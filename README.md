# WebEstoque-Artesanato_Acai

## 🖥️ Frontend para gerenciamento de estoque

O **WebEstoque-Artesanato_Acai** é uma aplicação web desenvolvida com **Angular 21 e TypeScript**, criada para fornecer uma interface de gerenciamento para uma solução de controle de estoque.

O frontend foi desenvolvido para consumir uma API REST responsável pelas operações de estoque, produtos, lotes e movimentações.

## 🏗️ Arquitetura da solução

O frontend faz parte de uma solução composta por uma aplicação web e uma API backend:

```text
┌─────────────────────────────────┐
│       WebEstoque                 │
│       Angular 21                 │
│       TypeScript                 │
└───────────────┬─────────────────┘
                │
                │ HTTP / REST
                ▼
┌─────────────────────────────────┐
│       ApiEstoque                 │
│       Java 21                    │
│       Spring Boot                │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│       PostgreSQL 16              │
└─────────────────────────────────┘
```

O frontend e o backend são mantidos em repositórios separados, permitindo a evolução independente das aplicações.

## 🛠️ Tecnologias utilizadas

### Frontend

* Angular 21.1
* TypeScript 5.9
* Angular Router
* Angular Forms
* RxJS
* Bootstrap 5.3
* Bootstrap Icons

### Desenvolvimento e testes

* Angular CLI 21.1
* npm 11
* Vitest
* JSDOM
* Prettier

## 📦 Funcionalidades

A aplicação frontend é utilizada como interface para o sistema de gerenciamento de estoque, permitindo a interação com os recursos disponibilizados pela API backend.

A solução está relacionada aos seguintes processos:

* Gerenciamento de produtos;
* Controle de estoque;
* Estoque de fábrica;
* Estoque de loja;
* Lotes de fabricação;
* Movimentações de estoque;
* Rastreabilidade de lotes.

> As operações e regras de negócio são processadas pelo backend através da `ApiEstoque`.

## 🔗 Integração com o Backend

O frontend foi desenvolvido para consumir a API REST do projeto:

**ApiEstoque-Artesanato_Acai**

Repositório:

https://github.com/Michel-Gomes/ApiEstoque-Artesanato_Acai

A comunicação entre as aplicações ocorre através de requisições HTTP utilizando APIs REST.

```text
WebEstoque
    │
    │ HTTP / REST
    ▼
ApiEstoque
    │
    ▼
PostgreSQL
```

## 📁 Estrutura

O projeto utiliza a estrutura padrão de uma aplicação Angular, com separação dos recursos da aplicação dentro de `src`.

```text
WebEstoque-Artesanato_Acai/
│
├── public/
│   └── assets/
│
├── src/
│
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 🚀 Como executar

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm

### 1. Clonar o projeto

```bash
git clone https://github.com/Michel-Gomes/WebEstoque-Artesanato_Acai.git
```

Acessar a pasta:

```bash
cd WebEstoque-Artesanato_Acai
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Executar a aplicação

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:4200
```

## 🧪 Testes

O projeto possui configuração para execução de testes utilizando **Vitest**.

Para executar os testes:

```bash
npm test
```

Os testes fazem parte da evolução da aplicação e podem ser ampliados conforme novas funcionalidades forem adicionadas.

## 🔨 Build

Para gerar a versão de produção:

```bash
npm run build
```

Também é possível utilizar o modo de desenvolvimento com recompilação automática:

```bash
npm run watch
```

## 🔄 Evolução do projeto

O frontend faz parte de uma aplicação em evolução contínua, acompanhando as mudanças e novas funcionalidades implementadas na `ApiEstoque`.

Entre as próximas evoluções estão:

* Ampliação da cobertura de testes automatizados;
* Evolução das funcionalidades de gerenciamento de estoque;
* Integração com novas funcionalidades do backend;
* Implementação futura de autenticação de usuários.

## 🎯 Objetivos técnicos

O projeto demonstra a aplicação prática de conceitos como:

* Desenvolvimento de aplicações web com Angular;
* TypeScript;
* Componentização;
* Consumo de APIs REST;
* Formulários;
* Roteamento;
* Comunicação assíncrona com RxJS;
* Interface utilizando Bootstrap;
* Organização de uma aplicação frontend;
* Testes automatizados com Vitest;
* Integração entre frontend e backend.

## 🔗 Projeto relacionado

### Backend

**ApiEstoque-Artesanato_Acai**

API REST desenvolvida com Java 21 e Spring Boot para gerenciamento dos recursos de estoque.

https://github.com/Michel-Gomes/ApiEstoque-Artesanato_Acai

## 👨‍💻 Autor

**Michel Gomes**
