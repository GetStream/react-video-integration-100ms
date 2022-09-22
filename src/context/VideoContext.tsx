import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';

export enum ConnectionState {
  NoCall,
  CallAvailable,
  Connecting,
  InCall,
}

interface VideoState {
  connectionState: ConnectionState;
  createCall: () => void;
  joinCall: () => void;
  leaveCall: () => void;
  endCall: () => void;
}

const defaultState: VideoState = {
  connectionState: ConnectionState.NoCall,
  createCall: () => {},
  joinCall: () => {},
  leaveCall: () => {},
  endCall: () => {},
};

export const VideoContext = createContext<VideoState>(defaultState);

export const VideoContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectionState, setConnectionState] = useState(
    ConnectionState.NoCall
  );

  const store = {
    connectionState: connectionState,
    createCall: () => {},
    joinCall: () => {},
    leaveCall: () => {},
    endCall: () => {},
  };

  return (
    <VideoContext.Provider value={store}>{children}</VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);
