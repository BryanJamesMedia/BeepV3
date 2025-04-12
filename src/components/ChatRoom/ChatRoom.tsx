import React, { useEffect, useState } from 'react';
import { useAbly } from '../../contexts/AblyContext';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  Avatar,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { supabase } from '../../config/supabase';

// Define message interface since we can't rely on the SDK's Message type
interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  sender: {
    id: string;
    name?: string;
  };
}

interface ChatRoomProps {
  roomId: string;
  participant: {
    id: string;
    name: string;
  };
  onBack: () => void;
}

export function ChatRoom({ roomId, participant, onBack }: ChatRoomProps) {
  const { chatClient } = useAbly();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyChannel, setAblyChannel] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    if (!chatClient) return;
    let channelInstance: any = null;
    
    const setupChat = async () => {
      try {
        console.log('Setting up chat with ID:', roomId);
        
        // Access the Ably Realtime instance directly through chatClient
        const ablyRealtime = (chatClient as any)._realtimeClient;
        
        if (!ablyRealtime) {
          console.error('No Ably Realtime client available');
          return;
        }
        
        // Create a channel with the roomId
        channelInstance = ablyRealtime.channels.get(roomId);
        setAblyChannel(channelInstance);
        
        console.log('Channel created:', channelInstance);
        
        // Subscribe to messages on this channel
        channelInstance.subscribe('message', (message: any) => {
          console.log('Message received:', message);
          
          // Format the message to match our interface
          const chatMessage: ChatMessage = {
            id: message.id || Date.now().toString(),
            content: message.data.text || message.data,
            timestamp: message.timestamp || Date.now(),
            sender: {
              id: message.data.senderId || message.clientId || 'unknown',
              name: message.data.senderName,
            }
          };
          
          setMessages(prev => [...prev, chatMessage]);
        });
        
        // Try to get message history (if available in this Ably SDK version)
        try {
          const history = await channelInstance.history({ limit: 100 });
          console.log('Message history:', history);
          
          if (history.items && history.items.length > 0) {
            // Transform history items to match our message format
            const historyMessages = history.items
              .map((item: any) => ({
                id: item.id || Date.now().toString(),
                content: item.data.text || item.data,
                timestamp: item.timestamp || Date.now(),
                sender: {
                  id: item.data.senderId || item.clientId || 'unknown',
                  name: item.data.senderName,
                }
              }))
              .reverse(); // Most recent last
              
            setMessages(historyMessages);
          }
        } catch (historyError) {
          console.error('Error loading message history:', historyError);
        }
        
      } catch (error) {
        console.error('Error setting up chat channel:', error);
        toast({
          title: 'Chat Error',
          description: 'Could not connect to the chat room',
          status: 'error',
          duration: 5000,
        });
      }
    };

    setupChat();

    return () => {
      // Cleanup - unsubscribe from the channel
      if (channelInstance) {
        channelInstance.unsubscribe();
      }
    };
  }, [chatClient, roomId]);

  const handleSendMessage = async () => {
    if (!ablyChannel || !newMessage.trim()) return;

    try {
      const timestamp = Date.now();
      const currentUserId = (chatClient as any)?._realtimeClient?.auth?.clientId || 'unknown';
      
      // Send message through the Ably channel
      await ablyChannel.publish('message', {
        text: newMessage,
        senderId: currentUserId,
        timestamp: timestamp
      });
      
      // Update the chat record in the database with the last message
      try {
        const { error: updateError } = await supabase
          .from('chats')
          .update({
            last_message: newMessage,
            last_message_time: new Date(timestamp).toISOString()
          })
          .eq('id', roomId);
          
        if (updateError) {
          console.error('Error updating chat record:', updateError);
        }
      } catch (dbError) {
        console.error('Database error when updating last message:', dbError);
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box h="full">
      {/* Chat Header */}
      <Flex
        p={4}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        align="center"
        gap={4}
      >
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Back to chat list"
          variant="ghost"
          display={{ base: 'flex', md: 'none' }}
          onClick={onBack}
        />
        <Avatar size="sm" name={participant.name} />
        <Text fontWeight="bold">{participant.name}</Text>
      </Flex>

      {/* Existing chat room content */}
      <Box p={4} h="calc(100vh - 144px)" overflowY="auto">
        <VStack spacing={4} align="stretch">
          {/* Messages */}
          {messages.length === 0 && (
            <Text textAlign="center" color="gray.500" mt={10}>
              No messages yet. Send a message to start the conversation.
            </Text>
          )}
          
          {messages.map((message) => (
            <Flex
              key={message.id}
              w="full"
              alignItems="start"
              gap={2}
            >
              <Avatar
                size="sm"
                name={message.sender?.id}
              />
              <Box
                bg="gray.100"
                p={3}
                borderRadius="lg"
                maxW="80%"
              >
                <Text fontSize="sm" fontWeight="bold">
                  {message.sender?.name || message.sender?.id}
                </Text>
                <Text>{message.content}</Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Message Input */}
      <Box p={4} borderTop="1px" borderColor="gray.200" bg="white">
        <Flex gap={2}>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </Box>
  );
} 