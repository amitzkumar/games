import React, { useState } from 'react';
import './SnakeLadder.css';

const boardSize = 10;
const totalCells = 100;

const snakes = { 16: 6, 48: 30, 64: 60, 79: 19, 93: 68, 95: 24, 97: 76, 98: 78 };
const ladders = { 10: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

const playerEmojis = ['🔴', '🟢', '🔵', '🟡'];

export default function SnakeLadder() {
  const [positions, setPositions] = useState([1, 1, 1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [message, setMessage] = useState('🎲 Player 🔴, roll the dice!');
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);

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

    setTimeout(() => {
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

      setPositions((prev) => {
        const updated = [...prev];
        updated[currentPlayer] = finalPos;
        return updated;
      });

      if (finalPos === 100) {
        setMessage(`🎉 Player ${playerEmojis[currentPlayer]} wins!`);
      } else {
        setCurrentPlayer((prev) => (prev + 1) % 4);
        setMessage(`🎲 Player ${playerEmojis[(currentPlayer + 1) % 4]}, your turn!`);
      }

      setRolling(false);
    }, 800);
  };

  const getCoordinates = (cell, indexInCell = 0) => {
    const idx = cell - 1;
    const row = Math.floor(idx / boardSize);
    const colInRow = idx % boardSize;
    const reversed = row % 2 === 1;
    const col = reversed ? boardSize - 1 - colInRow : colInRow;
    const cellSize = 500 / boardSize;

    // Slight offset for multiple tokens in one cell
    const offsetX = (indexInCell % 2) * 12 - 6;
    const offsetY = Math.floor(indexInCell / 2) * 12 - 6;

    return {
      left: col * cellSize + cellSize / 2 + offsetX,
      top: (boardSize - 1 - row) * cellSize + cellSize / 2 + offsetY,
    };
  };

  const getPlayerPositionsInCell = (cell) =>
    positions.map((p, i) => (p === cell ? i : null)).filter((i) => i !== null);

  return (
    <div className="snake-ladder-container">
      <h1>🐍🪜 Snake & Ladder</h1>

      <div className="board">
       {[...Array(boardSize)].map((_, rowIdx) => {
            const rowCells = [...Array(boardSize)].map((_, colIdx) => {
            const actualCol = rowIdx % 2 === 0 ? colIdx : boardSize - 1 - colIdx;
            const cellNum = (rowIdx * boardSize + actualCol) +1;
            return (
                <div key={cellNum} className="cell">
                <div className="cell-number">{cellNum}</div>
                {snakes[cellNum] && (
                    <div className="cell-icon snake">
                    🐍 <span className="snake-target">{snakes[cellNum]}</span>
                    </div>
                )}
                {ladders[cellNum] && (
                    <div className="cell-icon ladder">
                    🪜 <span className="ladder-target">{ladders[cellNum]}</span>
                    </div>
                )}
                </div>
            );
            });
            return (
            <div key={rowIdx} className="row">
                {rowCells}
            </div>
            );
        })}
        <div className="tokens">
          {positions.map((pos, i) => {
            const playersInSameCell = getPlayerPositionsInCell(pos);
            const positionIndex = playersInSameCell.indexOf(i);
            const { top, left } = getCoordinates(pos, positionIndex);
            return (
              <div
                key={i}
                className="token"
                style={{ top: `${top}px`, left: `${left}px` }}
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
