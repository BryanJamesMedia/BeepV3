// This is a simplified type definition for Ably Chat

declare module '@ably/chat' {
  interface Message {
    id: string;
    content: string;
    sender: {
      id: string;
      name?: string;
    };
    timestamp: number;
  }

  interface Room {
    id: string;
    name: string;
    subscribe(callback: (message: Message) => void): Promise<void>;
    publish(message: string): Promise<void>;
  }

  interface ChatClient {
    connect(): Promise<void>;
    getRoom(id: string): Promise<Room>;
    destroy(): Promise<void>;
  }

  export function createChatClient(options: any): ChatClient;
} 