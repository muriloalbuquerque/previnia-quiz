import React, { createContext, useContext, useState, useEffect } from 'react';
import { questions } from '../data/questions';

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [credits, setCredits] = useState(0);
  const [usedTips, setUsedTips] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled.slice(0, 5));
  };

  const startGame = () => {
    shuffleQuestions();
    setCurrentQuestionIndex(0);
    setScore(0);
    setCredits(0);
    setUsedTips([]);
  };

  const answerQuestion = (answerId) => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < shuffledQuestions.length) {
      const question = shuffledQuestions[currentQuestionIndex];
      const isCorrect = answerId === question.correctAnswerId;
      
      if (isCorrect) {
        setScore(prev => prev + 10);
        setCredits(prev => prev + 5);
      }

      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        if (user) {
          const updatedUser = {
            ...user,
            score: Math.max(user.score, score + (isCorrect ? 10 : 0)),
            credits: user.credits + credits + (isCorrect ? 5 : 0),
            usedTips: []
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          updateLeaderboard(updatedUser);
        }
      }
    }
  };

  const applyHelp = (type, questionId) => {
    const costs = {
      'TIP': 10,
      'ELIMINATE_ANSWER': 15,
      'CORRECT_ANSWER': 30
    };

    if (credits >= costs[type] && !usedTips.includes(questionId)) {
      setCredits(prev => prev - costs[type]);
      setUsedTips(prev => [...prev, questionId]);
      return true;
    }
    return false;
  };

  const updateLeaderboard = (updatedUser) => {
    setLeaderboard(prev => {
      const newLeaderboard = [...prev.filter(u => u.email !== updatedUser.email), updatedUser];
      return newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
    });
  };

  const value = {
    user,
    setUser,
    currentQuestion: currentQuestionIndex >= 0 ? shuffledQuestions[currentQuestionIndex] : null,
    score,
    credits,
    usedTips,
    startGame,
    answerQuestion,
    applyHelp,
    shuffledQuestions,
    currentQuestionIndex,
    leaderboard,
    setLeaderboard
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 