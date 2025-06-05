import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

const App = () => {
  return (
    <GameProvider>
      <Router>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GameProvider>
  );
};

export default App; 