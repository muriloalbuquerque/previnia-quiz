import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import './Home.css';

const Home = () => {
  const { user, leaderboard, startGame, setLeaderboard } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      const parsedLeaderboard = JSON.parse(savedLeaderboard);
      
      const currentUserInLeaderboard = parsedLeaderboard.some(
        player => player.name === user?.name
      );

      if (!currentUserInLeaderboard && user?.score > 0) {
        parsedLeaderboard.push({
          name: user.name,
          score: user.score
        });
        parsedLeaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(parsedLeaderboard));
      }

      setLeaderboard(parsedLeaderboard);
    }
  }, [user, setLeaderboard]);

  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="header-container">
          <h1 className="welcome-text">
            Bem-vindo, {user?.name}!
          </h1>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Sair
          </button>
        </div>

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
                Dicas sobre Prevenção de Enchentes
              </h2>
              <ul className="tips-list">
                <li className="tip-item">
                  <h3 className="tip-primary">Monitore os níveis de água</h3>
                  <p className="tip-secondary">Acompanhe alertas meteorológicos e fique atento aos níveis dos rios</p>
                </li>
                <li className="tip-item">
                  <h3 className="tip-primary">Prepare seu kit de emergência</h3>
                  <p className="tip-secondary">Água potável, alimentos não perecíveis, documentos em saco plástico e rádio à pilha</p>
                </li>
                <li className="tip-item">
                  <h3 className="tip-primary">Conheça rotas seguras</h3>
                  <p className="tip-secondary">Identifique pontos altos e rotas de evacuação em sua região</p>
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