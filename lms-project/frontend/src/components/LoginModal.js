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
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = (e) => {
    e.preventDefault();

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

    // Simulated login logic
    // In a real app, this would be an API call
    if (email === 'student@example.com' && password === 'student') {
      toast({
        title: "Login Successful",
        description: "Redirecting to Student Home",
        status: "success",
        duration: 2000,
        isClosable: true
      });
      onClose();
      setTimeout(() => {
        navigate('/student-home');
      }, 2000);
    } else if (email === 'instructor@example.com' && password === 'instructor') {
      toast({
        title: "Login Successful",
        description: "Redirecting to Instructor Home",
        status: "success",
        duration: 2000,
        isClosable: true
      });
      onClose();
      setTimeout(() => {
        navigate('/instructor-home');
      }, 2000);
    } else if (email === 'admin@example.com' && password === 'admin') {
      toast({
        title: "Login Successful",
        description: "Redirecting to Admin Dashboard",
        status: "success",
        duration: 2000,
        isClosable: true
      });
      onClose();
      setTimeout(() => {
        navigate('/admin-tutors-page');
      }, 2000);
    } else if (email === 'institution@example.com' && password === 'institution') {
      toast({
        title: "Login Successful",
        description: "Redirecting to Institution Dashboard",
        status: "success",
        duration: 2000,
        isClosable: true
      });
      onClose();
      setTimeout(() => {
        navigate('/institution-dashboard');
      }, 2000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        status: "error",
        duration: 3000,
        isClosable: true
      });
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
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              
              <Text 
                color="brand.primary0" 
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
              colorScheme="blue" 
              mr={3} 
              type="submit"
            >
              Login
            </Button>
            <Button onClick={onClose}>Cancel</Button>
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