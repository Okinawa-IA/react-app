import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { listGames } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

const STATUS_FILTERS = [
  {
    label: 'Todas',
    value: 'ALL',
  },
  {
    label: 'Aguardando',
    value: 'WAITING_PLAYERS',
  },
  {
    label: 'Em andamento',
    value: 'IN_PROGRESS',
  },
  {
    label: 'Pausadas',
    value: 'PAUSED',
  },
  {
    label: 'Finalizadas',
    value: 'FINISHED',
  },
];

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

function getStatusClass(status) {
  const classes = {
    WAITING_PLAYERS: 'status-pill warning',
    IN_PROGRESS: 'status-pill success',
    PLAYING: 'status-pill success',
    FINISHED: 'status-pill neutral',
    PAUSED: 'status-pill warning',
  };

  return classes[status] || 'status-pill neutral';
}

function matchesStatusFilter(game, statusFilter) {
  if (statusFilter === 'ALL') {
    return true;
  }

  if (statusFilter === 'IN_PROGRESS') {
    return game.status === 'IN_PROGRESS' || game.status === 'PLAYING';
  }

  return game.status === statusFilter;
}

export function WatchListPage() {
  const { getPlayerToken } = useGameContext();

  const [games, setGames] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredGames = games.filter((game) =>
    matchesStatusFilter(game, statusFilter)
  );

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
          <span className="hero-badge">Partidas</span>

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
          <div className="list-header">
            <div>
              <h2>Partidas encontradas</h2>

              <p>
                Exibindo {filteredGames.length} de {games.length} partidas.
              </p>
            </div>
          </div>

          <div className="status-filter">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={statusFilter === filter.value ? 'active' : ''}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {filteredGames.length === 0 ? (
            <div className="empty-filter-card">
              <p>Nenhuma partida encontrada para esse filtro.</p>
            </div>
          ) : (
            <div className="games-grid">
              {filteredGames.map((game) => {
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
          )}
        </section>
      )}
    </div>
  );
}