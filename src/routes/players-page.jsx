import { useEffect, useState } from 'react';
import { createPlayer, listPlayers } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

export function PlayersPage() {
  const { player, savePlayer, getPlayerToken } = useGameContext();

  const [formData, setFormData] = useState({
    group_name: 'Okinawa IA',
    ai_player_name: 'Okinawa Player',
    ai_player_avatar: 'https://example.com/avatar.png',
    ai_player_description: 'Jogador criado pelo front-end React',
    ai_player_move_endpoint: 'https://example.com/',
  });

  const [players, setPlayers] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [creatingPlayer, setCreatingPlayer] = useState(false);
  const [error, setError] = useState(null);

  const total = players.length;
  const totalPages = Math.ceil(total / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedPlayers = players.slice(startIndex, endIndex);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleCreatePlayer(event) {
    event.preventDefault();

    setCreatingPlayer(true);
    setError(null);

    try {
      const data = await createPlayer(formData);

      console.log('Jogador criado:', data);

      savePlayer(data);

      alert('Jogador criado com sucesso!');

      await loadPlayers(1);
    } catch (err) {
      console.error(err);
      setError('Erro ao criar jogador. Verifique os dados do formulário.');
    } finally {
      setCreatingPlayer(false);
    }
  }

  async function loadPlayers(selectedPage = 1) {
    setLoadingPlayers(true);
    setError(null);

    try {
      const token = getPlayerToken();

      if (!token) {
        throw new Error('Crie um jogador antes de listar players');
      }

      const data = await listPlayers(token);

      console.log('Players retornados pela API:', data);

      const playersList = Array.isArray(data)
        ? data
        : data.items || data.players || [];

      setPlayers(playersList);
      setPage(selectedPage);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar jogadores. Crie um jogador primeiro.');
    } finally {
      setLoadingPlayers(false);
    }
  }

  function goToPreviousPage() {
    if (page <= 1) return;

    setPage((currentPage) => currentPage - 1);
  }

  function goToNextPage() {
    if (page >= totalPages) return;

    setPage((currentPage) => currentPage + 1);
  }

  useEffect(() => {
    if (player) {
      loadPlayers(1);
    }
  }, [player]);

  return (
    <div className="players-page">
      <section>
        <h1>Players</h1>

        <p>
          Cadastre seu jogador inteligente e consulte os jogadores já registrados
          na API.
        </p>
      </section>

      <section>
        <h2>Cadastrar jogador</h2>

        <form className="player-form" onSubmit={handleCreatePlayer}>
          <div>
            <label htmlFor="group_name">Grupo</label>
            <input
              id="group_name"
              name="group_name"
              type="text"
              value={formData.group_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="ai_player_name">Nome do jogador</label>
            <input
              id="ai_player_name"
              name="ai_player_name"
              type="text"
              value={formData.ai_player_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="ai_player_avatar">URL do avatar</label>
            <input
              id="ai_player_avatar"
              name="ai_player_avatar"
              type="url"
              value={formData.ai_player_avatar}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="ai_player_description">Descrição</label>
            <textarea
              id="ai_player_description"
              name="ai_player_description"
              value={formData.ai_player_description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="ai_player_move_endpoint">
              Endpoint de movimento
            </label>
            <input
              id="ai_player_move_endpoint"
              name="ai_player_move_endpoint"
              type="url"
              value={formData.ai_player_move_endpoint}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={creatingPlayer}>
              {creatingPlayer ? 'Criando jogador...' : 'Criar jogador'}
            </button>
          </div>
        </form>

        {error && <p className="error-text">{error}</p>}
      </section>

      <section>
        <h2>Jogador atual</h2>

        {player ? (
          <div className="current-player-card">
            <p>
              <strong>Grupo:</strong> {player.group_name}
            </p>

            <p>
              <strong>Nome:</strong> {player.ai_player_name}
            </p>

            <p>
              <strong>ID:</strong> {player.id}
            </p>

            <span className="status-pill success">Jogador cadastrado</span>

            <details>
              <summary>Ver dados do jogador</summary>
              <pre>{JSON.stringify(player, null, 2)}</pre>
            </details>
          </div>
        ) : (
          <p>Nenhum jogador cadastrado ainda.</p>
        )}
      </section>

      <section>
        <div className="list-header">
          <div>
            <h2>Lista de jogadores</h2>

            <p>
              {total > 0
                ? `${total} jogadores encontrados`
                : 'Nenhum jogador encontrado'}
            </p>
          </div>

          <button onClick={() => loadPlayers(1)} disabled={loadingPlayers}>
            {loadingPlayers ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {paginatedPlayers.length > 0 && (
          <div className="players-grid">
            {paginatedPlayers.map((item) => (
              <article className="player-card" key={item.id}>
                <div>
                  <h3>{item.ai_player_name}</h3>
                  <p>{item.group_name}</p>
                </div>

                <span className="player-id">#{item.id}</span>
              </article>
            ))}
          </div>
        )}

        {!loadingPlayers && paginatedPlayers.length === 0 && (
          <p>Nenhum jogador encontrado nesta página.</p>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={goToPreviousPage} disabled={page <= 1}>
              Anterior
            </button>

            <span>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>

            <button onClick={goToNextPage} disabled={page >= totalPages}>
              Próxima
            </button>
          </div>
        )}
      </section>
    </div>
  );
}