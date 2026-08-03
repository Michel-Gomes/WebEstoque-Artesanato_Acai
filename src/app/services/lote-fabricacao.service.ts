import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoteFabricacao {
  id: string;
  produtoId: string;
  produtoNome: string;
  codigoLote: string;
  quantidadeFabricada: number;
  quantidadeDisponivel: number;
  dataFabricacao: string;
  dataValidade: string;
  observacao: string;
  usuarioId: string;
  usuarioNome: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface LoteFabricacaoRequest {
  produtoId: string;
  codigoLote: string;
  quantidadeFabricada: number;
  dataFabricacao: string;
  dataValidade: string;
  observacao?: string | null;
  usuarioId: string;
  usuarioNome: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoteFabricacaoService {

  private readonly baseUrl = `${environment.apiUrl}/lotes-fabricacao`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<LoteFabricacao[]> {
    return this.http.get<LoteFabricacao[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<LoteFabricacao> {
    return this.http.get<LoteFabricacao>(`${this.baseUrl}/${id}`);
  }

  buscarPorProduto(produtoId: string): Observable<LoteFabricacao[]> {
    return this.http.get<LoteFabricacao[]>(`${this.baseUrl}/produto/${produtoId}`);
  }

  criar(lote: LoteFabricacaoRequest): Observable<LoteFabricacao> {
    return this.http.post<LoteFabricacao>(this.baseUrl, lote);
  }

  atualizar(id: string, lote: LoteFabricacaoRequest): Observable<LoteFabricacao> {
    return this.http.put<LoteFabricacao>(`${this.baseUrl}/${id}`, lote);
  }
}