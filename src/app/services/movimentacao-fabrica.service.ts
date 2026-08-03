import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoMovimentacao } from './movimentacao-loja.service';


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


export interface MovimentacaoFabrica {
  id: string;
  estoqueFabricaId: string;
  produtoId: string;
  produtoNome: string;
  unidadeMedida: string;
  loteFabricacaoId: string | null;
  codigoLote: string | null;
  tipoMovimentacao: TipoMovimentacao;
  quantidade: number;
  observacao: string;
  dataMovimentacao: string;
  usuarioId: string;
  usuarioNome: string;
  dataCriacao: string;
}

export interface MovimentacaoFabricaRequest {
  produtoId: string;
  loteFabricacaoId?: string | null;
  tipoMovimentacao: TipoMovimentacao;
  quantidade: number;
  observacao?: string | null;
  usuarioId: string;
  usuarioNome: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoFabricaService {

  private readonly baseUrl = `${environment.apiUrl}/movimentacao-fabrica`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<MovimentacaoFabrica[]> {
    return this.http.get<MovimentacaoFabrica[]>(this.baseUrl);
  }

  criar(movimentacao: MovimentacaoFabricaRequest): Observable<MovimentacaoFabrica> {
    return this.http.post<MovimentacaoFabrica>(this.baseUrl, movimentacao);
  }
}