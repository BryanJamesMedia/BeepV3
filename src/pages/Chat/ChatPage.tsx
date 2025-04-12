import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  GridItem,
  useBreakpointValue
} from '@chakra-ui/react';
import ChatList from '../../components/ChatList/ChatList';
import { ChatRoom } from '../../components/ChatRoom/ChatRoom';

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
}

function ChatPage() {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Initialize with chat from navigation state if available
  useEffect(() => {
    if (location.state?.selectedChat) {
      setSelectedChat(location.state.selectedChat);
    }
  }, [location.state]);

  // Show either chat list or chat room on mobile, both on desktop
  const showChatList = !isMobile || !selectedChat;
  const showChatRoom = !isMobile || selectedChat;

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '350px 1fr' }}
      h="calc(100vh - 124px)" // Adjusted for bottom nav (60px) + padding
      gap={0}
    >
      {/* Chat List */}
      {showChatList && (
        <GridItem
          borderRight="1px"
          borderColor="gray.200"
          bg="white"
          overflowY="auto"
        >
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat?.id}
          />
        </GridItem>
      )}

      {/* Chat Room */}
      {showChatRoom && (
        <GridItem bg="gray.50" overflowY="auto">
          {selectedChat ? (
            <ChatRoom
              roomId={selectedChat.id}
              participant={{
                id: selectedChat.participantId,
                name: selectedChat.participantName
              }}
              onBack={() => setSelectedChat(null)}
            />
          ) : (
            <Box p={8} textAlign="center" color="gray.500">
              Select a chat to start messaging
            </Box>
          )}
        </GridItem>
      )}
    </Grid>
  );
}

export default ChatPage; 