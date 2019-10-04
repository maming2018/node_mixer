import React, { useState } from 'react';
import socketIOClient from "socket.io-client";

const socket = socketIOClient('http://127.0.0.1:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

const SendMessage = props => {

  const [newMessage, setNewMessage] = useState('');

  const newMessageChangeHandler = e => {
    let value = e.target.value;
    // console.log(value);
    setNewMessage(value);
  }

  // socket.on("ChatMessage", data => {
  //   console.log("%cNew chat message", "color:blue");
  //   setHistory(prevMovies => ([...prevMovies, data]));
  // });

  // socket.emit

  const newMessageSubmit = (e) => {
    e.preventDefault();

    socket.send("sendMessageEmit", newMessage)
    // socket.call('msg', ['Hello world!']);

    console.log("Form submitted")
  }


  return (
    <div className="input-group mb-3">
      <div>

        <form onSubmit={newMessageSubmit}>
          <input type="text" className="form-control" placeholder="Type message here" aria-label="Recipient's username" aria-describedby="button-addon2" value={newMessage} onChange={(e) => newMessageChangeHandler(e)} />
        </form>
      </div>
      <div className="input-group-append">
        <button className="btn btn-secondary" type="button" id="button-addon2">Send</button>
      </div>
    </div>
  );
};

export default SendMessage;
