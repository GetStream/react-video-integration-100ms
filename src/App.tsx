import { HMSRoomProvider } from '@100mslive/react-sdk';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import './App.css';
import { VideoContextProvider } from './context/VideoContext';
import MyChannelHeader from './MyChannelHeader/MyChannelHeader';
import VideoGrid from './VideoGrid/VideoGrid';

// -- Constants
const chatClientId = 'bwyj74v5hxzk';
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiVGVzdHVzZXIifQ.6P8dNLeAmJKvv4pwcohtNekdW_c7uregc5bv2pNJe-M';
const userId = 'Testuser';
const userName = 'Testuser';
const imagePath =
  'https://getstream.io/random_png/?id=lucky-snowflake-1&name=lucky-snowflake-1';
// -----------

const chatClient = new StreamChat(chatClientId);

chatClient.connectUser(
  {
    id: userId,
    name: userName,
    image: imagePath,
  },
  userToken
);

const filters = { type: 'messaging', members: { $in: [userId] } };

const App = () => {
  return (
    <HMSRoomProvider>
      <Chat client={chatClient} theme='str-chat__theme-light'>
        <ChannelList filters={filters} />
        <Channel>
          <VideoContextProvider>
            <Window>
              <MyChannelHeader />
              <VideoGrid />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </VideoContextProvider>
        </Channel>
      </Chat>
    </HMSRoomProvider>
  );
};

export default App;
