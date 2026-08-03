import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProdutoService, Produto as ProdutoModel } from '../../../services/produto.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-produto',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './produto.html',
  styleUrl: './produto.css',
})
export class Produto implements OnInit {

  produtos = signal<ProdutoModel[]>([]);

  termoBusca = new FormControl('');
  categoriaBusca = new FormControl('');

  mensagemErro: string | null = null;

  itensPorPagina = signal(5);
  paginaAtual = signal(1);

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.listarTodos().subscribe({
      next: (dados: ProdutoModel[]) => this.produtos.set(dados),
      error: (erro: any) => console.error('Erro ao buscar produtos:', erro)
    });
  }

  excluirProduto(produto: ProdutoModel) {
    if (!produto.id) return;

    this.produtoService.deletar(produto.id).subscribe({
      next: () => this.carregarProdutos(),
      error: (erro: any) => this.tratarErro(erro)
    });
  }

  private get numeroPorId(): Map<string, number> {
    const porOrdemDeCadastro = [...this.produtos()].sort((a, b) =>
      (a.dataCriacao || '').localeCompare(b.dataCriacao || '')
    );

    const mapa = new Map<string, number>();
    porOrdemDeCadastro.forEach((p, index) => {
      if (p.id) mapa.set(p.id, index + 1);
    });

    return mapa;
  }

  numeroDoProduto(id: string | undefined): number | string {
    if (!id) return '-';
    return this.numeroPorId.get(id) ?? '-';
  }

  get produtosFiltrados() {
    const termo = this.termoBusca.value?.toLowerCase() || '';
    const categoria = this.categoriaBusca.value;

    const filtrados = this.produtos().filter(p => {

      const numero = this.numeroDoProduto(p.id).toString();
      const bateTermo =
        p.produtoNome?.toLowerCase().includes(termo) ||
        numero === termo;

      const bateCategoria = !categoria || p.categoria === categoria;

      return bateTermo && bateCategoria;
    });

    return [...filtrados].sort((a, b) =>
      (b.dataCriacao || '').localeCompare(a.dataCriacao || '')
    );
  }

  get totalPaginas() {
    return Math.max(1, Math.ceil(this.produtosFiltrados.length / this.itensPorPagina()));
  }

  get produtosPaginados() {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    const fim = inicio + this.itensPorPagina();
    return this.produtosFiltrados.slice(inicio, fim);
  }

  mudarItensPorPagina(valor: number) {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1); // volta pra página 1 sempre que muda a quantidade
  }

  irParaPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaAtual.set(pagina);
  }

  exportarCsv() {
    const cabecalho = ['Produto', 'Categoria', 'Preço de Custo', 'Código de Barras', 'Fornecedor', 'Data de Validade', 'Quantidade em Estoque', 'Usuário'];

    const linhas = this.produtosFiltrados.map(p => [
      p.produtoNome,
      p.categoria,
      this.formatarMoeda(p.precoCusto),
      p.codigoBarras || '',
      p.fornecedor || '',
      p.dataValidade || '',
      p.quantidadeEstoque ?? 0,
      p.usuarioNome
    ]);

    const csv = [cabecalho, ...linhas]
      .map(linha => linha.map(campo => `"${String(campo).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    // \uFEFF garante que acentos (ç, ã) apareçam certinho ao abrir no Excel
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `produtos_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  private formatarMoeda(valor: number | undefined): string {
    if (valor == null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private tratarErro(erro: any) {
    this.mensagemErro = erro?.error?.message || 'Ocorreu um erro ao comunicar com o servidor.';
    console.error('Erro na API:', erro);
  }
}