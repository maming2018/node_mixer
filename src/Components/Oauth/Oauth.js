import React, { Component } from 'react';
import Popout from 'react-popout';

class Oauth extends Component {
  constructor(props) {
    super(props);
    this.popout = this.popout.bind(this);
    this.popoutClosed = this.popoutClosed.bind(this);
    this.state = { isPoppedOut: false };
  }

  popout() {
    this.setState({ isPoppedOut: true });
  }

  popoutClosed() {
    console.log("Popup closed")
    this.setState({ isPoppedOut: false });
  }

  render() {
    if (this.state.isPoppedOut) {
      return (
        <Popout url='https://mixer.com/oauth/authorize?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=chat:connect&client_id=e31e62c385128098f25cb1e703afbcba381a6a61e3ed62c3' title='Window title' onClosing={this.popoutClosed} options={{ width: '600px', height: '500px' }} />
      );
    } else {
      var popout = <span onClick={this.popout} className="buttonGlyphicon glyphicon glyphicon-export">POPUP</span>
      return (
        <div>
          <strong>Section {popout}</strong>
          <div>Inline content</div>
        </div>
      );
    }
  }
}


export default Oauth;
