
import React, { useState, useEffect } from 'react';
import dictionary from './dictionary';
import './Game.css';

window.onbeforeunload = function() {
    localStorage.clear();
  }; 

function Game() {
  const [mode, setMode] = useState('both');
  const [answer, setAnswer] = useState('');
  const [guess, setGuess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);
  const [won, setWon] = useState(false);
  const [initials, setInitials] = useState('');
  const [enteredInitials, setEnteredInitials] = useState(false);

  const startGame = () => {
    setInProgress(true);
    setScore(0);
    setAnswer(getRandomKey());
    setTimeRemaining(60);
    setGuess('');
  };
  
  const checkGuess = () => {
    if (!inProgress) {
      return;
    }
    const correctAnswer =
      mode === 'name' ? dictionary[answer].name.toLowerCase() : answer.toLowerCase();
    const cleanedGuess = guess.replace(/[\W_]+/g, '').toLowerCase();
    if (cleanedGuess === correctAnswer) {
      setScore(score + 1);
      setCorrect(true);
    } else {
      setScore(score - 1);
      setCorrect(false);
    }
    setGuess('');
    setAnswer(getRandomKey());
    if (timeRemaining === 0) {
      setInProgress(false);
    }
  };
  


  const getRandomKey = () => {
    const keys = Object.keys(dictionary);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  };

  const handleInitials = (e) => {
    setInitials(e.target.value.toUpperCase().substr(0, 3));
  };

  const handleInitialsSubmit = () => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
      if (initials && !enteredInitials) {
        localStorage.setItem('initials', initials);
      }
      
    }
    setEnteredInitials(true);
  };
  

  useEffect(() => {
    setAnswer(getRandomKey());
  }, []);

  useEffect(() => {
    if (timeRemaining === 0 && !won) {
      setInProgress(false);
    }
  }, [timeRemaining, won]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        setWon(score >= highScore);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, score, highScore]);

  return (
    <div className="container">
      <h1 className="title">Guess the Coin</h1>
      <div className="buttons">
        <button className={`btn ${mode === 'name' ? 'active' : ''}`} onClick={() => setMode('name')}>Name</button>
        <button className={`btn ${mode === 'company' ? 'active' : ''}`} onClick={() => setMode('company')}>Company</button>
        <button className={`btn ${mode === 'both' ? 'active' : ''}`} onClick={() => setMode('both')}>Both</button>
      </div>


  {inProgress ? (
    <div className="game">
      <div className="timer">Time remaining: {timeRemaining}</div>
      <div className="score">Score: {score}</div>
      <div className="question">{mode === 'name' ? answer : dictionary[answer][mode]}</div>
      <div className={`message ${correct === true ? 'correct' : 'incorrect'}`}>
        {correct === true && <div>Correct!</div>}
        {correct === false && <div>Incorrect. Try again!</div>}
      </div>
      
      {inProgress && timeRemaining > 0 && (
        <>
        <input className="guess" type="text" value={guess} onChange={e => setGuess(e.target.value)} onKeyPress={(e) => {
        if (e.key === 'Enter') {
          checkGuess();
        }
      }} />
        <button className="submit-btn" onClick={checkGuess}>Submit</button>
        </>
      )}

      {timeRemaining === 0 && score >= highScore && won && (
        <div className="win">
          <div>Congratulations, you won!</div>
          <div>Please enter your initials:</div>
          <input className="initials" type="text" maxLength="3" onChange={handleInitials} value={initials} />
          <button className="submit-initials" onClick={handleInitialsSubmit}>Submit</button>
          <button className="reset-btn" onClick={() => {
            setInProgress(false);
            setTimeRemaining(60);
            setScore(0);
            setInitials(initials);
          }}>Reset Timer</button>
        </div>
      )}

    </div>
  ) : (
    <button className="start-btn" onClick={startGame}>Start</button>
  )}
  <div className="high-score">High Score: {initials} - {highScore}</div>

</div>
);
}

export default Game;
