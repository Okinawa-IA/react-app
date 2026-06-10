import { useEffect, useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function resolveWebSocketURL(url) {
  const cleanUrl = url.trim();

  if (cleanUrl.startsWith('ws://') || cleanUrl.startsWith('wss://')) {
    return cleanUrl;
  }

  return cleanUrl.replace(/^https/, 'wss').replace(/^http/, 'ws');
}

function createWebSocketUrl(gameId, spectatorToken) {
  const url = new URL(`api/v1/ws/games/${gameId}`, API_BASE_URL);

  url.searchParams.set('token', spectatorToken);

  return resolveWebSocketURL(url.toString());
}

function normalizeSocketMessage(message) {
  console.log('Mensagem bruta do WebSocket:', message);

  const normalized =
    message.game ||
    message.data?.game ||
    message.data?.state ||
    message.data?.payload ||
    message.state ||
    message.payload ||
    message.data ||
    message;

  console.log('Estado normalizado do WebSocket:', normalized);

  return normalized;
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
        try {
          const message = JSON.parse(event.data);
          const normalizedGameState = normalizeSocketMessage(message);

          setGameState((previousState) => ({
            ...previousState,
            ...normalizedGameState,
            turing_player:
              normalizedGameState.turing_player ||
              normalizedGameState.turingPlayer ||
              previousState?.turing_player ||
              previousState?.turingPlayer,
            lovelace_player:
              normalizedGameState.lovelace_player ||
              normalizedGameState.lovelacePlayer ||
              previousState?.lovelace_player ||
              previousState?.lovelacePlayer,
          }));
        } catch (err) {
          console.error('Erro ao processar mensagem do WebSocket:', err);
          setSocketError('Erro ao processar mensagem em tempo real');
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