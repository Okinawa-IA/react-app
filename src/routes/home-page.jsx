import { createPlayer } from '@core/api/api';
import { useGameContext } from '@core/context/GameContext';

export function HomePage() {
  const { player, savePlayer } = useGameContext();

  async function handleCreatePlayer() {
    try {
      const data = await createPlayer({
        group_name: 'Okinawa IA',
        ai_player_name: 'Jogador Frontend',
        ai_player_avatar: 'https://example.com/avatar.png',
        ai_player_description: 'Jogador criado pelo front-end React',
        ai_player_move_endpoint: 'https://example.com/',
      });

      console.log('Jogador criado:', data);

      savePlayer(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao criar jogador');
    }
  }

  return (
    <div>
      <h1>Home</h1>

      <p>Front-end PI5</p>

      {player ? (
        <div>
          <p>Jogador cadastrado.</p>
          <pre>{JSON.stringify(player, null, 2)}</pre>
        </div>
      ) : (
        <button onClick={handleCreatePlayer}>
          Criar jogador
        </button>
      )}
    </div>
  );
}