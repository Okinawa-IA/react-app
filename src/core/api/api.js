const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const token = options.token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
}

export function createPlayer(data) {
  return request('/api/v1/players', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function listGames(token) {
  return request('/api/v1/games', {
    method: 'GET',
    token,
  });
}

export function getGameById(gameId, token) {
  return request(`/api/v1/games/${gameId}`, {
    method: 'GET',
    token,
  });
}

export function registerSpectator(gameId, token) {
  return request(`/api/v1/games/${gameId}/spectators`, {
    method: 'POST',
    token,
  });
}

export function getMockGameState() {
  return request('/api/v1/games/mock-state', {
    method: 'POST',
  });
}