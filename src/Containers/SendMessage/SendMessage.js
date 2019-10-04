import React from 'react';

const SendMessage = props => {
  return (
    <div className="input-group mb-3">
      <input type="text" className="form-control" placeholder="Type message here" aria-label="Recipient's username" aria-describedby="button-addon2" />
      <div className="input-group-append">
        <button className="btn btn-secondary" type="button" id="button-addon2">Send</button>
      </div>
    </div>
  );
};

export default SendMessage;
