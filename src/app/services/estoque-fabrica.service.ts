import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EstoqueFabrica {
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

export interface EstoqueFabricaRequest {
  produtoId: string;
  quantidadeDisponivel: number;
  quantidadeMinima?: number | null;
  quantidadeMaxima?: number | null;
  localizacao?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueFabricaService {

  private readonly baseUrl = `${environment.apiUrl}/estoque-fabrica`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<EstoqueFabrica[]> {
    return this.http.get<EstoqueFabrica[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<EstoqueFabrica> {
    return this.http.get<EstoqueFabrica>(`${this.baseUrl}/${id}`);
  }

  buscarPorProduto(produtoId: string): Observable<EstoqueFabrica> {
    return this.http.get<EstoqueFabrica>(`${this.baseUrl}/produto/${produtoId}`);
  }

  criar(estoque: EstoqueFabricaRequest): Observable<EstoqueFabrica> {
    return this.http.post<EstoqueFabrica>(this.baseUrl, estoque);
  }

  atualizar(id: string, estoque: EstoqueFabricaRequest): Observable<EstoqueFabrica> {
    return this.http.put<EstoqueFabrica>(`${this.baseUrl}/${id}`, estoque);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  buscarAlertaMinimo(): Observable<EstoqueFabrica[]> {
    return this.http.get<EstoqueFabrica[]>(`${this.baseUrl}/alerta/minimo`);
  }
}