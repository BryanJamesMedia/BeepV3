import React, { useEffect, useState } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { supabase } from '../../config/supabase';
import CreatorDashboard from './CreatorDashboard';
import MemberDashboard from './MemberDashboard';

function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          setUserRole(profile.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    }

    getUserRole();
  }, []);

  if (loading) {
    return (
      <Center h="calc(100vh - 60px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  return userRole === 'creator' ? <CreatorDashboard /> : <MemberDashboard />;
}

export default Dashboard; 