import { useEffect, useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function resolveWebSocketURL(url) {
  const cleanUrl = url.trim();

  if (cleanUrl.startsWith('ws://') || cleanUrl.startsWith('wss://')) {
    return cleanUrl;
  }

  return cleanUrl.replace(/^http/, 'ws').replace(/^https/, 'wss');
}

function createWebSocketUrl(gameId, spectatorToken) {
  const url = new URL(`api/v1/ws/games/${gameId}`, API_BASE_URL);

  url.searchParams.set('token', spectatorToken);

  return resolveWebSocketURL(url.toString());
}

export function useGameSocket(gameId, spectatorToken) {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [socketError, setSocketError] = useState(null);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    if (!gameId || !spectatorToken) return;

    shouldReconnectRef.current = true;

    function connect() {
      const socketUrl = createWebSocketUrl(gameId, spectatorToken);

      console.log('Conectando WebSocket em:', socketUrl);

      const socket = new WebSocket(socketUrl);

      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket aberto');
        setConnected(true);
        setSocketError(null);
      };

      socket.onmessage = (event) => {
        console.log('Mensagem recebida do WebSocket:', event.data);

        try {
          const data = JSON.parse(event.data);
          setGameState(data);
        } catch (err) {
          console.error('Erro ao interpretar mensagem do WebSocket:', err);
          setSocketError('Erro ao interpretar mensagem do servidor');
        }
      };

      socket.onerror = (event) => {
        console.error('Erro no WebSocket:', event);
        setSocketError('Erro na conexão em tempo real');
      };

      socket.onclose = () => {
        console.log('WebSocket fechado');
        setConnected(false);

        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 2000);
        }
      };
    }

    connect();

    return () => {
      shouldReconnectRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [gameId, spectatorToken]);

  return {
    connected,
    gameState,
    socketError,
  };
}