import React, { useState, useEffect } from 'react';
import dictionary from './dictionary';
import './Game.css';

const Game = () => {
  const [gameMode, setGameMode] = useState('');
  const [ticker, setTicker] = useState('');
  const [nameAnswer, setNameAnswer] = useState('');
  const [companyAnswer, setCompanyAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  const myAlert = (message) => {
    const alertBox = document.createElement("div");
    alertBox.className = "my-alert";
    const alertText = document.createTextNode(message);
    alertBox.appendChild(alertText);
    document.body.appendChild(alertBox);
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  const startGame = () => {
    if (!gameMode) {
      myAlert('Please select a game mode!');
      return;
    }

    setGameStarted(true);

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
      setTimeLeft(30);
      setTicker('');
      setNameAnswer('');
      setCompanyAnswer('');
    };
  
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, score, setGameStarted, setTimeLeft, setTicker, setNameAnswer, setCompanyAnswer]);
  

  const renderGameModeSelect = () => {
    return (
      <>
        <h1>Guess the Coin</h1>
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
      </>
    );
  };
  

  const renderGame = () => {
    return (
      <>
        <h1>Guess the Coin</h1>
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
        <p>Score: {score}</p>
        <p>Time Left: {timeLeft}</p>
      </>
    );
  };

return gameStarted ? renderGame() : renderGameModeSelect();
};

export default Game;
