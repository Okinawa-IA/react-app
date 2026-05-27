import { createContext, useContext, useEffect, useState } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const storedPlayer = localStorage.getItem('player');

    return storedPlayer ? JSON.parse(storedPlayer) : null;
  });

  const [spectatorTokens, setSpectatorTokens] = useState(() => {
    const storedTokens = localStorage.getItem('spectatorTokens');

    return storedTokens ? JSON.parse(storedTokens) : {};
  });

  useEffect(() => {
    if (player) {
      localStorage.setItem('player', JSON.stringify(player));
    }
  }, [player]);

  useEffect(() => {
    localStorage.setItem('spectatorTokens', JSON.stringify(spectatorTokens));
  }, [spectatorTokens]);

  function savePlayer(playerData) {
    setPlayer(playerData);
  }

  function getPlayerToken() {
   return player?.player_access_token;
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