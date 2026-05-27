import { Link } from 'react-router';
import { useGameContext } from '@core/context/GameContext';

export function HomePage() {
  const { player } = useGameContext();

  return (
    <div className="home-page">
      <section className="hero-card">
        <div>
          <span className="hero-badge">Projeto Integrador 5</span>

          <p>
            Acompanhe partidas entre jogadores inteligentes em um tabuleiro
            dinâmico. Cada jogador toma decisões automáticas para explorar o
            jogo, reagir ao estado atual da partida e disputar contra outros
            agentes.
          </p>

          <p>
            Entre como espectador para visualizar partidas em tempo real,
            acompanhar o status do jogo e observar as mudanças do tabuleiro
            conforme os jogadores realizam seus movimentos.
          </p>

          <div className="hero-actions">
            <Link className="button-link" to="/watch">
              Assistir partidas
            </Link>

            <Link className="button-link secondary" to="/players">
              Cadastrar jogador
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <h2>Status do jogador</h2>

          {player ? (
            <>
              <p>
                <strong>Nome:</strong> {player.ai_player_name}
              </p>

              <p>
                <strong>Grupo:</strong> {player.group_name}
              </p>

              <p>
                <strong>ID:</strong> {player.id}
              </p>

              <span className="status-pill success">
                Jogador cadastrado
              </span>
            </>
          ) : (
            <>
              <p>
                Nenhum jogador cadastrado ainda. Cadastre um jogador para
                liberar o acesso às partidas.
              </p>

              <span className="status-pill warning">
                Cadastro pendente
              </span>
            </>
          )}
        </div>
      </section>

      <section>
        <h2>Sobre o jogo</h2>

        <div className="game-description">
          <p>
            O jogo acontece em um tabuleiro formado por células. Cada partida
            possui jogadores inteligentes que recebem informações do estado
            atual e precisam responder com seu próximo movimento.
          </p>

          <p>
            O front-end permite cadastrar seu jogador, consultar partidas
            disponíveis e acompanhar uma partida como espectador usando conexão
            em tempo real via WebSocket.
          </p>
        </div>
      </section>
    </div>
  );
}