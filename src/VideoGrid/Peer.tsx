import { HMSPeer, useVideo } from '@100mslive/react-sdk';

const Peer = ({ peer }: { peer: HMSPeer }) => {
  const { videoRef } = useVideo({ trackId: peer.videoTrack });
  return (
    <div className='peer-container'>
      <video
        ref={videoRef}
        className={`peer-video ${peer.isLocal ? 'local' : ''}`}
        autoPlay
        playsInline
      />
      <p>
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </p>
    </div>
  );
};

export default Peer;
