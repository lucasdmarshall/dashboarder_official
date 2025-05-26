import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button, 
  Icon,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Card,
  CardBody,
  useColorModeValue,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { 
  FaChalkboardTeacher,
  FaArrowLeft,
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const InstructorSignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your full name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // API call to register instructor
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'instructor'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.registration_id) {
          // This is an instructor registration (pending approval)
          toast({
            title: 'Instructor Application Started!',
            description: 'Let\'s complete your application with your teaching credentials.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          // Store the registration data for the wizard
          localStorage.setItem('authData', JSON.stringify({
            registration_id: data.registration_id,
            status: data.status,
            next_step: data.next_step
          }));
          
          // Navigate to instructor wizard to complete application
          navigate('/instructor-wizard');
        } else if (data.access_token) {
          // This is a student registration with immediate access
          toast({
            title: 'Account Created!',
            description: 'Welcome to Dashboarder!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          // Store the access token
          localStorage.setItem('authToken', data.access_token);
          localStorage.setItem('authData', JSON.stringify(data));
          
          // Navigate to appropriate dashboard
          navigate('/student-dashboard');
        } else {
          throw new Error('Unexpected response format');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.md">
        {/* Header */}
        <HStack spacing={4} mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/')}
            color="#640101"
            size="lg"
          >
            Back to Home
          </Button>
        </HStack>

        {/* Sign Up Form */}
        <Card bg={cardBg} maxW="2xl" mx="auto" boxShadow="xl">
          <CardBody p={8}>
            <VStack spacing={6} textAlign="center" mb={8}>
              <Icon as={FaChalkboardTeacher} w={16} h={16} color="#640101" />
              <Heading as="h1" size="xl" color="#640101">
                Apply to Teach
              </Heading>
              <Text color="gray.600">
                Join our community of educators and start sharing your knowledge with students worldwide
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <InputGroup>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      focusBorderColor="#640101"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <InputGroup>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your professional email address"
                      focusBorderColor="#640101"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      focusBorderColor="#640101"
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                      >
                        <Icon as={showPassword ? FaEyeSlash : FaEye} />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      focusBorderColor="#640101"
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        size="sm"
                      >
                        <Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  bg="#640101"
                  color="white"
                  size="lg"
                  width="full"
                  leftIcon={<FaUserPlus />}
                  isLoading={isLoading}
                  loadingText="Creating Account..."
                  _hover={{ bg: "black" }}
                  mt={4}
                >
                  Create Instructor Account
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" mt={6} color="gray.600">
              Already have an instructor account?{' '}
              <Button
                variant="link"
                color="#640101"
                onClick={() => navigate('/')}
                fontWeight="bold"
              >
                Sign in here
              </Button>
            </Text>
            
            <Box mt={4} p={4} bg="rgba(100, 1, 1, 0.05)" borderRadius="md">
              <Text fontSize="sm" color="gray.600" textAlign="center">
                <strong>Next Steps:</strong> After creating your account, you'll complete your instructor profile 
                with your qualifications, experience, and subjects you'd like to teach.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default InstructorSignUp; 