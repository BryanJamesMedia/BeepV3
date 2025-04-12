import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  Switch,
  Text,
} from '@chakra-ui/react';

function CreatorSettings() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Creator Settings</Heading>
          <Text color="gray.600">Manage your creator profile and preferences</Text>
        </Box>

        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <Input placeholder="Your display name" />
              </FormControl>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Input placeholder="Tell your community about yourself" />
              </FormControl>

              <Divider />

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Allow Direct Messages</FormLabel>
                <Switch />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Community Notifications</FormLabel>
                <Switch />
              </FormControl>

              <Button colorScheme="blue">Save Changes</Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default CreatorSettings; 