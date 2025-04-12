import React, { useState, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../config/supabase';
import debounce from 'lodash/debounce';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  FormHelperText,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  InputRightAddon,
  Spinner,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  ViewOffIcon, 
  CheckIcon, 
  CloseIcon,
  InfoIcon 
} from '@chakra-ui/icons';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false
  });

  const validatePassword = (password: string) => {
    setPasswordErrors({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const validateUsername = (username: string) => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      setIsUsernameAvailable(null);
      return false;
    }
    if (username.length > 20) {
      setUsernameError('Username must be less than 20 characters');
      setIsUsernameAvailable(null);
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      setIsUsernameAvailable(null);
      return false;
    }
    return true;
  };

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      setIsCheckingUsername(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setIsUsernameAvailable(!data);
        setUsernameError(data ? 'Username is already taken' : '');
      } catch (err) {
        console.error('Error checking username:', err);
        setUsernameError('Error checking username availability');
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      validatePassword(value);
    } else if (name === 'username') {
      if (validateUsername(value)) {
        checkUsernameAvailability(value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: formData.username,
              email: formData.email,
            }
          ]);

        if (profileError) throw profileError;

        alert('Please check your email to confirm your account.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordErrors).every(Boolean);
  };

  return (
    <Container maxW="md" py={12}>
      <Card>
        <CardBody>
          <VStack spacing={8}>
            <Heading>Create Account</Heading>
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <InputGroup>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      isInvalid={Boolean(usernameError)}
                    />
                    <InputRightAddon>
                      {isCheckingUsername ? (
                        <Spinner size="sm" />
                      ) : isUsernameAvailable ? (
                        <CheckIcon color="green.500" />
                      ) : usernameError ? (
                        <CloseIcon color="red.500" />
                      ) : null}
                    </InputRightAddon>
                  </InputGroup>
                  {usernameError && (
                    <FormHelperText color="red.500">{usernameError}</FormHelperText>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <List spacing={1} mt={2}>
                    {Object.entries(passwordErrors).map(([key, valid]) => (
                      <ListItem key={key} color={valid ? 'green.500' : 'gray.500'}>
                        <ListIcon as={valid ? CheckIcon : InfoIcon} />
                        {key === 'length' && 'At least 8 characters'}
                        {key === 'number' && 'Contains a number'}
                        {key === 'uppercase' && 'Contains an uppercase letter'}
                        {key === 'special' && 'Contains a special character'}
                      </ListItem>
                    ))}
                  </List>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                      >
                        {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                  loadingText="Creating Account"
                  isDisabled={!isPasswordValid() || !isUsernameAvailable || !formData.email}
                >
                  Sign Up
                </Button>
              </VStack>
            </Box>

            <Text>
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="blue.500">
                Log In
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Signup; 