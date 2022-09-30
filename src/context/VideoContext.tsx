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
import { useHMSActions } from '@100mslive/react-sdk';
import { Event } from 'stream-chat';

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
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
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
      authToken: `${response.token}`,
      userName: client.user?.name || 'Unkown',
    });

    console.log('Updating channel');
    await channel.updatePartial({
      set: {
        data: {
          callActive: true,
          callId: response.call.id,
        },
      },
    });
  }, []);

  const joinCall = useCallback(async () => {
    setConnectionState(ConnectionState.Connecting);

    const response = await client.getCallToken(
      channel.data?.data?.callId as string
    );

    await hmsActions.join({
      authToken: `${response.token}`,
      userName: client.user?.name || 'Unkown',
    });

    setConnectionState(ConnectionState.InCall);
  }, []);

  const leaveCall = useCallback(async () => {
    setConnectionState(ConnectionState.Disconnecting);

    await hmsActions.leave();

    setConnectionState(ConnectionState.CallAvailable);
  }, []);

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
  }, []);

  useEffect(() => {
    const handleChannelUpdate = (event: Event) => {
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
      createCall: createCall,
      joinCall: joinCall,
      leaveCall: leaveCall,
      endCall: endCall,
    }),
    [connectionState]
  );

  return (
    <VideoContext.Provider value={store}>{children}</VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);
