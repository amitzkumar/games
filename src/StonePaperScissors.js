import React, { useState } from 'react';
import './StonePaperScissors.css';

const choices = ['🪨', '📄', '✂️'];
const choiceNames = ['Stone', 'Paper', 'Scissors'];

function getResult(p1, p2) {
  if (p1 === p2) return 'Draw';
  if (
    (p1 === 'Stone' && p2 === 'Scissors') ||
    (p1 === 'Scissors' && p2 === 'Paper') ||
    (p1 === 'Paper' && p2 === 'Stone')
  )
    return 'You Win 🎉';
  return 'You Lose 😞';
}

export default function StonePaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const handleChoice = (choice) => {
    const compChoice = choiceNames[Math.floor(Math.random() * 3)];
    const res = getResult(choice, compChoice);
    setPlayerChoice(choice);
    setComputerChoice(compChoice);
    setResult(res);
    setHistory((h) => [{ choice, compChoice, res, id: h.length + 1 }, ...h.slice(0, 9)]);
    if (res === 'You Win 🎉') setScore((s) => s + 1);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  return (
    <div className="sps-container">
      <h1 className="sps-title">✊ Stone Paper Scissors</h1>

      <div className="sps-score">⭐ Score: {score}</div>

      <div className="sps-choice-buttons">
        {choiceNames.map((choice, index) => (
          <button
            key={choice}
            className="sps-btn"
            onClick={() => handleChoice(choice)}
          >
            {choices[index]}<br />{choice}
          </button>
        ))}
      </div>

      {result && (
        <div className="sps-result">
          <h2>{result}</h2>
          <p>
            You chose: <strong>{playerChoice}</strong> <br />
            Computer chose: <strong>{computerChoice}</strong>
          </p>
          <button className="sps-reset" onClick={resetGame}>🔄 Play Again</button>
        </div>
      )}

      <div className="sps-history">
        <h3>📜 History (Last 10)</h3>
        <ul>
          {history.map((h) => (
            <li key={h.id}>
              #{h.id}: You: {h.choice} vs Computer: {h.compChoice} → <strong>{h.res}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
