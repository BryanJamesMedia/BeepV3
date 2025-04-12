import React, { useState, useEffect } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Box,
  Text,
  useToast,
  HStack,
  FormErrorMessage,
  Input as FileInput,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../../config/supabase';
import { debounce } from 'lodash';

export function ProfileSettings() {
  console.log('ProfileSettings component rendered');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const toast = useToast();

  // Get current user's profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, bio, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error fetching profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Check username availability with debounce
  const checkUsername = debounce(async (username: string) => {
    if (!username) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .neq('id', session.user.id)
        .single();

      setIsUsernameAvailable(!data);
      setUsernameError(data ? 'Username already taken' : '');
    } catch (error) {
      console.error('Error checking username:', error);
    }
  }, 500);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setProfile({ ...profile, username: value });
    checkUsername(value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });

      toast({
        title: 'Image uploaded successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error uploading image',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Extract file name from URL
      const fileName = profile.avatar_url.split('/').pop();
      
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`avatars/${fileName}`]);

      if (deleteError) throw deleteError;

      setProfile({ ...profile, avatar_url: '' });

      toast({
        title: 'Profile picture removed',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast({
        title: 'Error removing profile picture',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          updated_at: new Date(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Profile Picture Section */}
      <Box textAlign="center">
        <FormLabel>Profile Picture</FormLabel>
        <VStack spacing={4}>
          <Avatar
            size="2xl"
            src={profile.avatar_url}
            name={profile.display_name || profile.username}
          />
          <HStack spacing={2} justify="center">
            <FormControl w="auto">
              <Input
                type="file"
                accept="image/*"
                display="none"
                id="avatar-upload"
                onChange={handleImageUpload}
              />
              <Button
                as="label"
                htmlFor="avatar-upload"
                leftIcon={<FiEdit2 />}
                isLoading={loading}
                cursor="pointer"
              >
                Change Picture
              </Button>
            </FormControl>
            {profile.avatar_url && (
              <IconButton
                aria-label="Remove picture"
                icon={<FiTrash2 />}
                onClick={handleDeleteAvatar}
                isLoading={loading}
              />
            )}
          </HStack>
        </VStack>
      </Box>

      {/* Username Field */}
      <FormControl isInvalid={!!usernameError}>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="username"
          value={profile.username}
          onChange={handleUsernameChange}
          isInvalid={!isUsernameAvailable}
        />
        <FormErrorMessage>{usernameError}</FormErrorMessage>
      </FormControl>

      {/* Display Name Field */}
      <FormControl>
        <FormLabel>Display Name</FormLabel>
        <Input
          placeholder="How you want to be known"
          value={profile.display_name}
          onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
        />
      </FormControl>

      {/* Bio Field */}
      <FormControl>
        <FormLabel>Bio</FormLabel>
        <Input
          placeholder="Tell us about yourself"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </FormControl>

      {/* Save Button */}
      <Button
        colorScheme="blue"
        onClick={handleSave}
        isLoading={loading}
        isDisabled={!isUsernameAvailable || loading}
      >
        Save Changes
      </Button>
    </VStack>
  );
} 