import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { EstoqueFabricaService, EstoqueFabrica } from '../../../services/estoque-fabrica.service';
import { EstoqueLojaService, EstoqueLoja } from '../../../services/estoque-loja.service';

@Component({
  selector: 'app-alertas-estoque-minimo',
  imports: [CommonModule],
  templateUrl: './alertas-estoque-minimo.html',
  styleUrl: './alertas-estoque-minimo.css',
})
export class AlertasEstoqueMinimo implements OnInit {

  alertasFabrica = signal<EstoqueFabrica[]>([]);
  alertasLoja = signal<EstoqueLoja[]>([]);

  carregando = signal(true);
  mensagemErro = signal<string | null>(null);

  constructor(
    private estoqueFabricaService: EstoqueFabricaService,
    private estoqueLojaService: EstoqueLojaService
  ) {}

  ngOnInit(): void {
    this.carregarAlertas();
  }

  carregarAlertas(): void {
    this.carregando.set(true);
    this.mensagemErro.set(null);

    this.estoqueFabricaService.buscarAlertaMinimo().subscribe({
      next: (dados) => this.alertasFabrica.set(dados),
      error: (erro) => this.tratarErro(erro)
    });

    this.estoqueLojaService.buscarAlertaMinimo().subscribe({
      next: (dados) => {
        this.alertasLoja.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => this.tratarErro(erro)
    });
  }

  private tratarErro(erro: any): void {
    this.mensagemErro.set(erro?.error?.message || 'Erro ao carregar alertas de estoque mínimo.');
    this.carregando.set(false);
    console.error('Erro na API:', erro);
  }
}