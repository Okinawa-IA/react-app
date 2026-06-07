import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  createGame,
  joinGame,
  listGames,
  startGame,
} from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

function getStatusLabel(status) {
  const labels = {
    WAITING_PLAYERS: 'Aguardando jogadores',
    IN_PROGRESS: 'Em andamento',
    PLAYING: 'Em andamento',
    FINISHED: 'Finalizada',
    PAUSED: 'Pausada',
  };

  return labels[status] || status;
}

function canStartGame(game) {
  return game?.status === 'WAITING_PLAYERS' || game?.status === 'PAUSED';
}

export function PlayPage() {
  const navigate = useNavigate();
  const { player, getPlayerToken } = useGameContext();

  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const [loadingGames, setLoadingGames] = useState(false);
  const [creatingGame, setCreatingGame] = useState(false);
  const [joiningGame, setJoiningGame] = useState(false);
  const [startingGame, setStartingGame] = useState(false);

  const [error, setError] = useState(null);

  async function loadGames() {
    setLoadingGames(true);
    setError(null);

    try {
      const token = getPlayerToken();

      if (!token) {
        throw new Error('Cadastre um jogador antes de jogar.');
      }

      const data = await listGames(token);

      console.log('Partidas retornadas:', data);

      const gamesList = Array.isArray(data)
        ? data
        : data.items || data.games || [];

      setGames(gamesList);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar partidas.');
    } finally {
      setLoadingGames(false);
    }
  }

  async function handleCreateGame() {
    setCreatingGame(true);
    setError(null);

    try {
      const token = getPlayerToken();

      if (!token || !player?.id) {
        throw new Error('Cadastre um jogador antes de criar partida.');
      }

      const data = await createGame(
        {
          auto_start: false,
          player_id: player.id,
          team_slot: 1,
          vs_random_bot: false,
        },
        token
      );

      console.log('Partida criada:', data);

      setSelectedGame(data);

      await loadGames();
    } catch (err) {
      console.error(err);
      setError('Erro ao criar partida.');
    } finally {
      setCreatingGame(false);
    }
  }

  async function handleJoinGame(gameId) {
    setJoiningGame(true);
    setError(null);

    try {
      const token = getPlayerToken();

      if (!token || !player?.id) {
        throw new Error('Cadastre um jogador antes de entrar em partida.');
      }

      const data = await joinGame(
        gameId,
        {
          player_id: player.id,
          team_slot: 2,
        },
        token
      );

      console.log('Entrada na partida:', data);

      setSelectedGame(data);

      await loadGames();
    } catch (err) {
      console.error(err);
      setError('Erro ao entrar na partida.');
    } finally {
      setJoiningGame(false);
    }
  }

  async function handleStartGame(gameId) {
    setStartingGame(true);
    setError(null);

    try {
      const token = getPlayerToken();

      if (!token) {
        throw new Error('Cadastre um jogador antes de iniciar partida.');
      }

      const data = await startGame(
        gameId,
        {
          reason: 'Iniciado pelo front-end',
        },
        token
      );

      console.log('Partida iniciada:', data);

      setSelectedGame(data);

      navigate(`/watch/${data.id || gameId}`);
    } catch (err) {
      console.error(err);
      setError('Erro ao iniciar partida.');
    } finally {
      setStartingGame(false);
    }
  }

  useEffect(() => {
    if (player) {
      loadGames();
    }
  }, [player]);

  const waitingGames = games.filter((game) => game.status === 'WAITING_PLAYERS');

  return (
    <div className="play-page">
      <section className="play-header">
        <div>
          <span className="status-pill neutral">Modo jogador</span>

          <h1>Jogar partida</h1>

          <p>
            Crie uma partida, entre em uma partida aberta ou inicie uma partida
            usando o jogador cadastrado.
          </p>
        </div>

        <button onClick={loadGames} disabled={loadingGames || !player}>
          {loadingGames ? 'Atualizando...' : 'Atualizar partidas'}
        </button>
      </section>

      {error && (
        <section className="error-card">
          <strong>Erro:</strong> {error}
        </section>
      )}

      <section className="player-play-card">
        <h2>Jogador atual</h2>

        {player ? (
          <div>
            <p>
              <strong>Nome:</strong> {player.ai_player_name}
            </p>

            <p>
              <strong>Grupo:</strong> {player.group_name}
            </p>

            <p>
              <strong>ID:</strong> {player.id}
            </p>

            <span className="status-pill success">Pronto para jogar</span>
          </div>
        ) : (
          <div>
            <p>Nenhum jogador cadastrado.</p>

            <Link className="button-link secondary" to="/players">
              Cadastrar jogador
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="list-header">
          <div>
            <h2>Criar nova partida</h2>

            <p>
              Crie uma partida contra bot aleatório usando seu jogador atual.
            </p>
          </div>

          <button onClick={handleCreateGame} disabled={!player || creatingGame}>
            {creatingGame ? 'Criando...' : 'Criar partida'}
          </button>
        </div>
      </section>

      {selectedGame && (
        <section>
          <h2>Partida selecionada</h2>

          <div className="selected-game-card">
            <p>
              <strong>ID:</strong> {selectedGame.id}
            </p>

            <p>
              <strong>Status:</strong> {getStatusLabel(selectedGame.status)}
            </p>

            <div className="hero-actions">
              <button
                onClick={() => handleStartGame(selectedGame.id)}
                disabled={startingGame || !canStartGame(selectedGame)}
              >
                {selectedGame.status === 'PLAYING' ||
                selectedGame.status === 'IN_PROGRESS'
                  ? 'Partida em andamento'
                  : selectedGame.status === 'FINISHED'
                    ? 'Partida finalizada'
                    : startingGame
                      ? 'Iniciando...'
                      : 'Iniciar partida'}
              </button>

              <Link
                className="button-link secondary"
                to={`/watch/${selectedGame.id}`}
              >
                Assistir partida
              </Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="list-header">
          <div>
            <h2>Partidas abertas</h2>

            <p>
              {waitingGames.length > 0
                ? `${waitingGames.length} partidas aguardando jogadores`
                : 'Nenhuma partida aberta encontrada'}
            </p>
          </div>
        </div>

        {waitingGames.length > 0 && (
          <div className="games-grid">
            {waitingGames.map((game) => (
              <article className="game-card" key={game.id}>
                <div className="game-card-header">
                  <span className="status-pill warning">
                    {getStatusLabel(game.status)}
                  </span>

                  <span className="game-id">
                    #{String(game.id).slice(0, 8)}
                  </span>
                </div>

                <div className="game-info">
                  <p>
                    <strong>Turing:</strong>{' '}
                    {game.turing_player?.ai_player_name || 'Não definido'}
                  </p>

                  <p>
                    <strong>Lovelace:</strong>{' '}
                    {game.lovelace_player?.ai_player_name || 'Não definido'}
                  </p>
                </div>

                <div className="play-card-actions">
                  <button
                    onClick={() => handleJoinGame(game.id)}
                    disabled={joiningGame}
                  >
                    {joiningGame ? 'Entrando...' : 'Entrar'}
                  </button>

                  <Link className="button-link secondary" to={`/watch/${game.id}`}>
                    Assistir
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loadingGames && waitingGames.length === 0 && (
          <p>Nenhuma partida aguardando jogadores no momento.</p>
        )}
      </section>
    </div>
  );
}