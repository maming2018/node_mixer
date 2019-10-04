import React from 'react';

import ChannelsCont from '../../Containers/Channels/Channels'

const Channels = props => {

  // https://mixer.com/api/v1/channels/VintageRoom?fields=id

  const channels = [
    { name: 'AustinNorman', id: '102582456' },
    { name: 'Babalon_Don', id: '23383288' },
    { name: 'Camara', id: '13905476' },
    { name: 'FadedTrack27157', id: '102729102' },
    { name: 'MoltenCupid7120', id: '102802767' },
    { name: 'VintageRoom', id: '53877114' },
  ];

  return (
    <div>
      <h3>Channels</h3>

      <ChannelsCont currentChannel={props.currentChannel} channelClickHandler={props.channelClickHandler} channels={channels} />
    </div>
  );
};

export default Channels;
