import React, { useState, useEffect } from 'react';
import './ChessGame.css';
import { Chess } from 'chess.js';

const initialTime = 300;

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState(null);
  const [highlighted, setHighlighted] = useState([]);
  const [board, setBoard] = useState(game.board());
  const [turn, setTurn] = useState('w');
  const [time, setTime] = useState({ w: initialTime, b: initialTime });
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [invalidMoveMessage, setInvalidMoveMessage] = useState('');
  const [captured, setCaptured] = useState({ w: [], b: [] }); // ✅ Captured pieces

  useEffect(() => {
    if (game.isGameOver()) {
      setGameOver(true);
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        setResultMessage(`🏆 Checkmate! ${winner} wins!`);
      } else {
        setResultMessage('🤝 Draw!');
      }
    }
  }, [game]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTime(prev => ({
        ...prev,
        [turn]: Math.max(prev[turn] - 1, 0),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, gameOver]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const handleSquareClick = (row, col) => {
    const square = 'abcdefgh'[col] + (8 - row);

    if (selected) {
      const legalMoves = game.moves({ square: selected, verbose: true });
      const isLegal = legalMoves.some(m => m.to === square);

      if (isLegal) {
        const moveResult = game.move({ from: selected, to: square });
        if (moveResult?.captured) {
          setCaptured(prev => ({
            ...prev,
            [moveResult.color === 'w' ? 'b' : 'w']: [
              ...prev[moveResult.color === 'w' ? 'b' : 'w'],
              moveResult.captured
            ]
          }));
        }
        const newGame = new Chess(game.fen());
        setGame(newGame);
        setBoard(newGame.board());
        setTurn(newGame.turn());
        setSelected(null);
        setHighlighted([]);
      } else {
        setInvalidMoveMessage(`❌ Invalid move from ${selected} to ${square}`);
        setTimeout(() => setInvalidMoveMessage(''), 2000);
        setSelected(null);
        setHighlighted([]);
      }
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelected(square);
      const moves = game.moves({ square, verbose: true });
      setHighlighted(moves.map(m => m.to));
    } else {
      setSelected(null);
      setHighlighted([]);
    }
  };

  const isHighlighted = (square) => highlighted.includes(square);

  const getSquareColor = (i, j) =>
    (i + j) % 2 === 0 ? 'light' : 'dark';

  const getPieceSymbol = (piece) =>
    piece
      ? (piece.color === 'w' ? '♙♘♗♖♕♔' : '♟♞♝♜♛♚')[
          { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }[piece.type]
        ]
      : '';

  const getPieceFromType = (type, color) =>
    (color === 'w' ? '♙♘♗♖♕♔' : '♟♞♝♜♛♚')[
      { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }[type]
    ];

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setSelected(null);
    setHighlighted([]);
    setTurn('w');
    setTime({ w: initialTime, b: initialTime });
    setGameOver(false);
    setResultMessage('');
    setInvalidMoveMessage('');
    setCaptured({ w: [], b: [] }); // Reset captured pieces
  };

  return (
    <div className="chess-container">
      <h1>♟️ Local 2-Player Chess</h1>

      <div className="info-panel">
        <div className={`timer ${turn === 'w' ? 'active' : ''}`}>⬜ White: {formatTime(time.w)}</div>
        <div className={`timer ${turn === 'b' ? 'active' : ''}`}>⬛ Black: {formatTime(time.b)}</div>
      </div>

      {/* ✅ Captured Pieces */}
      <div className="captured-section">
        <div className="captured-row">⬛ Black Captured: {captured.w.map((p, i) => <span key={i}>{getPieceFromType(p, 'w')}</span>)}</div>
        <div className="captured-row">⬜ White Captured: {captured.b.map((p, i) => <span key={i}>{getPieceFromType(p, 'b')}</span>)}</div>
      </div>

      {invalidMoveMessage && (
        <div className="invalid-popup">{invalidMoveMessage}</div>
      )}

      <div className="chess-board">
        {board.map((row, i) => (
          <div key={i} className="chess-row">
            {row.map((cell, j) => {
              const square = 'abcdefgh'[j] + (8 - i);
              return (
                <div
                  key={j}
                  className={`chess-cell ${getSquareColor(i, j)} ${isHighlighted(square) ? 'highlight' : ''}`}
                  onClick={() => handleSquareClick(i, j)}
                >
                  <span className="piece">{getPieceSymbol(cell)}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="reset-button" onClick={resetGame}>🔄 New Game</button>

      {gameOver && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{resultMessage}</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
