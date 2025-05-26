import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Progress,
  useToast,
  useColorModeValue,
  Icon,
  Flex,
  Avatar,
  Badge,
  Divider,
  Card,
  CardBody,
  SimpleGrid
} from '@chakra-ui/react';
import {
  FaUser,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendar,
  FaPhone,
  FaArrowRight,
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa';

const API_URL = 'http://localhost:5001/api';

const StudentWizard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    
    // Academic Info (Step 2)
    educationLevel: '',
    institution: '',
    major: '',
    graduationYear: '',
    
    // Location & Personal (Step 3)
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    
    // Interests (Step 4)
    interests: '',
    goals: ''
  });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Get current user info if available
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            const nameParts = userData.name?.split(' ') || [];
            setFormData(prev => ({
              ...prev,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Update user profile with wizard data
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          bio: formData.bio,
          // Add other fields as needed by your backend
        }),
      });

      if (response.ok) {
        toast({
          title: 'Profile Complete!',
          description: 'Welcome to Dashboarder! Your student profile has been set up successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirect to student feed
        navigate('/student-feed');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Profile Update Failed',
        description: error.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Icon as={FaUser} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Personal Information</Heading>
              <Text color="gray.600">Let's start with your basic details</Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
            </SimpleGrid>
          </VStack>
        );
        
      case 2:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Icon as={FaGraduationCap} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Academic Background</Heading>
              <Text color="gray.600">Tell us about your education</Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Education Level</FormLabel>
                <Select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                >
                  <option value="">Select your level</option>
                  <option value="high_school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Institution</FormLabel>
                <Input
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Your school/university"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Major/Field of Study</FormLabel>
                <Input
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Expected Graduation Year</FormLabel>
                <Select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </VStack>
        );
        
      case 3:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Icon as={FaMapMarkerAlt} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Location & About You</Heading>
              <Text color="gray.600">Where are you based and tell us about yourself</Text>
            </VStack>
            
            <SimpleGrid columns={1} spacing={4}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    borderColor="#640101"
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    borderColor="#640101"
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>ZIP Code</FormLabel>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    borderColor="#640101"
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                  />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel>About You</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a bit about yourself, your interests, and what you hope to achieve..."
                  rows={4}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
            </SimpleGrid>
          </VStack>
        );
        
      case 4:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Icon as={FaCheck} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Learning Goals</Heading>
              <Text color="gray.600">What do you want to learn and achieve?</Text>
            </VStack>
            
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Areas of Interest</FormLabel>
                <Textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="What subjects, skills, or topics are you most interested in learning about?"
                  rows={3}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Learning Goals</FormLabel>
                <Textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="What are your learning goals? What do you hope to achieve through this platform?"
                  rows={3}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
            </VStack>
          </VStack>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="#640101">
              Welcome to Dashboarder!
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Let's set up your student profile in just a few steps
            </Text>
            
            {/* Progress Bar */}
            <Box w="full" maxW="md">
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Step {currentStep} of {totalSteps}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {Math.round(progress)}% Complete
                </Text>
              </Flex>
              <Progress
                value={progress}
                colorScheme="red"
                bg="gray.200"
                borderRadius="full"
                size="lg"
              />
            </Box>
          </VStack>

          {/* Main Form Card */}
          <Card bg={cardBg} w="full" maxW="3xl" boxShadow="xl">
            <CardBody p={8}>
              {renderStep()}
              
              <Divider my={8} />
              
              {/* Navigation Buttons */}
              <Flex justify="space-between">
                <Button
                  leftIcon={<FaArrowLeft />}
                  variant="outline"
                  borderColor="#640101"
                  color="#640101"
                  onClick={prevStep}
                  isDisabled={currentStep === 1}
                  _hover={{ bg: '#640101', color: 'white' }}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    rightIcon={<FaArrowRight />}
                    bg="#640101"
                    color="white"
                    onClick={nextStep}
                    _hover={{ bg: '#8B0000' }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    rightIcon={<FaCheck />}
                    bg="#640101"
                    color="white"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Completing Setup..."
                    _hover={{ bg: '#8B0000' }}
                  >
                    Complete Setup
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default StudentWizard; 