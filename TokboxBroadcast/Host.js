/* eslint-disable import/prefer-default-export */
import React, { useRef, useEffect } from 'react';
import http from 'util/http';
import hostFunction from './host_';

export const Host = () => {
  const hostDividerRef = useRef();
  const credentialsRef = useRef();
  const startStopRef = useRef();
  const urlContainerRef = useRef();
  const broadcastURLRef = useRef();
  const rtmpActiveRef = useRef();
  const rtmpLabelRef = useRef();
  const rtmpErrorRef = useRef();
  const copyNoticeRef = useRef();
  const rtmpServerRef = useRef();
  const rtmpStreamRef = useRef();
  const videoContainerRef = useRef();
  const copyURLRef = useRef();
  // const publishVideoRef = useRef();
  //   useEffect(() => {
  //     const SERVER_BASE_URL = 'https://open-webinar-koya1.herokuapp.com';
  //     window
  //       .fetch(`${SERVER_BASE_URL}/session`)
  //       .then(function(res) {
  //         return res.json();
  //       })
  //       .then(function(res) {
  //         const config = {
  //           apiKey: res.apiKey,
  //           sessionId: res.sessionId,
  //           token: res.token,
  //         };

  //         initializeSession(publisherRef, subscriberRef, config);
  //       })
  //       .catch(handleError);
  //   }, []);
  useEffect(() => {
    http();
    hostFunction(
      hostDividerRef,
      credentialsRef,
      startStopRef,
      urlContainerRef,
      broadcastURLRef,
      rtmpActiveRef,
      rtmpLabelRef,
      rtmpErrorRef,
      copyNoticeRef,
      rtmpServerRef,
      rtmpStreamRef,
      videoContainerRef,
      copyURLRef,
      // publishVideoRef
    );
  }, []);

  return (
    <>
      <div
        id="credentials"
        ref={credentialsRef}
        style={{ display: 'none' }}
        data-api-key="46467462"
        data-api-secret="3f50c31946c430678d79185d0b527b060d94b915"
      />
      <div id="main" className="main-container">
        <div
          id="videoContainer"
          ref={videoContainerRef}
          className="video-container"
        >
          <div id="hostDivider" ref={hostDividerRef} className="hidden" />
        </div>
      </div>
      <div className="broadcast-controls-container">
        <div className="rtmp-container">
          <span id="rtmpLabel" ref={rtmpLabelRef}>
            Want to stream to YouTube Live or Facebook Live? Add your RTMP
            Server URL and Stream Name:
          </span>
          <span className="hidden error" id="rtmpError" ref={rtmpErrorRef}>
            The entered RTMP server and/or stream name are not valid. Please
            check the url and try again.
          </span>
          <span id="rtmpActive" ref={rtmpActiveRef} className="hidden active">
            Your RTMP stream is active!
          </span>
          <div id="rtmpInputContainer" className="input-container">
            <input
              id="rtmpServer"
              ref={rtmpServerRef}
              type="url"
              placeholder="rtmp://myrtmpserver/mybroadcastapp"
            />
            <input
              id="rtmpStream"
              ref={rtmpStreamRef}
              type="text"
              placeholder="myStreamName"
            />
          </div>
        </div>
        <button
          id="startStop"
          ref={startStopRef}
          className="btn-broadcast hidden"
        >
          Start Broadcast
        </button>
        <div
          id="urlContainer"
          ref={urlContainerRef}
          className="url-container hidden"
        >
          <div
            id="broadcastURL"
            ref={broadcastURLRef}
            className="opacity-0 no-show"
          />
          <div
            id="copyURL"
            ref={copyURLRef}
            className="copy-link"
            data-clipboard-target="#broadcastURL"
          >
            <span>Get sharable HLS link</span>
          </div>
          <div id="copyNotice" className="tooltip copy opacity-0">
            <span>Link copied to clipboard!</span>
            <span className="triangle-down">▼</span>
          </div>
        </div>
      </div>
    </>
  );
};
