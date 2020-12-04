/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from 'react';

const BroadcastView = () => {
  const videoRef = useRef();
  const videoSrcHls =
    'https://cdn-broadcast001-dub.tokbox.com/19875/19875_b4646caa-c4dc-4094-a1f2-fd38a1843f8a.smil/playlist.m3u8';
  // const videoSrcInMp4 = '';

  useEffect(() => {
    if (window.Hls.isSupported()) {
      const hls = new window.Hls();
      // console.log(hls);
      hls.loadSource(videoSrcHls);
      hls.attachMedia(videoRef.current);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src =
        'https://cdn-broadcast001-dub.tokbox.com/19875/19875_b4646caa-c4dc-4094-a1f2-fd38a1843f8a.smil/playlist.m3u8';
      videoRef.current.addEventListener('loadedmetadata', function() {
        videoRef.current.play();
      });
    }
  }, []);
  return (
    <>
      <video ref={videoRef} controls autoPlay style={{ width: '60%' }} />
    </>
  );
};

export default BroadcastView;
