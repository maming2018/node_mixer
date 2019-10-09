import React from 'react';
import OauthPopup from 'react-oauth-popup';

const ComponentName = props => {

  const onCode = (code) => console.log("wooooo a code", code);

  return (
    <OauthPopup
      url="https://mixer.com/oauth/authorize?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=chat:connect&client_id=e31e62c385128098f25cb1e703afbcba381a6a61e3ed62c3"
      onCode={onCode} width="600px"
    >
      <div>Click me to open a Popup</div>
    </OauthPopup>
  );
};

export default ComponentName;
