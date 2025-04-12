import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatIcon, SettingsIcon } from '@chakra-ui/icons';
import { AiOutlineHome } from 'react-icons/ai';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      icon: AiOutlineHome,
      path: '/dashboard',
    },
    {
      label: 'Chats',
      icon: ChatIcon,
      path: '/chat',
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      path: '/settings',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height="60px"
      bg="white"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.05)"
      zIndex={1000}
    >
      <Flex
        h="full"
        justify="space-around"
        align="center"
        maxW="container.lg"
        mx="auto"
        px={4}
      >
        {navItems.map((item) => (
          <VStack
            key={item.path}
            spacing={0}
            flex={1}
            cursor="pointer"
            color={isActive(item.path) ? 'blue.500' : 'gray.500'}
            onClick={() => navigate(item.path)}
            transition="all 0.2s"
            _hover={{ color: 'blue.500' }}
          >
            <Icon
              as={item.icon}
              boxSize={6}
              mb={0.5}
            />
            <Text
              fontSize="xs"
              fontWeight={isActive(item.path) ? 'bold' : 'normal'}
            >
              {item.label}
            </Text>
          </VStack>
        ))}
      </Flex>
    </Box>
  );
}

export default BottomNav; 