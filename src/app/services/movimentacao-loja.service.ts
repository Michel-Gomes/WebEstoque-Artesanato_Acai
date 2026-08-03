import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type TipoMovimentacao =
  | 'ENTRADA'
  | 'SAIDA'
  | 'TRANSFERENCIA_RECEBIDA'
  | 'TRANSFERENCIA_ENVIADA'
  | 'AJUSTE_INVENTARIO'
  | 'PERDA'
  | 'DEVOLUCAO'
  | 'PRODUCAO';

export interface MovimentacaoLoja {
  id: string;
  estoqueLojaId: string;
  produtoId: string;
  produtoNome: string;
  tipoMovimentacao: TipoMovimentacao;
  unidadeMedida: string;
  quantidade: number;
  observacao: string;
  dataMovimentacao: string;
  usuarioId: string;
  usuarioNome: string;
  dataCriacao: string;
  loteFabricacaoId: string | null;
  codigoLote: string | null;
  dataValidadeLote: string | null;
}

export interface MovimentacaoLojaRequest {
  produtoId: string;
  loteFabricacaoId?: string | null;
  tipoMovimentacao: TipoMovimentacao;
  unidadeMedida: string;
  quantidade: number;
  observacao?: string | null;
  usuarioId: string;
  usuarioNome: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoLojaService {

  private readonly baseUrl = `${environment.apiUrl}/movimentacao-loja`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<MovimentacaoLoja[]> {
    return this.http.get<MovimentacaoLoja[]>(this.baseUrl);
  }

  criar(movimentacao: MovimentacaoLojaRequest): Observable<MovimentacaoLoja> {
    return this.http.post<MovimentacaoLoja>(this.baseUrl, movimentacao);
  }
}