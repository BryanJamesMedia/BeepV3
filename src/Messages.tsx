import { useEffect, useState } from 'react';
import { useMessages } from '@ably/chat';

// This is a simple chat component that uses the useMessages hook in Ably Chat to send and receive messages.
export function Messages() {
  const [messageText, setMessageText] = useState('Hello, Ably!');
  const { send } = useMessages();

  const handleSend = async () => {
    try {
      await send({ text: messageText });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // This is a very simple UI that displays the messages and a text input for sending messages.
  return (
    <div style={{
      maxWidth: '600px',
      minWidth: '400px',
      margin: '20px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Ably Chat Demo</h1>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}