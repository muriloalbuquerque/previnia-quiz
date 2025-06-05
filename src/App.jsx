import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import './App.css';

const Root = () => {
  // Verifica se existem dados válidos no localStorage
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
        return <Navigate to="/home" replace />;
      }
    } catch (error) {
      // Se houver erro no parse, limpa o storage
      localStorage.clear();
      sessionStorage.clear();
    }
  }

  // Se não houver dados válidos, redireciona para login
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <GameProvider>
      <Router>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/home" 
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/game" 
                element={
                  <PrivateRoute>
                    <Game />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Root />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GameProvider>
  );
};

export default App; 