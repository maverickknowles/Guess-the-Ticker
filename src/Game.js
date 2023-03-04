import React, { useState, useEffect, useCallback } from 'react';
import dictionary from './dictionary';
import dictionary2 from './dictionary2';
import Swal from 'sweetalert2';


import './Game.css';

const Game = () => {
  const [gameMode, setGameMode] = useState('');
  const [ticker, setTicker] = useState('');
  const [nameAnswer, setNameAnswer] = useState('');
  const [companyAnswer, setCompanyAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
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
  const [alerts, setAlerts] = useState([]);

  

  const dictionaryToUse = (gameMode === 'name' || gameMode === 'company' || gameMode === 'both') ? dictionary : (hardMode ? dictionary2 : dictionary);


  const myAlert = useCallback((message) => {
    setAlerts((existingAlerts) => {
      // add new alert to the beginning of the array
      const newAlerts = [message, ...existingAlerts];
      setTimeout(() => {
        // remove the alert after 5 seconds
        setAlerts((updatedAlerts) => updatedAlerts.filter((alert) => alert !== message));
      }, 5000);
      return newAlerts;
    });
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
  }, [highScores, gameMode]);
  

  const updateHighScore = useCallback(() => {
    if (score > highScores[gameMode].score) {
      Swal.fire({
        title: '<h1>Congratulations!<h1>',
        html: `<h3>You got a new high score!</h3><h2>${score} points!</h2>`,
        input: 'text',
        icon: 'success',
        inputPlaceholder: 'Enter your name or initials',
        confirmButtonText: 'Submit',
        confirmButtonColor: 'rgb(173, 123, 233)',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off',
          autocomplete: 'off',
        },
        showCancelButton: false,
        inputValidator: (value) => {
          if (!value) {
            return '<span style=" color: red;">Please enter your name or initials in the box</span>';
          }
        },
        background:'rgba(0, 0, 0, 0.8)',
        backdrop: `
          rgba(0,0,123,0.4)
        `
       
      }).then((result) => {
        if (result.isConfirmed) {
          const initials = result.value;
          setHighScores((prevHighScores) => ({
            ...prevHighScores,
            [gameMode]: { initials, score },
          }));
        }
      });
    } else {
      // Display the score using Swal.fire()
      Swal.fire({
        title: '<h1>Good Try!<h1>',
        html: `<h3>Your final score is:</h3><h2>${score} points...</h2>`,
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: 'rgb(62, 84, 172)',
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 250); // Add a short delay before closing the alert to give the user a chance to read the message
          });
        },
        background:'rgba(0, 0, 0, 0.8)',
        backdrop: `
          rgba(0,0,123,0.4)
        `
      });
    }
  }, [score, gameMode, highScores]);
  

  
  
  
  useEffect(() => {
    const endGame = () => {
      setGameStarted(false);
      updateHighScore();
      setScore(0);
      setTimeLeft(15);
      setTicker('');
      setNameAnswer('');
      setCompanyAnswer('');
    };
  
    if (timeLeft === 0 && ticker !== '') {
      endGame();
    }
  }, [timeLeft, score, setGameStarted, setTimeLeft, setTicker, setNameAnswer, setCompanyAnswer, ticker, gameMode, updateHighScore]);
  
  const HighScores = () => {
    const highScoresList = [
      { name: highScores.name, mode: 'Name' },
      { name: highScores.nameHardMode, mode: 'Name (Hard)' },
      { name: highScores.company, mode: 'Company' },
      { name: highScores.companyHardMode, mode: 'Company (Hard)' },
      { name: highScores.both, mode: 'Both' },
      { name: highScores.bothHardMode, mode: 'Both (Hard)' },
    ];
  
    // Sort high scores in descending order
    highScoresList.sort((a, b) => b.name?.score - a.name?.score);
  
    return (
      <div className="high-scores">
        <h5>High Scores:</h5>
        {highScoresList.map((score) => {
          if (score.name?.score > 0) {
            return (
              <p key={score.mode}>
                {score.mode} — {`${score.name?.initials} — Score: ${score.name?.score}`}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  };
  
  
  

 const renderGameModeSelect = () => {
  const handleHardModeChange = (e) => {
    setHardMode(e.target.checked);
    if (gameMode.includes('HardMode')) {
      myAlert('If not properly loading... Please reload the page to select a Game Mode.');
    }
  };

  return (
    <div className="container">
      <h1>Guess the Ticker!</h1>
      <h3>We'll give you the name and/or the company of the coin. Can you guess its Ticker symbol?</h3>
      <h4>Select a GameMode Below!</h4>
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
        return <h6>Please reload the page and select a GameMode!</h6>;
      }
    
      const dictionaryEntry = dictionaryToUse[ticker];
    
      const { name, company } = dictionaryEntry;
    
    return (
      <div className="container">
        <h1>Guess the Ticker!</h1>
  
        {gameMode === 'name' ? (
  <>
    <h6>GameMode: Name</h6>
    <h2>{dictionaryEntry.name}</h2>
    <form onSubmit={handleNameAnswerSubmit}>
      <input type="text" placeholder="answer..." value={nameAnswer} onChange={handleNameAnswerChange} />
      <button type="submit">Submit</button>
    </form>
  </>
) : gameMode === 'company' ? (
  <>
    <h6>GameMode: Company</h6>
    <h2>{dictionaryEntry.company}</h2>
    <form onSubmit={handleCompanyAnswerSubmit}>
      <input type="text" placeholder="answer..." value={companyAnswer} onChange={handleCompanyAnswerChange} />
      <button type="submit">Submit</button>
    </form>
  </>
) : gameMode === 'both' ? (
  <>
    <h6>GameMode: Both</h6>
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
    <h6>GameMode: Name (Hard)</h6>
    <h2>{dictionary2[ticker].name}</h2>
    <form onSubmit={handleNameAnswerSubmit}>
      <input type="text" placeholder="answer..." value={nameAnswer} onChange={handleNameAnswerChange} />
      <button type="submit">Submit</button>
    </form>
  </>
) : hardMode && gameMode === 'companyHardMode' ? (
  <>
    <h6>GameMode: Company (Hard)</h6>
    <h2>{dictionary2[ticker].company}</h2>
    <form onSubmit={handleCompanyAnswerSubmit}>
      <input type="text" placeholder="answer..." value={companyAnswer} onChange={handleCompanyAnswerChange} />
      <button type="submit">Submit</button>
    </form>
  </>
) : hardMode && gameMode === 'bothHardMode' ? (
  <>
    <h6>GameMode: Both (Hard)</h6>
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
            <p>Points: {score}</p>
            <p>Time Left: {timeLeft}</p>
          </div>
        ) : null}

        {alerts.map((message, index) => (
      <div className="my-alert" key={index}>
        {message}
      </div>
    ))}
      </div>
    );
  };
  
  

  return (
    <div className={gameStarted ? "game-going" : ""}>
      {gameStarted ? renderGame() : renderGameModeSelect()}
      <HighScores />
    </div>
  );
};

export default Game;