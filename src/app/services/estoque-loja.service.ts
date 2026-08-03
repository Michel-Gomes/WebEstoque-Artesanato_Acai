import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EstoqueLoja {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidadeDisponivel: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  localizacao: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface EstoqueLojaRequest {
  produtoId: string;
  quantidadeDisponivel: number;
  quantidadeMinima?: number | null;
  quantidadeMaxima?: number | null;
  localizacao?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueLojaService {

  private readonly baseUrl = `${environment.apiUrl}/estoque-loja`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<EstoqueLoja[]> {
    return this.http.get<EstoqueLoja[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<EstoqueLoja> {
    return this.http.get<EstoqueLoja>(`${this.baseUrl}/${id}`);
  }

  buscarPorProduto(produtoId: string): Observable<EstoqueLoja> {
    return this.http.get<EstoqueLoja>(`${this.baseUrl}/produto/${produtoId}`);
  }

  criar(estoque: EstoqueLojaRequest): Observable<EstoqueLoja> {
    return this.http.post<EstoqueLoja>(this.baseUrl, estoque);
  }

  atualizar(id: string, estoque: EstoqueLojaRequest): Observable<EstoqueLoja> {
    return this.http.put<EstoqueLoja>(`${this.baseUrl}/${id}`, estoque);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  buscarAlertaMinimo(): Observable<EstoqueLoja[]> {
    return this.http.get<EstoqueLoja[]>(`${this.baseUrl}/alerta/minimo`);
  }
}