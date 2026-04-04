import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";

export function WatchGamePage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Busca um estado aleatório de jogo
   */
  const fetchGame = async () => {
    setError(false);
    setLoading(true);
    
    try {
        const response = await fetch(
            `https://pi5-api-production.up.railway.app/api/v1/games/mock-state`, 
            {
                method: 'POST',
            },
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar estado do jogo');
        }

        const game = await response.json();
        setData(game);
        
    } catch (err) {
        setError(true);
    } finally {
        setLoading(false);
    }
   };

    useEffect(() => {
        if (!id) return;
        fetchGame();
   }, [id]);

   
   

  return (
    <div>
      <h1>Assistindo Jogo #{id}</h1>
      <Link to="/watch">&lt; Voltar</Link>
      <p>
            {error && <span>'Ocorreu um erro ao buscar o estado do jogo.'</span>}
            {loading && <span>'Carregando estado do jogo...'</span>}
            {data && 
                <span>
                    <pre>Estado do jogo: {JSON.stringify(data, null, 2)}</pre>
                </span>
            }
        </p>
    </div>
  );
}