import React, { useEffect } from 'react';

import './History.css'

const History = props => {

  let messagesEnd;

  useEffect(() => {

    // console.log("USEEFFECT CONTAINER HISTORY.js");

    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }, [props.history, messagesEnd])

  return (
    <div className="HistoryBox">
      <ul className="messageList">
        {
          props.history.map((item, key) => {
            return <li key={key}>
              <span className="userName">{item.user_name}</span> - <span className="userMessage">{item.text_message}</span>

              {item.image_url !== '' ? <span> <img src={item.image_url} width="25px" alt="" /></span> : null}
            </li>
          })
        }
      </ul>
      <div style={{ float: "left", clear: "both" }}
        ref={(el) => { messagesEnd = el; }}>
      </div>
    </div>
  );
};

export default History;
