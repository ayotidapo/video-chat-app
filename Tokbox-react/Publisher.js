/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { OTPublisher } from 'opentok-react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { CheckBox } from './CheckBox';

export const Publisher = props => {
  const { broadcaster } = props;
  const [state, setState] = useState({
    error: null,
    audio: broadcaster ? true : null,
    video: broadcaster ? true : null,
    videoSource: 'camera',
  });
  const setAudio = audio => {
    setState({ ...state, audio });
  };

  const setVideo = video => {
    setState({ ...state, video });
  };

  const changeVideoSource = videoSource => {
    if (videoSource === 'camera') {
      setState({ ...state, videoSource: 'screen' });
    } else {
      setState({ ...state, videoSource: 'camera' });
    }
  };

  const onError = err => {
    setState({ ...state, error: `Failed to publish: ${err.message}` });
  };
  const { error, audio, video, videoSource } = state;
  return (
    <div
      className={classnames('publisherz', {
        hidez: !broadcaster,
      })}
    >
      Click this link to <Link to="/join-broadcast">Join</Link>
      {error && <div id="error">{error}</div>}
      <OTPublisher
        properties={{
          publishAudio: audio,
          publishVideo: video,
          videoSource: videoSource === 'screen' ? 'screen' : undefined,
        }}
        onError={onError}
      />
      {console.log(broadcaster)}
      {broadcaster && (
        <>
          <CheckBox label="Share Screen" onChange={changeVideoSource} />
          <CheckBox
            label="Publish Audio"
            initialChecked={audio}
            onChange={setAudio}
          />
          <CheckBox
            label="Publish Video"
            initialChecked={video}
            onChange={setVideo}
          />
        </>
      )}
    </div>
  );
};
