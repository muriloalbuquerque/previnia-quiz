import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const { setUser } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se já existem dados válidos no localStorage
    const storedUser = localStorage.getItem('user');
    const storedLeaderboard = localStorage.getItem('leaderboard');

    if (storedUser && storedLeaderboard) {
      try {
        const parsedUser = JSON.parse(storedUser);
        JSON.parse(storedLeaderboard); // Valida se é um JSON válido

        // Verifica se o usuário tem todos os campos necessários
        if (parsedUser.name && 
            typeof parsedUser.score === 'number' && 
            typeof parsedUser.credits === 'number' && 
            Array.isArray(parsedUser.usedTips)) {
          // Se os dados são válidos, redireciona para home
          setUser(parsedUser);
          navigate('/home');
          return;
        }
      } catch (error) {
        // Se houver erro no parse, limpa o storage
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  }, [navigate, setUser]);

  const generateRandomScore = () => {
    // Gera uma pontuação aleatória entre 50 e 300
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

    // Ordena o ranking por pontuação em ordem decrescente
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
      
      // Salva o usuário no localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Verifica se já existe um ranking, se não, cria um novo
      if (!localStorage.getItem('leaderboard')) {
        const initialRanking = createInitialRanking();
        localStorage.setItem('leaderboard', JSON.stringify(initialRanking));
      }

      navigate('/home');
    }
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h1 className="login-title">PreviniaQuiz</h1>
        <h2 className="login-subtitle">
          Aprenda sobre prevenção de desastres de forma divertida!
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
    </div>
  );
};

export default Login; 