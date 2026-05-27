export function GameStatus({ status }) {
  const statusLabel = {
    WAITING_PLAYERS: 'Aguardando jogadores',
    IN_PROGRESS: 'Em andamento',
    FINISHED: 'Finalizada',
    PAUSED: 'Pausada',
  };

  return (
    <p>
      <strong>Status:</strong> {statusLabel[status] || status}
    </p>
  );
}