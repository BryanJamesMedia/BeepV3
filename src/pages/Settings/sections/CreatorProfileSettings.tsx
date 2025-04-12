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
  IconButton,
  SimpleGrid,
  Image,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlusCircle, FiX } from 'react-icons/fi';
import { supabase } from '../../../config/supabase';
import { debounce } from 'lodash';

export function CreatorProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    location: '',
    age: '',
    gender: '',
    headline: '',
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
    fetchGallery();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url, location, age, gender, headline')
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

  const fetchGallery = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('gallery')
        .select('image_url')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setGalleryImages(data.map(item => item.image_url));
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast({
        title: 'Error fetching gallery',
        status: 'error',
        duration: 3000,
      });
    }
  };

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

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-avatar-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });

      toast({
        title: 'Avatar uploaded successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error uploading avatar',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      if (galleryImages.length >= 10) {
        toast({
          title: 'Gallery limit reached',
          description: 'You can only have up to 10 images in your gallery',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-gallery-${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // Save to gallery table
      const { error: insertError } = await supabase
        .from('gallery')
        .insert({
          user_id: session.user.id,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      setGalleryImages([...galleryImages, publicUrl]);

      toast({
        title: 'Image added to gallery',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading gallery image:', error);
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
      if (!profile.avatar_url) return;

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

  const handleDeleteGalleryImage = async (imageUrl: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Delete from gallery table
      const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .eq('user_id', session.user.id)
        .eq('image_url', imageUrl);

      if (deleteError) throw deleteError;

      setGalleryImages(galleryImages.filter(url => url !== imageUrl));

      toast({
        title: 'Image removed from gallery',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast({
        title: 'Error removing image',
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
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          location: profile.location,
          age: profile.age,
          gender: profile.gender,
          headline: profile.headline,
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
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <FormLabel mb={4}>Profile Picture</FormLabel>
        <VStack spacing={4}>
          <Avatar
            size="2xl"
            src={profile.avatar_url}
            name={profile.username}
          />
          <HStack spacing={2} justify="center">
            <FormControl w="auto">
              <Input
                type="file"
                accept="image/*"
                display="none"
                id="avatar-upload"
                onChange={handleAvatarUpload}
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

      <FormControl>
        <FormLabel>Headline</FormLabel>
        <Input
          placeholder="A short catchy phrase about yourself"
          value={profile.headline}
          onChange={(e) => handleInputChange('headline', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Bio</FormLabel>
        <Textarea
          placeholder="Tell us about yourself"
          value={profile.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
        />
      </FormControl>

      <HStack spacing={4} align="start">
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            placeholder="City, Country"
            value={profile.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Age</FormLabel>
          <NumberInput min={18} max={100}>
            <NumberInputField
              placeholder="Your age"
              value={profile.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Gender</FormLabel>
          <Select 
            placeholder="Select gender"
            value={profile.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </Select>
        </FormControl>
      </HStack>

      <Box>
        <Heading size="md" mb={4}>Photo Gallery ({galleryImages.length}/10)</Heading>
        
        {galleryImages.length < 10 && (
          <FormControl w="full" mb={4}>
            <Input
              type="file"
              accept="image/*"
              display="none"
              id="gallery-upload"
              onChange={handleGalleryUpload}
            />
            <Button
              as="label"
              htmlFor="gallery-upload"
              leftIcon={<FiPlusCircle />}
              isLoading={loading}
              cursor="pointer"
              w="full"
            >
              Add Photo to Gallery
            </Button>
          </FormControl>
        )}
        
        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
          {galleryImages.map((imageUrl, index) => (
            <Box key={index} position="relative">
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                borderRadius="md"
                objectFit="cover"
                w="full"
                h="150px"
              />
              <IconButton
                aria-label="Remove image"
                icon={<FiX />}
                size="sm"
                position="absolute"
                top={1}
                right={1}
                colorScheme="red"
                onClick={() => handleDeleteGalleryImage(imageUrl)}
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Button
        colorScheme="blue"
        onClick={handleSave}
        isLoading={loading}
        isDisabled={!isUsernameAvailable || loading}
        size="lg"
        mt={4}
      >
        Save Profile
      </Button>
    </VStack>
  );
} 