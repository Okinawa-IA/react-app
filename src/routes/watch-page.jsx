import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { listGames } from '@core/api/api';

export function WatchListPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadGames() {
    setLoading(true);
    setError(null);

    try {
      const data = await listGames();

      console.log('Partidas retornadas pela API:', data);

      setGames(Array.isArray(data) ? data : data.games || []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar partidas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div>
      <h1>Assistir partidas</h1>

      <button onClick={loadGames}>
        Atualizar lista
      </button>

      {loading && <p>Carregando partidas...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && games.length === 0 && (
        <p>Nenhuma partida encontrada.</p>
      )}

      <ul>
        {games.map((game) => {
          const gameId = game.id || game.game_id || game.gameId;

          return (
            <li key={gameId}>
              <Link to={`/watch/${gameId}`}>
                Assistir partida {gameId}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}