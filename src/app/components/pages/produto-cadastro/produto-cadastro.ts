import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProdutoService, Produto as ProdutoModel } from '../../../services/produto.service';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-produto-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './produto-cadastro.html',
  styleUrl: './produto-cadastro.css',
})
export class ProdutoCadastro implements OnInit {

  produtoEmEdicaoId: string | null = null;

  mensagemErro: string | null = null;

  private readonly formVazio = {
    produtoNome: '',
    codigoBarras: '',
    unidadeMedida: '',
    descricao: '',
    categoria: '',
    fornecedor: '',
    precoCusto: '',
    dataValidade: '',
    perecivel: false
  };

  formProduto = new FormGroup({
    produtoNome: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),

    codigoBarras: new FormControl('', Validators.maxLength(50)),

    unidadeMedida: new FormControl('', Validators.required),

    descricao: new FormControl('', Validators.maxLength(500)),

    categoria: new FormControl('', Validators.required),

    fornecedor: new FormControl(''),

    precoCusto: new FormControl('', [
      Validators.required,
      Validators.min(0.01)
    ]),

    dataValidade: new FormControl(''),

    perecivel: new FormControl(false, Validators.required)
  });

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lê o :id da URL (ex: /produto/editar/abc-123). Se existir, é modo edição.
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.produtoEmEdicaoId = id;
      this.carregarProdutoParaEdicao(id);
    }
  }

  carregarProdutoParaEdicao(id: string) {
    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => this.formProduto.patchValue(produto as any),
      error: (erro: any) => this.tratarErro(erro)
    });
  }

  cadastrarProduto() {
    if (this.formProduto.invalid) {
      this.formProduto.markAllAsTouched();
      return;
    }

    const produto = {
      ...this.formProduto.value,
      usuarioId: crypto.randomUUID(), // temporário, até existir login de verdade
      usuarioNome: 'Michel', // temporário, até existir login de verdade
      dataValidade: this.formProduto.value.dataValidade || null
    } as unknown as ProdutoModel;

    this.mensagemErro = null;

    if (this.produtoEmEdicaoId) {
      this.produtoService.atualizar(this.produtoEmEdicaoId, produto).subscribe({
        next: () => this.router.navigate(['/produtos']),
        error: (erro: any) => this.tratarErro(erro)
      });

    } else {
      this.produtoService.criar(produto).subscribe({
        next: () => this.router.navigate(['/produtos']),
        error: (erro: any) => this.tratarErro(erro)
      });
    }
  }

  cancelar() {
    this.router.navigate(['/produtos']);
  }

  private tratarErro(erro: any) {
    this.mensagemErro = erro?.error?.message || 'Ocorreu um erro ao comunicar com o servidor.';
    console.error('Erro na API:', erro);
  }
}