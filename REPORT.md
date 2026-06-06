# Relatório Técnico — Front-end Okinawa IA

## 1. Tecnologias utilizadas

O front-end foi desenvolvido com **React** e **Vite**.

A escolha do React foi feita porque ele facilita a criação de interfaces componentizadas, permitindo separar a aplicação em páginas, componentes reutilizáveis e hooks. Isso ajuda a manter o projeto mais organizado conforme novas funcionalidades são adicionadas, como cadastro de jogadores, listagem de partidas, modo jogador e modo espectador.

O Vite foi utilizado por ser uma ferramenta moderna de criação e execução de projetos front-end. Ele permite iniciar o ambiente de desenvolvimento rapidamente, possui recarregamento automático durante o desenvolvimento e gera uma versão otimizada da aplicação no processo de build.

## 2. Organização de rotas

A aplicação foi separada em rotas principais para organizar melhor cada responsabilidade do sistema:

- `/players`: tela responsável pelo cadastro e listagem de jogadores.
- `/play`: tela voltada para o modo jogador, permitindo criar partidas, entrar em partidas abertas e iniciar partidas.
- `/watch`: tela responsável por listar partidas disponíveis para acompanhamento.
- `/watch/:gameId`: tela de espectador, onde é possível visualizar uma partida específica, acompanhar o tabuleiro e receber atualizações via WebSocket.

Essa separação evita que toda a lógica fique concentrada em uma única página e torna o fluxo da aplicação mais claro. Cada rota representa uma funcionalidade principal do projeto.

## 3. Uso do GameContext

Foi criado um contexto global chamado `GameContext` para compartilhar informações importantes entre diferentes telas da aplicação.

O contexto armazena principalmente:

- o jogador cadastrado;
- o token de acesso do jogador;
- os tokens de espectador associados a cada partida.

O uso do `GameContext` evita a necessidade de passar essas informações manualmente por várias páginas e componentes. Assim, qualquer tela que precise acessar o jogador atual ou os tokens pode fazer isso diretamente pelo contexto.

## 4. Uso do localStorage

A aplicação salva dados no `localStorage` para manter o usuário autenticado mesmo após atualizar a página.

Atualmente, o front-end salva o objeto inteiro do jogador na chave `player`. Dentro desse objeto existe o campo:

```txt
player_access_token
````

Esse token é utilizado nas requisições protegidas da API, como listagem de partidas, criação de partidas, entrada em partidas e busca de dados de uma partida.

Também são salvos tokens de espectador por partida na chave:

```txt
spectatorTokens
```

A estrutura funciona como um objeto em que cada `gameId` possui seu respectivo `spectator_access_token`.

Exemplo conceitual:

```json
{
  "id-da-partida": "token-do-espectador"
}
```

Essa estratégia permite que, ao recarregar a tela de uma partida, o front-end reutilize o token de espectador já registrado, evitando criar um novo espectador desnecessariamente.

## 5. Listagem de partidas

A listagem de partidas é feita por meio da rota `/watch`.

Essa tela chama a API de partidas usando o token do jogador salvo no `localStorage`. A resposta da API retorna uma lista de partidas com informações como:

* ID da partida;
* status da partida;
* jogador Turing;
* jogador Lovelace;
* quantidade de espectadores.

Cada partida é exibida em formato de card, com um botão para assistir. Ao clicar em uma partida, o usuário é direcionado para:

```txt
/watch/:gameId
```

Essa rota usa o `gameId` presente na URL para buscar os dados completos da partida.

## 6. Tela de espectador

A tela de espectador fica na rota:

```txt
/watch/:gameId
```

Ela tem como responsabilidade carregar uma partida específica e permitir que o usuário acompanhe o jogo.

O fluxo da tela é:

1. Capturar o `gameId` da URL.
2. Buscar o token do jogador salvo no contexto/localStorage.
3. Buscar os dados da partida na API.
4. Verificar se já existe token de espectador para aquela partida.
5. Caso não exista, registrar um novo espectador.
6. Salvar o `spectator_access_token`.
7. Abrir conexão WebSocket se a partida estiver em andamento.
8. Renderizar o tabuleiro atualizado.

O registro de espectador é necessário porque a API retorna um token específico para acompanhamento daquela partida.

## 7. WebSocket

A aplicação utiliza WebSocket para acompanhar atualizações em tempo real da partida.

O WebSocket é aberto usando o `gameId` da partida e o `spectator_access_token` recebido no registro do espectador.

A URL utilizada segue o formato:

```txt
wss://pi5-api-production.up.railway.app/api/v1/ws/games/{gameId}?token={spectator_access_token}
```

A lógica de conexão foi isolada em um hook chamado `useGameSocket`, responsável por:

* abrir a conexão;
* identificar quando o WebSocket está conectado;
* receber mensagens da API;
* atualizar o estado atual da partida;
* tratar erros de conexão;
* fechar a conexão ao sair da página.

Com isso, a tela de espectador não precisa controlar diretamente toda a lógica do WebSocket, deixando o código mais organizado.

## 8. Tratamento de partidas finalizadas

O front-end trata partidas finalizadas para evitar erros desnecessários de WebSocket.

Quando uma partida está com status `FINISHED`, a aplicação não tenta abrir uma conexão WebSocket, pois a partida já terminou e não há mais atualizações em tempo real a serem recebidas.

Nesse caso, a tela mostra os dados finais da partida e exibe uma mensagem informando que o WebSocket não será aberto porque a partida já foi finalizada.

Esse tratamento evita tentativas de conexão inválidas e melhora a experiência do usuário.

## 9. Modo jogador

Além do modo espectador, foi criada a rota:

```txt
/play
```

Essa tela permite que o jogador cadastrado:

* crie uma nova partida;
* entre em partidas abertas;
* inicie uma partida;
* seja direcionado para a tela de acompanhamento da partida.

A movimentação real do jogador depende do backend do bot, cadastrado no campo:

```txt
ai_player_move_endpoint
```

No front-end, o papel da tela `/play` é interagir com a API principal para criar e iniciar partidas. A lógica de decisão do jogador será executada no backend do bot.

## 10. Conclusão

O front-end foi estruturado para separar bem as responsabilidades da aplicação.

A aplicação possui:

* cadastro e listagem de jogadores;
* persistência do jogador e token no `localStorage`;
* criação e início de partidas;
* listagem de partidas;
* registro de espectadores;
* acompanhamento de partidas via WebSocket;
* tratamento de partidas finalizadas;
* renderização visual do tabuleiro.

Essa organização facilita a manutenção do projeto e permite integrar posteriormente o backend do bot responsável pela tomada de decisão do jogador.
