import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MovimentacaoFabricaService, MovimentacaoFabrica } from '../../../services/movimentacao-fabrica.service';
import { MovimentacaoLojaService, MovimentacaoLoja } from '../../../services/movimentacao-loja.service';

interface MovimentacaoUnificada {
  origem: 'Fábrica' | 'Loja';
  tipoMovimentacao: string;
  quantidade: number;
  unidadeMedida: string;
  observacao: string;
  dataMovimentacao: string;
  usuarioNome: string;
  codigoLote?: string | null;
}

@Component({
  selector: 'app-historico-produto',
  imports: [CommonModule, RouterLink],
  templateUrl: './historico-produto.html',
  styleUrl: './historico-produto.css',
})
export class HistoricoProduto implements OnInit {

  produtoId!: string;
  produtoNome = signal<string>('');

  private movimentacoesFabrica = signal<MovimentacaoFabrica[]>([]);
  private movimentacoesLoja = signal<MovimentacaoLoja[]>([]);

  carregando = signal(true);
  mensagemErro = signal<string | null>(null);

  timeline = computed<MovimentacaoUnificada[]>(() => {
    const daFabrica: MovimentacaoUnificada[] = this.movimentacoesFabrica()
      .filter(m => m.produtoId === this.produtoId)
      .map(m => ({
        origem: 'Fábrica' as const,
        tipoMovimentacao: m.tipoMovimentacao,
        quantidade: m.quantidade,
        unidadeMedida: m.unidadeMedida,
        observacao: m.observacao,
        dataMovimentacao: m.dataMovimentacao,
        usuarioNome: m.usuarioNome,
        codigoLote: m.codigoLote
      }));

    const daLoja: MovimentacaoUnificada[] = this.movimentacoesLoja()
      .filter(m => m.produtoId === this.produtoId)
      .map(m => ({
        origem: 'Loja' as const,
        tipoMovimentacao: m.tipoMovimentacao,
        quantidade: m.quantidade,
        unidadeMedida: m.unidadeMedida,
        observacao: m.observacao,
        dataMovimentacao: m.dataMovimentacao,
        usuarioNome: m.usuarioNome
      }));

    return [...daFabrica, ...daLoja].sort((a, b) =>
      new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime()
    );
  });

  constructor(
    private route: ActivatedRoute,
    private movimentacaoFabricaService: MovimentacaoFabricaService,
    private movimentacaoLojaService: MovimentacaoLojaService
  ) {}

  ngOnInit(): void {
    this.produtoId = this.route.snapshot.paramMap.get('produtoId') ?? '';
    this.produtoNome.set(this.route.snapshot.queryParamMap.get('nome') ?? '');
    this.carregarMovimentacoes();
  }

  private carregarMovimentacoes(): void {
    this.carregando.set(true);
    this.mensagemErro.set(null);

    this.movimentacaoFabricaService.listarTodas().subscribe({
      next: (dados) => this.movimentacoesFabrica.set(dados),
      error: (erro) => this.tratarErro(erro)
    });

    this.movimentacaoLojaService.listarTodas().subscribe({
      next: (dados) => {
        this.movimentacoesLoja.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => this.tratarErro(erro)
    });
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

  private tratarErro(erro: any): void {
    this.mensagemErro.set(erro?.error?.message || 'Erro ao carregar histórico de movimentações.');
    this.carregando.set(false);
    console.error('Erro na API:', erro);
  }
}