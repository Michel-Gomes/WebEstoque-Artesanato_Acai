import { Routes } from '@angular/router';
import { EstoqueLoja } from './components/pages/estoque-loja/estoque-loja';
import { EstoqueFabrica } from './components/pages/estoque-fabrica/estoque-fabrica';
import { Produto } from './components/pages/produto/produto';
import { LoteFabricacao } from './components/pages/lote-fabricacao/lote-fabricacao';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { MovimentacaoFabrica } from './components/pages/movimentacao-fabrica/movimentacao-fabrica';
import { ProdutoCadastro } from './components/pages/produto-cadastro/produto-cadastro';
import { Configuracoes } from './components/pages/configuracoes/configuracoes';
import { AlertasEstoqueMinimo } from './components/pages/alertas-estoque-minimo/alertas-estoque-minimo';
import { HistoricoProduto } from './components/pages/historico-produto/historico-produto';
import { MovimentacaoLoja } from './components/pages/movimentacao-loja/movimentacao-loja';
import { EstoqueLojaCadastro } from './components/pages/estoque-loja-cadastro/estoque-loja-cadastro';
import { EstoqueFabricaCadastro } from './components/pages/estoque-fabrica-cadastro/estoque-fabrica-cadastro';
import { LoteFabricacaoCadastro } from './components/pages/lote-fabricacao-cadastro/lote-fabricacao-cadastro';


export const routes: Routes = [

    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'estoque-loja',
        component: EstoqueLoja
    },
    {
        path: 'estoque-fabrica',
        component: EstoqueFabrica
    },
    {
        path: 'estoque-fabrica/cadastro',
        component: EstoqueFabricaCadastro
    },
    {
        path: 'estoque-fabrica/editar/:id',
        component: EstoqueFabricaCadastro
    },
    {
        path: 'produtos',
        component: Produto
    },
    {
        path: 'produto/cadastro',
        component: ProdutoCadastro
    },
    {
        path: 'produto/editar/:id',
        component: ProdutoCadastro
    },
    {
        path: 'lote-fabricacao',
        component: LoteFabricacao
    },
    {
        path: 'lote-fabricacao/cadastro',
        component: LoteFabricacaoCadastro
    },
    {
        path: 'lote-fabricacao/editar/:id',
        component: LoteFabricacaoCadastro
    },
    {
        path: 'alertas-estoque-minimo',
        component: AlertasEstoqueMinimo
    },
    {
       path: 'movimentacao-loja',
       component: MovimentacaoLoja
    },
    {
        path: 'movimentacao-fabrica',
        component: MovimentacaoFabrica
    },
    {
        path: 'produto/historico/:produtoId',
        component: HistoricoProduto
    },
    {
        path: 'estoque-loja/cadastro',
        component: EstoqueLojaCadastro
    },
    {
        path: 'estoque-loja/editar/:id',
        component: EstoqueLojaCadastro
    },
    {
        path: 'configuracoes',
        component: Configuracoes
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];