import * as Ably from 'ably';
import { ChatClient, ChatClientProvider, ChatRoomProvider, RoomOptionsDefaults } from '@ably/chat';
import { Messages } from './Messages';

// Initialize an Ably Realtime client, which we'll use to power the chat client
// Note: in production, you should use tokens for authentication, rather than a key.
const ablyClient = new Ably.Realtime({
  clientId: 'ably-chat',
  key: "NG-WuQ.Vu-PjQ:PobNc11IPxjtkjRtIvD2ElwE8fn_MzoT7VOy_Ji56gc"
});

// Create the chat client
const chatClient = new ChatClient(ablyClient, {});

// This an example App component that uses the chat client to power a chat UI. Your app will likely be
// much different to this.
// The ChatClientProvider provides the chat client to the underlying components and React hooks.
// The ChatRoomProvider provides the chat room to the underlying components and React hooks.
// For now, we're using the default room with some default options.
function App() {
  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id="getting-started" options={RoomOptionsDefaults}>
        <div>
          <Messages />
        </div>
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}

export default App;