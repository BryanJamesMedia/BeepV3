import React from 'react';
import {
  Box,
  HStack,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

function TopMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = async () => {
    // Implement search logic here
    // Example: Query the database for users matching the searchTerm
    // const results = await searchUsers(searchTerm);
    // setSearchResults(results);
  };

  const handleAddUser = (userId: string) => {
    // Implement logic to add user to chat room
    console.log('Adding user to chat:', userId);
    onClose();
  };

  return (
    <Box bg="gray.100" p={4} boxShadow="sm">
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">Dashboard</Text>
        <IconButton
          aria-label="Add"
          icon={<FiPlus />}
          onClick={onOpen}
          variant="outline"
        />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add to Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search for users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <VStack mt={4} spacing={3} align="stretch">
              {searchResults.map((user) => (
                <HStack key={user.id} justify="space-between">
                  <Text>{user.username}</Text>
                  <Button size="sm" onClick={() => handleAddUser(user.id)}>
                    Add
                  </Button>
                </HStack>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TopMenu; 