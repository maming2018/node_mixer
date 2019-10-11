import React, { useState, useEffect } from 'react';
import axios from "axios";

import { SERVER_ENDPOINT, OUR_MIXER_CHANNEL_ID, OAUTH_APP_CLIENT_ID, OAUTH_APP_REDIRECT_URI } from '../../Config/constants'
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
                  props.isAuthorized === true ? <SendMessage /> : <a href={`https://mixer.com/oauth/authorize?response_type=token&redirect_uri=${OAUTH_APP_REDIRECT_URI}&scope=chat:connect&client_id=${OAUTH_APP_CLIENT_ID}`}>Please login to chat</a>}
            </div>
      }
    </div>
  );
};

export default History;
