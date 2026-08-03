import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstoqueLojaService, EstoqueLojaRequest } from '../../../services/estoque-loja.service';
import { ProdutoService, Produto } from '../../../services/produto.service';

@Component({
  selector: 'app-estoque-loja-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estoque-loja-cadastro.html',
  styleUrl: './estoque-loja-cadastro.css',
})
export class EstoqueLojaCadastro implements OnInit {

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
    private estoqueLojaService: EstoqueLojaService,
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
    this.estoqueLojaService.buscarPorId(id).subscribe({
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

    const payload: EstoqueLojaRequest = {
      produtoId: valores.produtoId!,
      quantidadeDisponivel: valores.quantidadeDisponivel ? Number(valores.quantidadeDisponivel) : 0,
      quantidadeMinima: valores.quantidadeMinima ? Number(valores.quantidadeMinima) : null,
      quantidadeMaxima: valores.quantidadeMaxima ? Number(valores.quantidadeMaxima) : null,
      localizacao: valores.localizacao || null
    };

    this.mensagemErro = null;

    if (this.estoqueEmEdicaoId) {
      this.estoqueLojaService.atualizar(this.estoqueEmEdicaoId, payload).subscribe({
        next: () => this.router.navigate(['/estoque-loja']),
        error: (erro: any) => this.tratarErro(erro)
      });
    } else {
      this.estoqueLojaService.criar(payload).subscribe({
        next: () => this.router.navigate(['/estoque-loja']),
        error: (erro: any) => this.tratarErro(erro)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/estoque-loja']);
  }

  private tratarErro(erro: any): void {
    this.mensagemErro = erro?.error?.message || 'Ocorreu um erro ao comunicar com o servidor.';
    console.error('Erro na API:', erro);
  }
}