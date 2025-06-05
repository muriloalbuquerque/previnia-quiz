import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const PrivateRoute = ({ children }) => {
  const { user, setUser } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se existem dados no localStorage
    const storedUser = localStorage.getItem('user');
    const storedLeaderboard = localStorage.getItem('leaderboard');

    if (!storedUser || !storedLeaderboard) {
      // Se não existir algum dos dados necessários, limpa tudo e redireciona
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      return;
    }

    try {
      // Tenta fazer o parse dos dados
      const parsedUser = JSON.parse(storedUser);
      JSON.parse(storedLeaderboard); // Apenas para validar se é um JSON válido

      // Verifica se o usuário tem todos os campos necessários
      if (!parsedUser.name || typeof parsedUser.score !== 'number' || 
          typeof parsedUser.credits !== 'number' || !Array.isArray(parsedUser.usedTips)) {
        throw new Error('Dados do usuário inválidos');
      }

      // Se chegou até aqui, os dados são válidos
      setUser(parsedUser);
    } catch (error) {
      // Se houver erro no parse ou dados inválidos, limpa tudo e redireciona
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  }, [navigate, setUser]);

  // Se não houver usuário no contexto, redireciona para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se tudo estiver ok, renderiza o componente filho
  return children;
};

export default PrivateRoute; 