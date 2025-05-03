import React, { useState } from 'react';
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
  AlertDescription
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InstructorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    matriculationResult: null,
    bachelorsCertificate: null,
    mastersCertificate: null,
    doctorateCertificate: null,
    professionalResume: null,
    teachingLicense: null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['name', 'email', 'dateOfBirth', 'matriculationResult', 'bachelorsCertificate'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Registration Submitted",
      description: "Thanks for registering.",
      status: "success",
      duration: 3000,
      isClosable: true
    });
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <Box 
      maxW="container.xl" 
      mx="auto" 
      mt={40} 
      p={6} 
      borderWidth={1} 
      borderRadius="lg"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {/* Personal Information */}
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input 
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Specific Document Uploads */}
            <FormControl isRequired>
              <FormLabel>Matriculation Examination Result (1 Point)</FormLabel>
              <Input 
                type="file"
                name="matriculationResult"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bachelors' Certificate (Optional, 2 Points)</FormLabel>
              <Input 
                type="file"
                name="bachelorsCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Masters' Certificate (Optional, 2 Points)</FormLabel>
              <Input 
                type="file"
                name="mastersCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Doctorate Certificate (Optional, 4 Points)</FormLabel>
              <Input 
                type="file"
                name="doctorateCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Professional Resume</FormLabel>
              <Input 
                type="file"
                name="professionalResume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Teaching License (Optional)</FormLabel>
              <Input 
                type="file"
                name="teachingLicense"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </FormControl>

            <Button 
              colorScheme="blue" 
              type="submit" 
              size="lg" 
              width="full"
              mt={4}
            >
              Submit Registration
            </Button>
          </VStack>
        </form>
      ) : (
        <VStack spacing={6} align="center">
          <Icon 
            as={FaCheckCircle} 
            w={20} 
            h={20} 
            color="green.500" 
          />
          <Heading size="xl" textAlign="center">
            Thank You for Registering
          </Heading>
          <VStack spacing={4} textAlign="center" maxW="600px">
            <Text fontSize="lg">
              Your instructor registration has been successfully submitted.
            </Text>
            <Alert 
              status="info" 
              variant="subtle" 
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={2} fontSize="lg">
                Next Steps
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                <VStack spacing={3} align="start">
                  <Text>
                    • Please check your inbox in 1~2 hours
                  </Text>
                  <Text>
                    • We will send you credentials via email
                  </Text>
                  <Text>
                    • You can use these credentials to log in as a tutor
                  </Text>
                  <Text fontWeight="bold" color="red.500">
                    • If you didn't receive the credentials, please try:
                      - Re-uploading the documents
                      - Re-registering with correct information
                  </Text>
                </VStack>
              </AlertDescription>
            </Alert>
            <Button 
              colorScheme="blue" 
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </VStack>
        </VStack>
      )}
    </Box>
  );
};

export default InstructorRegistration;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */