import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import './Home.css';

const Home = () => {
  const { user, leaderboard, startGame } = useGame();
  const navigate = useNavigate();

  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="welcome-text">
          Bem-vindo, {user?.name}!
        </h1>

        <div className="home-grid">
          <div className="main-section">
            <div className="score-card">
              <h2 className="score-title">
                Sua Pontuação
              </h2>
              <div className="score-value">
                {user?.score || 0}
              </div>
              <div className="credits-text">
                Créditos disponíveis: {user?.credits || 0}
              </div>
              <button
                onClick={handleStartGame}
                className="play-button"
              >
                Jogar Agora
              </button>
            </div>

            <div className="tips-card">
              <h2 className="tips-title">
                Dicas sobre Prevenção de Desastres
              </h2>
              <ul className="tips-list">
                <li className="tip-item">
                  <h3 className="tip-primary">Mantenha um kit de emergência</h3>
                  <p className="tip-secondary">Água, alimentos não perecíveis, lanternas e rádio são essenciais</p>
                </li>
                <li className="tip-item">
                  <h3 className="tip-primary">Conheça as rotas de fuga</h3>
                  <p className="tip-secondary">Identifique saídas de emergência e pontos de encontro</p>
                </li>
                <li className="tip-item">
                  <h3 className="tip-primary">Mantenha-se informado</h3>
                  <p className="tip-secondary">Acompanhe alertas meteorológicos e orientações das autoridades</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="ranking-card">
            <h2 className="ranking-title">
              Ranking
            </h2>
            <ul className="ranking-list">
              {leaderboard.map((player, index) => (
                <li key={player.name} className="ranking-item">
                  <h3 className="ranking-name">{index + 1}. {player.name}</h3>
                  <p className="ranking-score">Pontuação: {player.score}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 