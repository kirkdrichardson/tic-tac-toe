import React from 'react';

 const Square = (props) => {

  let style = {
    height: 100,
    width: 100,
    backgroundColor: "transparent",
    color: "white",
    fontSize: 36
  }
  // if there is a winner, set winning square text to red
  if (props.winner && props.winningIndices.indexOf(props.id) !== -1) {
    style = {
      height: 100,
      width: 100,
      backgroundColor: "transparent",
      color: "red",
      fontSize: 36
    }
  }

  return (
    <input
      style={style}
      type={"button"}
      value={props.val}
      onClick={() => props.handleUserMove(props.id)} />
  );
}

export default Square
