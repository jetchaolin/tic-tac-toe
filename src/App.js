import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>
    {value}
  </button>;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i){
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const loopBoard = squares.slice();  
  const boardLines = loopBoard.map((element, index) => {
    return (
      <Square 
        value={squares[index]} 
        onSquareClick={() => handleClick(index)} 
      />
    );
  });  

  // EXEMPLOS!
  // const tentandoEntender = (element) => {
  //   return aaah.map((arrayN) => {
  //     return boardLines[arrayN]
  //   })
  // }

  // const tentandoEntenderTres = (aaah) => aaah.map((arrayN) => boardLines[arrayN])

  const drawLine = (element) => {
    return element.map((number) => boardLines[number])
  }

  const calculo = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const drawBoard = calculo.map((element) => {
    return (
      <div className="board-row">
        {drawLine(element)}
      </div>  
    );    
  });  

  return (
    <>
      <div className="status">{status}</div>
        {drawBoard}
    </>
  );
}


export default function Game() {    
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscend, setIsAscend] = useState(true);
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove];
  const swapDescription = (isAscend ? "Descending" : "Ascending");

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  
  function swap() {    
    const mutate = moves.toReversed();

    setIsAscend(!isAscend);
  }

  const moves = history.map((squares, move) => {
        let description;
    if (move === currentMove ) {
      description = 'You are at move #' + move;
    } if (move > 0 && move != currentMove) {
      description = 'Go to move #' + move;
    } if (move === 0 && move < currentMove) {
      description = 'Go to game start';
    } if (squares === null && move != currentMove && move > currentMove) {
      description = 'Next play';
    }

    if (move < currentMove || move > currentMove) {
      return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );} else {
      return (
        <li key={move} className="history">
          <p>{description}</p>
        </li>
      );}
  });
  console.log(moves)

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{(isAscend ? moves : moves.toReversed())}</ol>
      </div>
      <div>
        <button onClick={swap}>{swapDescription}</button>
      </div>
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
