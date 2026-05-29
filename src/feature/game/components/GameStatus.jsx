export function GameStatus({ status }) {
  const statusLabel = {
    WAITING_PLAYERS: 'Aguardando jogadores',
    IN_PROGRESS: 'Em andamento',
    FINISHED: 'Finalizada',
    PAUSED: 'Pausada',
  };

  return (
    <span className="status-pill neutral">
      {statusLabel[status] || status || 'Status não informado'}
    </span>
  );
}