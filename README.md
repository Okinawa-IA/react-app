# Okinawa IA Frontend - PI5

Frontend em React com Vite para a interface web do projeto PI5.

Esta aplicação consome a API principal do torneio e permite que o grupo Okinawa IA crie partidas, entre em jogos existentes, acompanhe partidas em andamento e visualize o tabuleiro em tempo real.

O sistema utiliza um player configurável por variáveis de ambiente, permitindo trocar o ID e o token do jogador sem alterar o código-fonte.

## Objetivo

O objetivo deste frontend é fornecer uma interface visual para interação com a API principal do professor, permitindo o gerenciamento e acompanhamento das partidas do time Okinawa IA.

Fluxo esperado:

```txt
Usuário acessa o Frontend Okinawa IA
        ↓
Aplicação carrega o player configurado
        ↓
Usuário cria ou entra em uma partida
        ↓
Frontend envia requisições para a API principal
        ↓
API principal aciona o endpoint do bot
        ↓
Frontend acompanha o estado da partida e exibe o tabuleiro
```

## Tecnologias utilizadas

* React
* Vite
* JavaScript
* React Router DOM
* CSS
* Vercel
* Railway

## Funcionalidades

* Player fixo configurável por variáveis de ambiente
* Listagem de jogadores
* Criação de partidas
* Entrada em partidas existentes
* Inicialização automática de partidas
* Listagem de partidas disponíveis
* Registro como espectador
* Visualização de partidas em andamento
* Atualização do estado da partida
* Exibição visual do tabuleiro
* Exibição dos professores/personagens no tabuleiro
* Exibição do vencedor ao final da partida
* Integração com a API principal do torneio
* Integração com o endpoint do bot Okinawa IA

## Estrutura do projeto

```txt
react-app/
├── public/
│
├── src/
│   ├── assets/
│   │   └── professors/
│   │       ├── bia.png
│   │       ├── claro.png
│   │       ├── karin.png
│   │       └── rey.png
│   │
│   ├── core/
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── config/
│   │   │   └── fixedPlayer.js
│   │   │
│   │   └── context/
│   │       └── GameContext.jsx
│   │
│   ├── feature/
│   │   └── game/
│   │       └── components/
│   │           └── GameBoard.jsx
│   │
│   ├── routes/
│   │   ├── home-page.jsx
│   │   ├── players-page.jsx
│   │   ├── play-page.jsx
│   │   ├── watch-page.jsx
│   │   └── watch-game-page.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── vite.config.js
└── vercel.json
```

## Principais arquivos

### `src/core/api/api.js`

Arquivo responsável pela comunicação com a API principal do torneio.

Centraliza as funções de requisição utilizadas pelo frontend, como:

* Listar jogadores
* Criar partidas
* Entrar em partidas
* Iniciar partidas
* Buscar partida por ID
* Listar partidas
* Registrar espectador
* Buscar histórico de turnos da partida

### `src/core/config/fixedPlayer.js`

Arquivo responsável por centralizar os dados do player utilizado pela aplicação.

Os dados podem vir das variáveis de ambiente ou, caso elas não existam, dos valores padrão definidos no próprio arquivo.

Isso permite que o ID e o token do player sejam alterados sem necessidade de modificar o restante do sistema.

### `src/core/context/GameContext.jsx`

Contexto global da aplicação.

Responsável por armazenar e disponibilizar informações importantes, como:

* Player atual
* Token do player
* Tokens de espectador
* Função para recuperar o token do player
* Função para salvar tokens de espectador

### `src/feature/game/components/GameBoard.jsx`

Componente responsável por renderizar visualmente o tabuleiro da partida.

Exibe os professores/personagens no mapa e atualiza a visualização conforme o estado retornado pela API.

### `src/routes`

Pasta responsável pelas páginas principais da aplicação.

| Arquivo               | Responsabilidade                                 |
| --------------------- | ------------------------------------------------ |
| `home-page.jsx`       | Página inicial da aplicação                      |
| `players-page.jsx`    | Página de jogadores                              |
| `play-page.jsx`       | Página para criar ou entrar em partidas          |
| `watch-page.jsx`      | Página de listagem/acompanhamento de partidas    |
| `watch-game-page.jsx` | Página de visualização de uma partida específica |

## Rotas da aplicação

| Rota             | Descrição                                        |
| ---------------- | ------------------------------------------------ |
| `/`              | Página inicial                                   |
| `/players`       | Página de jogadores                              |
| `/play`          | Página para criar ou entrar em partidas          |
| `/watch`         | Página para acompanhar partidas                  |
| `/watch/:gameId` | Página de visualização de uma partida específica |

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
```

2. Acesse a pasta do projeto:

```bash
cd react-app
```

3. Instale as dependências:

```bash
npm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias.

Exemplo:

