import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { listGames } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

function getStatusLabel(status) {
  const labels = {
    WAITING_PLAYERS: 'Aguardando jogadores',
    IN_PROGRESS: 'Em andamento',
    FINISHED: 'Finalizada',
    PAUSED: 'Pausada',
  };

  return labels[status] || status;
}

function getStatusClass(status) {
  const classes = {
    WAITING_PLAYERS: 'status-pill warning',
    IN_PROGRESS: 'status-pill success',
    FINISHED: 'status-pill neutral',
    PAUSED: 'status-pill warning',
  };

  return classes[status] || 'status-pill neutral';
}

export function WatchListPage() {
  const { getPlayerToken } = useGameContext();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadGames() {
    setLoading(true);
    setError(null);

    try {
      const token = getPlayerToken();

      if (!token) {
        throw new Error('Token do jogador não encontrado');
      }

      const data = await listGames(token);

      console.log('Partidas retornadas pela API:', data);

      const gamesList = Array.isArray(data)
        ? data
        : data.items || data.games || [];

      setGames(gamesList);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar partidas. Cadastre um jogador primeiro.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div className="watch-page">
      <section className="watch-header">
        <div>

          <h1>Assistir partidas</h1>

          <p>
            Escolha uma partida disponível para entrar como espectador e
            acompanhar o tabuleiro em tempo real.
          </p>
        </div>

        <button onClick={loadGames} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar lista'}
        </button>
      </section>

      {error && (
        <section className="error-card">
          <strong>Erro:</strong> {error}
        </section>
      )}

      {!loading && !error && games.length === 0 && (
        <section>
          <p>Nenhuma partida encontrada.</p>
        </section>
      )}

      {games.length > 0 && (
        <section>
          <div className="games-grid">
            {games.map((game) => {
              const spectatorsCount = game.spectators?.length || 0;

              return (
                <article className="game-card" key={game.id}>
                  <div className="game-card-header">
                    <span className={getStatusClass(game.status)}>
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

                    <p>
                      <strong>Espectadores:</strong> {spectatorsCount}
                    </p>
                  </div>

                  <Link className="button-link full" to={`/watch/${game.id}`}>
                    Assistir partida
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}