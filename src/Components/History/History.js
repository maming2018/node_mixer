import React, { useState, useEffect } from 'react';
import axios from "axios";

import { SERVER_ENDPOINT, OUR_MIXER_CHANNEL_ID } from '../../Config/constants'
import Loader from '../Loader/LoaderOne'
import HistoryCont from '../../Containers/History/History';
import SendMessage from '../SendMessage/SendMessage';

const History = props => {

  // console.log("props.currentChannel: ", props.currentChannel)

  const [history, setHistory] = useState([]);
  const [oldSocket, setOldSocket] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    // console.log("USE EFFECT COMPONENT/HISTORY.js");
    if (props.currentChannel !== '' && (!props.socketData || oldSocket == props.socketData)) {
      setIsLoading(true);

      axios.get(`${SERVER_ENDPOINT}/history`, {
        params: {
          'channel_id': props.currentChannel
        }
      }).then(function (response) {
        setHistory(response.data.history);
      }).catch(function (error) {
        console.log(error);
      }).then(function () {
        setIsLoading(false);
      });
    }
    if (props.isAuthorized === true && props.socketData) {
      if (oldSocket != props.socketData) {
        setHistory(prevHistory => ([...prevHistory, props.socketData]));
        setOldSocket(props.socketData);
        axios.post(`${SERVER_ENDPOINT}/save-chat`, props.socketData).then(response => {
          // console.log("save-chat response:", response);
        }).catch(error => {
          // console.log("save-chat error:", error)
        })
      }
    }
  }, [props.currentChannel, props.socketData])

  return (
    <div>
      <h3>History</h3>
      {
        isLoading === true ?
          <div className="mt-2"><Loader /></div>
          :
          props.currentChannel === '' ? 'Please select channel' :
            <div>
              <HistoryCont history={history} />
              {
                OUR_MIXER_CHANNEL_ID != props.currentChannel ? null :
                  props.isAuthorized === true ? <SendMessage /> : <a href="https://mixer.com/oauth/authorize?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=chat:connect&client_id=e31e62c385128098f25cb1e703afbcba381a6a61e3ed62c3">Please login to chat</a>}
            </div>
      }
    </div>
  );
};

export default History;
