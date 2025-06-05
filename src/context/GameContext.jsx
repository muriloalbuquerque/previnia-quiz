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
      const parsedUser = JSON.parse(storedUser);
      setCredits(parsedUser.credits || 0);
      setScore(parsedUser.score || 0);
    }

    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled.slice(0, 5));
  };

  const startGame = () => {
    shuffleQuestions();
    setCurrentQuestionIndex(0);
    setUsedTips([]);
    setScore(user?.score || 0);
    setCredits(user?.credits || 0);
  };

  const answerQuestion = (answerId) => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < shuffledQuestions.length) {
      const question = shuffledQuestions[currentQuestionIndex];
      const isCorrect = answerId === question.correctAnswerId;

      const updatedScore = score + (isCorrect ? 10 : 0);
      const updatedCredits = credits + (isCorrect ? 5 : 0);

      setScore(updatedScore);
      setCredits(updatedCredits);

      const updatedUser = {
        ...user,
        score: updatedScore,
        credits: updatedCredits
      };

      const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;

      if (isLastQuestion) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        updateLeaderboard(updatedUser);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
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
      const updatedCredits = credits - costs[type];
      setCredits(updatedCredits);
      setUsedTips(prev => [...prev, questionId]);

      const updatedUser = {
        ...user,
        credits: updatedCredits
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return true;
    }
    return false;
  };

  const updateLeaderboard = (updatedUser) => {
    setLeaderboard(prev => {
      const filtered = prev.filter(u => u.name !== updatedUser.name);

      const newLeaderboard = [...filtered, {
        name: updatedUser.name,
        score: updatedUser.score
      }];

      const sorted = newLeaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      localStorage.setItem('leaderboard', JSON.stringify(sorted));
      return sorted;
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
