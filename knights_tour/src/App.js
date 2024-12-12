import React, { useState, useRef } from "react";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";

const N = 8; // 8x8 chessboard
const movesX = [2, 1, -1, -2, -2, -1, 1, 2];
const movesY = [1, 2, 2, 1, -1, -2, -2, -1];

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
  const [initialStartPosition, setInitialStartPosition] = useState(null); // Keep track of the initial starting position
  const [currentMove, setCurrentMove] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const intervalRef = useRef(null);

  // Handle cell click to set the starting position
  const handleCellClick = (x, y) => {
    if (gameStarted || currentMove > 1) return;
    const newBoard = Array.from({ length: N }, () => Array(N).fill(-1));
    newBoard[x][y] = 0;
    setBoard(newBoard);
    setStartPosition({ x, y });
    setInitialStartPosition({ x, y }); // Set the initial starting position
    setCurrentMove(1);
  };

  // Handle the next move
  const nextMove = () => {
    if (!startPosition) return;
    const { x, y } = startPosition;
    const moves = getSortedMoves(x, y, board);
    if (moves.length === 0) return;
    const { x: nx, y: ny } = moves[0];
    const newBoard = board.map((row) => [...row]);
    newBoard[nx][ny] = currentMove;
    setBoard(newBoard);
    setStartPosition({ x: nx, y: ny });
    setCurrentMove(currentMove + 1);
    setGameStarted(true);
  };

  // Complete the tour
  const completeTour = () => {
    if (!startPosition) return;
    let tempBoard = board.map((row) => [...row]);
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

  // Reset 
  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBoard(Array.from({ length: N }, () => Array(N).fill(-1)));
    setStartPosition(null);
    setInitialStartPosition(null); // Reset the initial start position
    setCurrentMove(0);
    setGameStarted(false);
  };

  return (
    <div className="App">

      <Header /> 

      <main>
        <div className="container">
          <div className="board">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`cell 
                    ${cell !== -1 ? "visited" : ""} 
                    ${initialStartPosition &&
                    initialStartPosition.x === i &&
                    initialStartPosition.y === j
                      ? "start-cell"
                      : ""} 
                    ${(i + j) % 2 === 0 ? "light" : "dark"}`}
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell !== -1 ? cell : ""}
                </div>
              ))
            )}
          </div>
          <div className="controls">
            <button onClick={nextMove} disabled={!startPosition || currentMove === N * N}>
              Next Move
            </button>
            <button onClick={completeTour} disabled={!startPosition || currentMove === N * N}>
              Complete Tour
            </button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>
      </main>     

      <Footer />

    </div>
  );
}

export default App;
