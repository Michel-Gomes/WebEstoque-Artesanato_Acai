import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProdutoService, Produto } from '../../../services/produto.service';
import { MovimentacaoLojaService, TipoMovimentacao, MovimentacaoLoja as MovimentacaoLojaModel } from '../../../services/movimentacao-loja.service';

@Component({
  selector: 'app-movimentacao-loja',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './movimentacao-loja.html',
  styleUrl: './movimentacao-loja.css',
})
export class MovimentacaoLoja implements OnInit {

  produtos = signal<Produto[]>([]);
  movimentacoes = signal<MovimentacaoLojaModel[]>([]);
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
    'TRANSFERENCIA_RECEBIDA',
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
    private movimentacaoLojaService: MovimentacaoLojaService,
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
    this.movimentacaoLojaService.listarTodas().subscribe({
      next: (dados: MovimentacaoLojaModel[]) => {
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

  classeBadge(tipo: string): string {
    const mapa: Record<string, string> = {
      ENTRADA: 'badge-verde',
      DEVOLUCAO: 'badge-verde',
      TRANSFERENCIA_RECEBIDA: 'badge-azul',
      SAIDA: 'badge-vermelho',
      AJUSTE_INVENTARIO: 'badge-cinza',
      PERDA: 'badge-vermelho'
    };
    return mapa[tipo] ?? 'badge-cinza';
  }
}