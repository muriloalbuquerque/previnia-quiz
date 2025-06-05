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
        return <Navigate to="/home" replace />;
      }
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }

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