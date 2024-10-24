import { useState } from 'react';
import { Users, RotateCw, Trophy } from 'lucide-react';

const Button = ({ children, onClick, className = '' }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg bg-white border border-gray-200 
    hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2
    shadow-sm hover:shadow ${className}`}
  >
    {children}
  </button>
);

const Game = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [rotationAngles, setRotationAngles] = useState(Array(9).fill(0));

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleMove = (index) => {
    if (gameBoard[index] || winner) return;

    const newBoard = [...gameBoard];
    newBoard[index] = currentPlayer === 1 ? 'X' : 'O';
    setGameBoard(newBoard);

    const newRotations = [...rotationAngles];
    newRotations[index] = 360;
    setRotationAngles(newRotations);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores(prev => ({
        ...prev,
        [gameWinner === 'X' ? 'player1' : 'player2']: prev[gameWinner === 'X' ? 'player1' : 'player2'] + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setGameBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer(1);
    setRotationAngles(Array(9).fill(0));
  };

  const renderSymbol = (value, index) => {
    if (!value) return null;
    
    const isX = value === 'X';
    const rotation = rotationAngles[index];
    
    if (isX) {
      return (
        <div 
          className="relative w-16 h-16 transform-gpu"
          style={{
            animation: 'dropIn 0.5s ease-out',
            transform: `rotateY(${rotation}deg)`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          <div className="absolute w-full h-2 bg-blue-500 transform rotate-45 rounded-full shadow-lg" 
               style={{ top: '45%' }} />
          <div className="absolute w-full h-2 bg-blue-500 transform -rotate-45 rounded-full shadow-lg"
               style={{ top: '45%' }} />
        </div>
      );
    } else {
      return (
        <div 
          className="relative w-16 h-16 transform-gpu"
          style={{
            animation: 'dropIn 0.5s ease-out',
            transform: `rotateX(${rotation}deg)`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          <div className="absolute inset-0 border-8 border-red-500 rounded-full shadow-lg"
               style={{ animation: 'pulse 2s infinite' }} />
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <style>
        {`
          @keyframes dropIn {
            0% { transform: translateY(-100px) scale(0); opacity: 0; }
            70% { transform: translateY(10px) scale(1.1); opacity: 0.7; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .game-board {
            transform: perspective(1000px) rotateX(20deg);
            transform-style: preserve-3d;
          }
          .cell-3d {
            transform-style: preserve-3d;
            transition: all 0.3s ease;
          }
          .cell-3d:hover {
            transform: translateZ(20px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
        `}
      </style>

      <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Users className="h-6 w-6" />
              3D Tic-Tac-Toe
            </div>
            <Button onClick={resetGame}>
              <RotateCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-6">
          <div className="flex justify-between mb-8">
            <div className="text-center transform hover:scale-110 transition-transform">
              <div className={`text-lg font-bold ${currentPlayer === 1 ? 'text-blue-500' : 'text-gray-700'}`}>
                Player 1 (X)
              </div>
              <div className="flex items-center gap-1 justify-center">
                <Trophy className="h-4 w-4" />
                {scores.player1}
              </div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform">
              <div className={`text-lg font-bold ${currentPlayer === 2 ? 'text-red-500' : 'text-gray-700'}`}>
                Player 2 (O)
              </div>
              <div className="flex items-center gap-1 justify-center">
                <Trophy className="h-4 w-4" />
                {scores.player2}
              </div>
            </div>
          </div>

          <div className="game-board grid grid-cols-3 gap-4 p-4">
            {gameBoard.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleMove(index)}
                className={`
                  cell-3d h-24 flex items-center justify-center 
                  bg-white rounded-xl border-2
                  ${!cell && !winner ? 'hover:bg-gray-50' : ''}
                  ${cell === 'X' ? 'border-blue-300' : cell === 'O' ? 'border-red-300' : 'border-gray-200'}
                `}
                disabled={!!cell || !!winner}
              >
                {renderSymbol(cell, index)}
              </button>
            ))}
          </div>

          {winner && (
            <div className="mt-8 text-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text">
              Player {winner === 'X' ? '1' : '2'} wins!
            </div>
          )}
          {!winner && !gameBoard.includes(null) && (
            <div className="mt-8 text-center text-2xl font-bold text-gray-700">
              It's a draw!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;