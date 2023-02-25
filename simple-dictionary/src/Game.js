import React, { useState, useEffect, useCallback } from 'react';
import dictionary from './dictionary';
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

  

  const myAlert = useCallback((message) => {
    const alertBox = document.createElement("div");
    alertBox.className = "my-alert";
    const alertText = document.createTextNode(message);
    alertBox.appendChild(alertText);
    const container = document.querySelector('.container');
    container.appendChild(alertBox);
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
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


    const tickers = Object.keys(dictionary);
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

    const correctName = dictionary[ticker].name;

    if (nameAnswer.toLowerCase() === correctName.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      myAlert('Correct!');
    } else {
      myAlert(`Incorrect, the correct answer is "${correctName}".`);
    }

    setNameAnswer('');

    const tickers = Object.keys(dictionary);
    const randomIndex = Math.floor(Math.random() * tickers.length);
    const randomTicker = tickers[randomIndex];

    setTicker(randomTicker);
  };

  const handleCompanyAnswerSubmit = (e) => {
    e.preventDefault();

    const { name, company } = dictionary[ticker];

    if (
      companyAnswer.toLowerCase() === company.toLowerCase()
    ) {
      setScore((prevScore) => prevScore + 1);
      myAlert('Correct!');
    } else {
      myAlert(`Incorrect, this is "${name}", and the company is "${company}"`);
    }

    setNameAnswer('');
    setCompanyAnswer('');

    const tickers = Object.keys(dictionary);
    const randomIndex = Math.floor(Math.random() * tickers.length);
    const randomTicker = tickers[randomIndex];

    setTicker(randomTicker);
  };

  const handleBothAnswerSubmit = (e) => {
    e.preventDefault();
  
    const { name, company } = dictionary[ticker];
  
    if (nameAnswer.toLowerCase() === name.toLowerCase() && companyAnswer.toLowerCase() === company.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      myAlert('Correct!');
    } else if (name.toLowerCase() === company.toLowerCase()) {
      if (nameAnswer.toLowerCase() === name.toLowerCase() || companyAnswer.toLowerCase() === company.toLowerCase()) {
        setScore((prevScore) => prevScore + 1);
        myAlert('Correct!');
      } else {
        myAlert(`Incorrect, this is "${name}", and the company is "${company}"`);
      }
    } else {
      myAlert(`Incorrect, this is "${name}", and the company is "${company}"`);
    }
  
    setNameAnswer('');
    setCompanyAnswer('');
  
    const tickers = Object.keys(dictionary);
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
    return (
      <div className="container">
        <h1>Guess the Coin!</h1>
        <h3>We'll show you the Coin's Ticker, and you tell us the name and/or company!</h3>
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
        <br />
        <button onClick={startGame}>Start</button>
      </div>
    );
  };
  

  const renderGame = () => {
    return (
      <div className="container">
        <h1>Guess the Coin!</h1>

        {gameMode === 'name' ? (
          <>
            <h2>{dictionary[ticker].symbol}</h2>
            <form onSubmit={handleNameAnswerSubmit}>
              <input type="text" placeholder="Name" value={nameAnswer} onChange={handleNameAnswerChange} />
              <button type="submit">Submit</button>
            </form>
          </>
        ) : gameMode === 'company' ? (
          <>
            <h2>{dictionary[ticker].symbol}</h2>
            <form onSubmit={handleCompanyAnswerSubmit}>
              <input type="text" placeholder="Company" value={companyAnswer} onChange={handleCompanyAnswerChange} />
              <button type="submit">Submit</button>
            </form>
          </>
        ) : gameMode === 'both' ? (
          <>
            <h2>{dictionary[ticker].symbol}</h2>
            <form onSubmit={handleBothAnswerSubmit}>
              <input type="text" placeholder="Name" value={nameAnswer} onChange={handleNameAnswerChange} />
              <input type="text" placeholder="Company" value={companyAnswer} onChange={handleCompanyAnswerChange} />
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
