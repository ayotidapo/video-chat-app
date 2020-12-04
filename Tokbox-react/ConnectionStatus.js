import React from 'react';

const ConnectionStatus = props => {
  const status = props.connected ? 'Connected' : 'Disconnected';

  return (
    <div className="connectionStatus">
      <strong style={{ pointerEvents: 'none' }}>Status1:</strong> {status}
    </div>
  );
};
export default ConnectionStatus;
