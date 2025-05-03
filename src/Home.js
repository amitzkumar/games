import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const navigate = useNavigate();

  const handleLaunch = (game) => {
    const sound = new Audio('/sounds/click.mp3');
    sound.play();
    setTimeout(() => {
      if (game === "Snake & Ladder") {
        navigate("/snake-ladder"); // Navigate to Snake & Ladder
      } else {
        alert(`${game} is coming soon!`);
      }
    }, 400); // Brief delay for animation
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
            className={`game-card tooltip`}
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

export default Home;
