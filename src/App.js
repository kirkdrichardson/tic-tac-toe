import React, { Component } from 'react';
import Board from './comp/board.js'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <Board />

      </div>
    );
  }
}

export default App;
