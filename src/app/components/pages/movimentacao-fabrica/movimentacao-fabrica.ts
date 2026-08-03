import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProdutoService, Produto } from '../../../services/produto.service';
import { TipoMovimentacao } from '../../../services/movimentacao-loja.service';
import { MovimentacaoFabricaService, MovimentacaoFabrica as MovimentacaoFabricaEntity } from '../../../services/movimentacao-fabrica.service';

@Component({
  selector: 'app-movimentacao-fabrica',
  imports: [CommonModule, FormsModule],
  templateUrl: './movimentacao-fabrica.html',
  styleUrl: './movimentacao-fabrica.css',
})
export class MovimentacaoFabrica implements OnInit {

  produtos = signal<Produto[]>([]);
  movimentacoes = signal<MovimentacaoFabricaEntity[]>([]);
  carregando = signal(true);

  // filtros selecionados no formulário (ainda não aplicados)
  filtroProdutoIdSelecionado = signal('');
  filtroTipoSelecionado = signal('');

  // filtros efetivamente aplicados (usados na busca)
  filtroProdutoIdAplicado = signal('');
  filtroTipoAplicado = signal('');

  tiposMovimentacao: TipoMovimentacao[] = [
    'ENTRADA',
    'SAIDA',
    'PRODUCAO',
    'TRANSFERENCIA_ENVIADA',
    'AJUSTE_INVENTARIO',
    'PERDA',
    'DEVOLUCAO'
  ];

  movimentacoesFiltradas = computed(() => {
    const produtoId = this.filtroProdutoIdAplicado();
    const tipo = this.filtroTipoAplicado();

    return this.movimentacoes().filter(mov => {
      const bateProduto = !produtoId || mov.produtoId === produtoId;
      const bateTipo = !tipo || mov.tipoMovimentacao === tipo;
      return bateProduto && bateTipo;
    });
  });

  constructor(
    private movimentacaoFabricaService: MovimentacaoFabricaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarMovimentacoes();
  }

  private carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados: Produto[]) => this.produtos.set(dados),
      error: (erro: any) => console.error('Erro ao carregar produtos:', erro)
    });
  }

  carregarMovimentacoes(): void {
    this.carregando.set(true);
    this.movimentacaoFabricaService.listarTodas().subscribe({
      next: (dados: MovimentacaoFabricaEntity[]) => {
        this.movimentacoes.set(dados);
        this.carregando.set(false);
      },
      error: (erro: any) => {
        console.error('Erro ao carregar movimentações:', erro);
        this.carregando.set(false);
      }
    });
  }

  buscar(): void {
    this.filtroProdutoIdAplicado.set(this.filtroProdutoIdSelecionado());
    this.filtroTipoAplicado.set(this.filtroTipoSelecionado());
  }

  limparFiltros(): void {
    this.filtroProdutoIdSelecionado.set('');
    this.filtroTipoSelecionado.set('');
    this.filtroProdutoIdAplicado.set('');
    this.filtroTipoAplicado.set('');
  }

  destino(tipo: string): string {
    return tipo === 'TRANSFERENCIA_ENVIADA' ? 'Estoque Loja' : '-';
  }

  classeBadge(tipo: string): string {
    const mapa: Record<string, string> = {
      ENTRADA: 'badge-verde',
      PRODUCAO: 'badge-verde',
      DEVOLUCAO: 'badge-verde',
      TRANSFERENCIA_RECEBIDA: 'badge-azul',
      SAIDA: 'badge-vermelho',
      TRANSFERENCIA_ENVIADA: 'badge-laranja',
      AJUSTE_INVENTARIO: 'badge-cinza',
      PERDA: 'badge-vermelho'
    };
    return mapa[tipo] ?? 'badge-cinza';
  }
}