import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EstoqueFabricaService, EstoqueFabrica as EstoqueFabricaModel } from '../../../services/estoque-fabrica.service';
import { ProdutoService, Produto } from '../../../services/produto.service';
import { MovimentacaoFabricaService } from '../../../services/movimentacao-fabrica.service';
import { LoteFabricacaoService, LoteFabricacao } from '../../../services/lote-fabricacao.service';

@Component({
  selector: 'app-estoque-fabrica',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './estoque-fabrica.html',
  styleUrl: './estoque-fabrica.css',
})
export class EstoqueFabrica implements OnInit {

  itens = signal<EstoqueFabricaModel[]>([]);
  produtos = signal<Produto[]>([]);
  lotes = signal<LoteFabricacao[]>([]);

  carregando = signal(true);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);

  termoBusca = signal('');
  itensFiltrados = signal<EstoqueFabricaModel[]>([]);

  // --- Adicionar Quantidade (via lote) ---
  itemEmAdicaoId = signal<string | null>(null);
  loteEscolhidoId = new FormControl('', Validators.required);
  salvandoAdicao = signal(false);

  // --- Retirar Quantidade (manual) ---
  itemEmRetiradaId = signal<string | null>(null);
  quantidadeRetirar = new FormControl('', [Validators.required, Validators.min(1)]);
  observacaoRetirar = new FormControl('');
  salvandoRetirada = signal(false);

  // --- Transferir para Loja ---
  itemEmTransferenciaId = signal<string | null>(null);
  loteTransferenciaId = new FormControl('');
  quantidadeTransferir = new FormControl('', [Validators.required, Validators.min(1)]);
  salvandoTransferencia = signal(false);

  private produtosPorId = computed(() => {
    const mapa = new Map<string, Produto>();
    this.produtos().forEach(p => { if (p.id) mapa.set(p.id, p); });
    return mapa;
  });

  private lotesPorProduto = computed(() => {
    const mapa = new Map<string, LoteFabricacao[]>();
    this.lotes().forEach(l => {
      if (!mapa.has(l.produtoId)) mapa.set(l.produtoId, []);
      mapa.get(l.produtoId)!.push(l);
    });
    return mapa;
  });

  constructor(
    private estoqueFabricaService: EstoqueFabricaService,
    private produtoService: ProdutoService,
    private movimentacaoFabricaService: MovimentacaoFabricaService,
    private loteFabricacaoService: LoteFabricacaoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarLotes();
    this.carregarItens();
  }

  private carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados: Produto[]) => this.produtos.set(dados),
      error: (erro: any) => console.error('Erro ao carregar produtos:', erro)
    });
  }

  private carregarLotes(): void {
    this.loteFabricacaoService.listarTodos().subscribe({
      next: (dados: LoteFabricacao[]) => this.lotes.set(dados),
      error: (erro: any) => console.error('Erro ao carregar lotes:', erro)
    });
  }

  carregarItens(): void {
    this.carregando.set(true);
    this.mensagemErro.set(null);

    this.estoqueFabricaService.listarTodos().subscribe({
      next: (dados: EstoqueFabricaModel[]) => {
        this.itens.set(dados);
        this.itensFiltrados.set(dados);
        this.carregando.set(false);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao carregar estoque da fábrica.');
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

  detalhesProduto(item: EstoqueFabricaModel): Produto | undefined {
    return this.produtosPorId().get(item.produtoId);
  }

  // Lotes com saldo disponível > 0 daquele produto, ordenados por validade (FIFO)
  lotesDisponiveis(item: EstoqueFabricaModel): LoteFabricacao[] {
    const lotes = this.lotesPorProduto().get(item.produtoId) || [];
    return [...lotes]
      .filter(l => l.quantidadeDisponivel > 0)
      .sort((a, b) => new Date(a.dataValidade).getTime() - new Date(b.dataValidade).getTime());
  }

  // Lote mais próximo do vencimento, pra exibir na coluna da tabela
  loteResumo(item: EstoqueFabricaModel): LoteFabricacao | null {
    const lotes = this.lotesDisponiveis(item);
    return lotes.length > 0 ? lotes[0] : null;
  }

  loteSelecionado(item: EstoqueFabricaModel): LoteFabricacao | undefined {
    const id = this.loteEscolhidoId.value;
    return this.lotesDisponiveis(item).find(l => l.id === id);
  }

  statusEstoque(item: EstoqueFabricaModel): 'baixo' | 'normal' {
    return item.quantidadeDisponivel <= item.quantidadeMinima ? 'baixo' : 'normal';
  }

  statusValidadeLote(lote: LoteFabricacao | null): 'vencido' | 'proximo' | 'ok' | null {
    if (!lote) return null;
    const hoje = new Date();
    const validade = new Date(lote.dataValidade);
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 0) return 'vencido';
    if (diffDias <= 7) return 'proximo';
    return 'ok';
  }

  private fecharTodasAsAcoes(): void {
    this.itemEmAdicaoId.set(null);
    this.itemEmRetiradaId.set(null);
    this.itemEmTransferenciaId.set(null);
  }

  // --- Ação: Adicionar Quantidade (via lote) ---

  abrirAdicionarQuantidade(item: EstoqueFabricaModel): void {
    this.fecharTodasAsAcoes();
    this.itemEmAdicaoId.set(item.id);
    this.loteEscolhidoId.reset('');
    this.mensagemErro.set(null);
  }

  cancelarAdicionarQuantidade(): void {
    this.itemEmAdicaoId.set(null);
  }

  confirmarAdicionarQuantidade(item: EstoqueFabricaModel): void {
    if (this.loteEscolhidoId.invalid) {
      this.loteEscolhidoId.markAsTouched();
      return;
    }

    const lote = this.loteSelecionado(item);
    if (!lote) {
      this.mensagemErro.set('Selecione um lote válido.');
      return;
    }

    const payload = {
      produtoId: item.produtoId,
      loteFabricacaoId: lote.id,
      tipoMovimentacao: 'PRODUCAO' as const,
      quantidade: lote.quantidadeFabricada,
      observacao: `Entrada referente ao lote ${lote.codigoLote}`,
      usuarioId: crypto.randomUUID(), // temporário, até existir login de verdade
      usuarioNome: 'Michel' // temporário
    };

    this.salvandoAdicao.set(true);
    this.mensagemErro.set(null);

    this.movimentacaoFabricaService.criar(payload).subscribe({
      next: () => {
        this.mensagemSucesso.set(`Lote ${lote.codigoLote} adicionado ao estoque de "${item.produtoNome}".`);
        this.salvandoAdicao.set(false);
        this.itemEmAdicaoId.set(null);
        this.carregarItens();
        this.carregarLotes();
        setTimeout(() => this.mensagemSucesso.set(null), 4000);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao adicionar quantidade.');
        this.salvandoAdicao.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  // --- Ação: Retirar Quantidade (manual, sem lote) ---

  abrirRetirarQuantidade(item: EstoqueFabricaModel): void {
    this.fecharTodasAsAcoes();
    this.itemEmRetiradaId.set(item.id);
    this.quantidadeRetirar.reset('');
    this.observacaoRetirar.reset('');
    this.mensagemErro.set(null);
  }

  cancelarRetirarQuantidade(): void {
    this.itemEmRetiradaId.set(null);
  }

  confirmarRetirarQuantidade(item: EstoqueFabricaModel): void {
    if (this.quantidadeRetirar.invalid) {
      this.quantidadeRetirar.markAsTouched();
      return;
    }

    const quantidade = Number(this.quantidadeRetirar.value);

    if (quantidade > item.quantidadeDisponivel) {
      this.mensagemErro.set(`Quantidade insuficiente. Disponível: ${item.quantidadeDisponivel}`);
      return;
    }

    const payload = {
      produtoId: item.produtoId,
      tipoMovimentacao: 'SAIDA' as const,
      quantidade: quantidade,
      observacao: this.observacaoRetirar.value || null,
      usuarioId: crypto.randomUUID(),
      usuarioNome: 'Michel'
    };

    this.salvandoRetirada.set(true);
    this.mensagemErro.set(null);

    this.movimentacaoFabricaService.criar(payload).subscribe({
      next: () => {
        this.mensagemSucesso.set(`Quantidade retirada do estoque de "${item.produtoNome}".`);
        this.salvandoRetirada.set(false);
        this.itemEmRetiradaId.set(null);
        this.carregarItens();
        setTimeout(() => this.mensagemSucesso.set(null), 4000);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao retirar quantidade.');
        this.salvandoRetirada.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  // --- Ação: Transferir para Loja ---

  abrirTransferencia(item: EstoqueFabricaModel): void {
    this.fecharTodasAsAcoes();
    this.itemEmTransferenciaId.set(item.id);
    this.loteTransferenciaId.reset('');
    this.quantidadeTransferir.reset('');
    this.mensagemErro.set(null);
  }

  cancelarTransferencia(): void {
    this.itemEmTransferenciaId.set(null);
  }

  confirmarTransferencia(item: EstoqueFabricaModel): void {
    if (this.quantidadeTransferir.invalid) {
      this.quantidadeTransferir.markAsTouched();
      return;
    }

    const quantidade = Number(this.quantidadeTransferir.value);

    if (quantidade > item.quantidadeDisponivel) {
      this.mensagemErro.set(`Quantidade insuficiente na fábrica. Disponível: ${item.quantidadeDisponivel}`);
      return;
    }

    const payload = {
      produtoId: item.produtoId,
      loteFabricacaoId: this.loteTransferenciaId.value || null,
      tipoMovimentacao: 'TRANSFERENCIA_ENVIADA' as const,
      quantidade: quantidade,
      observacao: 'Transferência para a loja',
      usuarioId: crypto.randomUUID(),
      usuarioNome: 'Michel'
    };

    this.salvandoTransferencia.set(true);
    this.mensagemErro.set(null);

    this.movimentacaoFabricaService.criar(payload).subscribe({
      next: () => {
        this.mensagemSucesso.set(`${quantidade} unidade(s) de "${item.produtoNome}" transferida(s) para a Loja.`);
        this.salvandoTransferencia.set(false);
        this.itemEmTransferenciaId.set(null);
        this.carregarItens();
        this.carregarLotes();
        setTimeout(() => this.mensagemSucesso.set(null), 4000);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao transferir quantidade.');
        this.salvandoTransferencia.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  // --- Ação: Excluir registro de estoque ---

  excluir(item: EstoqueFabricaModel): void {
    const confirmou = confirm(`Deseja realmente excluir o estoque de "${item.produtoNome}"?`);
    if (!confirmou) return;

    this.estoqueFabricaService.excluir(item.id).subscribe({
      next: () => this.carregarItens(),
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao excluir estoque.');
        console.error('Erro na API:', erro);
      }
    });
  }
}