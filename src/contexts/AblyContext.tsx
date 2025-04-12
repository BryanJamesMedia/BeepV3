import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Ably from 'ably';
import { ChatClient } from '@ably/chat';
import { supabase } from '../config/supabase';

interface AblyContextType {
  chatClient: ChatClient | null;
  isConnected: boolean;
}

const AblyContext = createContext<AblyContextType>({
  chatClient: null,
  isConnected: false,
});

export const useAbly = () => useContext(AblyContext);

export function AblyProvider({ children }: { children: React.ReactNode }) {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    let ablyInstance: Ably.Realtime | null = null;
    let chatInstance: ChatClient | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    const setupAbly = async () => {
      try {
        // Clear any previous errors
        setConnectionError(null);
        
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Setting up Ably with user ID:', session.user.id);
          
          // Initialize Ably with autoConnect option
          ablyInstance = new Ably.Realtime({
            key: import.meta.env.VITE_ABLY_API_KEY,
            clientId: session.user.id,
            autoConnect: true
          });

          console.log('Ably instance created, connection state:', ablyInstance.connection.state);

          // Listen for all connection state changes
          ablyInstance.connection.on((stateChange: Ably.ConnectionStateChange) => {
            console.log('Ably connection state changed:', stateChange.current);
            
            if (stateChange.current === 'connected') {
              setIsConnected(true);
              reconnectAttempts = 0; // Reset attempts on successful connection
            } else if (['disconnected', 'suspended', 'closed', 'failed'].includes(stateChange.current)) {
              setIsConnected(false);
              
              if (stateChange.reason) {
                console.error('Ably connection issue:', stateChange.reason.message);
                setConnectionError(stateChange.reason.message);
              }
            }
          });

          // Wait for the Ably connection to be established
          await new Promise<void>((resolve, reject) => {
            ablyInstance?.connection.once('connected', () => {
              console.log('Ably connection established');
              resolve();
            });
            
            ablyInstance?.connection.once('failed', (err) => {
              console.error('Ably connection failed:', err);
              reject(new Error(`Ably connection failed: ${err}`));
            });
            
            // If already connected, resolve immediately
            if (ablyInstance?.connection.state === 'connected') {
              console.log('Ably already connected');
              resolve();
            }
            
            // Set a timeout to avoid waiting forever
            const timeout = setTimeout(() => {
              console.error('Ably connection timed out');
              reject(new Error('Ably connection timeout'));
            }, 10000);
            
            return () => clearTimeout(timeout);
          });

          // Initialize Chat Client after connection is established
          try {
            console.log('Initializing Chat Client');
            
            // @ts-ignore - Type issues with ChatClient constructor
            chatInstance = new ChatClient(ablyInstance);
            
            // Log methods for debugging
            if (chatInstance) {
              console.log('Chat client instance methods:', Object.getOwnPropertyNames(chatInstance));
              
              // Log available methods
              const hasGetRoom = typeof chatInstance.getRoom === 'function';
              console.log('Available methods:', {
                getRoom: hasGetRoom ? 'Available' : 'Not available',
                // Check other potential methods that might exist
              });
              
              // Store the underlying Ably Realtime instance for direct access to channels
              // @ts-ignore - Adding custom property for easy access
              chatInstance._realtimeClient = ablyInstance;
            }
            
            // Make sure the chat client is properly initialized
            if (!chatInstance) {
              throw new Error('Chat client is null after initialization');
            }
            
            setChatClient(chatInstance);
            setIsConnected(true);
            console.log('Ably Chat client initialized successfully');
          } catch (err) {
            console.error('Error initializing chat client:', err);
            if (err instanceof Error) {
              setConnectionError(err.message);
            }
            throw err;
          }
        } else {
          console.error('No user session found');
          setConnectionError('No user session found. Please log in again.');
        }
      } catch (error) {
        console.error('Error connecting to Ably:', error);
        setIsConnected(false);
        
        if (error instanceof Error) {
          setConnectionError(error.message);
        } else {
          setConnectionError('Unknown connection error');
        }
        
        // Attempt to reconnect if not at max attempts
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`Reconnect attempt ${reconnectAttempts} of ${MAX_RECONNECT_ATTEMPTS} in 5 seconds...`);
          
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect to Ably...');
            setupAbly();
          }, 5000);
        }
      }
    };

    setupAbly();

    return () => {
      // Clear any pending reconnect attempts
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      
      // Cleanup
      if (chatInstance) {
        try {
          // Only call destroy if it exists
          if (typeof chatInstance.destroy === 'function') {
            chatInstance.destroy();
          }
        } catch (err) {
          console.error('Error destroying chat instance:', err);
        }
      }
      
      if (ablyInstance) {
        try {
          ablyInstance.close();
        } catch (err) {
          console.error('Error closing Ably instance:', err);
        }
      }
    };
  }, []);

  return (
    <AblyContext.Provider value={{ chatClient, isConnected }}>
      {children}
    </AblyContext.Provider>
  );
} 