import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import { Event, DefaultGenerics } from 'stream-chat';
import { useHMSActions } from '@100mslive/react-sdk';

export type StreamChatGenerics = {
  channelType: {
    data?: {
      callActive?: boolean;
      callId?: string;
    };
  };
} & Omit<DefaultGenerics, 'channelType'>;

export enum ConnectionState {
  NoCall,
  CallAvailable,
  Connecting,
  Disconnecting,
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
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const { client } = useChatContext<StreamChatGenerics>();
  const hmsActions = useHMSActions();

  const [connectionState, setConnectionState] = useState(
    channel.data?.data?.callActive
      ? ConnectionState.CallAvailable
      : ConnectionState.NoCall
  );

  const createCall = useCallback(async () => {
    setConnectionState(ConnectionState.Connecting);

    const response = await channel.createCall({
      id: `call-${channel.cid}`,
      type: 'video',
    });

    await hmsActions.join({
      authToken: response.token as string,
      userName: client.user?.name || 'Unkown',
    });

    console.log('Updating channel');
    await channel.updatePartial({
      set: {
        data: {
          callActive: true,
          callId: response.call.id as string,
        },
      },
    });
  }, [channel.cid]);

  const joinCall = useCallback(async () => {
    setConnectionState(ConnectionState.Connecting);

    const response = await client.getCallToken(
      channel.data?.data?.callId as string
    );

    await hmsActions.join({
      authToken: response.token as string,
      userName: client.user?.name || 'Unkown',
    });

    setConnectionState(ConnectionState.InCall);
  }, [channel.cid]);

  const leaveCall = useCallback(async () => {
    setConnectionState(ConnectionState.Disconnecting);

    await hmsActions.leave();

    setConnectionState(ConnectionState.CallAvailable);
  }, [channel.cid]);

  const endCall = useCallback(async () => {
    setConnectionState(ConnectionState.Disconnecting);

    await hmsActions.leave();

    await channel.updatePartial({
      set: {
        data: {
          callActive: false,
        },
      },
    });
  }, [channel.cid]);

  useEffect(() => {
    const handleChannelUpdate = (event: Event<StreamChatGenerics>) => {
      if (event.channel?.data?.callActive) {
        console.log('[handleChannelUpdate] call is active');
        if (connectionState === ConnectionState.NoCall) {
          console.log('[handleChannelUpdate] NoCall active');

          setConnectionState(ConnectionState.CallAvailable);
        } else if (connectionState === ConnectionState.Connecting) {
          console.log('[handleChannelUpdate] Connecting');

          setConnectionState(ConnectionState.InCall);
        }
      } else {
        setConnectionState(ConnectionState.NoCall);
      }
    };

    client.on('channel.updated', handleChannelUpdate);

    return () => {
      client.off('channel.updated', handleChannelUpdate);
    };
  }, [connectionState]);

  useEffect(
    () => () => {
      hmsActions.leave();
    },
    []
  );

  const store = useMemo(
    () => ({
      connectionState,
      createCall,
      joinCall,
      leaveCall,
      endCall,
    }),
    [connectionState, createCall, joinCall, leaveCall, endCall]
  );

  return (
    <VideoContext.Provider value={store}>{children}</VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);
