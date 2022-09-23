import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import { ConnectionState, useVideoContext } from '../context/VideoContext';
import Peer from './Peer';

import './VideoGrid.css';

const VideoGrid = () => {
  const { connectionState } = useVideoContext();
  const peers = useHMSStore(selectPeers);
  return (
    <>
      {connectionState == ConnectionState.InCall && (
        <div className='video-grid'>
          {peers.map((peer) => (
            <Peer key={peer.id} peer={peer} />
          ))}
        </div>
      )}
    </>
  );
};

export default VideoGrid;
