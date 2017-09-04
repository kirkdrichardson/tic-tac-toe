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
      computerIndices: []
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
        else if (this.state.computerTurn) {
          alert("It's a triump of humanity!!!");
          this.resetBoard();
        }
      }
      else if (this.state.turn === 9){
        alert("It's a tie!");
        this.resetBoard();
      }

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
      easyMode: true,
      availableIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      humanIndices: [],
      computerIndices: []
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
      prompt: prompt,
      computerTurn: true
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
      this.setBoardState();
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
    this.setBoardState();

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




  computerPlayHard = () => {
    let newBoard;
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const randomCorner = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
    let hasMoved = false;

    let availableIndices = this.state.availableIndices
    let humanIndices = this.state.humanIndices
    let computerIndices = this.state.computerIndices

    // console.log('####################################')
    // console.log('availableIndices was ', this.state.availableIndices)
    // console.log('humanIndices was ', this.state.humanIndices)
    // console.log('computerIndices was ', this.state.computerIndices)


    switch (this.state.computerTurn) {

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
        let checkWin = this.winPossible(); // if true returns [true, index of best move]
        let checkLoss = this.lossPossible();

        if (checkWin[0])
          thirdMove = checkWin[1];
        else if (checkLoss[0]) {
          thirdMove = checkLoss[1];
        }
        else {
          alert('revert to easy version. later insert forkPossible here');
          this.setState({ turn: this.state.turn - 2 })
          this.computerPlay();
        }

        newBoard = this.generateNewBoard(thirdMove);
        break;




        case this.state.turn === 6:
          alert('gucc')
          let fourthMove;
          checkWin = this.winPossible(); // if true returns [true, index of best move]
          console.log('checkWin defined as ', checkWin)
          checkLoss = this.lossPossible(); // inverse of above logic
          let forkPossible = this.createFork();
          console.log('checkWin is ', checkWin)
          console.log('forkPossible is ', forkPossible);

          if (checkWin[0])
            fourthMove = checkWin[1];
          else if (checkLoss[0])
            fourthMove = checkLoss[1];
          // else if (forkPossible[0])
          //   fourthMove = forkPossible[1];
          else {
            this.setState({ turn: this.state.turn - 1 })
            this.computerPlay();

          }

        newBoard = this.generateNewBoard(fourthMove);
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
    this.setBoardState();
    // console.log('########################################')
    // console.log('availableIndices IS ', this.state.availableIndices)
    // console.log('humanIndices IS ', this.state.humanIndices)
    // console.log('computerIndices IS ', this.state.computerIndices)
  }


  winPossible = () => {
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let computerIndices = this.state.computerIndices;
    let availableIndices = this.state.availableIndices;
    let possibleCombos = [];
    let canWin = false;
    let finalIndex;

    winningCombos.forEach(function(combo) {
       // if any combo has two of the indices in computer indices
        let cnt = 0;
        combo.forEach(function(index, i, arr) {
          if (computerIndices.indexOf(index) !== -1 ) {
            ++cnt;
          }
          if (cnt === 2) {
            possibleCombos.push(arr); // push if arr contains two computer squares
          }
        });
      });
      // if the third index is empty, assign it to finalIndex
      possibleCombos.forEach(function(comboArr) {
        console.log('new possibleCombo is ', comboArr)

        for (let i = 0; i < comboArr.length; i++) {
          let testIndex = availableIndices.indexOf(comboArr[i]);
          console.log('availableIndices is ', availableIndices)
          console.log('specific index of availableIndices is ', comboArr[i])
          console.log('testIndex is ', testIndex)
          if (testIndex !== -1) {
            finalIndex = availableIndices[testIndex];
            canWin = true;
            console.log("########   finalIndex is ", finalIndex)
            break;
          }
        }

      });
    return [canWin, finalIndex];
  }







  lossPossible = () => {
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let availableIndices = this.state.availableIndices
    let humanIndices = this.state.humanIndices
    let retArr = [false, null];

    winningCombos.forEach(function(combo) {
      let firstIndex = combo.indexOf(humanIndices[0]);
      let secondIndex = combo.indexOf(humanIndices[1]);
      // if computer has played in two of three winningCombos
      if (firstIndex !== -1 && secondIndex !== -1) {
        combo.forEach(function(index) {
          // and if the winning position is not taken
          if (index !== firstIndex && index !== secondIndex) {
            let remainingIndex = index;
            let isAvailable = availableIndices.indexOf(remainingIndex) !== -1
            if (isAvailable) {
              retArr = [true, index]
              console.log('%%%%%% SUCCESS %%%%%%%%% retArr for checkLoss is ', retArr)
            }
          }

        });
      }
    });
    return retArr;
  }


  createFork = () => {
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let availableIndices = this.state.availableIndices
    let humanIndices = this.state.humanIndices
    let computerIndices = this.state.computerIndices
    let openSquares = [];
    let retArr = [];

    const possibleCombos = winningCombos.forEach(function(combo) {
            let firstIndex = combo.indexOf(computerIndices[0]);
            let secondIndex = combo.indexOf(computerIndices[1]);
            // if computer has played in two of three winningCombos
            if (firstIndex !== -1 || secondIndex !== -1) {
              return combo;
            }
          });

    console.log('0000000000000   ', possibleCombos)
    return possibleCombos;
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
