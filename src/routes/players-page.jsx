import { useEffect, useState } from 'react';
import { createPlayer, listPlayers } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

export function PlayersPage() {
  const { player, savePlayer, getPlayerToken } = useGameContext();

  const [formData, setFormData] = useState({
    group_name: 'Okinawa IA',
    ai_player_name: 'Jogador Frontend',
    ai_player_avatar: 'https://example.com/avatar.png',
    ai_player_description: 'Jogador criado pelo front-end React',
    ai_player_move_endpoint: 'https://example.com/',
  });

  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [creatingPlayer, setCreatingPlayer] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      console.error(err);
      setError('Erro ao criar jogador. Verifique os dados do formulário.');
    } finally {
      setCreatingPlayer(false);
    }
  }

  async function loadPlayers() {
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
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar jogadores. Crie um jogador primeiro.');
    } finally {
      setLoadingPlayers(false);
    }
  }

  useEffect(() => {
    if (player) {
      loadPlayers();
    }
  }, [player]);

  return (
    <div>
      <h1>Players</h1>

      <section>
        <h2>Cadastrar jogador</h2>

        <form onSubmit={handleCreatePlayer}>
          <div>
            <label htmlFor="group_name">
              Grupo
            </label>
            <br />
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
            <label htmlFor="ai_player_name">
              Nome do jogador
            </label>
            <br />
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
            <label htmlFor="ai_player_avatar">
              URL do avatar
            </label>
            <br />
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
            <label htmlFor="ai_player_description">
              Descrição
            </label>
            <br />
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
            <br />
            <input
              id="ai_player_move_endpoint"
              name="ai_player_move_endpoint"
              type="url"
              value={formData.ai_player_move_endpoint}
              onChange={handleInputChange}
              required
            />
          </div>

          <br />

          <button type="submit" disabled={creatingPlayer}>
            {creatingPlayer ? 'Criando jogador...' : 'Criar jogador'}
          </button>
        </form>

        {error && <p>{error}</p>}
      </section>

      <hr />

      <section>
        <h2>Jogador atual</h2>

        {player ? (
          <div>
            <p>
              <strong>Grupo:</strong> {player.group_name}
            </p>

            <p>
              <strong>Nome:</strong> {player.ai_player_name}
            </p>

            <p>
              <strong>ID:</strong> {player.id}
            </p>

            <details>
              <summary>Ver dados do jogador</summary>
              <pre>{JSON.stringify(player, null, 2)}</pre>
            </details>
          </div>
        ) : (
          <p>Nenhum jogador cadastrado ainda.</p>
        )}
      </section>

      <hr />

      <section>
        <h2>Lista de jogadores</h2>

        <button onClick={loadPlayers} disabled={loadingPlayers}>
          {loadingPlayers ? 'Carregando...' : 'Atualizar jogadores'}
        </button>

        {!loadingPlayers && players.length === 0 && (
          <p>Nenhum jogador encontrado.</p>
        )}

        {players.length > 0 && (
          <ul>
            {players.map((item) => (
              <li key={item.id}>
                <strong>{item.ai_player_name}</strong> — {item.group_name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}