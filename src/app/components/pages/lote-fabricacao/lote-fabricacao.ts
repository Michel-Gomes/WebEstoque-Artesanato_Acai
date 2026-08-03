import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoteFabricacaoService, LoteFabricacao as LoteFabricacaoModel } from '../../../services/lote-fabricacao.service';

@Component({
  selector: 'app-lote-fabricacao',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lote-fabricacao.html',
  styleUrl: './lote-fabricacao.css',
})
export class LoteFabricacao implements OnInit {

  lotes = signal<LoteFabricacaoModel[]>([]);
  carregando = signal(true);
  mensagemErro = signal<string | null>(null);

  termoBusca = signal('');
  lotesFiltrados = signal<LoteFabricacaoModel[]>([]);

  constructor(private loteFabricacaoService: LoteFabricacaoService) {}

  ngOnInit(): void {
    this.carregarLotes();
  }

  carregarLotes(): void {
    this.carregando.set(true);
    this.mensagemErro.set(null);

    this.loteFabricacaoService.listarTodos().subscribe({
      next: (dados: LoteFabricacaoModel[]) => {
        // ordena por data de validade, mais próximo de vencer primeiro
        const ordenados = [...dados].sort((a, b) =>
          new Date(a.dataValidade).getTime() - new Date(b.dataValidade).getTime()
        );
        this.lotes.set(ordenados);
        this.lotesFiltrados.set(ordenados);
        this.carregando.set(false);
      },
      error: (erro: any) => {
        this.mensagemErro.set(erro?.error?.message || 'Erro ao carregar lotes de fabricação.');
        this.carregando.set(false);
        console.error('Erro na API:', erro);
      }
    });
  }

  filtrar(valor: string): void {
    this.termoBusca.set(valor);
    const termo = valor.trim().toLowerCase();

    if (!termo) {
      this.lotesFiltrados.set(this.lotes());
      return;
    }

    this.lotesFiltrados.set(
      this.lotes().filter(lote =>
        lote.produtoNome.toLowerCase().includes(termo) ||
        lote.codigoLote.toLowerCase().includes(termo)
      )
    );
  }

  statusValidade(lote: LoteFabricacaoModel): 'vencido' | 'proximo' | 'ok' {
    const hoje = new Date();
    const validade = new Date(lote.dataValidade);
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return 'vencido';
    if (diffDias <= 7) return 'proximo';
    return 'ok';
  }
}