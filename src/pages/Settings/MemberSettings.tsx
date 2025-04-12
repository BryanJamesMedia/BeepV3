import React, { useState } from 'react';
import {
  Container,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Icon,
  Divider,
  useColorModeValue,
  useBreakpointValue,
  IconButton,
  SimpleGrid,
  Button,
  Card,
  CardBody,
  Center,
} from '@chakra-ui/react';
import { FiUser, FiSettings, FiLock, FiBell, FiHelpCircle, FiChevronLeft, FiLogOut, FiBookmark } from 'react-icons/fi';
import { BiWallet, BiQr } from 'react-icons/bi';
import { MdPayment } from 'react-icons/md';
import { ProfileSettings } from './sections/ProfileSettings';
import { logout } from '../../utils/auth';

// Define the menu items and their icons
const menuItems = [
  { id: 'profile', label: 'Profile', icon: FiUser, component: 'Profile Settings' },
  { id: 'account', label: 'Account', icon: FiSettings, component: 'Account Settings' },
  { id: 'privacy', label: 'Privacy', icon: FiLock, component: 'Privacy Settings' },
  { id: 'billing', label: 'Billing', icon: MdPayment, component: 'Billing Settings' },
  { id: 'wallet', label: 'Wallet', icon: BiWallet, component: 'Wallet Settings' },
  { id: 'qr-code', label: 'QR Code', icon: BiQr, component: 'QR Code Settings' },
  { id: 'saved-creators', label: 'Saved Creators', icon: FiBookmark, component: 'Saved Creators' },
  { id: 'notifications', label: 'Notifications', icon: FiBell, component: 'Notification Settings' },
  { id: 'help', label: 'Help Center', icon: FiHelpCircle, component: 'Help Center' },
];

function MemberSettings() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const cardBg = useColorModeValue('white', 'gray.700');

  const DesktopMenuItems = () => (
    <VStack align="stretch" spacing={1}>
      {menuItems.map((item) => (
        <Box
          key={item.id}
          p={3}
          cursor="pointer"
          borderRadius="md"
          bg={activeSection === item.id ? activeBg : 'transparent'}
          color={activeSection === item.id ? activeColor : 'inherit'}
          onClick={() => setActiveSection(item.id)}
          _hover={{ bg: activeSection === item.id ? activeBg : hoverBg }}
          transition="all 0.2s"
        >
          <HStack spacing={3}>
            <Icon as={item.icon} boxSize={5} />
            <Text fontWeight={activeSection === item.id ? "semibold" : "normal"}>
              {item.label}
            </Text>
          </HStack>
        </Box>
      ))}
      <Divider />
      <Button
        leftIcon={<FiLogOut />}
        variant="ghost"
        justifyContent="flex-start"
        onClick={logout}
      >
        Logout
      </Button>
    </VStack>
  );

  const MobileMenuGrid = () => (
    <VStack spacing={6} align="stretch">
      <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4}>
        {menuItems.map((item) => (
          <Card 
            key={item.id}
            bg={cardBg}
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            onClick={() => setActiveSection(item.id)}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            <CardBody>
              <Center flexDirection="column" textAlign="center" py={2}>
                <Icon 
                  as={item.icon} 
                  boxSize={8} 
                  mb={2}
                  color={activeColor}
                />
                <Text fontWeight="medium">{item.label}</Text>
              </Center>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      
      <Button
        leftIcon={<FiLogOut />}
        colorScheme="red"
        variant="outline"
        w="full"
        onClick={logout}
        mt={4}
      >
        Logout
      </Button>
    </VStack>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'saved-creators':
        // Show saved creators content
        return (
          <Text>
            Manage your saved creators here. You'll be able to view, organize, and remove creators you've saved.
          </Text>
        );
      // Add other cases for different sections
      default:
        return (
          <Text color="gray.500">
            Select a section from the menu
          </Text>
        );
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Mobile View */}
      {isMobile && (
        <>
          {/* Section View with Back Button */}
          {activeSection ? (
            <>
              <HStack mb={6} spacing={4} align="center">
                <IconButton
                  aria-label="Back to menu"
                  icon={<FiChevronLeft />}
                  variant="ghost"
                  onClick={() => setActiveSection(null)}
                />
                <Heading size="lg">
                  {menuItems.find(item => item.id === activeSection)?.label}
                </Heading>
              </HStack>
              
              <Box
                bg="white"
                borderRadius="lg"
                p={6}
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                {renderContent()}
              </Box>
            </>
          ) : (
            /* Menu Grid View */
            <>
              <Heading mb={6}>Settings</Heading>
              <MobileMenuGrid />
            </>
          )}
        </>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <>
          <Heading mb={6}>Member Settings</Heading>
          <HStack align="start" spacing={8}>
            {/* Settings Menu */}
            <Box
              w="250px"
              borderRight="1px"
              borderColor={borderColor}
              pr={4}
              position="sticky"
              top="20px"
            >
              <DesktopMenuItems />
            </Box>

            {/* Settings Content */}
            <Box flex="1">
              <Box
                bg="white"
                borderRadius="lg"
                p={6}
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Heading size="md" mb={6}>
                  {menuItems.find(item => item.id === activeSection)?.label || "Select a section"}
                </Heading>
                
                {renderContent()}
              </Box>
            </Box>
          </HStack>
        </>
      )}
    </Container>
  );
}

export default MemberSettings; 