import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { AddIcon, ChatIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';

function CreatorDashboard() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
        <Box>
          <Heading size="lg" mb={2}>Creator Dashboard</Heading>
          <Text color="gray.600">Manage your community and content</Text>
        </Box>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Members</StatLabel>
                  <StatNumber>0</StatNumber>
                  <StatHelpText>Active community members</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Messages Today</StatLabel>
                  <StatNumber>0</StatNumber>
                  <StatHelpText>Across all channels</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Channels</StatLabel>
                  <StatNumber>0</StatNumber>
                  <StatHelpText>Chat channels</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Quick Actions */}
        <Box>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Button leftIcon={<AddIcon />} colorScheme="blue" variant="outline">
              Create New Channel
            </Button>
            <Button leftIcon={<ChatIcon />} colorScheme="green" variant="outline">
              Send Announcement
            </Button>
          </Grid>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <Card>
            <CardBody>
              <Text color="gray.600">No recent activity to display</Text>
            </CardBody>
          </Card>
        </Box>
      </VStack>
    </Container>
  );
}

export default CreatorDashboard; 