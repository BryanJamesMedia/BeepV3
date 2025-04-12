// Create this file to declare global types
declare module '@ably/chat';

// This lets TypeScript be more permissive during the build
interface Window {
  [key: string]: any;
} 