import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeCard, setActiveCard] = useState(null);

  const handleLaunch = (game) => {
    setActiveCard(game);
    const sound = new Audio('/sounds/click.mp3');
    sound.play();
    setTimeout(() => alert(`Launching ${game}...`), 400); // brief delay to show animation
  };

  return (
    <div className="App">
      <h1>🎮 Game Launcher</h1>
      <div className="card-container">
        {[
          { name: 'Snake & Ladder', icon: '🎲', desc: 'Roll dice and climb or slide!' },
          { name: 'Chess', icon: '♟️', desc: 'Strategize, think, win!' },
          { name: 'Tic Tac Toe', icon: '❌⭕', desc: '3 in a row wins!' },
        ].map((game, index) => (
          <div
            key={game.name}
            className={`game-card tooltip ${activeCard === game.name ? 'active' : ''}`}
            onClick={() => handleLaunch(game.name)}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="ripple-container">
              <div className="card-front">
                <div className="icon">{game.icon}</div>
                <p>{game.name}</p>
              </div>
              <div className="card-back">
                <p>{game.desc}</p>
              </div>
            </div>
            <span className="tooltiptext">Click to play {game.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
