/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { OTSubscriber } from 'opentok-react';
import classnames from 'classnames';
import { CheckBox } from './CheckBox';

export const Subscriber = props => {
  const { broadcaster } = props;
  const [state, setState] = useState({
    error: null,
    audio: broadcaster ? null : true,
    video: broadcaster ? null : true,
  });

  const setAudio = audio => {
    setState({ ...state, audio });
  };

  const setVideo = video => {
    setState({ ...state, video });
  };

  const onError = err => {
    setState({ ...state, error: `Failed to subscribe: ${err.message}` });
  };

  return (
    <div
      className={classnames('subscriberz', {
        hidez: broadcaster,
      })}
    >
      Subscriber
      {state.error && <div id="error">{state.error}</div>}
      <OTSubscriber
        properties={{
          subscribeToAudio: state.audio,
          subscribeToVideo: state.video,
        }}
        onError={onError}
      />
      {false && (
        <>
          <CheckBox
            label="Subscribe to Audio"
            initialChecked={state.audio}
            onChange={setAudio}
          />
          <CheckBox
            label="Subscribe to Video"
            initialChecked={state.video}
            onChange={setVideo}
          />
        </>
      )}
    </div>
  );
};
