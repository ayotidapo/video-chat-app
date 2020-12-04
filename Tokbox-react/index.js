/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { OTSession, OTStreams, preloadScript } from 'opentok-react';
import opentokConfig from 'config/opentok-config';
import ConnectionStatus from './ConnectionStatus';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import './tok.css';

const BroadcastPage = () => {
  const [error, setError] = useState(null);
  const { location } = window;
  const [connected, setConnected] = useState(false);
  //
  const sessionEvents = {
    sessionConnected: data => {
      setConnected(true);
      // alert('connected');
      // console.log(data);
    },
    sessionDisconnected: () => {
      setConnected(false);
      // alert('disconnected');
    },
  };

  const onError = err => {
    setError(`Failed to connect: ${err.message}`);
  };

  // useEffect(() => {
  //   const { location } = window;
  //   console.log(location);
  // }, []);

  return (
    <div>
      <OTSession
        apiKey={opentokConfig.API_KEY}
        sessionId={opentokConfig.SESSION_ID}
        token={opentokConfig.TOKEN}
        eventHandlers={sessionEvents}
        onError={onError}
      >
        {error && <div id="error">{error}</div>}
        <ConnectionStatus connected={connected} />
        <Publisher broadcaster={location.pathname === '/broadcast'} />
        <OTStreams>
          <Subscriber broadcaster={location.pathname === '/broadcast'} />
        </OTStreams>
      </OTSession>
    </div>
  );
};

export default preloadScript(BroadcastPage);
