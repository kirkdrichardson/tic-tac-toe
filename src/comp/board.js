import React, { Component } from 'react';
import Square from './square.js'
import UserChoice from './userchoice.js'
import SetMode from './setmode.js'


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      humanPlayer: '',
      computerPlayer: '',
      playerAssigned: false,
      board: ['','','','','','','','',''],
      computerTurn: true,
      turn: 0,
      prompt: "Select whether you'd like to battle with X or O",
      modeSet: false,
      easyMode: true
    }
  }

  // checks for a winner or end of game
  componentDidUpdate() {
    if (this.state.turn > 2) {
      if (this.playerWon(this.state.board)) {
        if (this.state.computerTurn === false){
          alert("computer won");
          this.resetBoard();
        }
        else {
          alert("It's a triump of humanity!!!");
          this.resetBoard();
        }
      }

    }
    if (this.state.turn === 9) {
      alert("It's a tie!");
      this.resetBoard();
    }

    if (this.state.computerTurn && this.state.playerAssigned && this.state.modeSet) {
      if (this.state.easyMode)
        setTimeout(this.computerPlay, 400);
      else
        setTimeout(this.computerPlayHard, 400);
    }
  }

  resetBoard = () => {
    this.setState({
      humanPlayer: '',
      computerPlayer: '',
      playerAssigned: false,
      board: ['','','','','','','','',''],
      computerTurn: true,
      turn: 0,
      prompt: "Select whether you'd like to battle with X or O",
      modeSet: false,
      easyMode: true
    });
  }


  playerWon = (boardState) => {
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      let checkpoint;
      winningCombos.forEach(function(combo) {
        let testArr = [];
        let firstElement = boardState[combo[0]];
          combo.forEach(function(boardIndex) {
              testArr.push(boardState[boardIndex]);
            });
        if (testArr.every((e) => e === firstElement && e !== ''))
          checkpoint = true
      });
      return checkpoint;
  }


  setPlayer = (value) => {
    const computerAssignment = (value === "X") ? "O" : "X";
    if (this.state.playerAssigned === false) {
      this.setState({
        humanPlayer: value,
        computerPlayer: computerAssignment,
        playerAssigned: true,
        prompt: 'May ' + value + ' bring you luck'
      });
    }
    else {
      alert("Sorry. You must live with the choice you've made.")
    }
  }


  setMode = (val) => {
    const selectedEasy = val === "Easy" ? true : false;
    const prompt = selectedEasy ? "Pshh, who needs luck?" : "Machine says:  self  >  human."
    this.setState({
      modeSet: true,
      easyMode: selectedEasy,
      prompt: prompt
    });
  }


  handleUserMove = (id) => {
    if (this.state.computerTurn === false && this.state.board[id] === "") {
      // create new board state
      const newBoard = this.state.board.map((square, index, arr) => {
        if (index === id && arr[id] === "")
          return arr[id] = this.state.humanPlayer;
        else {
          return square;
        }
      });
      this.setState({
        board: newBoard,
        turn: this.state.turn + 1,
        computerTurn: true
      });
    }
  }


  computerPlay = () => {
    let hasMoved = false;
    const newBoard = this.state.board.map((square, index, arr) => {
      if (square === "" && hasMoved === false){
        hasMoved = true;
        return square = this.state.computerPlayer;
      }
      else
        return square;
    });
    this.setState({
      board: newBoard,
      computerTurn: false,
      turn: this.state.turn + 1
    });

  }

  generateNewBoard = (boardIndex) => {
    let hasMoved = false;
    return this.state.board.map((square, index) => {
    if (square === "" && index === boardIndex && hasMoved === false){
      hasMoved = true;
      return square = this.state.computerPlayer;
    }
    else
      return square;
  });
  }


  getPlayerPositionObj = () => {
    const board = this.state.board;
    const computerChar = this.state.computerPlayer;
    const humanChar = this.state.humanPlayer;
    const humanPositions = [];
    const computerPositions = [];
    const emptySquares = [];

    board.forEach(function(char, index) {
      if (char === computerChar)
        computerPositions.push(index)
      else if (char === humanChar)
        humanPositions.push(index)
      else
        emptySquares.push(index)
    });

    return {
      computerIndices: computerPositions,
      humanIndices: humanPositions,
      emptyIndices: emptySquares
    }

  }

  computerPlayHard = () => {
    let newBoard;
    const randomCorner = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
    let hasMoved = false;

    switch (this.state.computerTurn) {

      case this.state.turn === 0:
        // first move: place in random corner
        newBoard = this.generateNewBoard(randomCorner);
        break;

      case this.state.turn === 2:
          const positionObj = this.getPlayerPositionObj();
          const center = this.state.board[4];
          const firstMove = positionObj.computerIndices[0];
          let secondMove;

          if (center !== "")
            secondMove = ( firstMove === 0) ? 8 : (firstMove === 2) ? 6 : (firstMove === 6) ? 2 : 0;
          else if (center === "")
            


          newBoard = this.generateNewBoard(secondMove);
          break;

      default:
        // place in next available spot
          newBoard = this.state.board.map((square, index, arr) => {
          if (square === "" && hasMoved === false){
            hasMoved = true;
            return square = this.state.computerPlayer;
          }
          else
            return square;
          });

    }


    this.setState({
      board: newBoard,
      computerTurn: false,
      turn: this.state.turn + 1
    });

  }




/**************************************/
  render() {
    const boardContainer = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const boardStyle = {
      width: 300,
      height: 300,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    };

    const boardFromState =
              this.state.board.map((square, index) =>
                  <Square
                    key={index}
                    id={index}
                    val={this.state.board[index]}
                    handleUserMove={this.handleUserMove}/>
                );

    return (
      <div>
        <div style={boardContainer}>
          <div style={boardStyle}> { boardFromState } </div>
        </div>
        <UserChoice val={"X"} setPlayer={this.setPlayer} show={this.state.playerAssigned}/>
        <UserChoice val={"O"} setPlayer={this.setPlayer} show={this.state.playerAssigned}/>
        <SetMode val={"Easy"} setMode={this.setMode} modeSet={this.state.modeSet} userSet ={this.state.playerAssigned}/>
        <SetMode val={"Hard"} setMode={this.setMode} modeSet={this.state.modeSet} userSet ={this.state.playerAssigned}/>
        <div><h3 style={{color: "white"}}>{this.state.prompt}</h3></div>
      </div>
    );
  }
}



export default Board