import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const navigate = useNavigate();

  const handleLaunch = (game) => {
    setTimeout(() => {
      if (game === "Snake & Ladder") {
        navigate("/snake-ladder");
      } else if (game === "Tic Tac Toe") {
        navigate("/tic-tac-toe");
      } else if (game === "Chess") {
        navigate("/chess");
      } else if (game === "SnakeFood") {
        navigate("/snake-food");
      } else if (game === "Stone Paper Scissors") {
        navigate("/stone-paper-scissors");
      } else {
        alert(`${game} is coming soon!`);
      }
    }, 400);
  };

  const games = [
    { name: 'Snake & Ladder', icon: '🎲', desc: 'Roll dice and climb or slide!' },
    { name: 'Chess', icon: '♟️', desc: 'Strategize, think, win!' },
    { name: 'Tic Tac Toe', icon: '❌⭕', desc: '3 in a row wins!' },
    { name: 'SnakeFood', icon: '🐍', desc: 'Eat food, don’t crash!' },
    { name: 'Stone Paper Scissors', icon: '🪨📄✂️', desc: 'Classic hand game!' },
  ];

  // Split games into chunks of 4
  const rows = [];
  for (let i = 0; i < games.length; i += 4) {
    rows.push(games.slice(i, i + 4));
  }

  return (
    <div className="home-app">
      <h1 className="home-title">🎮 Game Launcher</h1>
      {rows.map((row, rowIndex) => (
        <div className="home-card-row" key={rowIndex}>
          {row.map((game, index) => (
            <div
              key={game.name}
              className="home-game-card home-tooltip"
              onClick={() => handleLaunch(game.name)}
              style={{ animationDelay: `${(rowIndex * 4 + index) * 0.2}s` }}
            >
              <div className="home-ripple-container">
                <div className="home-card-front">
                  <div className="home-icon">{game.icon}</div>
                  <p>{game.name}</p>
                </div>
                <div className="home-card-back">
                  <p>{game.desc}</p>
                </div>
              </div>
              <span className="home-tooltiptext">Click to play {game.name}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Home;
