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

function MemberSettings() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Member Settings</Heading>
          <Text color="gray.600">Manage your profile and preferences</Text>
        </Box>

        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input placeholder="Your username" />
              </FormControl>

              <FormControl>
                <FormLabel>Email Notifications</FormLabel>
                <Switch />
              </FormControl>

              <Divider />

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Show Online Status</FormLabel>
                <Switch />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Allow Direct Messages</FormLabel>
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

export default MemberSettings; 