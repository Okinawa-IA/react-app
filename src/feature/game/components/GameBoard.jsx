export function GameBoard({ board }) {
  if (!board || board.length === 0) {
    return <p>Tabuleiro não encontrado.</p>;
  }

  return (
    <div className="board-wrapper">
      <h2>Tabuleiro</h2>

      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${board[0].length}, 72px)`,
        }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className="game-cell"
              title={`Linha ${rowIndex + 1}, Coluna ${columnIndex + 1}`}
            >
              {cell.professor ? 'P' : cell.level}
            </div>
          ))
        )}
      </div>
    </div>
  );
}