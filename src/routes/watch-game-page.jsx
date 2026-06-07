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

function getWinnerText(game) {
  if (!game || game.status !== 'FINISHED') {
    return null;
  }

  if (game.winner_team === 1) {
    return 'Time 1 - Turing venceu com CLARO e REY';
  }

  if (game.winner_team === 2) {
    return 'Time 2 - Lovelace venceu com KARIN e BEATRIZ';
  }

  return 'Partida finalizada sem vencedor definido';
}

function getWinnerClass(game) {
  if (!game || game.status !== 'FINISHED') {
    return 'neutral';
  }

  if (game.winner_team === 1 || game.winner_team === 2) {
    return 'success';
  }

  return 'warning';
}

function getTeamName(teamId) {
  if (teamId === 1) {
    return 'Time 1 - Turing';
  }

  if (teamId === 2) {
    return 'Time 2 - Lovelace';
  }

  return 'Time não definido';
}

function getTeamProfessors(teamId) {
  if (teamId === 1) {
    return ['CLARO', 'REY'];
  }

  if (teamId === 2) {
    return ['KARIN', 'BEATRIZ'];
  }

  return [];
}

function getProfessorByTeam(teamId) {
  const professors = getTeamProfessors(teamId);

  if (professors.length === 0) {
    return 'O time';
  }

  return professors[0];
}

function getGameActionText(game) {
  const lastAction = game?.last_action;

  if (!lastAction) {
    if (game?.status === 'FINISHED') {
      return 'A partida foi finalizada.';
    }

    if (game?.status === 'PLAYING' || game?.status === 'IN_PROGRESS') {
      return 'A partida está em andamento. Aguardando a próxima jogada.';
    }

    return 'Aguardando movimentações da partida.';
  }

  const teamName = getTeamName(lastAction.team_id);
  const professorName = getProfessorByTeam(lastAction.team_id);

  if (lastAction.type === 'forfeit') {
    if (lastAction.reason === 'invalid_move') {
      return `${professorName} tentou uma jogada inválida e o ${teamName} perdeu a vez.`;
    }

    return `${teamName} perdeu a vez.`;
  }

  if (lastAction.type === 'move') {
    return `${professorName} se movimentou pelo tabuleiro.`;
  }

  if (lastAction.type === 'help_student') {
    return `${professorName} ajudou um aluno a passar de semestre.`;
  }

  if (lastAction.type === 'level_up') {
    return `${professorName} evoluiu uma casa do tabuleiro.`;
  }

  if (lastAction.type === 'attack') {
    return `${professorName} realizou uma ação contra o time adversário.`;
  }

  return `${teamName} realizou uma ação: ${lastAction.type}.`;
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

  const winnerText = getWinnerText(currentGame);
  const winnerClass = getWinnerClass(currentGame);
  const gameActionText = getGameActionText(currentGame);

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
        <section className="finished-card">
          <div>
            <span className={`status-pill ${winnerClass}`}>
              Partida finalizada
            </span>

            <h2>Resultado da partida</h2>

            <p>{winnerText}</p>
          </div>
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
        <section className="game-action-card">
          <span className="status-pill neutral">Acontecimento</span>

          <h2>Status do jogo</h2>

          <p>{gameActionText}</p>
        </section>
      )}

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

              <small>Time 1 — CLARO e REY</small>
            </article>

            <article>
              <h3>Lovelace</h3>
              <p>
                {currentGame.lovelace_player?.ai_player_name || 'Não definido'}
              </p>

              <small>Time 2 — KARIN e BEATRIZ</small>
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