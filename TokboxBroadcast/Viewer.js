/* eslint-disable import/prefer-default-export */
import React from 'react';
// import viewer_js
export const Viewer = () => {
  return (
    <>
      <div id="main" className="main-container">
        <div id="banner" className="banner">
          <span id="bannerText" className="text">
            Waiting for Broadcast to Begin
          </span>
        </div>
        <div id="videoContainer" className="video-container">
          <div id="hostDivider" className="hidden" />
        </div>
      </div>
    </>
  );
};
