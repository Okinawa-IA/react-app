const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders(token) {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}


async function request(path, options = {}) {
  const { token, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
      ...fetchOptions.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Erro da API:', {
      status: response.status,
      path,
      data,
    });

    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return data;
}

export function createPlayer(data) {
  return request('/api/v1/players', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function listPlayers(token, page = 1, pageSize = 20) {
  return request(`/api/v1/players?page=${page}&page_size=${pageSize}`, {
    method: 'GET',
    token,
  });
}

export function updatePlayerMovement(playerId, data, token) {
  return request(`/api/v1/players/${playerId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function createGame(data, token) {
  return request('/api/v1/games', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function joinGame(gameId, data, token) {
  return request(`/api/v1/games/${gameId}/join`, {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function startGame(gameId, data, token) {
  return request(`/api/v1/games/${gameId}/start`, {
    method: 'POST',
    token,
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


export function registerSpectator(gameId, data, token) {
  return request(`/api/v1/games/${gameId}/spectators`, {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function getMockGameState() {
  return request('/api/v1/games/mock-state', {
    method: 'POST',
  });
}