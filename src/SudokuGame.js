import React, { useEffect, useState } from 'react';
import './SudokuGame.css';
import { generateSudoku } from './utils/sudokuGenerator'; // Add utility below

export default function SudokuGame() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showRules, setShowRules] = useState(true);

  useEffect(() => {
    const newBoard = generateSudoku();
    setBoard(newBoard);
  }, []);

  const handleSelect = (row, col) => setSelected({ row, col });

  const handleInput = (num) => {
    if (!selected) return;
    const { row, col } = selected;
    if (board[row][col].readonly) return;

    const newBoard = [...board];
    newBoard[row][col].value = num;
    setBoard(newBoard);
  };

  return (
    <div className="sudoku-container">
      <h1 className="sudoku-title">🧩 Sudoku Challenge</h1>
      <div className="sudoku-rules-section">
        <button className="sudoku-toggle-rules" onClick={() => setShowRules(!showRules)}>
          {showRules ? 'Hide Rules ⬆️' : 'Show Rules ⬇️'}
        </button>
        {showRules && (
          <div className="sudoku-rules">
            <ul>
              <li>Fill every row with digits 1–9 without repeating.</li>
              <li>Fill every column with digits 1–9 without repeating.</li>
              <li>Each 3×3 box must contain digits 1–9 without repeating.</li>
              <li>Click on cells to fill in values. Use digits 1–9 only.</li>
            </ul>
          </div>
        )}
      </div>
      <div className="sudoku-board">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selected?.row === r && selected?.col === c;
            const isSameRow = selected?.row === r;
            const isSameCol = selected?.col === c;
            const isSameBox =
              Math.floor(selected?.row / 3) === Math.floor(r / 3) &&
              Math.floor(selected?.col / 3) === Math.floor(c / 3);

            return (
              <div
                key={`${r}-${c}`}
                className={`sudoku-cell 
                  ${isSelected ? 'sudoku-selected' : ''}
                  ${isSameRow || isSameCol || isSameBox ? 'sudoku-highlight' : ''}
                  ${cell.readonly ? 'sudoku-readonly' : ''}
                `}
                onClick={() => handleSelect(r, c)}
              >
                {cell.value !== 0 ? cell.value : ''}
              </div>
            );
          })
        )}
      </div>

      <div className="sudoku-inputs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => handleInput(n)} className="sudoku-input-btn">
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
