# Projeto Integrador 5 - Frontend

Este repositório contém a aplicação frontend desenvolvida para o Projeto Integrador 5, utilizando **React** com **Vite**.

A aplicação tem como objetivo servir como interface para visualizar os jogos dos jogadores inteligentes desenvolvidos no projeto.

---

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- React Router
- npm
- Git

---

## Comandos importantes usados no projeto

Durante a criação da aplicação frontend com React e Vite, alguns comandos foram utilizados para configurar, instalar dependências, executar e versionar o projeto.

---

## Inicializar o repositório Git

```bash
git init

```

Cria um repositório Git local dentro da pasta do projeto.

Esse comando permite versionar o código, fazer commits e depois enviar o projeto para o GitHub.

----------

## Inicializar o projeto Node/npm

```bash
npm init -y

```

Cria o arquivo `package.json`, que guarda as informações principais do projeto, como nome, versão, scripts e dependências.

O parâmetro `-y` responde automaticamente às perguntas iniciais do npm, criando uma configuração padrão.

----------

## Instalar o Vite

```bash
npm install --save-dev vite

```

Instala o Vite como dependência de desenvolvimento.

O Vite é a ferramenta usada para rodar o servidor local, fazer o build da aplicação e facilitar o desenvolvimento frontend.

----------

## Instalar tipos do Node

```bash
npm install --save-dev @types/node

```

Instala definições de tipos do Node.js.

Mesmo usando JavaScript, esse pacote ajuda o editor, como o VS Code, a entender melhor recursos do Node e oferecer autocomplete.

----------

## Instalar React, React DOM e React Router

```bash
npm install react react-dom react-router

```

Instala as principais dependências da aplicação React.

-   `react`: biblioteca principal para criar componentes e interfaces.
    
-   `react-dom`: permite renderizar os componentes React no navegador.
    
-   `react-router`: permite criar rotas e navegação entre páginas dentro da aplicação.
    

----------

## Instalar tipos do React

```bash
npm install --save-dev @types/react @types/react-dom

```

Instala definições de tipos para React e React DOM.

Esses pacotes ajudam o editor a reconhecer melhor os componentes, propriedades e funções do React.

----------

## Instalar o plugin React para o Vite

```bash
npm install -D @vitejs/plugin-react

```

Instala o plugin que permite ao Vite trabalhar corretamente com React e JSX.

O `-D` é um atalho para `--save-dev`, ou seja, instala como dependência de desenvolvimento.

----------

## Rodar o projeto em modo desenvolvimento

```bash
npm run dev

```

Inicia o servidor local de desenvolvimento do Vite.

Esse comando permite abrir a aplicação no navegador e ver as alterações quase automaticamente sempre que um arquivo é salvo.

----------

## Gerar a versão de produção

```bash
npm run build

```

Gera a versão final da aplicação para produção.

O Vite cria uma pasta `dist/` com os arquivos otimizados, minificados e prontos para publicação.

----------

## Visualizar a versão de produção localmente

```bash
npm run preview

```

Executa uma prévia local da versão gerada pelo `npm run build`.

Serve para testar como a aplicação vai se comportar depois de preparada para produção.

----------

# Comandos Git para entrega

## Conectar o repositório local ao GitHub

```bash
git remote add origin https://github.com/Okinawa-IA/Entrega-01.git

```

Conecta o projeto local a um repositório remoto no GitHub.

----------

## Enviar o projeto para o GitHub

```bash
git push -u origin main

```

Envia os commits do projeto local para o repositório remoto no GitHub.

O `-u` configura a branch local para acompanhar a branch remota, facilitando os próximos `git push`.

Caso a branch principal do projeto seja `master`, use:

```bash
git push -u origin master

```

----------

# Arquivo `.gitignore`

No arquivo `.gitignore`, foram adicionados:

```gitignore
dist/
node_modules/
.env

```

Esses arquivos e pastas não devem ser enviados ao GitHub.

-   `dist/`: pasta gerada automaticamente no build de produção.
    
-   `node_modules/`: pasta com as dependências instaladas pelo npm.
    
-   `.env`: arquivo usado para variáveis de ambiente, podendo conter dados sensíveis.
    

----------

# Scripts de Execução

## `npm run dev`

Executa o projeto em ambiente de desenvolvimento.

## `npm run build`

Gera os arquivos finais da aplicação para produção.

## `npm run preview`

Permite visualizar localmente a versão de produção gerada pelo build.

----------


