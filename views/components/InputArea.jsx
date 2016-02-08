import React from 'react';
import ReactDOM from 'react-dom';

export default class InputArea extends React.Component {
  handleChange() {
    this.props.onUserInput(
      ReactDOM.findDOMNode(this.refs.textarea).value
    );
  }

  render() {
    return (
      <textarea
        onChange={this.handleChange.bind(this)}
        ref="textarea"
        id="input"
        className="input-area"
        value={this.props.code}
        />
    );
  }
}
