import React from 'react';
import SnakeGame from './SnakeGame';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-green-700 p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-green-800">Snake Game</h1>
        <SnakeGame />
      </div>
    </div>
  );
}