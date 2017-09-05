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
      easyMode: true,
      availableIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      humanIndices: [],
      computerIndices: [],
      gameOver: false,
      winner: false,
      winningIndices: []
    }
  }

  componentDidUpdate() {
    // check if game has finished & update state, set timer, & reset
    if (this.state.turn > 2) {
      this.updateStateOnGameEnd();
    }

    if (this.state.computerTurn && this.state.playerAssigned && this.state.modeSet && this.state.gameOver === false) {
      if (this.state.easyMode)
        setTimeout(this.computerPlay, 400);
      else
        setTimeout(this.computerPlayHard, 400);
    }
  }

  // resets to default board state. Runs after win, loss, or tie
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
      easyMode: true,
      availableIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      humanIndices: [],
      computerIndices: [],
      gameOver: false,
      winner: false,
      winningIndices: []
    });
  }


  // updates state with win/loss message & resets board after timeout
  updateStateOnGameEnd = () => {
    if (this.playerWon(this.state.board)) {
      // generate a new board with winning indices colored red
      const coloredBoard = this.state.board.map((e) => e);
      if (this.state.computerTurn === false){
        this.setState({
          winner: true,
          gameOver: true,
          boardState: coloredBoard
        });
        this.setState({
          prompt: "First Kasparov, now you. Our time is limited.",
        }, () => setTimeout(this.resetBoard, 2500));
      }
      else if (this.state.computerTurn) {
        this.setState({
          winner: true,
          gameOver: true,
          boardState: coloredBoard
        });
        this.setState({
          prompt: "It's a triumph of humanity!",
        }, () => setTimeout(this.resetBoard, 2500));
      }
    }
    else if (this.state.turn === 9){
      this.setState({
        prompt: "Dead even. I'll reset the board.",
        gameOver: true
      }, () => setTimeout(this.resetBoard, 2500));
    }
    else {
      return null;
    }
  }

  // returns a Boolean of whether a player has won & updates state w/ winning combo
  playerWon = (boardState) => {
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      let checkpoint;
      let winningIndices = [];
      winningCombos.forEach(function(combo) {
        let testArr = [];
        let firstElement = boardState[combo[0]];
          combo.forEach(function(boardIndex) {
              testArr.push(boardState[boardIndex]);
            });
        if (testArr.every((e) => e === firstElement && e !== '')) {
          checkpoint = true;
          winningIndices = combo;
        }
      });
      if (winningIndices.length) {
        this.setState({
          winningIndices: winningIndices
        });
      }
      return checkpoint;
  }

  // sets state according to X/O assignments
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

  // sets state according to the selected mode
  setMode = (val) => {
    const selectedEasy = (val === "Easy") ? true : false;
    const computerTurnBoolean = selectedEasy ? false : true
    const prompt = selectedEasy ? "Pshh, who needs luck? Your move." : "Machine says:  self  >  human."
    this.setState({
      modeSet: true,
      easyMode: selectedEasy,
      prompt: prompt,
      computerTurn: computerTurnBoolean
    });
  }


  // returns an object w/ the indices for computer, human, and available squares
  getPlayerPositionObj = () => {
    const board = this.state.board;
    const computerChar = this.state.computerPlayer;
    const humanChar = this.state.humanPlayer;
    const humanPositions = [];
    const computerPositions = [];
    const emptySquares = [];

    board.forEach(function(char, index) {
      if (char === computerChar && computerChar !== '')
        computerPositions.push(index)
      else if (char === humanChar && humanChar !== '')
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


  setBoardState = () => {
    const positionObj = this.getPlayerPositionObj();
    const availableIndices = positionObj.emptyIndices;
    const humanIndices = positionObj.humanIndices;
    const computerIndices = positionObj.computerIndices;

    this.setState({
      availableIndices: availableIndices,
      humanIndices: humanIndices,
      computerIndices: computerIndices
    });
  }

  handleUserMove = (id) => {
    if (this.state.computerTurn === false && this.state.board[id] === "" && this.state.gameOver === false) {
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
      this.setBoardState();
    }
  }

  // returns a random index of an available square
  randomMove = () => {
      let available = this.state.availableIndices;
      let numberOpen = available.length;
      let randomIndex = Math.floor(Math.random() * numberOpen);
      return available[randomIndex];
  }


// EASY MODE: allows user first move, checks for win & loss opportunities,
// but plays randomly otherwise
  computerPlay = () => {
    if (this.state.gameOver === false) {
      let checkWin = this.winPossible(this.state.computerIndices); // if true returns [true, index of best move]
      let checkLoss = this.winPossible(this.state.humanIndices);
      let moveIndex;

      switch (this.state.computerTurn) {
        case (checkWin[0]):
          moveIndex = checkWin[1];
          break;
        case (checkLoss[0]):
          moveIndex = checkLoss[1]
          break;
        default:
          moveIndex = this.randomMove();
      }

      const newBoard = this.generateNewBoard(moveIndex);

      this.setState({
        board: newBoard,
        computerTurn: false,
        turn: this.state.turn + 1
      });
      this.setBoardState();
    }
  }


// returns an array with updated board state
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


  computerPlayHard = () => {
    if (this.state.gameOver === false) {
      let newBoard;
      const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      const randomCorner = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
      const availableIndices = this.state.availableIndices
      const humanIndices = this.state.humanIndices
      const computerIndices = this.state.computerIndices
      const checkWin = this.winPossible(this.state.computerIndices); // if true returns [true, index of best move]
      const checkLoss = this.winPossible(this.state.humanIndices);

      switch (this.state.computerTurn && this.state.gameOver === false) {

        case this.state.turn === 0:
          // first move: place in random corner
          newBoard = this.generateNewBoard(randomCorner);
          break;

        case this.state.turn === 2:
            let center = this.state.board[4];
            const firstMove = computerIndices[0];
            let secondMove;

            if (center !== "")
              secondMove = ( firstMove === 0) ? 8 : (firstMove === 2) ? 6 : (firstMove === 6) ? 2 : 0;

            else if (center === "") {
              const corners = [0, 2, 6, 8];
              // get corners computer has not played
              corners.splice([0, 2, 6, 8].indexOf(firstMove), 1);
              corners.forEach(function(corner) {
                // if corner has not been played
                if (availableIndices.indexOf(corner) !== -1) {
                  // check that the human play is not in the middle of the next corner
                  winningCombos.forEach(function(combo) {
                    // if the combo contains the first move, proposed move, and opponent has not moved in the middle
                    if (combo.indexOf(computerIndices[0]) !== -1 && combo.indexOf(corner) !== -1 && combo[1] !== humanIndices[0]) {
                      secondMove = corner;
                    }
                  });
                }
              });
            }
            newBoard = this.generateNewBoard(secondMove);
            break;


        case this.state.turn === 4:
          let thirdMove;
          if (checkWin[0])
            thirdMove = checkWin[1];
          else if (checkLoss[0]) {
            thirdMove = checkLoss[1];
          }
          else if (availableIndices.indexOf(4) !== -1){
            thirdMove = 4; // center of the board, if available
          }
          else {
            thirdMove = this.randomMove();
          }
          newBoard = this.generateNewBoard(thirdMove);
          break;


          case this.state.turn === 6:
            let fourthMove;
            if (checkWin[0])
              fourthMove = checkWin[1];
            else if (checkLoss[0])
              fourthMove = checkLoss[1];
            else {
              fourthMove = this.randomIndex();
            }
          newBoard = this.generateNewBoard(fourthMove);
          break;


        default:
          // play a random available square
            let moveIndex;
              if (checkWin[0])
                moveIndex = checkWin[1];
              else if (checkLoss[0])
                moveIndex = checkLoss[1];
              else
                moveIndex = this.randomMove();
            newBoard = this.generateNewBoard(moveIndex);
      }


      this.setState({
        board: newBoard,
        computerTurn: false,
        turn: this.state.turn + 1
      });
      this.setBoardState();
    }
  }

  // checks if player (passed as arg) can win on next move
  // returns an arr in form [Boolean, index of winning move]
  winPossible = (playerIndicesToAnalyze) => {
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let playerIndices = playerIndicesToAnalyze;
    let availableIndices = this.state.availableIndices;
    let possibleCombos = [];
    let canWin = false;
    let finalIndex;

    winningCombos.forEach(function(combo) {
       // if any combo has two of the indices in computer indices
        let cnt = 0;
        combo.forEach(function(index, i, arr) {
          if (playerIndices.indexOf(index) !== -1 ) {
            ++cnt;
          }
          if (cnt === 2) {
            possibleCombos.push(arr); // push if arr contains two computer squares
          }
        });
      });
      // if the third index is empty, assign it to finalIndex
      possibleCombos.forEach(function(comboArr) {
        for (let i = 0; i < comboArr.length; i++) {
          let testIndex = availableIndices.indexOf(comboArr[i]);
          if (testIndex !== -1) {
            finalIndex = availableIndices[testIndex];
            canWin = true;
            break;
          }
        }

      });
    return [canWin, finalIndex];
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
                    handleUserMove={this.handleUserMove}
                    winner={this.state.winner}
                    winningIndices={this.state.winningIndices} />
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
