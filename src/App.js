import { useState } from 'react';

function Square({ valueSquares, valueIndex, onSquareClick, hightLight }) {
  const teste = hightLight.positions.includes(valueIndex);
  
  return (
    <button className={teste ? "winner-square" : "square"} onClick={onSquareClick}>
      {valueSquares[valueIndex]}
    </button>
  );
}

function HistorySquare({ valueSquares }) {
  const littleNumber = {0: '°', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹'}
  let drawPlay;
  if (valueSquares.player) {
    drawPlay = valueSquares.player + littleNumber[valueSquares.turn];
  } else {
    drawPlay = valueSquares.player;
  }

  return (
    <button className='history-square'>
      {drawPlay}
    </button>
  );
}

function HistoryBoard({ historySquaresProp }) {
  const loopHistoryBoard = historySquaresProp.slice();  
  const historyBoardLines = loopHistoryBoard.map((element, index) => {
    return (
      <HistorySquare key={index} 
        valueSquares={element} 
        valueIndex={index} 
      />
    );
  }); 

  const drawHistoryLine = (element) => {
    return element.map((number) => historyBoardLines[number])
  }

  const calculo = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const drawHistoryBoard = calculo.map((element) => {
    return (
      <div key={element} className="board-row">
        {drawHistoryLine(element)}
      </div>  
    );    
  });  

  return (
    <>
        {drawHistoryBoard}
    </>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove, onHistory }) {
    function handleClick(i){
      if (squares[i] || calculateWinner(squares).winner || currentMove > 8) {
        return;
      }    

      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
      onHistory(i);
  }
  
  const winner = calculateWinner(squares); 
  let status;
  if (winner.winner) {
    status = "Winner: " + winner.winner;
  } else if (currentMove > 8) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const loopBoard = squares.slice();  
  const boardLines = loopBoard.map((element, index) => {
    return (
      <Square key={index} 
        valueSquares={squares}
        valueIndex={index}
        onSquareClick={() => handleClick(index)} 
        hightLight={calculateWinner(squares)} 
      />
    );
  });  

  const drawLine = (element) => {
    return element.map((number) => boardLines[number])
  }

  const calculo = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const drawBoard = calculo.map((element) => {
    return (
      <div key={element} className="board-row">
        {drawLine(element)}
      </div>  
    );    
  });  

  return (
    <>
      <div className={status === "Winner: " + winner.winner ? "winner-status" : "status"}>{status}</div>
        {drawBoard}
    </>
  );
}


export default function Game() {    
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscend, setIsAscend] = useState(true);
  const [formatHistory, setFormatHistory] = useState([Array(9).fill({player: null, turn: null})])
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove];
  const currentHistorySquares = formatHistory[currentMove];
  const swapDescription = (isAscend ? "Ascending ⩓" : "Descending ⩔");

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleHistory(i) {
    const nextSquaresHistory = currentHistorySquares.slice();
    if (xIsNext) {
      nextSquaresHistory[i] = {player: "X", turn: (currentMove + 1)};
    } else {
      nextSquaresHistory[i] = {player: "O", turn: (currentMove + 1) };
    }  

    const nextFormatHistory = [...formatHistory.slice(0, currentMove + 1), nextSquaresHistory];
    setFormatHistory(nextFormatHistory);
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

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext}
         squares={currentSquares}
         onPlay={handlePlay}
         onHistory={handleHistory} 
         currentMove={currentMove} 
        />
        <div className='history-board'>
          <HistoryBoard historySquaresProp={currentHistorySquares} />
        </div>
      </div>
      <div className="game-info">
      <button className="toggle" onClick={swap}>{swapDescription}</button>
        <ol>{(isAscend ? moves : moves.toReversed())}</ol>
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
      return {winner: squares[a], positions: [a, b, c]};
    }
  }
  return {winner: null, positions: []};
}
