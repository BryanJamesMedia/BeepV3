import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  HStack,
  Avatar,
  Spinner,
  Button,
  Icon,
  useColorModeValue,
  useToast,
  Flex,
  Link,
} from '@chakra-ui/react';
import { FiTrash2, FiEye } from 'react-icons/fi';
import { supabase } from '../../config/supabase';

const SavedCreatorsList: React.FC = () => {
  const [savedCreators, setSavedCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const toast = useToast();
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');

  useEffect(() => {
    fetchSavedCreators();
  }, []);

  const fetchSavedCreators = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Get saved creator IDs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_creators')
        .select('creator_id')
        .eq('member_id', session.user.id);

      if (savedError) throw savedError;

      if (savedData && savedData.length > 0) {
        // Get creator profiles from the IDs
        const creatorIds = savedData.map(item => item.creator_id);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, display_name, headline, location')
          .in('id', creatorIds);

        if (profilesError) throw profilesError;
        
        setSavedCreators(profilesData || []);
      } else {
        setSavedCreators([]);
      }
    } catch (error) {
      console.error('Error fetching saved creators:', error);
      toast({
        title: "Error loading saved creators",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCreator = async (creatorId: string) => {
    setIsRemoving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('saved_creators')
        .delete()
        .eq('member_id', session.user.id)
        .eq('creator_id', creatorId);

      if (error) throw error;

      // Update the list after removing
      setSavedCreators(savedCreators.filter(creator => creator.id !== creatorId));
      
      toast({
        title: "Creator removed from saved list",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error removing saved creator:', error);
      toast({
        title: "Error removing creator",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Box mt={6}>
      <Heading size="md" mb={4}>Saved Creators</Heading>
      
      {isLoading ? (
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading saved creators...</Text>
        </Box>
      ) : savedCreators.length > 0 ? (
        <VStack spacing={2} align="stretch">
          {savedCreators.map((creator, index) => (
            <Box 
              key={creator.id}
              p={4} 
              borderWidth="1px" 
              borderRadius="lg"
              bg={cardBg}
              _hover={{ boxShadow: 'md', bg: cardHoverBg }}
              transition="all 0.2s"
            >
              <Flex justify="space-between" wrap={{ base: "wrap", md: "nowrap" }}>
                <HStack spacing={4} mb={{ base: 3, md: 0 }} flex="1">
                  <Avatar 
                    size="md" 
                    name={creator.username} 
                    src={creator.avatar_url}
                  />
                  <VStack align="start" spacing={0}>
                    <Link 
                      as={RouterLink} 
                      to={`/creator/${creator.id}`}
                      fontWeight="bold"
                      _hover={{ color: 'blue.500', textDecoration: 'none' }}
                    >
                      @{creator.username}
                    </Link>
                    {creator.headline && (
                      <Text fontSize="sm" color="gray.600" noOfLines={1}>
                        {creator.headline}
                      </Text>
                    )}
                    {creator.location && (
                      <Text fontSize="xs" color={emptyTextColor}>
                        {creator.location}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                
                <HStack>
                  <Button
                    as={RouterLink}
                    to={`/creator/${creator.id}`}
                    size="sm"
                    leftIcon={<Icon as={FiEye} />}
                    colorScheme="blue"
                    variant="outline"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<Icon as={FiTrash2} />}
                    onClick={() => removeCreator(creator.id)}
                    isLoading={isRemoving}
                  >
                    Remove
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box 
          py={8} 
          textAlign="center" 
          borderWidth="1px" 
          borderRadius="lg"
          bg={cardBg}
        >
          <Text color={emptyTextColor}>
            No creators saved yet. Search and save creators you're interested in.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SavedCreatorsList; 