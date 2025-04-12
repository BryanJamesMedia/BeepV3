import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';
import TopMenu from '../../components/TopMenu';
import SavedCreators from '../../components/Dashboard/SavedCreators';
import SavedCreatorsList from '../../components/Dashboard/SavedCreatorsList';

function MemberDashboard() {
  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={8} align="stretch">
        <TopMenu />
        <Heading size="lg">Member Dashboard</Heading>

        {/* Find and save creators section */}
        <SavedCreators userRole="member" />

        {/* List of saved creators */}
        <SavedCreatorsList />

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Your Activity</Heading>
                <HStack justify="space-between">
                  <Text>Messages Sent</Text>
                  <Badge colorScheme="blue">0</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>Communities Joined</Text>
                  <Badge colorScheme="green">0</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Recent Communities</Heading>
                <Text color="gray.500">No communities joined yet</Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Container>
  );
}

export default MemberDashboard; 