import { Link, useParams } from "react-router";
import { useState } from "react";

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

  return (
    <div>
      <h1>Assistindo Jogo #{id}</h1>
      <Link to="/watch">&lt; Voltar</Link>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto consequuntur magnam ipsa sed minima? Velit libero, nulla expedita deserunt enim error at beatae officiis, dolorum saepe similique ad asperiores ratione?</p>
    </div>
  );
}