/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* global analytics http Clipboard */
/* eslint-disable object-shorthand */
/* eslint-disable vars-on-top */

export default function(
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
) {
  /** The state of things */
  let broadcast = { status: 'waiting', streams: 1, rtmp: false };
  const el = credentialsRef;
  // const dataSet = el.current.dataset;

  //   const credentials = {
  //     apiKey: dataSet.apiKey,
  //     apiSecret: dataSet.apiSecret,
  //   };
  //   console.log(credentials);
  /**
   * Options for adding OpenTok publisher and subscriber video elements
   */
  const insertOptions = {
    width: '100%',
    height: '100%',
    showControls: false,
  };

  /**
   * Get our OpenTok http Key, Session ID, and Token from the JSON embedded
   * in the HTML.
   */
  //   const getCredentials = function() {
  //     const el = credentialsRef;

  //     const credentials = JSON.parse(el.current.getAttribute('data'));
  //     el.remove();
  //     return credentials;
  //   };
  const getCredentials = function() {
    const el = credentialsRef;
    const dataSet = el.current.dataset;

    const credentials = {
      apiKey: dataSet.apiKey,
      apiSecret: dataSet.apiSecret,
    };
    el.remove();
    return credentials;
  };
  /**
   * Create an OpenTok publisher object
   */
  const initPublisher = function() {
    const properties = {
      name: 'Host',
      insertMode: 'before',
      ...insertOptions,
    };
    return window.OT.initPublisher(hostDividerRef, properties);
  };

  /**
   * Send the broadcast status to everyone connected to the session using
   * the OpenTok signaling API
   * @param {Object} session
   * @param {String} status
   * @param {Object} [to] - An OpenTok connection object
   */
  const signal = function(session, status, to) {
    const signalData = {
      type: 'broadcast',
      data: status,
      ...(to ? { to } : {}),
    };
    session.signal(signalData, function(error) {
      if (error) {
        console.log(
          ['signal error (', error.code, '): ', error.message].join(''),
        );
      } else {
        console.log('signal sent');
      }
    });
  };

  /**
   * Construct the url for viewers to view the broadcast stream
   * @param {Object} params
   * @param {String} params.url The CDN url for the m3u8 video stream
   * @param {Number} params.availableAt The time (ms since epoch) at which the stream is available
   */
  const getBroadcastUrl = function(params) {
    const buildQueryString = function(query, key) {
      return [query, key, '=', params[key], '&'].join('');
    };

    const queryString = window.R.reduce(
      buildQueryString,
      '?',
      window.R.keys(params),
    ).slice(0, -1);

    return [window.location.host, '/broadcast', queryString].join('');
  };

  /**
   * Set the state of the broadcast and update the UI
   */
  const updateStatus = function(session, status) {
    const startStopButton = startStopRef;
    const playerUrl = getBroadcastUrl(
      window.R.pick(['url', 'availableAt'], broadcast),
    );

    const displayUrl = broadcastURLRef;
    const rtmpActive = rtmpActiveRef;

    broadcast.status = status;

    if (status === 'active') {
      startStopButton.current.classList.add('active');
      startStopButton.current.innerHTML = 'End Broadcast';
      urlContainerRef.current.classList.remove('hidden');
      displayUrl.current.innerHTML = playerUrl;
      displayUrl.current.setAttribute('value', playerUrl);
      if (broadcast.rtmp) {
        rtmpActive.current.classList.remove('hidden');
      }
    } else {
      startStopButton.current.classList.remove('active');
      startStopButton.current.innerHTML = 'Broadcast Over';
      startStopButton.current.disabled = true;
      rtmpActive.current.classList.add('hidden');
    }

    signal(session, broadcast.status);
  };

  // Let the user know that the url has been copied to the clipboard
  const showCopiedNotice = function() {
    const notice = copyNoticeRef;
    notice.current.classList.remove('opacity-0');
    setTimeout(function() {
      notice.classList.add('opacity-0');
    }, 1500);
  };

  const validRtmp = function() {
    const server = rtmpServerRef;
    const stream = rtmpStreamRef;

    const serverDefined = !!server.current.value;
    const streamDefined = !!stream.current.value;
    const invalidServerMessage =
      'The RTMP server url is invalid. Please update the value and try again.';
    const invalidStreamMessage =
      'The RTMP stream name must be defined. Please update the value and try again.';

    if (serverDefined && !server.checkValidity()) {
      rtmpLabelRef.current.classList.add('hidden');
      rtmpErrorRef.current.innerHTML = invalidServerMessage;
      rtmpErrorRef.current.classList.remove('hidden');
      return null;
    }

    if (serverDefined && !streamDefined) {
      rtmpLabelRef.current.classList.add('hidden');
      rtmpErrorRef.current.innerHTML = invalidStreamMessage;
      rtmpErrorRef.classList.remove('hidden');
      return null;
    }

    rtmpLabelRef.current.classList.remove('hidden');
    rtmpErrorRef.current.classList.add('hidden');
    return { serverUrl: server.value, streamName: stream.value };
  };

  const hideRtmpInput = function() {
    [rtmpLabelRef, rtmpErrorRef, rtmpServerRef, rtmpStreamRef].forEach(function(
      ref,
    ) {
      ref.current.classList.add('hidden');
    });
  };

  /**
   * Make a request to the server to start the broadcast
   * @param {String} sessionId
   */
  const startBroadcast = function(session) {
    analytics.log('startBroadcast', 'variationAttempt');

    const rtmp = validRtmp();
    if (!rtmp) {
      analytics.log('startBroadcast', 'variationError');
      return;
    }

    hideRtmpInput();
    http
      .post('/broadcast/start', {
        sessionId: session.sessionId,
        streams: broadcast.streams,
        rtmp: rtmp,
      })
      .then(function(broadcastData) {
        broadcast = window.R.merge(broadcast, broadcastData);
        updateStatus(session, 'active');
        analytics.log('startBroadcast', 'variationSuccess');
      })
      .catch(function(error) {
        console.log(error);
        analytics.log('startBroadcast', 'variationError');
      });
  };

  /**
   * Make a request to the server to stop the broadcast
   * @param {String} sessionId
   */
  const endBroadcast = function(session) {
    http
      .post('/broadcast/end')
      .then(function() {
        updateStatus(session, 'ended');
        analytics.log('endBroadcast', 'variationSuccess');
      })
      .catch(function(error) {
        console.log(error);
        analytics.log('endBroadcast', 'variationError');
      });
  };

  /**
   * Subscribe to a stream
   */
  const subscribe = function(session, stream) {
    const properties = {
      name: 'Guest',
      insertMode: 'after',
      ...insertOptions,
    };
    session.subscribe(stream, 'hostDivider', properties, function(error) {
      if (error) {
        console.log(error);
      }
    });
  };

  /**
   * Toggle publishing audio/video to allow host to mute
   * their video (publishVideo) or audio (publishAudio)
   * @param {Object} publisher The OpenTok publisher object
   * @param {Object} el The DOM element of the control whose id corresponds to the action
   */
  const toggleMedia = function(publisher, el) {
    const enabled = el.classList.contains('disabled');
    el.classList.toggle('disabled');
    publisher[el.id](enabled);
  };

  const updateBroadcastLayout = function() {
    http
      .post('/broadcast/layout', { streams: broadcast.streams })
      .then(function(result) {
        console.log(result);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const setEventListeners = function(session, publisher) {
    // Add click handler to the start/stop button
    const startStopButton = startStopRef;
    startStopButton.current.classList.remove('hidden');
    startStopButton.current.addEventListener('click', function() {
      // alert(23);
      if (broadcast.status === 'waiting') {
        startBroadcast(session);
      } else if (broadcast.status === 'active') {
        endBroadcast(session);
      }
    });

    // Subscribe to new streams as they're published
    session.on('streamCreated', function(event) {
      const currentStreams = broadcast.streams;
      subscribe(session, event.stream);
      broadcast.streams++;
      if (broadcast.streams > 3) {
        videoContainerRef.current.classList.add('wrap');
        if (broadcast.status === 'active' && currentStreams <= 3) {
          updateBroadcastLayout();
        }
      }
    });

    session.on('streamDestroyed', function() {
      const currentStreams = broadcast.streams;
      broadcast.streams--;
      if (broadcast.streams < 4) {
        videoContainerRef.current.classList.remove('wrap');
        if (broadcast.status === 'active' && currentStreams >= 4) {
          updateBroadcastLayout();
        }
      }
    });

    // Signal the status of the broadcast when requested
    session.on('signal:broadcast', function(event) {
      if (event.data === 'status') {
        signal(session, broadcast.status, event.from);
      }
    });

    copyURLRef.current.addEventListener('click', function() {
      showCopiedNotice();
    });

    document
      .getElementById('publishVideo')
      .addEventListener('click', function() {
        toggleMedia(publisher, this);
      });

    document
      .getElementById('publishAudio')
      .addEventListener('click', function() {
        toggleMedia(publisher, this);
      });
  };

  const addPublisherControls = function(publisher) {
    const publisherContainer = document.getElementById(publisher.element.id);
    const el = document.createElement('div');
    const controls = [
      '<div class="publisher-controls-container">',
      '<div id="publishVideo" class="control video-control"></div>',
      '<div id="publishAudio" class="control audio-control"></div>',
      '</div>',
    ].join('\n');
    el.innerHTML = controls;
    publisherContainer.appendChild(el.firstChild);
  };

  /**
   * The host starts publishing and signals everyone else connected to the
   * session so that they can start publishing and/or subscribing.
   * @param {Object} session The OpenTok session
   * @param {Object} publisher The OpenTok publisher object
   */
  const publishAndSubscribe = function(session, publisher) {
    session.publish(publisher);
    addPublisherControls(publisher);
    setEventListeners(session, publisher);
  };

  const init = function() {
    const clipboard = new Clipboard('#copyURL'); // eslint-disable-line no-unused-vars
    const credentials = getCredentials();
    const props = { connectionEventsSuppressed: true };
    const session = window.OT.initSession(
      credentials.apiKey,
      credentials.sessionId,
      props,
    );
    const publisher = initPublisher();

    session.connect(credentials.token, function(error) {
      if (error) {
        console.log(error);
        analytics.init(session);
        analytics.log('initialize', 'variationAttempt');
        analytics.log('initialize', 'variationError');
      } else {
        publishAndSubscribe(session, publisher);
        analytics.init(session);
        analytics.log('initialize', 'variationAttempt');
        analytics.log('initialize', 'variationSuccess');
      }
    });
  };

  document.addEventListener('DOMContentLoaded', init);
}