```env
VITE_API_BASE_URL=https://pi5-api-production.up.railway.app

VITE_FIXED_PLAYER_ID=216
VITE_FIXED_PLAYER_GROUP_NAME=Okinawa
VITE_FIXED_PLAYER_NAME=okinawa_bot
VITE_FIXED_PLAYER_AVATAR=https://i0.wp.com/blog.janm.org/wp-content/uploads/2015/07/shisa-by-troy-williams-via-flickr.jpg?ssl=1
VITE_FIXED_PLAYER_DESCRIPTION=Bot de testes
VITE_FIXED_PLAYER_MOVE_ENDPOINT=https://back-end-production-f7ba.up.railway.app/move
VITE_FIXED_PLAYER_ACCESS_TOKEN=coloque_o_token_do_player_aqui
```

## Variáveis de ambiente

| Variável                          | Descrição                                  |
| --------------------------------- | ------------------------------------------ |
| `VITE_API_BASE_URL`               | URL base da API principal do torneio       |
| `VITE_FIXED_PLAYER_ID`            | ID do player utilizado pela aplicação      |
| `VITE_FIXED_PLAYER_GROUP_NAME`    | Nome do grupo                              |
| `VITE_FIXED_PLAYER_NAME`          | Nome do bot/player                         |
| `VITE_FIXED_PLAYER_AVATAR`        | URL do avatar do player                    |
| `VITE_FIXED_PLAYER_DESCRIPTION`   | Descrição do player                        |
| `VITE_FIXED_PLAYER_MOVE_ENDPOINT` | Endpoint público do bot Okinawa IA         |
| `VITE_FIXED_PLAYER_ACCESS_TOKEN`  | Token de acesso do player na API principal |

## Como rodar localmente

Na raiz do projeto, execute:

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:5173
```

## Como gerar build de produção

Execute:

```bash
npm run build
```

O Vite irá gerar os arquivos finais na pasta:

```txt
dist/
```

## Como testar a build localmente

Após gerar a build, execute:

```bash
npm run preview
```

## Scripts disponíveis

| Comando           | Descrição                                         |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Inicia a aplicação em ambiente de desenvolvimento |
| `npm run build`   | Gera a build de produção                          |
| `npm run preview` | Executa localmente a build gerada                 |

## Integração com a API principal

O frontend se comunica com a API principal do torneio por meio da variável:

```env
VITE_API_BASE_URL=https://pi5-api-production.up.railway.app
```

Essa API é responsável por gerenciar:

* Players
* Partidas
* Entrada em partidas
* Início dos jogos
* Estado atual do jogo
* Histórico de turnos
* Espectadores

## Integração com o bot Okinawa IA

O player configurado no frontend utiliza o seguinte endpoint de movimento:

```txt
https://back-end-production-f7ba.up.railway.app/move
```

Esse endpoint pertence ao backend Okinawa Bot API e é responsável por calcular a próxima jogada do agente.

Campo utilizado no cadastro do player:

```json
{
  "ai_player_move_endpoint": "https://back-end-production-f7ba.up.railway.app/move"
}
```

## Player fixo

A aplicação utiliza um player fixo para facilitar a execução dos testes e evitar a necessidade de cadastro manual a cada uso.

Os dados do player são carregados a partir das variáveis de ambiente. Caso essas variáveis não estejam configuradas, o arquivo `fixedPlayer.js` utiliza valores padrão.

Essa estratégia permite que, caso o player seja recriado, seja necessário alterar apenas o ID e o token nas variáveis de ambiente.

Exemplo:

```env
VITE_FIXED_PLAYER_ID=216
VITE_FIXED_PLAYER_ACCESS_TOKEN=novo_token_do_player
```

Após alterar essas variáveis em produção, é necessário realizar um novo deploy.

## Deploy na Vercel

O frontend está publicado na Vercel.

Para o funcionamento correto em produção, as variáveis de ambiente devem ser cadastradas em:

```txt
Vercel → Project Settings → Environment Variables
```

As variáveis devem ser configuradas para os ambientes:

```txt
Production
Preview
Development
```

Após adicionar ou alterar variáveis de ambiente, é necessário realizar um novo deploy.

## Reescrita de rotas na Vercel

Como a aplicação utiliza React Router, o arquivo `vercel.json` é utilizado para redirecionar as rotas para o `index.html`.

Exemplo:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Isso evita erro ao acessar diretamente rotas como:

```txt
/watch/1
/play
/players
```

## Fluxo de funcionamento

```txt
Frontend Okinawa IA
        ↓
Carrega player configurado
        ↓
Usuário cria ou entra em uma partida
        ↓
Frontend envia requisições para a API principal
        ↓
API principal gerencia o estado do jogo
        ↓
API principal chama o endpoint do bot
        ↓
Bot retorna movimento e mentoria
        ↓
Frontend atualiza e exibe o tabuleiro
```
## Deploy na Vercel

O frontend está publicado na Vercel e pode ser acessado pelo link:

```txt
https://okinawa-ia.vercel.app/
```

