import React, { useState, useEffect } from 'react';
// import socketIOClient from "socket.io-client";
import axios from "axios";

import { MIXER_API_ENDPOINT } from '../../Config/constants'
import Loader from '../Loader/LoaderOne'
import HistoryCont from '../../Containers/History/History';
import SendMessage from '../SendMessage/SendMessage';

// const socket = socketIOClient('http://127.0.0.1:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

const History = props => {

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    // console.log("USE EFFECT COMPONENT/HISTORY.js");

    if (props.currentChannel !== '') {
      setIsLoading(true);
      let searchOutput = [];
      axios.get(`${MIXER_API_ENDPOINT}/chats/${props.currentChannel}/history`).then(function (response) {
        response.data.forEach(raw => {
          // console.log(raw.message.message[0].type)
          let text_message = '-';
          let image_url = '-';
          if (raw.message.message[0].type === 'text') {
            text_message = raw.message.message[0].text;
          } else if (raw.message.message[0].type === 'image') {
            text_message = raw.message.message[0].text;
            image_url = raw.message.message[0].url;
          } else {
            text_message = raw.message.message[0].type;
          }
          raw.text_message = text_message;
          raw.image_url = image_url;
          searchOutput.push(raw)
        })
        setHistory(searchOutput);
      }).catch(function (error) {
        console.log(error);
      }).then(function () {

        setIsLoading(false);

        console.log("%cCalling chat socket", "color:blue")

        // socket.on("FromAPI", data => {
        //   console.log("%cWeather is:", "color:green");
        //   console.log(data)
        // });

        props.socket.on("ChatMessage", data => {
          console.log("%cNew chat message", "color:blue");
          // console.table(data)

          setHistory(prevMovies => ([...prevMovies, data]));
        });
        

      });
    }

  }, [props.currentChannel])

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
              <SendMessage />
            </div>
      }
    </div>
  );
};

export default History;
