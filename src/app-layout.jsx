import { Link } from 'react-router';
import toriiIcon from '@assets/torii.svg';

export function AppLayout({ children = null }) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src={toriiIcon} alt="Torii japonês" />

          <div>
            <h1>Okinawa IA</h1>
            <p>Jogadores, partidas e acompanhamento em tempo real</p>
          </div>
        </div>

        <span className="header-kanji">沖縄</span>
      </header>

      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/players">Jogadores</Link>
         <Link to="/play">Jogar</Link>
        <Link to="/watch">Assistir</Link>
      </nav>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}