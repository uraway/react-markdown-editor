'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import InputArea from './components/InputArea';
import PreviewArea from './components/PreviewArea';
const ipcRenderer = require('electron').ipcRenderer;
import ipc from 'ipc';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ code: '# Markdown' });
  }

  handleUserInput(newCode) {
    this.setState({ code: newCode });
  }

  componentDidMount() {
    ipc.on('fileContent', fileData => {
      this.setState({ code: fileData });
    });
    ipc.on('saveFile', () => {
      ipc.send('contentToSave', this.state.code);
    });
  }

  render() {
    return (
      <div>
        <div className="header">
        </div>
        <div className="container">
          <div className="col">
            <InputArea code={this.state.code} onUserInput={this.handleUserInput.bind(this)} />
          </div>
          <div className="col">
            <PreviewArea code={this.state.code} />
          </div>
        </div>
      </div>
    );
  }
}
