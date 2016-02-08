import React from 'react';
import marked from 'marked';

export default class PreviewArea extends React.Component {
  constructor(props) {
    super(props);
  }

  rawMarkup() {
    let rawMarkup = marked(this.props.code.toString(),
      {
        sanitize: true,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: true,
      });
    return { __html: rawMarkup };
  }

  render() {
    return (
      <div
        className="preview-area markdown-body"
        dangerouslySetInnerHTML={this.rawMarkup()}
      />
    );
  }
}
