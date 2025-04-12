import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Button,
  VStack,
  HStack,
  Avatar,
  Text,
  Divider,
  Center,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { AddIcon, ChatIcon } from '@chakra-ui/icons';
import TopMenu from '../../components/TopMenu';
import { supabase } from '../../config/supabase';
import { FiMessageSquare } from 'react-icons/fi';
import useCustomToast from '../../hooks/useCustomToast';

// Define the types for follower data
interface FollowerMember {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
}

interface Follower {
  member_id: string;
  member: FollowerMember;
}

function CreatorDashboard() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useCustomToast();

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found");
        return;
      }

      // First check if the table exists
      const { error: tableCheckError } = await supabase
        .from('saved_creators')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        console.error("Table check error:", tableCheckError);
        toast({
          title: 'Database table not ready. Please run the SQL setup script.',
          status: 'error',
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      // Get members who have saved this creator
      const { data, error } = await supabase
        .from('saved_creators')
        .select(`
          member_id,
          member:member_id(id, username, display_name, avatar_url)
        `)
        .eq('creator_id', session.user.id);

      if (error) {
        console.error("Followers query error:", error);
        throw error;
      }
      
      setFollowers(data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast({
        title: 'Error loading follower data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = (memberId: string) => {
    // Logic to start a chat with a follower
    console.log('Starting chat with:', memberId);
    // Navigate to chat page with this member
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={8} align="stretch">
        <TopMenu />
        <Heading size="lg">Creator Dashboard</Heading>

        {/* Earnings Stats */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Today's Earnings</StatLabel>
                <StatNumber>$0.00</StatNumber>
                <StatHelpText>From all sources</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Balance</StatLabel>
                <StatNumber>$0.00</StatNumber>
                <StatHelpText>Available for withdrawal</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Followers</StatLabel>
                <StatNumber>{followers.length}</StatNumber>
                <StatHelpText>Members who saved your profile</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Followers List */}
        <Box>
          <Heading size="md" mb={4}>Your Followers</Heading>
          <Card>
            <CardBody>
              {isLoading ? (
                // Loading skeletons
                Array(3).fill(0).map((_, i) => (
                  <Box key={i} mb={i < 2 ? 4 : 0}>
                    <HStack>
                      <SkeletonCircle size="50px" />
                      <Box flex="1">
                        <Skeleton height="20px" width="40%" mb={2} />
                        <Skeleton height="16px" width="60%" />
                      </Box>
                      <Skeleton height="40px" width="100px" />
                    </HStack>
                    {i < 2 && <Divider my={4} />}
                  </Box>
                ))
              ) : followers.length > 0 ? (
                // Followers list
                followers.map((follower, index) => (
                  <Box key={follower.member_id}>
                    <HStack justify="space-between" align="center">
                      <HStack>
                        <Avatar 
                          size="md" 
                          name={follower.member.display_name || follower.member.username} 
                          src={follower.member.avatar_url}
                        />
                        <Box>
                          <Text fontWeight="bold">
                            {follower.member.display_name || follower.member.username}
                          </Text>
                          <Text fontSize="sm" color="gray.500">Follower</Text>
                        </Box>
                      </HStack>
                      <Button 
                        leftIcon={<FiMessageSquare />} 
                        colorScheme="blue" 
                        size="sm"
                        onClick={() => startChat(follower.member_id)}
                      >
                        Chat
                      </Button>
                    </HStack>
                    {index < followers.length - 1 && <Divider my={4} />}
                  </Box>
                ))
              ) : (
                // Empty state
                <Center py={8}>
                  <Text color="gray.500">
                    No followers yet. Share your profile with potential followers.
                  </Text>
                </Center>
              )}
            </CardBody>
          </Card>
        </Box>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Quick Actions</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <Button leftIcon={<AddIcon />} colorScheme="blue">
                  Create New Channel
                </Button>
                <Button leftIcon={<ChatIcon />} colorScheme="green">
                  Send Announcement
                </Button>
              </Grid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default CreatorDashboard; 