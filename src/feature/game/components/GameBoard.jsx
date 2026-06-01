function getProfessorName(professor) {
  if (!professor) {
    return null;
  }

  if (typeof professor === 'string') {
    return professor;
  }

  return (
    professor.name ||
    professor.professor_name ||
    professor.nome ||
    'Professor'
  );
}

function renderCellContent(cell) {
  const professorName = getProfessorName(cell.professor);

  if (professorName) {
    return (
      <div className="cell-character professor">
        <span>👨‍🏫</span>
        <small>{professorName}</small>
      </div>
    );
  }

  if (cell.turing_player || cell.turing) {
    return (
      <div className="cell-character turing">
        <span>🤖</span>
        <small>Turing</small>
      </div>
    );
  }

  if (cell.lovelace_player || cell.lovelace) {
    return (
      <div className="cell-character lovelace">
        <span>🧠</span>
        <small>Lovelace</small>
      </div>
    );
  }

  return <span className="cell-level">{cell.level ?? 0}</span>;
}

export function GameBoard({ board }) {
  if (!board || board.length === 0) {
    return <p>Tabuleiro não encontrado.</p>;
  }

  const boardColumns = board[0]?.length || 0;

  return (
    <div className="board-wrapper">
      <div className="board-title-row">
        <div>
          <h2>Tabuleiro</h2>
          <p>Acompanhe jogadores e professores no mapa da partida.</p>
        </div>

        <span className="board-size">
          {board.length} x {boardColumns}
        </span>
      </div>

      <div className="board-scroll">
        <div
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${boardColumns}, 88px)`,
          }}
        >
          {board.flatMap((row, rowIndex) =>
            row.map((cell, columnIndex) => {
              const professorName = getProfessorName(cell.professor);

              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={[
                    'game-cell',
                    professorName ? 'has-professor' : '',
                    cell.turing_player || cell.turing ? 'has-turing' : '',
                    cell.lovelace_player || cell.lovelace ? 'has-lovelace' : '',
                  ].join(' ')}
                  title={
                    professorName
                      ? `Professor: ${professorName}`
                      : `Linha ${rowIndex + 1}, Coluna ${columnIndex + 1}`
                  }
                >
                  {renderCellContent(cell)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}