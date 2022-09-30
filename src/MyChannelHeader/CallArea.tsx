import { ConnectionState } from '../context/VideoContext';
import './MyChannelHeader.css';

const buttonText = (connectionState: ConnectionState): string => {
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

interface CallAreaProps {
  connectionState: ConnectionState;
  onVideoButtonClick: () => void;
  endCall: () => void;
}

const CallArea = ({
  connectionState,
  onVideoButtonClick,
  endCall,
}: CallAreaProps) => {
  switch (connectionState) {
    case ConnectionState.NoCall:
    case ConnectionState.CallAvailable:
      return (
        <button
          className='call-button start-call-button'
          onClick={onVideoButtonClick}
        >
          {buttonText(connectionState)}
        </button>
      );
    case ConnectionState.Connecting:
    case ConnectionState.Disconnecting:
      return <p className='call-button'>{buttonText(connectionState)}</p>;
    case ConnectionState.InCall:
      return (
        <>
          <button
            className='call-button leave-call-button'
            onClick={onVideoButtonClick}
          >
            <p>{buttonText(connectionState)}</p>
          </button>
          <button className='call-button end-call-button' onClick={endCall}>
            <p>End call</p>
          </button>
        </>
      );
  }
};

export default CallArea;
