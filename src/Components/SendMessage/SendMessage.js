import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_ENDPOINT } from '../../Config/constants';

const SendMessage = props => {

  const defaultMessageHelp = "Press ENTER to send message";
  const [newMessage, setNewMessage] = useState('');
  const [messageHelp, setMessageHelp] = useState({ type: 'muted', msg: defaultMessageHelp });

  useEffect(() => {
    if (messageHelp.type !== "muted") {
      const timeout = setTimeout(() => {
        setMessageHelp({ type: 'muted', msg: defaultMessageHelp })
        clearTimeout(timeout);
      }, 6000)
    }
  }, [messageHelp])

  const newMessageChangeHandler = e => {
    let value = e.target.value;
    setNewMessage(value);
  }

  const newMessageSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted")

    let data = {
      'new_message': newMessage
    }

    axios.post(`${SERVER_ENDPOINT}/send-new-message`, data).then(response => {
      console.log("new message sent");
      // console.log(response);
      setNewMessage('');
      setMessageHelp({ type: 'success', msg: "Message sent" })
    }).catch(error => {
      console.log(error)
      setMessageHelp({ type: 'danger', msg: "Error sending message. Please try again!" })
    })

  }

  return (
    <div className="input-group mb-3">
      <form onSubmit={newMessageSubmit} style={{ width: '100%' }}>
        <input type="text" className="form-control" placeholder="Type message here" aria-label="Recipient's username" aria-describedby="button-addon2" value={newMessage} onChange={(e) => newMessageChangeHandler(e)} />
        <small className={`form-text text-${messageHelp.type}`}>{messageHelp.msg}</small>
      </form>
    </div>
  );
};

export default SendMessage;
