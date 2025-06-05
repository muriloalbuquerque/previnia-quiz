import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const { setUser } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedLeaderboard = localStorage.getItem('leaderboard');

    if (storedUser && storedLeaderboard) {
      try {
        const parsedUser = JSON.parse(storedUser);
        JSON.parse(storedLeaderboard);

        if (parsedUser.name && 
            typeof parsedUser.score === 'number' && 
            typeof parsedUser.credits === 'number' && 
            Array.isArray(parsedUser.usedTips)) {
          setUser(parsedUser);
          navigate('/home');
          return;
        }
      } catch (error) {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  }, [navigate, setUser]);

  const generateRandomScore = () => {
    return Math.floor(Math.random() * (300 - 50 + 1)) + 50;
  };

  const createInitialRanking = () => {
    const defaultUsers = [
      { name: 'Maria Silva', score: generateRandomScore() },
      { name: 'João Santos', score: generateRandomScore() },
      { name: 'Ana Oliveira', score: generateRandomScore() },
      { name: 'Pedro Costa', score: generateRandomScore() },
      { name: 'Lucia Pereira', score: generateRandomScore() },
      { name: 'Carlos Souza', score: generateRandomScore() },
      { name: 'Julia Lima', score: generateRandomScore() },
      { name: 'Rafael Martins', score: generateRandomScore() }
    ];

    return defaultUsers.sort((a, b) => b.score - a.score);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      const newUser = {
        name,
        score: 0,
        credits: 0,
        usedTips: []
      };
      setUser(newUser);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      
      if (!localStorage.getItem('leaderboard')) {
        const initialRanking = createInitialRanking();
        localStorage.setItem('leaderboard', JSON.stringify(initialRanking));
      }

      navigate('/home');
    }
  };

  const handleWatchVideo = () => {
    window.open('https://youtu.be/your-video-id', '_blank');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-grid">
          <div className="login-paper">
            <h1 className="login-title">PreviniaQuiz</h1>
            <h2 className="login-subtitle">
              Aprenda sobre prevenção de enchentes de forma divertida!
            </h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
              <button
                type="submit"
                className="login-button"
                disabled={!name}
              >
                Entrar
              </button>
            </form>
          </div>

          <div className="about-card">
            <h2 className="about-title">Sobre Nós</h2>
            <div className="about-content">
              <p className="about-text">
                O PreviniaQuiz é um projeto desenvolvido por alunos da FIAP com o objetivo de conscientizar sobre a prevenção de enchentes e inundações de forma interativa e educativa.
              </p>
              <p className="about-text">
                Nossa equipe: <br />
                - Bruno Ribeiro (RM559642) <br />
                - Victor Mazon (RM560419)<br />
                - Murilo Albuquerque (RM560420)<br />
              </p>
              <button
                onClick={handleWatchVideo}
                className="video-button"
              >
                Assista ao Vídeo Explicativo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 