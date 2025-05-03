import React, { useState, useEffect } from 'react';
import './SnakeLadder.css';

const boardSize = 10;
const totalCells = 100;

const snakes = { 16: 6, 48: 30, 64: 60, 79: 19, 93: 68, 95: 24, 97: 76, 98: 78 };
const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

const playerEmojis = ['🔴', '🟢', '🔵', '🟡'];

export default function SnakeLadder() {
  const [positions, setPositions] = useState([1, 1, 1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [message, setMessage] = useState('🎲 Player 🔴, roll the dice!');
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [movingToken, setMovingToken] = useState(null);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);

    const dice = Math.floor(Math.random() * 6) + 1;
    setDiceValue(dice);
    let newPos = positions[currentPlayer] + dice;

    if (newPos > totalCells) {
      setMessage(`⚠️ Player ${playerEmojis[currentPlayer]} rolled ${dice} but can't move.`);
      setRolling(false);
      return;
    }

    animateMove(currentPlayer, positions[currentPlayer], newPos, () => {
      let finalPos = newPos;
      if (snakes[newPos]) {
        finalPos = snakes[newPos];
        setMessage(`🐍 Snake bite! ${newPos} → ${finalPos}`);
      } else if (ladders[newPos]) {
        finalPos = ladders[newPos];
        setMessage(`🪜 Ladder climb! ${newPos} → ${finalPos}`);
      } else {
        setMessage(`🎲 Player ${playerEmojis[currentPlayer]} moved to ${newPos}`);
      }

      setTimeout(() => {
        setPositions((prev) => {
          const updated = [...prev];
          updated[currentPlayer] = finalPos;
          return updated;
        });

        if (finalPos === 100) {
          setMessage(`🎉 Player ${playerEmojis[currentPlayer]} wins!`);
        } else {
          const nextPlayer = (currentPlayer + 1) % 4;
          setCurrentPlayer(nextPlayer);
          setMessage(`🎲 Player ${playerEmojis[nextPlayer]}, your turn!`);
        }

        setRolling(false);
      }, 600);
    });
  };

  const animateMove = (playerIndex, from, to, onDone) => {
    let step = from + 1;
    const interval = setInterval(() => {
      setMovingToken({ playerIndex, pos: step });
      step++;
      if (step > to) {
        clearInterval(interval);
        setMovingToken(null);
        onDone();
      }
    }, 100);
  };

  const getCoordinates = (cell, indexInCell = 0) => {
    const idx = cell - 1;
    const row = Math.floor(idx / boardSize);
    const colInRow = idx % boardSize;
    const reversed = row % 2 === 1;
    const col = reversed ? boardSize - 1 - colInRow : colInRow;
    const cellSize = 100 / boardSize;

    const offsetX = (indexInCell % 2) * 10 - 5;
    const offsetY = Math.floor(indexInCell / 2) * 10 - 5;

    return {
      left: `calc(${col * cellSize}% + ${cellSize / 2}% + ${offsetX}px)`,
      top: `calc(${(boardSize - 1 - row) * cellSize}% + ${cellSize / 2}% + ${offsetY}px)`,
    };
  };

  const getPlayerPositionsInCell = (cell) =>
    positions.map((p, i) => (p === cell ? i : null)).filter((i) => i !== null);

  return (
    <div className="snake-ladder-container">
      <h1>🐍🪜 Snake & Ladder</h1>

      <div className="players">
        {playerEmojis.map((emoji, index) => (
          <span
            key={index}
            className={`player-info ${index === currentPlayer ? 'active-player' : ''}`}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="board">
        {[...Array(totalCells)].map((_, i) => {
          const cellNum = totalCells - i;
          return (
            <div key={cellNum} className="cell">
              <div className="cell-number">{cellNum}</div>
              {snakes[cellNum] && (
                <div className="cell-icon snake-icon">
                  🐍 <span className="target red">{snakes[cellNum]}</span>
                </div>
              )}
              {ladders[cellNum] && (
                <div className="cell-icon ladder-icon">
                  🪜 <span className="target green">{ladders[cellNum]}</span>
                </div>
              )}
            </div>
          );
        })}

        <div className="tokens">
          {[...positions.entries()].map(([i, pos]) => {
            const playersInSameCell = getPlayerPositionsInCell(pos);
            const indexInCell = playersInSameCell.indexOf(i);
            const effectivePos =
              movingToken?.playerIndex === i ? movingToken.pos : positions[i];
            const { top, left } = getCoordinates(effectivePos, indexInCell);

            return (
              <div
                key={i}
                className="token"
                style={{
                  top,
                  left,
                  transition: movingToken?.playerIndex === i ? 'none' : 'top 0.3s, left 0.3s',
                }}
              >
                {playerEmojis[i]}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={rollDice} disabled={rolling}>🎲 Roll Dice</button>
      <p>{message}</p>
      {diceValue && <p>🎯 You rolled: <strong>{diceValue}</strong></p>}
    </div>
  );
}
