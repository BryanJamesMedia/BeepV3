import React from 'react';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Button,
  Icon,
  Text,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Avatar,
  Code,
  Center,
} from '@chakra-ui/react';
import { FiUserPlus, FiSearch, FiShare2, FiGrid } from 'react-icons/fi';
import { supabase } from '../../config/supabase';
import useCustomToast from '../../hooks/useCustomToast';

interface AddFriendsProps {
  userRole: 'member' | 'creator';
}

const AddFriends: React.FC<AddFriendsProps> = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const inviteDisclosure = useDisclosure();
  const searchDisclosure = useDisclosure();
  const qrDisclosure = useDisclosure();
  const toast = useCustomToast();
  
  const buttonBg = useColorModeValue('white', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.50', 'gray.600');

  // Search for users based on role
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const searchRole = userRole === 'creator' ? 'member' : 'creator';
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, display_name')
        .eq('role', searchRole)
        .ilike('username', `%${searchQuery}%`)
        .limit(5);
        
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Generate invite link
  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?invited_by=${userRole}`;
  };

  // Generate QR code link
  const qrCodeValue = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${userRole}`;
  };

  // Add a function to handle adding friends
  const addFriend = async (userId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Determine which ID goes where based on user role
      const friendData = userRole === 'creator' 
        ? { creator_id: session.user.id, member_id: userId }
        : { member_id: session.user.id, creator_id: userId };

      // Check if this relationship already exists
      const { data: existingFriend, error: checkError } = await supabase
        .from('friends')
        .select('id')
        .eq('creator_id', friendData.creator_id)
        .eq('member_id', friendData.member_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // If relationship already exists, notify user
      if (existingFriend) {
        toast({
          title: "Already connected",
          status: "info",
          duration: 2000,
        });
        return;
      }

      // Insert the new friend relationship
      const { error } = await supabase
        .from('friends')
        .insert([friendData]);

      if (error) throw error;

      toast({
        title: "Friend added successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error adding friend:', error);
      toast({
        title: "Error adding friend",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>Add Friends</Heading>
      
      <SimpleGrid columns={3} spacing={4}>
        <Button
          height="100px"
          onClick={inviteDisclosure.onOpen}
          bg={buttonBg}
          _hover={{ bg: buttonHoverBg }}
          boxShadow="md"
          borderRadius="lg"
        >
          <VStack>
            <Icon as={FiShare2} boxSize={6} />
            <Text>Invite</Text>
          </VStack>
        </Button>
        
        <Button
          height="100px"
          onClick={qrDisclosure.onOpen}
          bg={buttonBg}
          _hover={{ bg: buttonHoverBg }}
          boxShadow="md"
          borderRadius="lg"
        >
          <VStack>
            <Icon as={FiGrid} boxSize={6} />
            <Text>QR Code</Text>
          </VStack>
        </Button>
        
        <Button
          height="100px"
          onClick={searchDisclosure.onOpen}
          bg={buttonBg}
          _hover={{ bg: buttonHoverBg }}
          boxShadow="md"
          borderRadius="lg"
        >
          <VStack>
            <Icon as={FiSearch} boxSize={6} />
            <Text>Search</Text>
          </VStack>
        </Button>
      </SimpleGrid>

      {/* Invite Modal */}
      <Modal isOpen={inviteDisclosure.isOpen} onClose={inviteDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite Friends</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>Share this link with friends to join:</Text>
              <Box
                p={3}
                borderWidth="1px"
                borderRadius="md"
                width="100%"
                bg="gray.50"
              >
                <Text fontWeight="medium" isTruncated>
                  {generateInviteLink()}
                </Text>
              </Box>
              <Button 
                colorScheme="blue"
                onClick={() => {
                  navigator.clipboard.writeText(generateInviteLink());
                  toast({
                    title: "Link copied",
                    status: "success",
                    duration: 2000,
                  });
                }}
              >
                Copy Link
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* QR Code Modal */}
      <Modal isOpen={qrDisclosure.isOpen} onClose={qrDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Profile Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="center">
              <Text>Share this link with others to find you:</Text>
              
              {/* Replaced QR code component with a simple link display */}
              <Box 
                p={4} 
                bg="gray.50" 
                borderRadius="md" 
                borderWidth="1px" 
                width="100%"
              >
                <Text fontWeight="medium" textAlign="center">
                  {qrCodeValue()}
                </Text>
              </Box>
              
              <Button 
                colorScheme="blue"
                onClick={() => {
                  navigator.clipboard.writeText(qrCodeValue());
                  toast({
                    title: "Link copied",
                    status: "success",
                    duration: 2000,
                  });
                }}
              >
                Copy Link
              </Button>
              
              <Text fontSize="sm" color="gray.500">
                Note: QR code functionality will be added in the next update
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Search Modal */}
      <Modal isOpen={searchDisclosure.isOpen} onClose={searchDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Search {userRole === 'creator' ? 'Members' : 'Creators'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder={`Search for ${userRole === 'creator' ? 'members' : 'creators'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </InputGroup>
              
              <Button 
                colorScheme="blue" 
                onClick={handleSearch}
                isLoading={isSearching}
              >
                Search
              </Button>
              
              {searchResults.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {searchResults.map(user => (
                    <HStack
                      key={user.id}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      justify="space-between"
                    >
                      <HStack>
                        <Avatar 
                          size="sm" 
                          name={user.display_name || user.username}
                          src={user.avatar_url}
                        />
                        <Text fontWeight="medium">
                          {user.display_name || user.username}
                        </Text>
                      </HStack>
                      <Button
                        size="sm"
                        leftIcon={<FiUserPlus />}
                        onClick={() => addFriend(user.id)}
                        isLoading={isAddingFriend}
                      >
                        Add
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                searchQuery && !isSearching && (
                  <Text textAlign="center" color="gray.500" py={4}>
                    No results found
                  </Text>
                )
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddFriends; 