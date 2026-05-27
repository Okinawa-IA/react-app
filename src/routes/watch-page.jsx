import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { listGames } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

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
        : data.items || [];

      setGames(gamesList);
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

      {games.length > 0 && (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <Link to={`/watch/${game.id}`}>
                Assistir partida {game.id} - {game.status}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}