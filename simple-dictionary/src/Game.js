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
  const [highScores, setHighScores] = useState({
    name: { initials: '', score: 0 },
    company: { initials: '', score: 0 },
    both: { initials: '', score: 0 },
    nameHardMode: { initials: '', score: 0 },
    companyHardMode: { initials: '', score: 0 },
    bothHardMode: { initials: '', score: 0 },
  });
  const [hardMode, setHardMode] = useState(false);

  const dictionaryToUse = hardMode ? dictionary2 : dictionary;

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
    }, 5000);
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
    const storedHighScores = JSON.parse(localStorage.getItem('highScores'));
    if (storedHighScores) {
      setHighScores(storedHighScores);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }, [highScores]);

  const updateHighScore = useCallback(() => {
    if (score > highScores[gameMode].score) {
      const initials = window.prompt('Congratulations! You got a new high score! Enter your Name:');
      setHighScores((prevHighScores) => ({
        ...prevHighScores,
        [gameMode]: { initials, score },
      }));
    }
  }, [score, gameMode, highScores]);

  useEffect(() => {
    const endGame = () => {
      setGameStarted(false);
      myAlert(`Congratulations, your score was: ${score}`);
      setScore(0);
      setTimeLeft(60);
      setTicker('');
      setNameAnswer('');
      setCompanyAnswer('');
      updateHighScore();
    };
  
    if (timeLeft === 0 && ticker !== '') {
      endGame();
    }
  }, [timeLeft, score, myAlert, setGameStarted, setTimeLeft, setTicker, setNameAnswer, setCompanyAnswer, ticker, gameMode, updateHighScore]);

  const HighScores = () => {
    return (
      <div className="high-scores">
        <h5>High Scores:</h5>
        {highScores.name && highScores.name.score > 0 && <p>Mode=Name: {`${highScores.name.initials} with a score of ${highScores.name.score}`}</p>}
        {highScores.company && highScores.company.score > 0 && <p>Mode=Company: {`${highScores.company.initials} with a score of ${highScores.company.score}`}</p>}
        {highScores.both && highScores.both.score > 0 && <p>Mode=Both: {`${highScores.both.initials} with a score of ${highScores.both.score}`}</p>}
        {highScores.nameHardMode && highScores.nameHardMode.score > 0 && <p>Mode=Name (Hard): {`${highScores.nameHardMode.initials} with a score of ${highScores.nameHardMode.score}`}</p>}
        {highScores.companyHardMode && highScores.companyHardMode.score > 0 && <p>Mode=Company (Hard): {`${highScores.companyHardMode.initials} with a score of ${highScores.companyHardMode.score}`}</p>}
        {highScores.bothHardMode && highScores.bothHardMode.score > 0 && <p>Mode=Both (Hard): {`${highScores.bothHardMode.initials} with a score of ${highScores.bothHardMode.score}`}</p>}
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
          {hardMode && (
            <>
              <button
                className={gameMode === 'nameHardMode' ? 'selected' : ''}
                onClick={() => setGameMode('nameHardMode')}
              >
                Name (Hard)
              </button>
              <button
                className={gameMode === 'companyHardMode' ? 'selected' : ''}
                onClick={() => setGameMode('companyHardMode')}
              >
                Company (Hard)
              </button>
              <button
                className={gameMode === 'bothHardMode' ? 'selected' : ''}
                onClick={() => setGameMode('bothHardMode')}
              >
                Both (Hard)
              </button>
            </>
          )}
        </div>
        <div className="hard-mode">
          <input
            type="checkbox"
            id="hardMode"
            checked={hardMode}
            onChange={handleHardModeChange}
          />
          <label htmlFor="hardMode">Too Easy?</label>
        </div>
        <br />
        <button className="start-button" onClick={startGame}>Start</button>
      </div>
    );
  };

    
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
) : hardMode && gameMode === 'nameHardMode' ? (
  <>
    <h6>Game Mode: Name (Hard)</h6>
    <h2>{dictionary2[ticker].name}</h2>
    <form onSubmit={handleNameAnswerSubmit}>
      <input type="text" placeholder="answer..." value={nameAnswer} onChange={handleNameAnswerChange} />
      <button type="submit">Submit</button>
    </form>
  </>
) : hardMode && gameMode === 'companyHardMode' ? (
  <>
    <h6>Game Mode: Company (Hard)</h6>
    <h2>{dictionary2[ticker].company}</h2>
    <form onSubmit={handleCompanyAnswerSubmit}>
      <input type="text" placeholder="answer..." value={companyAnswer} onChange={handleCompanyAnswerChange} />
      <button type="submit">Submit</button>
    </form>
  </>
) : hardMode && gameMode === 'bothHardMode' ? (
  <>
    <h6>Game Mode: Both (Hard)</h6>
    {dictionary2[ticker].name.toLowerCase() === dictionary2[ticker].company.toLowerCase() ? (
      <div>
        <h2>Name&Company:</h2>
        <h6>{dictionary2[ticker].name}</h6>
      </div>
    ) : (
      <>
        <div>
          <h2>Name/Company:</h2>
          <h6>{dictionary2[ticker].name} / {dictionary2[ticker].company}</h6>
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