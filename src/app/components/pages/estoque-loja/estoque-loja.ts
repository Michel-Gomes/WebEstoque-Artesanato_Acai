import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EstoqueLojaService, EstoqueLoja as EstoqueLojaModel } from '../../../services/estoque-loja.service';
import { ProdutoService, Produto } from '../../../services/produto.service';
import { MovimentacaoLojaService, MovimentacaoLoja as MovimentacaoLojaModel } from '../../../services/movimentacao-loja.service';

@Component({
  selector: 'app-estoque-loja',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './estoque-loja.html',
  styleUrl: './estoque-loja.css',
})
export class EstoqueLoja implements OnInit {

  itens = signal<EstoqueLojaModel[]>([]);
  produtos = signal<Produto[]>([]);
  movimentacoes = signal<MovimentacaoLojaModel[]>([]);

  carregando = signal(true);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);

  termoBusca = signal('');
  itensFiltrados = signal<EstoqueLojaModel[]>([]);

  // controla qual linha está em modo "adicionar quantidade"
  itemEmAdicaoId = signal<string | null>(null);
  quantidadeAdicionar = new FormControl('', [Validators.required, Validators.min(1)]);
  observacaoAdicionar = new FormControl('');
  salvandoQuantidade = signal(false);

  // controla qual linha está em modo "retirar quantidade"
  itemEmRetiradaId = signal<string | null>(null);
  quantidadeRetirar = new FormControl('', [Validators.required, Validators.min(1)]);
  observacaoRetirar = new FormControl('');
  salvandoRetirada = signal(false);

  // mapa produtoId -> Produto, pra enriquecer a tabela sem esperar mudança no backend
  private produtosPorId = computed(() => {
    const mapa = new Map<string, Produto>();
    this.produtos().forEach(p => { if (p.id) mapa.set(p.id, p); });
    return mapa;
  });

  constructor(
    private estoqueLojaService: EstoqueLojaService,
    private produtoService: ProdutoService,
    private movimentacaoLojaService: MovimentacaoLojaService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarMovimentacoes();
    this.carregarItens();
  }

  private carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados: Produto[]) => this.produtos.set(dados),
      error: (erro: any) => console.error('Erro ao carregar produtos:', erro)
    });
  }

  private carregarMovimentacoes(): void {
    this.movimentacaoLojaService.listarTodas().subscribe({
      next: (dados: MovimentacaoLojaModel[]) => this.movimentacoes.set(dados),
      error: (erro: any) => console.error('Erro ao carregar movimentações:', erro)
    });
  }

  carregarItens(): void {
    this.carregando.set(true);
    this.mensagemErro.set(null);

    this.estoqueLojaService.listarTodos().subscribe({
      next: (dados: EstoqueLojaModel[]) => {
        this.itens.set(dados);
        this.itensFiltrados.set(dados);
        this.carregando.set(false);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao carregar estoque da loja.');
        this.carregando.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  filtrar(valor: string): void {
    this.termoBusca.set(valor);
    const termo = valor.trim().toLowerCase();

    if (!termo) {
      this.itensFiltrados.set(this.itens());
      return;
    }

    this.itensFiltrados.set(
      this.itens().filter(item => item.produtoNome.toLowerCase().includes(termo))
    );
  }

  // Dados extras do produto, buscados pelo produtoId (categoria, unidade, etc.)
  detalhesProduto(item: EstoqueLojaModel): Produto | undefined {
    return this.produtosPorId().get(item.produtoId);
  }

  statusEstoque(item: EstoqueLojaModel): 'baixo' | 'normal' {
    return item.quantidadeDisponivel <= item.quantidadeMinima ? 'baixo' : 'normal';
  }

  // Última movimentação com lote associado, pra esse produto (referência, não saldo exato por lote)
  loteMaisRecente(item: EstoqueLojaModel): MovimentacaoLojaModel | null {
    const movimentacoesComLote = this.movimentacoes()
      .filter(m => m.produtoId === item.produtoId && m.codigoLote)
      .sort((a, b) => new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime());

    return movimentacoesComLote.length > 0 ? movimentacoesComLote[0] : null;
  }

  statusValidadeLote(dataValidade: string | null): 'vencido' | 'proximo' | 'ok' | null {
    if (!dataValidade) return null;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 0) return 'vencido';
    if (diffDias <= 7) return 'proximo';
    return 'ok';
  }

  // --- Ação: Adicionar Quantidade ---

  abrirAdicionarQuantidade(item: EstoqueLojaModel): void {
    this.itemEmRetiradaId.set(null); // fecha retirada se estiver aberta
    this.itemEmAdicaoId.set(item.id);
    this.quantidadeAdicionar.reset('');
    this.observacaoAdicionar.reset('');
    this.mensagemErro.set(null);
  }

  cancelarAdicionarQuantidade(): void {
    this.itemEmAdicaoId.set(null);
  }

  confirmarAdicionarQuantidade(item: EstoqueLojaModel): void {
    if (this.quantidadeAdicionar.invalid) {
      this.quantidadeAdicionar.markAsTouched();
      return;
    }

    const produto = this.detalhesProduto(item);

    const payload = {
      produtoId: item.produtoId,
      tipoMovimentacao: 'ENTRADA' as const,
      unidadeMedida: produto?.unidadeMedida || 'UNIDADES',
      quantidade: Number(this.quantidadeAdicionar.value),
      observacao: this.observacaoAdicionar.value || null,
      usuarioId: crypto.randomUUID(), // temporário, até existir login de verdade
      usuarioNome: 'Michel' // temporário
    };

    this.salvandoQuantidade.set(true);
    this.mensagemErro.set(null);

    this.movimentacaoLojaService.criar(payload).subscribe({
      next: () => {
        this.mensagemSucesso.set(`Quantidade adicionada ao estoque de "${item.produtoNome}".`);
        this.salvandoQuantidade.set(false);
        this.itemEmAdicaoId.set(null);
        this.carregarItens();
        this.carregarMovimentacoes();
        setTimeout(() => this.mensagemSucesso.set(null), 4000);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao adicionar quantidade.');
        this.salvandoQuantidade.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  // --- Ação: Retirar Quantidade ---

  abrirRetirarQuantidade(item: EstoqueLojaModel): void {
    this.itemEmAdicaoId.set(null); // fecha adição se estiver aberta
    this.itemEmRetiradaId.set(item.id);
    this.quantidadeRetirar.reset('');
    this.observacaoRetirar.reset('');
    this.mensagemErro.set(null);
  }

  cancelarRetirarQuantidade(): void {
    this.itemEmRetiradaId.set(null);
  }

  confirmarRetirarQuantidade(item: EstoqueLojaModel): void {
    if (this.quantidadeRetirar.invalid) {
      this.quantidadeRetirar.markAsTouched();
      return;
    }

    const quantidade = Number(this.quantidadeRetirar.value);

    if (quantidade > item.quantidadeDisponivel) {
      this.mensagemErro.set(`Quantidade insuficiente. Disponível: ${item.quantidadeDisponivel}`);
      return;
    }

    const produto = this.detalhesProduto(item);

    const payload = {
      produtoId: item.produtoId,
      tipoMovimentacao: 'SAIDA' as const,
      unidadeMedida: produto?.unidadeMedida || 'UNIDADES',
      quantidade: quantidade,
      observacao: this.observacaoRetirar.value || null,
      usuarioId: crypto.randomUUID(), // temporário, até existir login de verdade
      usuarioNome: 'Michel' // temporário
    };

    this.salvandoRetirada.set(true);
    this.mensagemErro.set(null);

    this.movimentacaoLojaService.criar(payload).subscribe({
      next: () => {
        this.mensagemSucesso.set(`Quantidade retirada do estoque de "${item.produtoNome}".`);
        this.salvandoRetirada.set(false);
        this.itemEmRetiradaId.set(null);
        this.carregarItens();
        this.carregarMovimentacoes();
        setTimeout(() => this.mensagemSucesso.set(null), 4000);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao retirar quantidade.');
        this.salvandoRetirada.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  // --- Ação: Excluir registro de estoque ---

  excluir(item: EstoqueLojaModel): void {
    const confirmou = confirm(`Deseja realmente excluir o estoque de "${item.produtoNome}"?`);
    if (!confirmou) return;

    this.estoqueLojaService.excluir(item.id).subscribe({
      next: () => this.carregarItens(),
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao excluir estoque.');
        console.error('Erro na API:', erro);
      }
    });
  }
}