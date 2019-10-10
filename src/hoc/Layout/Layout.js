import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { SERVER_ENDPOINT, OUR_MIXER_CHANNEL_ID } from '../../Config/constants';

import History from '../../Components/History/History';
import Channels from '../../Components/Channels/Channels';
import ChannelForm from '../../Components/Channels/ChannelForm/ChannelForm';

const socket = socketIOClient('http://127.0.0.1:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

const Layout = props => {

  let access_token = '';

  let vars = {};
  window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });

  // console.log(vars)

  if (vars.access_token) {
    access_token = vars.access_token;
  } else if (localStorage.getItem('access_token')) {
    access_token = localStorage.getItem('access_token');
  }
  // console.log("access_token: ", access_token)

  const [currentChannel, setCurrentChannel] = useState(OUR_MIXER_CHANNEL_ID);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [socketData, setSocketData] = useState(null);
  const [someUpdate, setSomeUpdate] = useState({});

  useEffect(() => {
    if (access_token !== "") {
      axios.post(`${SERVER_ENDPOINT}/token-verify`, {
        access_token: access_token
      }).then(response => {
        // console.log("response:", response)
        if (response.data === "AUTHENTICATED") {
          console.log("You are authorized to chat")
          localStorage.setItem('access_token', access_token)
          setIsAuthorized(true);

          socket.on("ChatMessage", data => {
            console.log("%cNew chat message", "color:blue");
            setSocketData(data);
          });
        }
      }).catch(error => {
        localStorage.removeItem('access_token')
        console.log('error', error)
        console.log("You aren't authorized to chat")
      })
    }
  }, [])

  const channelClickHandler = (channel_id) => {
    setCurrentChannel(channel_id);
  }

  const modalHandler = () => {
    // const newState = !isModal;
    setIsModal(true)
  }

  const cancelHandler = () => {
    // const newState = !isModal;
    setIsModal(false)
  }

  const updateHandler = (action, data) => {
    setIsModal(false)
    setSomeUpdate(action, data)
    // console.log("updateHandler called");
  }

  const responseUpdate = () => {
    // console.log("responseUpdate called");
  }

  return (
    <div className="container">
      <div className={isModal === true ? 'Opacity-01' : null}>
        <h2>Mixer</h2>
        <hr />
        <div className="row">
          <div className="col-sm">

            <Channels
              someUpdate={someUpdate}
              currentChannel={currentChannel}
              channelClickHandler={channelClickHandler}
              modalHandler={modalHandler} />

          </div>
          <div className="col-sm">
            <History socketData={socketData} isAuthorized={isAuthorized} currentChannel={currentChannel} />
          </div>
        </div>
      </div>
      {isModal === true ?
        <div>
          <ChannelForm
            defaultValue={{ id: 'new' }}
            updateHandler={(action, data) => updateHandler(action, data)}
            cancelHandler={cancelHandler}
            responseUpdate={responseUpdate} />
        </div> : null
      }
    </div>

  );
};

export default Layout;
