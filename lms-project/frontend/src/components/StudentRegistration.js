import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  Text,
  useToast,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  Checkbox,
  InputGroup,
  InputRightElement,
  Flex,
  ScaleFade
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEye, FaEyeSlash, FaUserGraduate } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

// Function to generate a sequential user ID
const generateUserId = () => {
  // In a real application, this would be handled by the backend
  // Here we'll use localStorage to simulate a sequential ID
  const lastIdKey = 'lastStudentId';
  const lastId = localStorage.getItem(lastIdKey);
  
  let newId;
  if (lastId) {
    const numericPart = parseInt(lastId.replace('STD', ''), 10);
    const nextNumericPart = numericPart + 1;
    newId = `STD${nextNumericPart.toString().padStart(5, '0')}`;
  } else {
    newId = 'STD00001';
  }
  
  localStorage.setItem(lastIdKey, newId);
  return newId;
};

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    userId: generateUserId(), // System-generated user ID
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    grade: '',
    parentEmail: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Incomplete Form",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Check terms agreement
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Not Agreed",
        description: "Please agree to the terms and conditions.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Submit logic would go here (e.g., API call)
    setIsSubmitted(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your student registration is being processed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };

  return (
    <Container 
      maxW="container.xl" 
      py={16} 
      bg="gray.50"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <MotionBox
        width="100%"
        maxWidth="600px"
        bg="white"
        boxShadow="2xl"
        borderRadius="2xl"
        p={8}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isSubmitted ? (
          <VStack spacing={6} align="stretch">
            <Flex align="center" justify="center" mb={6}>
              <Icon 
                as={FaUserGraduate} 
                w={12} 
                h={12} 
                color="#640101" 
                mr={4}
              />
              <Heading 
                textAlign="center" 
                color="#640101"
                size="xl"
                fontWeight="bold"
              >
                Student Registration
              </Heading>
            </Flex>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} width="100%">
                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl isRequired width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">User ID</FormLabel>
                    <Input 
                      name="userId"
                      value={formData.userId}
                      isReadOnly
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                    />
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl isRequired width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">First Name</FormLabel>
                    <Input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                    />
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl isRequired width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Last Name</FormLabel>
                    <Input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                    />
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl isRequired width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Email</FormLabel>
                    <Input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                    />
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Date of Birth</FormLabel>
                    <Input 
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                      textTransform="uppercase"
                    />
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Grade/Year</FormLabel>
                    <Select 
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                    >
                      <option value="elementary">Elementary</option>
                      <option value="middle">Middle School</option>
                      <option value="high">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                    </Select>
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Parent/Guardian Email (Optional)</FormLabel>
                    <Input 
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      placeholder="Enter parent/guardian email"
                      borderColor="#640101"
                      _focus={{ 
                        borderColor: "#640101", 
                        boxShadow: "0 0 0 1px #640101" 
                      }}
                      height="45px"
                      width="100%"
                    />
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl isRequired width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Create Password</FormLabel>
                    <InputGroup width="100%">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        borderColor="#640101"
                        _focus={{ 
                          borderColor: "#640101", 
                          boxShadow: "0 0 0 1px #640101" 
                        }}
                        height="45px"
                        width="100%"
                      />
                      <InputRightElement height="45px">
                        <Button 
                          h="full" 
                          size="sm" 
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          color="#640101"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl isRequired width="100%">
                    <FormLabel color="gray.700" fontWeight="semibold">Confirm Password</FormLabel>
                    <InputGroup width="100%">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        borderColor="#640101"
                        _focus={{ 
                          borderColor: "#640101", 
                          boxShadow: "0 0 0 1px #640101" 
                        }}
                        height="45px"
                        width="100%"
                      />
                      <InputRightElement height="45px">
                        <Button 
                          h="full" 
                          size="sm" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          variant="ghost"
                          color="#640101"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </ScaleFade>

                <ScaleFade in={true} initialScale={0.9} style={{ width: '100%' }}>
                  <FormControl width="100%">
                    <Checkbox 
                      name="agreedToTerms"
                      isChecked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      colorScheme="red"
                    >
                      <Text color="gray.700">I agree to the terms and conditions</Text>
                    </Checkbox>
                  </FormControl>
                </ScaleFade>

                <MotionBox
                  width="100%"
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="submit" 
                    bg="#640101"
                    color="white"
                    width="100%"
                    size="lg"
                    isDisabled={!formData.agreedToTerms}
                    _hover={{ 
                      bg: "darkred",
                      transform: "scale(1.02)"
                    }}
                  >
                    Register
                  </Button>
                </MotionBox>
              </VStack>
            </form>
          </VStack>
        ) : (
          <VStack spacing={8} align="center">
            <Icon 
              as={FaCheckCircle} 
              w={20} 
              h={20} 
              color="#640101" 
            />
            <Heading size="xl" color="#640101" textAlign="center">
              Registration Successful!
            </Heading>
            <Text color="gray.600" textAlign="center">
              Your student registration is being processed. 
              You will receive further instructions via email.
            </Text>
            <Button 
              onClick={() => navigate('/')}
              bg="#640101"
              color="white"
              _hover={{ bg: "darkred" }}
            >
              Return to Home
            </Button>
          </VStack>
        )}
      </MotionBox>
    </Container>
  );
};

export default StudentRegistration;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */