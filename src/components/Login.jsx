import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const { setUser } = useGame();
  const navigate = useNavigate();

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