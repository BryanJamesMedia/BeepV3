import React from 'react';
import { Box } from '@chakra-ui/react';
import BottomNav from '../Navigation/BottomNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/creator-signup', '/member-signup'].includes(location.pathname);

  return (
    <Box minH="100vh" bg="gray.50">
      <Box pb={isAuthPage ? 0 : "60px"}>
        {children}
      </Box>
      {!isAuthPage && <BottomNav />}
    </Box>
  );
}

export default Layout; 