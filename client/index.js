/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import OpenTok from 'opentok';
// import axios from 'axios';
import history from 'helpers/history';
import { API_KEY, SECRET_KEY, BroadcastAxios } from 'config/axiosInstance';
import { initializeSession, handleError } from './script';

import './sty.css';

const opentok = new OpenTok(API_KEY, SECRET_KEY);

const url = window.location.href;
const channel = history.location.pathname.split('/')[2]; // sessionID

const Tokbox = () => {
  const publisherRef = useRef();
  const subscriberRef = useRef();
  const broadcastId = null;
  const [sessionID, setSessionID] = useState(channel);
  const [isbroadcaster, setIsbroadcaster] = useState(true); // initiate to broadcaster

  const broadcastFunc = async body => {
    try {
      const res = await BroadcastAxios.post('/broadcast', body);
      return {
        success: true,
        res,
      };
    } catch (err) {
      // console.log(err);
      return {
        success: false,
        err,
      };
    }
  };
  const handleError = error => {
    if (error) {
      // console.log(error.message);
    }
    return false;
  };
  useEffect(() => {
    const session = window.OT.initSession(
      API_KEY,
      '1_MX40NjQ2NzQ2Mn5-MTU3ODY1NjQ0MjQyNn42ZXgxbXRISExMQmYzZDV5ZEUxdExsTzl-fg',
    );
    const token =
      'T1==cGFydG5lcl9pZD00NjQ2NzQ2MiZzaWc9MWI5N2VkOGJjMzMwOThjZGM4NmQ4YzkzZTJlY2UwNmRiY2Y4ZDE2ZTpzZXNzaW9uX2lkPTFfTVg0ME5qUTJOelEyTW41LU1UVTNPRFkxTmpRME1qUXlObjQyWlhneGJYUklTRXhNUW1ZelpEVjVaRVV4ZEV4c1R6bC1mZyZjcmVhdGVfdGltZT0xNTc4NjU2NDQzJm5vbmNlPTAuOTY5NjYyMzc3NTIxNDU0MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTc4NzQyODQzJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
    const publisher = window.OT.initPublisher(null, {
      insertMode: 'append',
      width: '60%',
      height: '75%',
      fitMode: 'cover',
    });
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        // console.log(session);

        session.publish(publisher, handleError);
      }
    });
    // if (sessionID) {
    //   const tokenOptions = {};
    //   tokenOptions.role = 'subscriber';
    //   const role = 'subscriber';
    //   setIsbroadcaster(false);
    //   // tokenOptions.data = 'username=bob';
    //   const token = opentok.generateToken(sessionID, tokenOptions);
    //   console.log(token);
    //   const config = { apiKey: API_KEY, sessionId: sessionID, token };
    //   initializeSession(publisherRef, subscriberRef, config, role);
    //   return;
    // }
    // opentok.createSession({ mediaMode: 'routed' }, function(error, session) {
    //   if (error) {
    //     console.log('Error creating session:', error);
    //   } else {
    //     const { sessionId } = session;
    //     // const token = opentok.generateToken(sessionId);
    //     // const body = {
    //     //   sessionId,
    //     //   outputs: { hls: {} },
    //     // };
    //     // const resPayload = broadcastFunc(body);
    //     // console.log(resPayload);
    //     // const config = { apiKey: API_KEY, sessionId, token };
    //     setSessionID(sessionId);
    //     console.log(sessionId);
    //     // initializeSession(publisherRef, subscriberRef, config);
    //   }
    // });
    // const SERVER_BASE_URL = 'https://open-webinar-koya1.herokuapp.com';
    // window
    //   .fetch(`${SERVER_BASE_URL}/session`)
    //   .then(function(res) {
    //     return res.json();
    //   })
    //   .then(function(res) {
    //     const config = {
    //       apiKey: res.apiKey,
    //       sessionId: res.sessionId,
    //       token: res.token,
    //     };
    //     initializeSession(publisherRef, subscriberRef, config);
    //     console.log(config);
    //   })
    //   .catch(handleError);
  }, []);

  const startToBroadcast = () => {
    // const session = window.OT.initSession(API_KEY, config.sessionId);
  };

  return (
    <>
      {isbroadcaster && (
        <p style={{ marginTop: '10px' }}>
          Copy this link{' '}
          <em className="hand" style={{ color: 'blue' }}>
            {sessionID && `${url}/${sessionID}`}
          </em>{' '}
          and send to student to join{' '}
        </p>
      )}
      <div className="videos1">
        <div className="subscriberDiv" ref={subscriberRef} />
        <div className="publisherDiv" ref={publisherRef} />
      </div>
      <button onClick={startToBroadcast}>Start Broadcast</button>
    </>
  );
};
export default Tokbox;
