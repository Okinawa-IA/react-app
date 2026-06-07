import claroImg from '@/assets/professors/claro.png';
import reyImg from '@/assets/professors/rey.png';
import biaImg from '@/assets/professors/bia.png';
import karinImg from '@/assets/professors/karin.png';

const professorImages = {
  CLARO: claroImg,
  REY: reyImg,
  BEATRIZ: biaImg,
  BIA: biaImg,
  KARIN: karinImg,
};

function normalizeText(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

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
    professor.full_name ||
    professor.display_name ||
    'Professor'
  );
}

function getProfessorImage(professorName) {
  const normalizedName = normalizeText(professorName);

  if (normalizedName.includes('CLARO')) {
    return professorImages.CLARO;
  }

  if (normalizedName.includes('REY')) {
    return professorImages.REY;
  }

  if (normalizedName.includes('BIA') || normalizedName.includes('BEATRIZ')) {
    return professorImages.BEATRIZ;
  }

  if (normalizedName.includes('KARIN')) {
    return professorImages.KARIN;
  }

  return null;
}

function getProfessorTeamClass(professorName) {
  const normalizedName = normalizeText(professorName);

  if (normalizedName.includes('CLARO') || normalizedName.includes('REY')) {
    return 'professor-team-1';
  }

  if (
    normalizedName.includes('BIA') ||
    normalizedName.includes('BEATRIZ') ||
    normalizedName.includes('KARIN')
  ) {
    return 'professor-team-2';
  }

  return 'professor-team-default';
}

function renderCellContent(cell) {
  const professorName = getProfessorName(cell.professor);

  if (professorName) {
    const professorImage = getProfessorImage(professorName);
    const professorTeamClass = getProfessorTeamClass(professorName);

    return (
      <div className={`cell-character professor ${professorTeamClass}`}>
        {professorImage ? (
          <img
            src={professorImage}
            alt={professorName}
            className="professor-image"
          />
        ) : (
          <span className="professor-fallback">先</span>
        )}

        <small>{professorName}</small>
      </div>
    );
  }

  if (cell.turing_player || cell.turing) {
    return (
      <div className="cell-character turing">
        <span className="player-avatar">🤖</span>
        <small>Turing</small>
      </div>
    );
  }

  if (cell.lovelace_player || cell.lovelace) {
    return (
      <div className="cell-character lovelace">
        <span className="player-avatar">🧠</span>
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
            gridTemplateColumns: `repeat(${boardColumns}, 96px)`,
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