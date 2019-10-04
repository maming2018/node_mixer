import React from 'react';

const Channels = props => {


  return (
    <div>
      <ul className="list-group">
        {props.channels.map((channel, key) => {
          let isActive = '';
          if(props.currentChannel === channel.id) {
            isActive = ' active'
          }
          return <li className={`list-group-item cursorPointer ${isActive}`} key={key} onClick={() => props.channelClickHandler(channel.id)}>{channel.name}</li>
        })}
      </ul>

    </div>
  );
};

export default Channels;
