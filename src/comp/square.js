import React from 'react';

 const Square = (props) => {
  const style = {
    height: 100,
    width: 100,
    backgroundColor: "transparent",
    color: "white",
    fontSize: 36
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
