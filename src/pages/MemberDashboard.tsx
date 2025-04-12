import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  VStack,
  Text,
  Button,
  Badge,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import { ChatIcon, StarIcon } from '@chakra-ui/icons';

function MemberDashboard() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
        <Box>
          <Heading size="lg" mb={2}>Member Dashboard</Heading>
          <Text color="gray.600">Your community hub</Text>
        </Box>

        {/* Active Channels */}
        <Box>
          <Heading size="md" mb={4}>Your Channels</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text color="gray.600">No active channels yet</Text>
                  <Button leftIcon={<ChatIcon />} colorScheme="blue" variant="outline">
                    Browse Channels
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Grid>
        </Box>

        {/* Community Updates */}
        <Box>
          <Heading size="md" mb={4}>Community Updates</Heading>
          <Card>
            <CardBody>
              <Text color="gray.600">No updates to display</Text>
            </CardBody>
          </Card>
        </Box>

        {/* Your Activity */}
        <Box>
          <Heading size="md" mb={4}>Your Activity</Heading>
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text>Messages Sent</Text>
                  <Badge>0</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>Days Active</Text>
                  <Badge>0</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </VStack>
    </Container>
  );
}

export default MemberDashboard; 