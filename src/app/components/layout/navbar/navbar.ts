import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EstoqueFabricaService, EstoqueFabrica } from '../../../services/estoque-fabrica.service';
import { EstoqueLojaService, EstoqueLoja } from '../../../services/estoque-loja.service';

interface NotificacaoAlerta {
  produtoNome: string;
  quantidadeDisponivel: number;
  quantidadeMinima: number;
  origem: 'Fábrica' | 'Loja';
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  private alertasFabrica = signal<EstoqueFabrica[]>([]);
  private alertasLoja = signal<EstoqueLoja[]>([]);

  notificacoes = computed<NotificacaoAlerta[]>(() => [
    ...this.alertasFabrica().map(item => ({
      produtoNome: item.produtoNome,
      quantidadeDisponivel: item.quantidadeDisponivel,
      quantidadeMinima: item.quantidadeMinima,
      origem: 'Fábrica' as const
    })),
    ...this.alertasLoja().map(item => ({
      produtoNome: item.produtoNome,
      quantidadeDisponivel: item.quantidadeDisponivel,
      quantidadeMinima: item.quantidadeMinima,
      origem: 'Loja' as const
    }))
  ]);

  totalAlertas = computed(() => this.notificacoes().length);

  painelAberto = signal(false);

  constructor(
    private estoqueFabricaService: EstoqueFabricaService,
    private estoqueLojaService: EstoqueLojaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAlertas();
  }

  private carregarAlertas(): void {
    this.estoqueFabricaService.buscarAlertaMinimo().subscribe({
      next: (dados) => this.alertasFabrica.set(dados),
      error: (erro) => console.error('Erro ao buscar alertas da fábrica:', erro)
    });

    this.estoqueLojaService.buscarAlertaMinimo().subscribe({
      next: (dados) => this.alertasLoja.set(dados),
      error: (erro) => console.error('Erro ao buscar alertas da loja:', erro)
    });
  }

  alternarPainel(): void {
    this.painelAberto.set(!this.painelAberto());
  }

  fecharPainel(): void {
    this.painelAberto.set(false);
  }

  @HostListener('document:click', ['$event'])
  aoClicarFora(evento: MouseEvent): void {
    const clicouNoSino = (evento.target as HTMLElement).closest('.sino-wrapper');
    if (!clicouNoSino) {
      this.fecharPainel();
    }
  }

  irParaAlertas(): void {
    this.fecharPainel();
    this.router.navigate(['/alertas-estoque-minimo']);
  }
}