import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{x: 10, y: 10}];
const INITIAL_DIRECTION = {x: 1, y: 0};
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({x: 15, y: 15});
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wallMode, setWallMode] = useState('solid'); // 'solid' or 'passthrough'

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const checkCollision = useCallback((head) => {
    if (wallMode === 'solid') {
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
      }
    }

    for (let segment of snake.slice(1)) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }, [snake, wallMode]);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = {...prevSnake[0]};
      head.x += direction.x;
      head.y += direction.y;

      if (wallMode === 'passthrough') {
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 5);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, checkCollision, generateFood, wallMode]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (!isPlaying && (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd'].includes(key))) {
        setIsPlaying(true);
      }

      switch(key) {
        case 'arrowup':
        case 'w':
          setDirection(d => d.y !== 1 ? {x: 0, y: -1} : d);
          break;
        case 'arrowdown':
        case 's':
          setDirection(d => d.y !== -1 ? {x: 0, y: 1} : d);
          break;
        case 'arrowleft':
        case 'a':
          setDirection(d => d.x !== 1 ? {x: -1, y: 0} : d);
          break;
        case 'arrowright':
        case 'd':
          setDirection(d => d.x !== -1 ? {x: 1, y: 0} : d);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <>
      <div className="mb-4 flex justify-center gap-2">
        <button
          onClick={() => setWallMode('solid')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            wallMode === 'solid'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Solid Walls
        </button>
        <button
          onClick={() => setWallMode('passthrough')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            wallMode === 'passthrough'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Passthrough Walls
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold text-green-700">Score: {score}</div>
        <button 
          onClick={resetGame}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          {gameOver ? 'Play Again' : 'Restart'}
        </button>
      </div>

      <div 
        className="relative bg-green-100 border-4 border-green-800"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-600 rounded-sm"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              backgroundColor: i === 0 ? '#15803d' : '#16a34a'
            }}
          />
        ))}
        
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-3xl font-bold">Game Over!</div>
          </div>
        )}

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="text-white text-xl font-bold">Press Arrow Keys or WASD to Start</div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-gray-600">
        Use arrow keys or WASD to control the snake
      </div>
    </>
  );
}
