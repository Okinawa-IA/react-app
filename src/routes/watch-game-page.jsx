import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { registerSpectator, getGameById } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';
import { useGameSocket } from '@core/hooks/useGameSocket';
import { GameStatus } from '@feature/game/components/GameStatus';
import { GameBoard } from '@feature/game/components/GameBoard';

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

  const {
    connected,
    gameState,
    socketError,
  } = useGameSocket(gameId, spectatorToken);

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

  return (
    <div>
      <h1>Assistindo partida</h1>

      <p>
        <strong>ID:</strong> {gameId}
      </p>

      <Link to="/watch">&lt; Voltar</Link>

      {loading && <p>Carregando partida...</p>}

      {error && <p>{error}</p>}

      {socketError && <p>{socketError}</p>}

      <p>
        <strong>Status WebSocket:</strong>{' '}
        {connected ? 'conectado' : 'desconectado'}
      </p>

      {currentGame && (
        <div>
          <h2>Dados da partida</h2>

          <GameStatus status={currentGame.status} />

          <p>
            <strong>Jogador atual:</strong>{' '}
            {currentGame.turing_player?.ai_player_name || 'Não definido'}
          </p>

          <GameBoard board={currentGame.board} />
        </div>
      )}

      {spectator && (
        <div>
          <h2>Espectador registrado</h2>
          <pre>{JSON.stringify(spectator, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}