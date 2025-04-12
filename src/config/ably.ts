import { Realtime } from 'ably';
import { ChatClient } from '@ably/chat';

if (!import.meta.env.VITE_ABLY_API_KEY) {
  throw new Error('Missing Ably API key');
}

const ablyClient = new Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY,
  clientId: crypto.randomUUID(), // We'll update this with the user's ID later
});

export const chatClient = new ChatClient(ablyClient); 