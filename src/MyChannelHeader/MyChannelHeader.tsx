// import { useVideoContext } from '../VideoContext/VideoContext';
import { useState } from 'react';
import { ConnectionState } from '../context/VideoContext';
import './MyChannelHeader.css';

interface MyChannelHeaderProps {
  channelName: string;
}

const MyChannelHeader = ({ channelName }: MyChannelHeaderProps) => {
  //   const { videoActive, callOngoing, createCall, joinCall, leaveCall, endCall } =
  //     useVideoContext();
  const [videoState, setVideoState] = useState(ConnectionState.NoCall);

  const endCall = () => {};
  const joinCall = () => {};
  const createCall = () => {};
  const leaveCall = () => {};

  const onVideoButtonClick = () => {
    switch (videoState) {
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

  const isVideoActive = (): boolean => {
    switch (videoState) {
      case ConnectionState.NoCall:
      case ConnectionState.CallAvailable:
        return false;
      case ConnectionState.Connecting:
      case ConnectionState.InCall:
        return true;
    }
  };

  const buttonText = (): string => {
    switch (videoState) {
      case ConnectionState.NoCall:
        return 'Create call';
      case ConnectionState.CallAvailable:
        return 'Join call';
      case ConnectionState.Connecting:
        return 'Connecting';
      case ConnectionState.InCall:
        return 'Leave Call';
    }
  };

  return (
    <div className='custom-header'>
      <h2>{channelName}</h2>
      <div className='button-area'>
        <button
          className={`call-button ${
            isVideoActive() ? 'leave-call-button' : 'start-call-button'
          }`}
          onClick={onVideoButtonClick}
        >
          <p>{buttonText()}</p>
        </button>
        {videoState == ConnectionState.InCall && (
          <button className='call-button end-call-button' onClick={endCall}>
            <p>End call</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default MyChannelHeader;
