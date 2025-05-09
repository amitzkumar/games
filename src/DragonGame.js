import React, { useRef, useEffect, useState } from "react";

const DragonGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [jumpPower, setJumpPower] = useState(0);
  const [charging, setCharging] = useState(false);
  const jumpCharge = useRef(0);
  const jumpInterval = useRef(null);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 300;

    const dog = {
      x: 50,
      y: 250,
      width: 40,
      height: 40,
      vy: 0,
      gravity: 1.2,
      isJumping: false,
    };

    const obstacle = {
      x: canvas.width,
      y: 260,
      width: 30,
      height: 30,
      speed: 6,
    };

    const setRandomObstacleSize = () => {
      obstacle.width = 20 + Math.random() * 40;
      obstacle.height = 20 + Math.random() * 40;
      obstacle.y = 280 - obstacle.height;
    };

    setRandomObstacleSize();

    let animationId;

    const checkCollision = () => {
      return (
        dog.x < obstacle.x + obstacle.width &&
        dog.x + dog.width > obstacle.x &&
        dog.y < obstacle.y + obstacle.height &&
        dog.y + dog.height > obstacle.y
      );
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !dog.isJumping && !jumpInterval.current) {
        setCharging(true);
        jumpCharge.current = 0;
        setJumpPower(0);
        jumpInterval.current = setInterval(() => {
          if (jumpCharge.current < 20) {
            jumpCharge.current += 1;
            setJumpPower((jumpCharge.current / 20) * 100);
          }
        }, 20);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" && !dog.isJumping) {
        clearInterval(jumpInterval.current);
        jumpInterval.current = null;
        setCharging(false);
        const power = -5 - jumpCharge.current;
        dog.vy = power;
        dog.isJumping = true;
        jumpCharge.current = 0;
        setJumpPower(0);
      }
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = "#444";
      ctx.fillRect(0, 280, canvas.width, 20);

      // Dog physics
      dog.vy += dog.gravity;
      dog.y += dog.vy;
      if (dog.y >= 240) {
        dog.y = 240;
        dog.isJumping = false;
      }

      // Draw dog emoji (flipped horizontally to face right)
      ctx.save();
      ctx.translate(dog.x + dog.width, dog.y + 35);
      ctx.scale(-1, 1); // Flip horizontally
      ctx.font = "40px serif";
      ctx.fillText("🐕", 0, 0);
      ctx.restore();

      // Obstacle logic
      obstacle.x -= obstacle.speed;
      if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width + Math.random() * 200;
        setRandomObstacleSize();
        setScore((prev) => prev + 1);
      }

      // Draw obstacle
      ctx.fillStyle = "#f44336";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // Score
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Score: ${score}`, 10, 25);

      // Collision
      if (checkCollision()) {
        cancelAnimationFrame(animationId);
        setGameOver(true);
        setIsRunning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    if (isRunning) animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(jumpInterval.current);
    };
  }, [score, isRunning]);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>🐕 Dog Jump Game</h2>
      <p style={{ color: "#aaa" }}>Hold <strong>Space</strong> to jump higher</p>
      <canvas
        ref={canvasRef}
        style={{ border: "3px solid #333", backgroundColor: "#000" }}
      />

      {charging && (
        <div style={{ width: 300, height: 20, border: "1px solid #555", margin: "10px auto", background: "#222" }}>
          <div
            style={{
              width: `${jumpPower}%`,
              height: "100%",
              background: "#4caf50",
              transition: "width 0.05s"
            }}
          />
        </div>
      )}

      {gameOver && (
        <div style={{ marginTop: 10 }}>
          <h2 style={{ color: "#e91e63" }}>Game Over</h2>
          <button
            onClick={resetGame}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default DragonGame;
