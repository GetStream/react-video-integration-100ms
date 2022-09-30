import { useChannelStateContext } from 'stream-chat-react';
import { ConnectionState, useVideoContext } from '../context/VideoContext';
import CallArea from './CallArea';
import './MyChannelHeader.css';

const MyChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const { connectionState, createCall, joinCall, leaveCall, endCall } =
    useVideoContext();

  const onVideoButtonClick = () => {
    switch (connectionState) {
      case ConnectionState.NoCall:
        createCall();
        break;
      case ConnectionState.CallAvailable:
        joinCall();
        break;
      case ConnectionState.InCall:
        leaveCall();
        break;
    }
  };

  return (
    <div className='custom-header'>
      <h2>{channel?.data?.name || 'Unknown'}</h2>
      <div className='button-area'>
        <CallArea
          connectionState={connectionState}
          onVideoButtonClick={onVideoButtonClick}
          endCall={endCall}
        />
      </div>
    </div>
  );
};

export default MyChannelHeader;
