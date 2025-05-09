import React, { useState } from 'react';
import './TicTacToe.css';

const players = [
  { symbol: '❌', name: 'Player 1' },
  { symbol: '⭕', name: 'Player 2' }
];

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState(0);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState([0, 0]);
  const [winningLine, setWinningLine] = useState([]);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  const checkWinner = (newBoard) => {
    for (const [a, b, c] of winningCombinations) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = players[current].symbol;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setWinningLine(result.line);
      const newScores = [...scores];
      newScores[current]++;
      setScores(newScores);
    } else if (!newBoard.includes(null)) {
      setWinner({ winner: 'draw' });
    } else {
      setCurrent((current + 1) % 2);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setCurrent(0);
  };

  return (
    <div className="ttt-container">
      <h1>❌⭕ Tic Tac Toe</h1>

      <div className="scoreboard">
        {players.map((p, i) => (
          <div key={i} className={`player ${i === current && !winner ? 'active' : ''}`}>
            {p.symbol} {p.name}: {scores[i]}
          </div>
        ))}
      </div>

      <div className="ttt-board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`ttt-cell ${cell === '❌' ? 'red' : cell === '⭕' ? 'green' : ''} ${winningLine.includes(index) ? 'win-cell' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="message">
        {!winner ? (
          `🎮 ${players[current].symbol}'s turn`
        ) : null}
      </div>

      {winner && (
        <div className="tic-modal">
          <div className="tic-modal-content">
            <h2>
              {winner.winner === 'draw'
                ? '🤝 It\'s a draw!'
                : `🏆 ${winner.winner} wins!`}
            </h2>
            <button onClick={resetGame}>🔄 New Game</button>
          </div>
        </div>
      )}
    </div>
  );
}
