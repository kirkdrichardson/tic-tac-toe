import React, { Component } from 'react';

class UserChoice extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const style = {
      margin: 10,
      fontWeight: "bold",
      fontSize: 24
    }

    if (this.props.show)
      return null;

    else {
      return (
          <input
            style={style}
            type="submit"
            value={this.props.val}
            onClick={() => this.props.setPlayer(this.props.val)} />
      );
    }
  }
}

export default UserChoice
