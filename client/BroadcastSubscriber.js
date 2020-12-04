import React, { useRef } from 'react';
import { API_KEY, SECRET_KEY } from 'config/axiosInstance';
import OpenTok from 'opentok';

const opentok = new OpenTok(API_KEY, SECRET_KEY);

const BroadcastSubcriber = () => {
  const publisherRef = useRef();
  const subscriberRef = useRef();
  const sessionId =
    '2_MX40NjQ2NzQ2Mn5-MTU3ODY0MTIxMjA4Nn4wS2M4RGZaRHAxV1BXTVpLZFFXR2xlWlN-fg';
  const session = window.OT.initSession(API_KEY, sessionId);
  const tokenOptions = { role: 'subscriber' };
  const token = opentok.generateToken(sessionId, tokenOptions);

  const handleError = error => {
    if (error) {
      // console.log(error.message);
    }
    return false;
  };

  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      // console.log(session);
    }
  });
  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(
      event.stream,
      null,
      {
        insertMode: 'append',
        width: '60%',
        height: '70%',
        fitMode: 'cover',
      },
      handleError,
    );
  });

  return (
    <div className="videos">
      <div className="subscriber" ref={subscriberRef} />
      <div className="publisher" ref={publisherRef} />
    </div>
  );
};

export default BroadcastSubcriber;
