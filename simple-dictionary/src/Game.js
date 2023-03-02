import React, { useState, useEffect, useCallback } from 'react';
import dictionary from './dictionary';
import dictionary2 from './dictionary2';

import './Game.css';

const Game = () => {
  const [gameMode, setGameMode] = useState('');
  const [ticker, setTicker] = useState('');
  const [nameAnswer, setNameAnswer] = useState('');
  const [companyAnswer, setCompanyAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScores, setHighScores] = useState({ name: null, company: null, both: null });
  const [hardMode, setHardMode] = useState(false);

  

  const myAlert = useCallback((message) => {
    const alertBox = document.createElement("div");
    alertBox.className = "my-alert";
    const alertText = document.createTextNode(message);
    alertBox.appendChild(alertText);
    const container = document.querySelector('.container');
    const existingAlerts = container.querySelectorAll('.my-alert');
    if (existingAlerts.length > 0) {
      container.insertBefore(alertBox, existingAlerts[0]);
    } else {
      container.appendChild(alertBox);
    }
    setTimeout(() => {
      alertBox.remove();
    }, 4000);
  }, []);
  
  
  

  useEffect(() => {
    let intervalId;
    if (gameStarted) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [gameStarted]);


  const startGame = () => {
    setGameStarted(true);
    
    if (!gameMode) {
      myAlert('Please select a game mode!');
      return;
    }


    const dictionaryToUse = hardMode ? dictionary2 : dictionary;
    const tickers = Object.keys(dictionaryToUse);
    const randomIndex = Math.floor(Math.random() * tickers.length);
    const randomTicker = tickers[randomIndex];

    setTicker(randomTicker);
  };

  const handleNameAnswerChange = (e) => {
    setNameAnswer(e.target.value);
  };

  const handleCompanyAnswerChange = (e) => {
    setCompanyAnswer(e.target.value);
  };

  const handleNameAnswerSubmit = (e) => {
    e.preventDefault();
  
    const { symbol, name } = dictionaryToUse[ticker];
  
    if (nameAnswer.toLowerCase() === symbol.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      myAlert(`Correct!`);
    } else {
      myAlert(`Incorrect. The ticker for ${name} is ${symbol}.`);
    }
  
    setNameAnswer('');
  
    const tickers = Object.keys(dictionaryToUse);
    const randomIndex = Math.floor(Math.random() * tickers.length);
    const randomTicker = tickers[randomIndex];
  
    setTicker(randomTicker);
  };
  
  const handleCompanyAnswerSubmit = (e) => {
    e.preventDefault();
  
    const { symbol, company } = dictionaryToUse[ticker];
  
    if (companyAnswer.toLowerCase() === symbol.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      myAlert(`Correct!`);
    } else {
      myAlert(`Incorrect. The ticker for ${company} is ${symbol}.`);
    }
  
    setCompanyAnswer('');
  
    const tickers = Object.keys(dictionaryToUse);
    const randomIndex = Math.floor(Math.random() * tickers.length);
    const randomTicker = tickers[randomIndex];
  
    setTicker(randomTicker);
  };
  




  useEffect(() => {
    const endGame = () => {
      setGameStarted(false);
      myAlert(`Congratulations, your score was: ${score}`);
      setScore(0);
      setTimeLeft(60);
      setTicker('');
      setNameAnswer('');
      setCompanyAnswer('');
      if (score > highScores[gameMode]) {
        const initials = window.prompt('Congratulations! You got a new high score! Enter your Name:');
        setHighScores((prevHighScores) => ({
          ...prevHighScores,
          [gameMode]: { initials, score }
        }));
        localStorage.setItem('highScores', JSON.stringify(highScores));
      }
    };
  
    if (timeLeft === 0 && ticker !== '') {
      endGame();
    }
  }, [timeLeft, score, myAlert, setGameStarted, setTimeLeft, setTicker, setNameAnswer, setCompanyAnswer, ticker, gameMode, highScores]);

  const HighScores = () => {
    return (
      <div className="high-scores">
        <h5>High Scores:</h5>
        <p>Name-Mode: {highScores.name ? `${highScores.name.initials}: ${highScores.name.score}` : '-'}</p>
        <p>Company-Mode: {highScores.company ? `${highScores.company.initials}: ${highScores.company.score}` : '-'}</p>
        <p>Both-Mode: {highScores.both ? `${highScores.both.initials}: ${highScores.both.score}` : '-'}</p>
      </div>
    );
  };
  

  const renderGameModeSelect = () => {

    const handleHardModeChange = (e) => {
      setHardMode(e.target.checked);
    };

    return (
      <div className="container">
        <h1>Guess the Ticker!</h1>
        <h3>We'll show you the Coin's company, and/or name and you tell us the Ticker!</h3>
        <h5>Select a mode Below!</h5>
        <div className="mode-buttons">
          <button
            className={gameMode === 'name' ? 'selected' : ''}
            onClick={() => setGameMode('name')}
          >
            Name
          </button>
          <button
            className={gameMode === 'company' ? 'selected' : ''}
            onClick={() => setGameMode('company')}
          >
            Company
          </button>
          <button
            className={gameMode === 'both' ? 'selected' : ''}
            onClick={() => setGameMode('both')}
          >
            Both
          </button>
        </div>
        <div className="hard-mode">
        <input
          type="checkbox"
          id="hardMode"
          checked={hardMode}
          onChange={handleHardModeChange}
        />
        <label htmlFor="hardMode">Hard Mode</label>
      </div>
        <br />
        <button onClick={startGame}>Start</button>
      </div>
    );
  };
  
  const dictionaryToUse = hardMode ? dictionary2 : dictionary;

    
    const renderGame = () => {
      if (!gameMode) {
        return <div>Please reload the page and select a game mode!</div>;
      }
    
      const dictionaryEntry = dictionaryToUse[ticker];
    
      const { name, company } = dictionaryEntry;
    
    return (
      <div className="container">
        <h1>Guess the Ticker!</h1>
  
        {gameMode === 'name' ? (
          <>
            <h6>Game Mode: Name</h6>
            <h2>{dictionaryEntry.name}</h2>
            <form onSubmit={handleNameAnswerSubmit}>
              <input type="text" placeholder="answer..." value={nameAnswer} onChange={handleNameAnswerChange} />
              <button type="submit">Submit</button>
            </form>
          </>
        ) : gameMode === 'company' ? (
          <>
            <h6>Game Mode: Company</h6>
            <h2>{dictionaryEntry.company}</h2>
            <form onSubmit={handleCompanyAnswerSubmit}>
              <input type="text" placeholder="answer..." value={companyAnswer} onChange={handleCompanyAnswerChange} />
              <button type="submit">Submit</button>
            </form>
          </>
        ) : gameMode === 'both' ? (
          <>
            <h6>Game Mode: Both</h6>
            {name.toLowerCase() === company.toLowerCase() ? (
              <div>
                <h2>Name&Company:</h2>
                <h6>{name}</h6>
              </div>
            ) : (
              <>
                <div>
                  <h2>Name/Company:</h2>
                  <h6>{name} / {company}</h6>
                </div>
              </>
            )}
            <form onSubmit={handleNameAnswerSubmit}>
              <input type="text" placeholder="answer..." value={nameAnswer} onChange={handleNameAnswerChange} />
              <button type="submit">Submit</button>
            </form>
          </>
        ) : null}
        {gameStarted ? (
          <div>
            <p>Score: {score}</p>
            <p>Time Left: {timeLeft}</p>
          </div>
        ) : null}
      </div>
    );
  };
  
  

return (
  <div>
    {gameStarted ? renderGame() : renderGameModeSelect()}

    <HighScores />
  </div>
);
};

export default Game;
