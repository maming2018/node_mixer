import React, { useState, useEffect } from 'react';
import axios from '../../Config/axios';

import ChannelsCont from '../../Containers/Channels/Channels'
import Loader from '../Loader/LoaderOne'

const Channels = props => {

  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    // console.log("USE EFFECT COMPONENT/CHANNELS.js");

    setIsLoading(true);

    axios.get('/channels').then(response => {
      // console.log("Response: ", response);
      setChannels(response.data);
    }).catch(error => {
      console.log("Error: ", error);
    }).then(function () {
      setIsLoading(false);
    });
  }, [props.someUpdate])

  return (
    <div>
      <h3>
        Channels
        <button className="btn btn-sm btn-dark" style={{ float: 'right' }} onClick={props.modalHandler}>Add New Channel</button>
      </h3>

      {
        isLoading === true ? <div className="mt-2"><Loader /></div> :
          <ChannelsCont currentChannel={props.currentChannel} channelClickHandler={props.channelClickHandler} channels={channels} />
      }
    </div>
  );
};

export default Channels;
