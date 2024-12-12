import React, { useState, useRef } from "react";
import "./App.css";

const N = 8; // 8x8 chessboard
const movesX = [2, 1, -1, -2, -2, -1, 1, 2];
const movesY = [1, 2, 2, 1, -1, -2, -2, -1];

// Utility functions
const isSafe = (x, y, board) => x >= 0 && y >= 0 && x < N && y < N && board[x][y] === -1;

const countOnwardMoves = (x, y, board) => {
  let count = 0;
  for (let i = 0; i < 8; i++) {
    const nx = x + movesX[i];
    const ny = y + movesY[i];
    if (isSafe(nx, ny, board)) count++;
  }
  return count;
};

const getSortedMoves = (x, y, board) => {
  const options = [];
  for (let i = 0; i < 8; i++) {
    const nx = x + movesX[i];
    const ny = y + movesY[i];
    if (isSafe(nx, ny, board)) {
      options.push({ x: nx, y: ny, onwardMoves: countOnwardMoves(nx, ny, board) });
    }
  }
  options.sort((a, b) => a.onwardMoves - b.onwardMoves);
  return options;
};

function App() {
  const [board, setBoard] = useState(Array.from({ length: N }, () => Array(N).fill(-1)));
  const [startPosition, setStartPosition] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); // Track whether the game has started
  const intervalRef = useRef(null); // To hold the interval for the "Complete Tour"

  // Handle cell click to set the starting position
  const handleCellClick = (x, y) => {
    // Prevent changes after the game has started
    if (gameStarted || currentMove > 1) return;

    const newBoard = Array.from({ length: N }, () => Array(N).fill(-1));
    newBoard[x][y] = 0;
    setBoard(newBoard);
    setStartPosition({ x, y });
    setCurrentMove(1);
  };

  // Handle the next move
  const nextMove = () => {
    if (!startPosition) return; // If no starting position, do nothing
    const { x, y } = startPosition; // Use the current position
    const moves = getSortedMoves(x, y, board); // Get possible moves from the current position
    if (moves.length === 0) return; // No onward moves available
    const { x: nx, y: ny } = moves[0]; // Get the next move
    const newBoard = board.map(row => [...row]); // Create a copy of the board
    newBoard[nx][ny] = currentMove; // Mark the new position on the board
    setBoard(newBoard); // Update the board state
    setStartPosition({ x: nx, y: ny }); // Update the current position
    setCurrentMove(currentMove + 1); // Increment the move count
    setGameStarted(true); // Mark the game as started after the first move
  };

  // Complete the tour
  const completeTour = () => {
    if (!startPosition) return;
    let tempBoard = board.map(row => [...row]);
    let tempPosition = { ...startPosition };
    let move = currentMove;

    intervalRef.current = setInterval(() => {
      const moves = getSortedMoves(tempPosition.x, tempPosition.y, tempBoard);
      if (moves.length === 0 || move === N * N) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }
      const { x: nx, y: ny } = moves[0];
      tempBoard[nx][ny] = move;
      tempPosition = { x: nx, y: ny };
      move++;
      setBoard(tempBoard);
      setCurrentMove(move);
      setStartPosition(tempPosition);
    }, 500);
  };

  // Reset the game
  const resetGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBoard(Array.from({ length: N }, () => Array(N).fill(-1)));
    setStartPosition(null);
    setCurrentMove(0);
    setGameStarted(false); // Reset the gameStarted flag
  };

  return (
    <div className="App">
      <h1>Knight's Tour Visualizer</h1>
      <div className="container">
        <div className="board">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${cell !== -1 ? "visited" : ""} ${ (i + j) % 2 === 0 ? 'light' : 'dark'}`}
                onClick={() => handleCellClick(i, j)}
              >
                {cell !== -1 ? cell : ""}
              </div>
            ))
          )}
        </div>
        <div className="controls">
          <button onClick={nextMove} disabled={(!startPosition || currentMove === N * N ) }>
            Next Move
          </button>
          <button onClick={completeTour} disabled={!startPosition || currentMove === N * N}>
            Complete Tour
          </button>
          <button onClick={resetGame}>Reset Game</button> {/* Reset button */}
        </div>
      </div>
    </div>
  );
}

export default App;
