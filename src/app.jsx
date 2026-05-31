import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from './app-layout';
import { GameProvider } from '@core/context/GameContext';
import { HomePage } from '@routes/home-page';
import { PlayersPage } from '@routes/players-page';
import { WatchListPage } from '@routes/watch-page';
import { WatchGamePage } from '@routes/watch-game-page';
import { PlayPage } from '@routes/play-page';

export function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/watch" element={<WatchListPage />} />
            <Route path="/watch/:gameId" element={<WatchGamePage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </GameProvider>
  );
}