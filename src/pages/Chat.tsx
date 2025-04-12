import { Box, Container, VStack, Heading, Text, Card, CardBody, Spinner as ChakraSpinner } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

function Chat() {
  return (
    <Container maxW="container.lg">
      <Card mt={8}>
        <CardBody>
          <VStack spacing={6} align="center" py={10}>
            <ChatIcon boxSize={12} color="blue.500" />
            
            <Heading>Chat Coming Soon</Heading>
            
            <Text color="gray.600" textAlign="center">
              We're working on building an amazing chat experience for you.
              Check back soon!
            </Text>

            <Box display="flex" alignItems="center" gap={3}>
              <ChakraSpinner size="sm" color="blue.500" />
              <Text color="gray.500">Setting up chat functionality...</Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Chat; 