import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { registerSpectator, getGameById } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';
import { useGameSocket } from '@core/hooks/useGameSocket';
import { GameStatus } from '@feature/game/components/GameStatus';
import { GameBoard } from '@feature/game/components/GameBoard';

function canUseWebSocket(game) {
  return game?.status === 'PLAYING' || game?.status === 'IN_PROGRESS';
}

export function WatchGamePage() {
  const { gameId } = useParams();

  const {
    getPlayerToken,
    getSpectatorToken,
    saveSpectatorToken,
  } = useGameContext();

  const [game, setGame] = useState(null);
  const [spectator, setSpectator] = useState(null);
  const [spectatorToken, setSpectatorToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shouldOpenSocket = canUseWebSocket(game) && Boolean(spectatorToken);

  const {
    connected,
    gameState,
    socketError,
  } = useGameSocket(gameId, shouldOpenSocket ? spectatorToken : null);

  async function loadGameAndRegisterSpectator() {
    setLoading(true);
    setError(null);

    try {
      const playerToken = getPlayerToken();

      if (!playerToken) {
        throw new Error('Token do jogador não encontrado');
      }

      const gameData = await getGameById(gameId, playerToken);

      console.log('Partida carregada:', gameData);

      setGame(gameData);

      const existingSpectatorToken = getSpectatorToken(gameId);

      if (existingSpectatorToken) {
        console.log('Token de espectador já existe:', existingSpectatorToken);

        setSpectatorToken(existingSpectatorToken);

        setSpectator({
          game_id: gameId,
          spectator_name: 'Okinawa IA',
          spectator_access_token: existingSpectatorToken,
        });

        return;
      }

      const spectatorData = await registerSpectator(
        gameId,
        {
          spectator_name: 'Okinawa IA',
          spectator_avatar: 'https://example.com/avatar.png',
        },
        playerToken
      );

      console.log('Espectador registrado:', spectatorData);

      setSpectator(spectatorData);

      const newSpectatorToken =
        spectatorData.token ||
        spectatorData.access_token ||
        spectatorData.spectator_access_token;

      if (newSpectatorToken) {
        saveSpectatorToken(gameId, newSpectatorToken);
        setSpectatorToken(newSpectatorToken);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar partida ou registrar espectador');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!gameId) return;

    loadGameAndRegisterSpectator();
  }, [gameId]);

  const currentGame = gameState || game;
  const gameFinished = currentGame?.status === 'FINISHED';
  const gameIsRunning =
    currentGame?.status === 'PLAYING' || currentGame?.status === 'IN_PROGRESS';

  return (
    <div className="watch-game-page">
      <section className="watch-game-header">
        <div>
          <span className="status-pill neutral">
            Partida #{String(gameId).slice(0, 8)}
          </span>

          <h1>Assistindo jogo</h1>

          <p>
            Acompanhe o estado da partida em tempo real como espectador.
          </p>
        </div>

        <Link className="button-link secondary" to="/watch">
          Voltar para partidas
        </Link>
      </section>

      {loading && (
        <section>
          <p>Carregando partida...</p>
        </section>
      )}

      {error && (
        <section className="error-card">
          <strong>Erro:</strong> {error}
        </section>
      )}

      {socketError && shouldOpenSocket && (
        <section className="error-card">
          <strong>WebSocket:</strong> {socketError}
        </section>
      )}

      {gameFinished && (
        <section className="error-card">
          <strong>Partida finalizada:</strong> o WebSocket não será aberto
          porque essa partida já terminou.
        </section>
      )}

      <section className="match-summary">
        <div>
          <h2>Status da conexão</h2>

          <span
            className={
              connected
                ? 'connection-status connected'
                : 'connection-status disconnected'
            }
          >
            {connected
              ? 'Conectado em tempo real'
              : gameIsRunning
                ? 'Desconectado'
                : 'WebSocket inativo'}
          </span>
        </div>

        <div>
          <h2>Espectador</h2>

          {spectator ? (
            <>
              <p>
                <strong>Nome:</strong> {spectator.spectator_name}
              </p>

              <p>
                <strong>ID:</strong> {spectator.id || 'Token salvo'}
              </p>
            </>
          ) : (
            <p>Aguardando registro do espectador...</p>
          )}
        </div>
      </section>

      {currentGame && (
        <section className="game-details">
          <div className="game-details-header">
            <div>
              <h2>Dados da partida</h2>

              <GameStatus status={currentGame.status} />
            </div>

            <span className="game-id">
              #{String(currentGame.id || gameId).slice(0, 8)}
            </span>
          </div>

          <div className="players-summary">
            <article>
              <h3>Turing</h3>
              <p>
                {currentGame.turing_player?.ai_player_name || 'Não definido'}
              </p>
            </article>

            <article>
              <h3>Lovelace</h3>
              <p>
                {currentGame.lovelace_player?.ai_player_name || 'Não definido'}
              </p>
            </article>
          </div>

          <GameBoard board={currentGame.board} />
        </section>
      )}

      {spectator && (
        <section>
          <details>
            <summary>Ver dados brutos do espectador</summary>
            <pre>{JSON.stringify(spectator, null, 2)}</pre>
          </details>
        </section>
      )}
    </div>
  );
}