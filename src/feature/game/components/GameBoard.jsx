export function GameBoard({ board }) {
  if (!board || board.length === 0) {
    return <p>Tabuleiro não encontrado.</p>;
  }

  return (
    <div>
      <h2>Tabuleiro</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${board[0].length}, 40px)`,
          gap: '4px',
        }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              {cell.professor ? 'P' : cell.level}
            </div>
          ))
        )}
      </div>
    </div>
  );
}