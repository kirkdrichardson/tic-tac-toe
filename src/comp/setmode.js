import React, { Component } from 'react';

class SetMode extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const style = {
      margin: 10,
      fontWeight: "bold",
      fontSize: 24
    }

    if (this.props.modeSet === false && this.props.userSet === true) {
      return (
          <input
            style={style}
            type="submit"
            value={this.props.val}
            onClick={() => this.props.setMode(this.props.val)} />
      );
    }
    else {
      return null;
    }
  }
}

export default SetMode
