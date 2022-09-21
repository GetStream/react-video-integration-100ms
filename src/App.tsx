import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
  useChannelStateContext,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import './App.css';
import MyChannelHeader from './MyChannelHeader/MyChannelHeader';

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
  const { channel } = useChannelStateContext();
  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <ChannelList filters={filters} />
      <Channel>
        <Window>
          <MyChannelHeader channelName={channel?.data?.name ?? 'Unknown'} />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;
