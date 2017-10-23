import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function Square(props) {
  const bgColor = props.bgColor;
  return (
    <button className="square" onClick={props.funcToClick} style={{backgroundColor: bgColor}}>
      {props.value}
    </button>
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
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      }
    }
     return null;
  }

  function calculateLocation(i) {
    const lines = [ '(0,0)', '(0,1)', '(0,2)', '(1,0)', '(1,1)', '(1,2)', '(2,0)', '(2,1)', '(2,2)'];
    return lines[i];
  }

class Board extends React.Component {  
  renderSquare(i) {
    var color = (this.props.victoryIndex && this.props.victoryIndex.indexOf(i) !== -1) ? 'green' : 'white'; 
    return (<Square key={i} value={ this.props.squares[i] } funcToClick={() => this.props.onClick(i)} bgColor={color}/>);
  }
  
  renderLine(i) {
    var line = [];
    for (var k = 0; k < 3; k++) {
      var index = k+3*i;
      line.splice(line.length, 0, this.renderSquare(index));
    }
    return (<div key={i} className="board-row">{line}</div>);
  }
  
  renderMatrix() {
    var matrix = [];
    for (var i = 0; i < 3; i++) {
      matrix.splice(matrix.length, 0, this.renderLine(i));
    }
    return(matrix);
  }
  
  render() {                            
    return (
      <div>                          
        {this.renderMatrix()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
        victoryIndex: null
      }],
      xIsNext: true,
      stepNumber: 0,
      itemSelected: null,
      ascending: true
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const itemSelected = calculateLocation(i);

    if (squares[i]) {
      this.setState({
        itemSelected: itemSelected
      });
      return;
    }
    
    if (calculateWinner(squares)) {
      return;
    }
    
    var victoryPlayer = this.state.xIsNext ? 'X' : 'O';
    squares[i] = victoryPlayer;
    let victoryIndex = calculateWinner(squares);
    victoryIndex = victoryIndex ? victoryIndex[1] : null
    const location = calculateLocation(i);
    this.setState({ 
      history: history.concat([
        {
          squares: squares,
          location: location,
          victoryIndex: victoryIndex
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      itemSelected: itemSelected
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  toggleOrd(order) {
    this.setState({
      ascending: !order,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const victoryIndex = current.victoryIndex;
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      var desc = move ?
        'Go to move #' + move + ' location ' + step.location :
        'Go to game start';
      if (step.location === this.state.itemSelected) {
        desc = <strong>{ desc }</strong>;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.ascending) { 
      moves.reverse();
    }
    
    const arrow = this.state.ascending ? ' \u2191' : ' \u2193' ;
    const toggleOrder = <button onClick={ () => this.toggleOrd(this.state.ascending) }>{ 'Order' + arrow }</button>;
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board             
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            victoryIndex={victoryIndex} />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>{ toggleOrder }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Game />
      </div>
    );
  }
}

export default App;
