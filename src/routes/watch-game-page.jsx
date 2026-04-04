import { Link, useParams } from "react-router";

export function WatchGamePage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Assistindo Jogo #{id}</h1>
      <Link to="/watch">&lt; Voltar</Link>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto consequuntur magnam ipsa sed minima? Velit libero, nulla expedita deserunt enim error at beatae officiis, dolorum saepe similique ad asperiores ratione?</p>
    </div>
  );
}