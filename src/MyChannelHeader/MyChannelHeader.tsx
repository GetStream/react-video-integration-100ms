// import { useVideoContext } from '../VideoContext/VideoContext';
import { useState } from 'react';
import './MyChannelHeader.css';

interface MyChannelHeaderProps {
  channelName: string;
}

enum VideoState {
  NoCall,
  CallAvailable,
  Connecting,
  InCall,
}

const MyChannelHeader = ({ channelName }: MyChannelHeaderProps) => {
  //   const { videoActive, callOngoing, createCall, joinCall, leaveCall, endCall } =
  //     useVideoContext();
  const [videoState, setVideoState] = useState(VideoState.NoCall);

  const endCall = () => {};
  const joinCall = () => {};
  const createCall = () => {};
  const leaveCall = () => {};

  const onVideoButtonClick = () => {
    switch (videoState) {
      case VideoState.NoCall:
        createCall();
        break;
      case VideoState.CallAvailable:
        joinCall();
        break;
      case VideoState.InCall:
        leaveCall();
        break;
    }
  };

  const isVideoActive = (): boolean => {
    switch (videoState) {
      case VideoState.NoCall:
      case VideoState.CallAvailable:
        return false;
      case VideoState.Connecting:
      case VideoState.InCall:
        return true;
    }
  };

  const buttonText = (): string => {
    switch (videoState) {
      case VideoState.NoCall:
        return 'Create call';
      case VideoState.CallAvailable:
        return 'Join call';
      case VideoState.Connecting:
        return 'Connecting';
      case VideoState.InCall:
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
        {videoState == VideoState.InCall && (
          <button className='call-button end-call-button' onClick={endCall}>
            <p>End call</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default MyChannelHeader;
