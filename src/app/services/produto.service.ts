import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Produto {
  id?: string;
  produtoNome: string;
  descricao?: string;
  codigoBarras?: string;
  precoCusto: number;
  quantidadeEstoque?: number;
  categoria: string;
  unidadeMedida: string;
  perecivel: boolean;
  dataValidade?: string;
  fornecedor?: string;
  usuarioId: string;
  usuarioNome: string;
  dataCriacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly baseUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }

  atualizar(id: string, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, produto);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  
}