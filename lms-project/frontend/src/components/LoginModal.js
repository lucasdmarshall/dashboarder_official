import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// API base URL - updated to match our FastAPI backend
const API_URL = 'http://localhost:5001/api';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Login Error",
        description: "Please enter both email and password",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setIsLoading(true); // Set loading true before the try block

    try {
      // Step 1: Login to get access token using the fastapi-users login endpoint
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: email, // fastapi-users expects 'username' field for email
          password: password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      // Get the token from the response
      const loginData = await response.json();
      const token = loginData.access_token;
      
      // Step 2: Fetch user information using the token
      const userResponse = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      
      // Store token and user info in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userId', userData.id);
      
      // Store institutionId if user is an institution
      if (userData.role === 'institution') {
        // Use institutionId from user object if available, otherwise fallback to user.id
        const institutionIdToStore = userData.institutionId || userData.id;
        localStorage.setItem('institutionId', institutionIdToStore);
      }
      
      // Show success message with personalized welcome
      toast({
        title: "Login Successful",
        description: `Welcome ${userData.name}! Redirecting...`,
        status: "success",
        duration: 2000, // Keep toast short as navigation will happen
        isClosable: true
      });
      
      // Close modal
      onClose();
      
      // Redirect based on user role
      setTimeout(() => {
        const userRole = userData.role;
        if (userRole === 'admin') {
          navigate('/admin-tutors-page');
        } else if (userRole === 'institution') {
          navigate('/institution-dashboard');
        } else if (userRole === 'instructor') {
          navigate('/instructor-feed');
        } else if (userRole === 'student') {
          navigate('/student-feed');
        } else {
          console.warn('Unknown user role for navigation:', userRole);
          navigate('/'); // Default navigation
        }
      }, 1000); // Reduced timeout slightly
      
    } catch (error) { // This will now correctly catch errors from fetch
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false); // Ensure loading is set to false in all cases
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login to Dashboarder LMS</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleLogin}>
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isDisabled={isLoading}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={isLoading}
                />
              </FormControl>
              
              {error && (
                <Text color="red.500" fontSize="sm" width="100%">
                  {error}
                </Text>
              )}
              
              <Text 
                color="#640101" 
                alignSelf="flex-end" 
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                Forgot Password?
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              bg="#640101"
              color="white"
              mr={3} 
              type="submit"
              isLoading={isLoading}
              loadingText="Logging in"
              _hover={{
                bg: "#4A0000"
              }}
            >
              Login
            </Button>
            <Button onClick={onClose} isDisabled={isLoading}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */