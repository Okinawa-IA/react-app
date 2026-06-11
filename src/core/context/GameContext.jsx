import { createContext, useContext, useEffect, useState } from 'react';
import { getFixedPlayer } from '@core/config/fixedPlayer';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const fixedPlayer = getFixedPlayer();

    localStorage.setItem('player', JSON.stringify(fixedPlayer));

    return fixedPlayer;
  });

  const [spectatorTokens, setSpectatorTokens] = useState(() => {
    const storedTokens = localStorage.getItem('spectatorTokens');

    return storedTokens ? JSON.parse(storedTokens) : {};
  });

  useEffect(() => {
    const fixedPlayer = getFixedPlayer();

    localStorage.setItem('player', JSON.stringify(fixedPlayer));
    setPlayer(fixedPlayer);
  }, []);

  useEffect(() => {
    localStorage.setItem('spectatorTokens', JSON.stringify(spectatorTokens));
  }, [spectatorTokens]);

  function savePlayer() {
    const fixedPlayer = getFixedPlayer();

    localStorage.setItem('player', JSON.stringify(fixedPlayer));
    setPlayer(fixedPlayer);

    return fixedPlayer;
  }

  function getPlayerToken() {
    return getFixedPlayer().player_access_token;
  }

  function getSpectatorToken(gameId) {
    return spectatorTokens[gameId];
  }

  function saveSpectatorToken(gameId, token) {
    setSpectatorTokens((currentTokens) => ({
      ...currentTokens,
      [gameId]: token,
    }));
  }

  return (
    <GameContext.Provider
      value={{
        player,
        savePlayer,
        getPlayerToken,
        spectatorTokens,
        getSpectatorToken,
        saveSpectatorToken,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGameContext precisa ser usado dentro de GameProvider');
  }

  return context;
}