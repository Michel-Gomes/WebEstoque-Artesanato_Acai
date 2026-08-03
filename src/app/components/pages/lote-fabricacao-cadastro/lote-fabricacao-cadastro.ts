import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoteFabricacaoService, LoteFabricacaoRequest } from '../../../services/lote-fabricacao.service';
import { ProdutoService, Produto } from '../../../services/produto.service';

@Component({
  selector: 'app-lote-fabricacao-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lote-fabricacao-cadastro.html',
  styleUrl: './lote-fabricacao-cadastro.css',
})
export class LoteFabricacaoCadastro implements OnInit {

  loteEmEdicaoId: string | null = null;
  mensagemErro: string | null = null;

  produtos = signal<Produto[]>([]);

  formLote = new FormGroup({
    produtoId: new FormControl('', Validators.required),
    codigoLote: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    quantidadeFabricada: new FormControl('', [Validators.required, Validators.min(1)]),
    dataFabricacao: new FormControl('', Validators.required),
    dataValidade: new FormControl('', Validators.required),
    observacao: new FormControl('')
  });

  constructor(
    private loteFabricacaoService: LoteFabricacaoService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loteEmEdicaoId = id;
      this.carregarLoteParaEdicao(id);
    }
  }

  private carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados: Produto[]) => this.produtos.set(dados),
      error: (erro: any) => console.error('Erro ao carregar produtos:', erro)
    });
  }

  private carregarLoteParaEdicao(id: string): void {
    this.loteFabricacaoService.buscarPorId(id).subscribe({
      next: (lote) => {
        this.formLote.patchValue({
          produtoId: lote.produtoId,
          codigoLote: lote.codigoLote,
          quantidadeFabricada: String(lote.quantidadeFabricada),
          dataFabricacao: lote.dataFabricacao,
          dataValidade: lote.dataValidade,
          observacao: lote.observacao || ''
        });
      },
      error: (erro: any) => this.tratarErro(erro)
    });
  }

  salvar(): void {
    if (this.formLote.invalid) {
      this.formLote.markAllAsTouched();
      return;
    }

    const valores = this.formLote.value;

    const payload: LoteFabricacaoRequest = {
      produtoId: valores.produtoId!,
      codigoLote: valores.codigoLote!,
      quantidadeFabricada: Number(valores.quantidadeFabricada),
      dataFabricacao: valores.dataFabricacao!,
      dataValidade: valores.dataValidade!,
      observacao: valores.observacao || null,
      usuarioId: crypto.randomUUID(), // temporário, até existir login de verdade
      usuarioNome: 'Michel' // temporário
    };

    this.mensagemErro = null;

    if (this.loteEmEdicaoId) {
      this.loteFabricacaoService.atualizar(this.loteEmEdicaoId, payload).subscribe({
        next: () => this.router.navigate(['/lote-fabricacao']),
        error: (erro: any) => this.tratarErro(erro)
      });
    } else {
      this.loteFabricacaoService.criar(payload).subscribe({
        next: () => this.router.navigate(['/lote-fabricacao']),
        error: (erro: any) => this.tratarErro(erro)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/lote-fabricacao']);
  }

  private tratarErro(erro: any): void {
    this.mensagemErro = erro?.error?.message || 'Ocorreu um erro ao comunicar com o servidor.';
    console.error('Erro na API:', erro);
  }
}