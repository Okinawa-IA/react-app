import { Link } from 'react-router';

export function AppLayout({ children = null }) {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>PI5 Frontend</h1>
          <p>Jogadores, partidas e acompanhamento em tempo real</p>
        </div>
      </header>

      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/players">Players</Link>
        <Link to="/watch">Watch</Link>
      </nav>

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 PI5 - Okinawa IA</p>
      </footer>
    </div>
  );
}