import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const PrivateRoute = ({ children }) => {
  const { user, setUser } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedLeaderboard = localStorage.getItem('leaderboard');

    if (!storedUser || !storedLeaderboard) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      JSON.parse(storedLeaderboard);

      if (!parsedUser.name || typeof parsedUser.score !== 'number' || 
          typeof parsedUser.credits !== 'number' || !Array.isArray(parsedUser.usedTips)) {
        throw new Error('Dados do usuário inválidos');
      }

      setUser(parsedUser);
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  }, [navigate, setUser]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute; 