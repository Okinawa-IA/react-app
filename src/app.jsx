import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from './app-layout';
import { HomePage } from '@/routes/home-page';
import { WatchListPage } from '@/routes/watch-page';

export function App() {
  return
  <BrowserRouter>
    <AppLayout>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch" element={<WatchListPage />} />
        </Routes>
    </AppLayout>
  </BrowserRouter>
}