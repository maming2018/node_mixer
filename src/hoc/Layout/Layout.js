import React, { useState } from 'react';
import History from '../../Components/History/History';
import Channels from '../../Components/Channels/Channels';
import socketIOClient from "socket.io-client";

const socket = socketIOClient('http://127.0.0.1:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

const Layout = props => {

  const [currentChannel, setCurrentChannel] = useState('102802767');

  const channelClickHandler = (channel_id) => {
    setCurrentChannel(channel_id);
  }

  return (
    <div className="container">
      <h2>Mixer</h2>
      <hr />
      <div className="row">
        <div className="col-sm">
          <Channels currentChannel={currentChannel} channelClickHandler={channelClickHandler} />
        </div>
        <div className="col-sm">
          <History socket={socket} currentChannel={currentChannel} />
        </div>
      </div>
    </div>

  );
};

export default Layout;
