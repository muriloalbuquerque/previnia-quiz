import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import './Game.css';

const Game = () => {
  const {
    currentQuestion,
    score,
    credits,
    answerQuestion,
    applyHelp,
    currentQuestionIndex,
    shuffledQuestions,
    usedTips,
    user,
    setUser
  } = useGame();
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [eliminatedAnswers, setEliminatedAnswers] = useState([]);
  const [showTip, setShowTip] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    setEliminatedAnswers([]);
    setShowTip(false);
    setShowCorrect(false);
  }, [currentQuestion]);

  // Salva os créditos no localStorage quando eles mudarem
  useEffect(() => {
    if (user) {
      const updatedUser = {
        ...user,
        credits
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [credits, user, setUser]);

  if (!currentQuestion) {
    navigate('/home');
    return null;
  }

  const progress = ((currentQuestionIndex + 1) / 5) * 100;

  const handleAnswer = (answerId) => {
    setSelectedAnswer(answerId);
    const correct = answerId === currentQuestion.correctAnswerId;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      answerQuestion(answerId);
      
      if (currentQuestionIndex >= 4) {
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    }, 1500);
  };

  const handleQuit = () => {
    if (window.confirm('Tem certeza que deseja encerrar o jogo? Seu progresso será perdido.')) {
      navigate('/home');
    }
  };

  const handleUseHelp = (type) => {
    if (applyHelp(type, currentQuestion.id)) {
      switch (type) {
        case 'TIP':
          setShowTip(true);
          break;
        case 'ELIMINATE_ANSWER':
          const wrongAnswers = currentQuestion.answers
            .map((_, index) => index)
            .filter(index => index !== currentQuestion.correctAnswerId);
          const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
          setEliminatedAnswers(prev => [...prev, randomWrong]);
          break;
        case 'CORRECT_ANSWER':
          setShowCorrect(true);
          break;
      }
    }
  };

  const canUseTip = !usedTips.includes(currentQuestion.id) && credits >= 10;
  const canUseEliminate = !usedTips.includes(currentQuestion.id) && credits >= 15;
  const canUseCorrect = !usedTips.includes(currentQuestion.id) && credits >= 30;

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="game-header">
          <div className="game-header-top">
            <div className="game-scores">
              <div className="game-score">Pontuação: {score}</div>
              <div className="game-score">Créditos: {credits}</div>
            </div>
            <button
              onClick={handleQuit}
              className="quit-button"
            >
              Encerrar
            </button>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="game-main">
          <div className="question-card">
            <div className="question-content">
              <h2 className="question-title">
                Questão {currentQuestionIndex + 1} de 5
              </h2>
              <h3 className="question-text">
                {currentQuestion.title}
              </h3>

              {showTip && (
                <p className="tip-text">
                  Dica: {currentQuestion.tip}
                </p>
              )}

              <div className="answers-container">
                {currentQuestion.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`answer-button ${
                      selectedAnswer === index
                        ? isCorrect
                          ? 'correct'
                          : 'wrong'
                        : ''
                    } ${eliminatedAnswers.includes(index) ? 'eliminated' : ''} ${
                      showCorrect && index === currentQuestion.correctAnswerId ? 'correct' : ''
                    }`}
                    disabled={
                      selectedAnswer !== null ||
                      eliminatedAnswers.includes(index) ||
                      (showCorrect && index !== currentQuestion.correctAnswerId)
                    }
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="help-card">
            <h3 className="help-title">
              Ajudas Disponíveis
            </h3>
            <div className="help-buttons">
              <button
                onClick={() => handleUseHelp('TIP')}
                className="help-button"
                disabled={!canUseTip || selectedAnswer !== null}
              >
                Dica (10 créditos)
              </button>
              <button
                onClick={() => handleUseHelp('ELIMINATE_ANSWER')}
                className="help-button"
                disabled={!canUseEliminate || selectedAnswer !== null}
              >
                Eliminar (15 créditos)
              </button>
              <button
                onClick={() => handleUseHelp('CORRECT_ANSWER')}
                className="help-button"
                disabled={!canUseCorrect || selectedAnswer !== null}
              >
                Resposta (30 créditos)
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className={`feedback-icon ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect ? '✓' : '✕'}
            </div>
            <h2 className={`feedback-text ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect ? 'Correto!' : 'Incorreto!'}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 