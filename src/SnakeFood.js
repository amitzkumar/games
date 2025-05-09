import React, { useState, useEffect, useRef } from 'react';
import './SnakeFood.css';

const boardSize = 20;
const cellSize = 25;

const initialSnake = [{ x: 9, y: 9 }];
const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default function SnakeFood() {
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(directions.ArrowRight);
  const [food, setFood] = useState(generateFood(initialSnake));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const boardRef = useRef(null);

function generateFood(snake) {
  let newFood;

  function isOnSnake(segment) {
    return segment.x === newFood.x && segment.y === newFood.y;
  }

  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(isOnSnake));

  return newFood;
}


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (directions[e.key]) {
        setDirection(prev => {
          const newDir = directions[e.key];
          if (prev.x + newDir.x === 0 && prev.y + newDir.y === 0) return prev;
          return newDir;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y
        };

        if (
          newHead.x < 0 || newHead.x >= boardSize ||
          newHead.y < 0 || newHead.y >= boardSize ||
          prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          setScore(prev => prev + 1);
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, 130);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const resetGame = () => {
    setSnake(initialSnake);
    setDirection(directions.ArrowRight);
    setFood(generateFood(initialSnake));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="snake-food-wrapper">
      <div className="snake-food-container">
        <h1>🐍 SnakeFood</h1>
        <div className="snake-food-score">🍎 Score: {score}</div>

        <div
          className="snake-food-board"
          ref={boardRef}
          style={{
            width: boardSize * cellSize,
            height: boardSize * cellSize,
          }}
        >
          {snake.map((seg, index) => (
            <div
              key={index}
              className={`snake-food-segment ${index === 0 ? 'head' : ''}`}
              style={{
                left: seg.x * cellSize,
                top: seg.y * cellSize,
                width: cellSize,
                height: cellSize
              }}
            />
          ))}

          <div
            className="snake-food-emoji"
            style={{
              left: food.x * cellSize,
              top: food.y * cellSize,
              width: cellSize,
              height: cellSize
            }}
          >
            🍎
          </div>
        </div>

        {gameOver && (
          <div className="snake-food-popup-overlay">
            <div className="snake-food-modal">
              <h2>💀 Game Over</h2>
              <p>Your score: {score}</p>
              <button onClick={resetGame}>🔄 Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
