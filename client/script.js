/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
// replace these values with those generated in your TokBox Account

// (optional) add server code here

// window.initializeSession();

export function handleError(error) {
  if (error) {
    console.log(error.message);
  }
  return false;
}

export function initializeSession(
  publisherRef,
  subscriberRef,
  config,
  role = 'publisher',
) {
  const session = window.OT.initSession(config.apiKey, config.sessionId);
  console.log(session);
  let publisher;
  // const token = session.generateToken({
  //   role :                   'moderator',
  //   expireTime :             (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
  //   data :                   'name=Johnny',
  //   initialLayoutClassList : ['focus']
  // });
  // Connect to the session
  session.connect(config.token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      console.log(session);
      if (role === 'publisher') {
        session.publish(publisher, handleError);
      }
    }
  });

  // Create a publisher
  if (role === 'publisher') {
    publisher = window.OT.initPublisher(
      publisherRef,
      {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        // fitMode: 'cover',
      },
      handleError,
    );
  }
  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(
      event.stream,
      subscriberRef,
      {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        fitMode: 'cover',
      },
      handleError,
    );
  });

  //
  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });
}
