// import { useVideoContext } from '../VideoContext/VideoContext';
import { ReactNode } from 'react';
import { useChannelStateContext } from 'stream-chat-react';
import { ConnectionState, useVideoContext } from '../context/VideoContext';
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

  const callArea = (): ReactNode => {
    switch (connectionState) {
      case ConnectionState.NoCall:
      case ConnectionState.CallAvailable:
        return (
          <button
            className='call-button start-call-button'
            onClick={onVideoButtonClick}
          >
            {buttonText()}
          </button>
        );
      case ConnectionState.Connecting:
      case ConnectionState.Disconnecting:
        return <p className='call-button'>{buttonText()}</p>;
      case ConnectionState.InCall:
        return (
          <>
            <button
              className='call-button leave-call-button'
              onClick={onVideoButtonClick}
            >
              <p>{buttonText()}</p>
            </button>
            <button className='call-button end-call-button' onClick={endCall}>
              <p>End call</p>
            </button>
          </>
        );
    }
  };

  const buttonText = (): string => {
    switch (connectionState) {
      case ConnectionState.NoCall:
        return 'Create call';
      case ConnectionState.CallAvailable:
        return 'Join call';
      case ConnectionState.Connecting:
        return 'Connecting';
      case ConnectionState.Disconnecting:
        return 'Disconnecting';
      case ConnectionState.InCall:
        return 'Leave Call';
    }
  };

  return (
    <div className='custom-header'>
      <h2>{channel?.data?.name ?? 'Unknown'}</h2>
      <div className='button-area'>{callArea()}</div>
    </div>
  );
};

export default MyChannelHeader;
