import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstoqueFabricaService, EstoqueFabricaRequest } from '../../../services/estoque-fabrica.service';
import { ProdutoService, Produto } from '../../../services/produto.service';

@Component({
  selector: 'app-estoque-fabrica-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estoque-fabrica-cadastro.html',
  styleUrl: './estoque-fabrica-cadastro.css',
})
export class EstoqueFabricaCadastro implements OnInit {

  estoqueEmEdicaoId: string | null = null;
  mensagemErro: string | null = null;

  produtos = signal<Produto[]>([]);

  formEstoque = new FormGroup({
    produtoId: new FormControl('', Validators.required),
    quantidadeDisponivel: new FormControl('0', [Validators.min(0)]),
    quantidadeMinima: new FormControl('', [Validators.min(0)]),
    quantidadeMaxima: new FormControl('', [Validators.min(0)]),
    localizacao: new FormControl('')
  });

  constructor(
    private estoqueFabricaService: EstoqueFabricaService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.estoqueEmEdicaoId = id;
      this.formEstoque.get('quantidadeDisponivel')?.clearValidators();
      this.formEstoque.get('quantidadeDisponivel')?.updateValueAndValidity();
      this.carregarEstoqueParaEdicao(id);
    }
  }

  private carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados: Produto[]) => this.produtos.set(dados),
      error: (erro: any) => console.error('Erro ao carregar produtos:', erro)
    });
  }

  private carregarEstoqueParaEdicao(id: string): void {
    this.estoqueFabricaService.buscarPorId(id).subscribe({
      next: (estoque) => {
        this.formEstoque.patchValue({
          produtoId: estoque.produtoId,
          quantidadeDisponivel: String(estoque.quantidadeDisponivel),
          quantidadeMinima: estoque.quantidadeMinima != null ? String(estoque.quantidadeMinima) : '',
          quantidadeMaxima: estoque.quantidadeMaxima != null ? String(estoque.quantidadeMaxima) : '',
          localizacao: estoque.localizacao || ''
        });
      },
      error: (erro: any) => this.tratarErro(erro)
    });
  }

  salvar(): void {
    if (this.formEstoque.invalid) {
      this.formEstoque.markAllAsTouched();
      return;
    }

    const valores = this.formEstoque.value;

    const payload: EstoqueFabricaRequest = {
      produtoId: valores.produtoId!,
      quantidadeDisponivel: valores.quantidadeDisponivel ? Number(valores.quantidadeDisponivel) : 0,
      quantidadeMinima: valores.quantidadeMinima ? Number(valores.quantidadeMinima) : null,
      quantidadeMaxima: valores.quantidadeMaxima ? Number(valores.quantidadeMaxima) : null,
      localizacao: valores.localizacao || null
    };

    this.mensagemErro = null;

    if (this.estoqueEmEdicaoId) {
      this.estoqueFabricaService.atualizar(this.estoqueEmEdicaoId, payload).subscribe({
        next: () => this.router.navigate(['/estoque-fabrica']),
        error: (erro: any) => this.tratarErro(erro)
      });
    } else {
      this.estoqueFabricaService.criar(payload).subscribe({
        next: () => this.router.navigate(['/estoque-fabrica']),
        error: (erro: any) => this.tratarErro(erro)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/estoque-fabrica']);
  }

  private tratarErro(erro: any): void {
    this.mensagemErro = erro?.error?.message || 'Ocorreu um erro ao comunicar com o servidor.';
    console.error('Erro na API:', erro);
  }
}