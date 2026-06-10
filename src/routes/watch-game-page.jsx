import { Link, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { registerSpectator, getGameById } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';
import { useGameSocket } from '@core/hooks/useGameSocket';
import { GameStatus } from '@feature/game/components/GameStatus';
import { GameBoard } from '@feature/game/components/GameBoard';

function canUseWebSocket(game) {
  return game?.status === 'PLAYING' || game?.status === 'IN_PROGRESS';
}

function normalizeTeamId(teamId) {
  if (teamId === null || teamId === undefined) {
    return null;
  }

  const parsedTeamId = Number(teamId);

  return Number.isNaN(parsedTeamId) ? null : parsedTeamId;
}

function getWinnerTeam(game) {
  return normalizeTeamId(
    game?.winner_team ||
      game?.winnerTeam ||
      game?.winner?.team_id ||
      game?.winner?.teamId ||
      game?.result?.winner_team ||
      game?.result?.winnerTeam
  );
}

function getWinnerClass(game) {
  if (!game || game.status !== 'FINISHED') {
    return 'neutral';
  }

  const winnerTeam = getWinnerTeam(game);

  if (winnerTeam === 1 || winnerTeam === 2) {
    return 'success';
  }

  return 'warning';
}

function getTeamName(teamId) {
  const normalizedTeamId = normalizeTeamId(teamId);

  if (normalizedTeamId === 1) {
    return 'Time 1 - Turing';
  }

  if (normalizedTeamId === 2) {
    return 'Time 2 - Lovelace';
  }

  return 'Um jogador';
}

function getTeamProfessors(teamId) {
  const normalizedTeamId = normalizeTeamId(teamId);

  if (normalizedTeamId === 1) {
    return ['CLARO', 'REY'];
  }

  if (normalizedTeamId === 2) {
    return ['KARIN', 'BEATRIZ'];
  }

  return [];
}

function getProfessorByTeam(teamId) {
  const professors = getTeamProfessors(teamId);

  if (professors.length === 0) {
    return 'Um jogador';
  }

  return professors[0];
}

function getPlayerName(player) {
  return (
    player?.ai_player_name ||
    player?.name ||
    player?.player_name ||
    player?.group_name ||
    'Não definido'
  );
}

function getTuringPlayer(game) {
  return (
    game?.turing_player ||
    game?.turingPlayer ||
    game?.players?.find?.((player) => player.team_slot === 1) ||
    game?.players?.find?.((player) => player.team_id === 1) ||
    null
  );
}

function getLovelacePlayer(game) {
  return (
    game?.lovelace_player ||
    game?.lovelacePlayer ||
    game?.players?.find?.((player) => player.team_slot === 2) ||
    game?.players?.find?.((player) => player.team_id === 2) ||
    null
  );
}

function getWinnerPlayer(game) {
  const winnerTeam = getWinnerTeam(game);

  if (winnerTeam === 1) {
    return getTuringPlayer(game);
  }

  if (winnerTeam === 2) {
    return getLovelacePlayer(game);
  }

  return null;
}

function getWinnerPopupText(game) {
  if (!game || game.status !== 'FINISHED') {
    return 'A partida ainda não foi finalizada.';
  }

  const winnerTeam = getWinnerTeam(game);
  const winnerPlayer = getWinnerPlayer(game);
  const winnerPlayerName = getPlayerName(winnerPlayer);

  if (winnerTeam === 1) {
    return `${winnerPlayerName} venceu jogando como Turing, com CLARO e REY.`;
  }

  if (winnerTeam === 2) {
    return `${winnerPlayerName} venceu jogando como Lovelace, com KARIN e BEATRIZ.`;
  }

  return 'A partida foi finalizada sem vencedor definido.';
}

function getLastAction(game) {
  return (
    game?.last_action ||
    game?.lastAction ||
    game?.current_action ||
    game?.currentAction ||
    game?.action ||
    null
  );
}

function getActionType(action) {
  return (
    action?.type ||
    action?.action ||
    action?.move ||
    action?.event_type ||
    action?.eventType ||
    action?.name ||
    null
  );
}

function getActionTeamId(action) {
  return (
    action?.team_id ||
    action?.teamId ||
    action?.player_team ||
    action?.playerTeam ||
    action?.current_team ||
    action?.currentTeam ||
    null
  );
}

function getGameActionText(game) {
  const status = game?.status;

  if (status === 'FINISHED') {
    return 'A partida foi finalizada.';
  }

  if (status === 'PAUSED') {
    return 'A partida está pausada.';
  }

  if (status === 'WAITING_PLAYERS') {
    return 'Aguardando jogadores para iniciar a partida.';
  }

  const lastAction = getLastAction(game);

  if (!lastAction) {
    if (status === 'PLAYING' || status === 'IN_PROGRESS') {
      return 'A partida está em andamento. Aguardando a próxima jogada.';
    }

    return 'Aguardando movimentações da partida.';
  }

  const actionType = getActionType(lastAction);
  const teamId = getActionTeamId(lastAction);

  const teamName = getTeamName(teamId);
  const professorName = getProfessorByTeam(teamId);

  if (!actionType) {
    if (status === 'PLAYING' || status === 'IN_PROGRESS') {
      return 'A partida está em andamento. Aguardando a próxima jogada.';
    }

    return 'Aguardando movimentações da partida.';
  }

  if (actionType === 'forfeit' || actionType === 'FORFEIT') {
    if (
      lastAction.reason === 'invalid_move' ||
      lastAction.reason === 'INVALID_MOVE'
    ) {
      return `${professorName} tentou uma jogada inválida e o ${teamName} perdeu a vez.`;
    }

    return `${teamName} perdeu a vez.`;
  }

  if (actionType === 'move' || actionType === 'MOVE') {
    return `${professorName} se movimentou pelo tabuleiro.`;
  }

  if (actionType === 'help_student' || actionType === 'HELP_STUDENT') {
    return `${professorName} ajudou um aluno a passar de semestre.`;
  }

  if (actionType === 'level_up' || actionType === 'LEVEL_UP') {
    return `${professorName} evoluiu uma casa do tabuleiro.`;
  }

  if (actionType === 'attack' || actionType === 'ATTACK') {
    return `${professorName} realizou uma ação contra o time adversário.`;
  }

  return 'A partida está em andamento. Aguardando a próxima jogada.';
}

function mergeGameData(apiGame, socketGame) {
  if (!apiGame && !socketGame) {
    return null;
  }

  if (!apiGame) {
    return socketGame;
  }

  if (!socketGame) {
    return apiGame;
  }

  return {
    ...apiGame,
    ...socketGame,

    id: socketGame.id || apiGame.id,
    status: socketGame.status || apiGame.status,
    board: socketGame.board || apiGame.board,

    turing_player:
      socketGame.turing_player ||
      socketGame.turingPlayer ||
      apiGame.turing_player ||
      apiGame.turingPlayer,

    lovelace_player:
      socketGame.lovelace_player ||
      socketGame.lovelacePlayer ||
      apiGame.lovelace_player ||
      apiGame.lovelacePlayer,

    winner_team:
      socketGame.winner_team ||
      socketGame.winnerTeam ||
      socketGame.winner?.team_id ||
      socketGame.winner?.teamId ||
      socketGame.result?.winner_team ||
      socketGame.result?.winnerTeam ||
      apiGame.winner_team ||
      apiGame.winnerTeam ||
      apiGame.winner?.team_id ||
      apiGame.winner?.teamId ||
      apiGame.result?.winner_team ||
      apiGame.result?.winnerTeam,

    last_action:
      socketGame.last_action ||
      socketGame.lastAction ||
      socketGame.current_action ||
      socketGame.currentAction ||
      socketGame.action ||
      apiGame.last_action ||
      apiGame.lastAction ||
      apiGame.current_action ||
      apiGame.currentAction ||
      apiGame.action,
  };
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
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const finishedReloadedRef = useRef(false);
  const winnerPopupOpenedRef = useRef(false);

  const shouldOpenSocket = canUseWebSocket(game) && Boolean(spectatorToken);

  const {
    connected,
    gameState,
    socketError,
  } = useGameSocket(gameId, shouldOpenSocket ? spectatorToken : null);

  const currentGame = mergeGameData(game, gameState);

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

  async function reloadFinishedGame() {
    try {
      const playerToken = getPlayerToken();

      if (!playerToken) {
        return;
      }

      const finishedGameData = await getGameById(gameId, playerToken);

      console.log('Partida finalizada recarregada:', finishedGameData);

      setGame((previousGame) => mergeGameData(previousGame, finishedGameData));
    } catch (err) {
      console.error('Erro ao recarregar partida finalizada:', err);
    }
  }

  useEffect(() => {
    if (!gameId) return;

    finishedReloadedRef.current = false;
    winnerPopupOpenedRef.current = false;

    setShowWinnerPopup(false);

    loadGameAndRegisterSpectator();
  }, [gameId]);

  useEffect(() => {
    if (!gameState) return;

    setGame((previousGame) => mergeGameData(previousGame, gameState));
  }, [gameState]);

  useEffect(() => {
    if (currentGame?.status !== 'FINISHED') {
      return;
    }

    if (!winnerPopupOpenedRef.current) {
      winnerPopupOpenedRef.current = true;
      setShowWinnerPopup(true);
    }

    if (finishedReloadedRef.current) {
      return;
    }

    finishedReloadedRef.current = true;
    reloadFinishedGame();
  }, [currentGame?.status, gameId]);

  const gameFinished = currentGame?.status === 'FINISHED';

  const gameIsRunning =
    currentGame?.status === 'PLAYING' || currentGame?.status === 'IN_PROGRESS';

  const winnerClass = getWinnerClass(currentGame);
  const winnerPopupText = getWinnerPopupText(currentGame);
  const gameActionText = getGameActionText(currentGame);

  const turingPlayer = getTuringPlayer(currentGame);
  const lovelacePlayer = getLovelacePlayer(currentGame);

  return (
    <div className="watch-game-page">
      {gameFinished && showWinnerPopup && (
        <div className="winner-modal-overlay">
          <div className="winner-modal">
            <span className={`status-pill ${winnerClass}`}>
              Partida finalizada
            </span>

            <h2>Resultado da partida</h2>

            <p>{winnerPopupText}</p>

            <div className="winner-modal-actions">
              <button type="button" onClick={() => setShowWinnerPopup(false)}>
                Fechar
              </button>

              <Link className="button-link secondary" to="/watch">
                Ver outras partidas
              </Link>
            </div>
          </div>
        </div>
      )}

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
          <span className="hero-badge">Acontecimento</span>

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

              <p>{getPlayerName(turingPlayer)}</p>

              <small>Time 1 — CLARO e REY</small>
            </article>

            <article>
              <h3>Lovelace</h3>

              <p>{getPlayerName(lovelacePlayer)}</p>

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