import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Heading,
  Button,
  Badge,
  Card,
  CardBody,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
  Avatar,
  useToast,
  Spinner,
  Center,
  useColorModeValue,
  IconButton,
  Divider,
  AspectRatio,
  Stack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Checkbox,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaUser,
  FaGraduationCap,
  FaBuilding,
  FaArrowRight,
  FaFilter,
  FaBell,
  FaCheck,
  FaTachometerAlt
} from 'react-icons/fa';
import LoginModal from '../components/LoginModal';

const API_URL = 'http://localhost:5001/api';

const InstructorFeed = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [institutionDetails, setInstitutionDetails] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  
  // Application modal state
  const { isOpen: isApplyOpen, onOpen: onApplyOpen, onClose: onApplyClose } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState(null);
  const [applicationForm, setApplicationForm] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();

  const bgColor = useColorModeValue('#f8f9fb', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.800');

  // Function to shuffle array randomly
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter posts based on search query and randomize order
    if (searchQuery.trim() === '') {
      setFilteredPosts(shuffleArray(posts));
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.institution_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(shuffleArray(filtered));
    }
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
        
        // Fetch institution details for each unique institution
        const uniqueInstitutionIds = [...new Set(data.map(post => post.institution_id))];
        const institutionDetailsMap = {};
        
        for (const institutionId of uniqueInstitutionIds) {
          try {
            const institutionResponse = await fetch(`${API_URL}/institutions/${institutionId}/profile`);
            if (institutionResponse.ok) {
              const institutionData = await institutionResponse.json();
              institutionDetailsMap[institutionId] = institutionData;
            }
          } catch (error) {
            console.error(`Error fetching details for institution ${institutionId}:`, error);
          }
        }
        
        setInstitutionDetails(institutionDetailsMap);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found - user not logged in');
        return;
      }

      console.log('Fetching user with token:', token.substring(0, 20) + '...');
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('User fetch response status:', response.status);
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        console.log('Current user loaded successfully:', userData);
      } else if (response.status === 401) {
        console.log('Token expired or invalid');
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      } else {
        console.error('Failed to fetch user:', response.status, response.statusText);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser(null);
    }
  };

  const handleViewProfile = (institutionId) => {
    navigate(`/student-view-institution-profile/${institutionId}`);
  };

  const handleLike = (postId) => {
    toast({
      title: 'Saved to favorites',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShare = (postId) => {
    toast({
      title: 'Shared successfully',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleGoToDashboard = () => {
    if (!currentUser) {
      onLoginOpen();
      return;
    }

    switch (currentUser.role) {
      case 'student':
        navigate('/student-home');
        break;
      case 'instructor':
        navigate('/instructor-home');
        break;
      case 'institution':
        navigate('/institution-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        toast({
          title: 'Dashboard not available',
          description: 'No dashboard available for your role',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
    }
  };

  const handleApply = async (post) => {
    console.log('Apply button clicked for:', post.institution_name);
    console.log('Current user state:', currentUser);
    
    // Check token first as a fallback - using 'authToken' to match LoginModal
    const token = localStorage.getItem('authToken');
    console.log('Token exists:', !!token);
    
    // If we have a token but no currentUser, try to fetch user data quickly
    if (token && !currentUser) {
      console.log('Token exists but no currentUser - attempting to fetch user data...');
      await fetchCurrentUser();
      
      // Give it a moment to process
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Check if user is logged in, if not, prompt them to log in
    if (!currentUser && !token) {
      toast({
        title: 'Login Required',
        description: 'Please log in to apply to institutions.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      
      // Open login modal instead of navigating to non-existent page
      onLoginOpen();
      return;
    }
    
    // If we have a token but still no currentUser, proceed with token-based auth
    if (token && !currentUser) {
      console.log('Proceeding with token-based authentication (currentUser not loaded yet)');
    }

    const userEmail = currentUser?.email || 'loading...';
    console.log('Using email for application:', userEmail);

    try {
      // Check if user has already applied to this institution using authenticated endpoint
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in again to continue.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        onLoginOpen();
        return;
      }

      console.log('Checking if user already applied to institution:', post.institution_id);
      const checkResponse = await fetch(`${API_URL}/check-application/${post.institution_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Application check response status:', checkResponse.status);
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log('Application check data:', checkData);
        
        if (checkData.hasApplied) {
          toast({
            title: 'Already Applied',
            description: 'You have already submitted an application to this institution. Please wait for their response.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      } else if (checkResponse.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again to continue.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        localStorage.removeItem('authToken');
        onLoginOpen();
        return;
      } else {
        console.error('Failed to check application status:', checkResponse.status);
        // Continue anyway - don't block the user from applying
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      // Continue anyway - don't block the user from applying due to network issues
    }

    console.log('Proceeding to show application form...');
    // If we get here, the user can apply
    setSelectedPost(post);
    setIsLoadingForm(true);
    onApplyOpen();
    
    try {
      // First, try to get institution's custom form
      const formsResponse = await fetch(`${API_URL}/public/forms/${post.institution_id}`);
      if (formsResponse.ok) {
        const formsData = await formsResponse.json();
        
        if (formsData.forms && formsData.forms.length > 0) {
          // Get the first active form (usually the student application form)
          const activeForm = formsData.forms.find(f => f.type === 'student_application') || formsData.forms[0];
          
          // Get form fields
          const formResponse = await fetch(`${API_URL}/public/forms/${post.institution_id}/${activeForm.id}`);
          if (formResponse.ok) {
            const formData = await formResponse.json();
            setApplicationForm(formData.form);
            setFormFields(formData.fields);
            
            // Initialize form values with user info pre-filled
            const initialValues = {};
            formData.fields.forEach(field => {
              // Pre-fill common fields with user data
              if (field.field_name === 'email' || field.field_name === 'emailAddress' || field.field_name === 'email_address') {
                initialValues[field.field_name] = currentUser?.email || '';
              } else if (field.field_name === 'name' || field.field_name === 'fullName' || field.field_name === 'full_name') {
                initialValues[field.field_name] = currentUser?.name || '';
              } else if (field.field_name === 'firstName' || field.field_name === 'first_name') {
                initialValues[field.field_name] = currentUser?.name?.split(' ')[0] || '';
              } else if (field.field_name === 'lastName' || field.field_name === 'last_name') {
                const nameParts = currentUser?.name?.split(' ') || [];
                initialValues[field.field_name] = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
              } else {
                initialValues[field.field_name] = field.default_value || '';
              }
            });
            setFormValues(initialValues);
          } else {
            throw new Error('Failed to load form fields');
          }
        } else {
          // No custom form found, use default fields
          setApplicationForm({
            id: 'default',
            name: 'Student Application Form',
            description: 'Standard application form'
          });
          setFormFields([
            { field_name: 'firstName', field_label: 'First Name', field_type: 'text', is_required: true },
            { field_name: 'lastName', field_label: 'Last Name', field_type: 'text', is_required: true },
            { field_name: 'email', field_label: 'Email', field_type: 'email', is_required: true },
            { field_name: 'phone', field_label: 'Phone Number', field_type: 'text', is_required: false },
            { field_name: 'motivation', field_label: 'Why do you want to join this institution?', field_type: 'textarea', is_required: true }
          ]);
          
          const firstNamePart = currentUser?.name?.split(' ')[0] || '';
          const lastNamePart = currentUser?.name?.split(' ').slice(1).join(' ') || '';
          
          setFormValues({
            firstName: firstNamePart,
            lastName: lastNamePart,
            email: currentUser?.email || '',
            phone: '',
            motivation: ''
          });
        }
      } else {
        // Failed to fetch forms, use default fields
        setApplicationForm({
          id: 'default',
          name: 'Student Application Form',
          description: 'Standard application form'
        });
        setFormFields([
          { field_name: 'firstName', field_label: 'First Name', field_type: 'text', is_required: true },
          { field_name: 'lastName', field_label: 'Last Name', field_type: 'text', is_required: true },
          { field_name: 'email', field_label: 'Email', field_type: 'email', is_required: true },
          { field_name: 'phone', field_label: 'Phone Number', field_type: 'text', is_required: false },
          { field_name: 'motivation', field_label: 'Why do you want to join this institution?', field_type: 'textarea', is_required: true }
        ]);
        
        const firstNamePart = currentUser?.name?.split(' ')[0] || '';
        const lastNamePart = currentUser?.name?.split(' ').slice(1).join(' ') || '';
        
        setFormValues({
          firstName: firstNamePart,
          lastName: lastNamePart,
          email: currentUser?.email || '',
          phone: '',
          motivation: ''
        });
      }
    } catch (error) {
      console.error('Error loading application form:', error);
      toast({
        title: 'Error',
        description: 'Failed to load application form. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      onApplyClose();
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmitApplication = async () => {
    if (!selectedPost || !applicationForm) return;

    // Validate required fields
    const requiredFields = formFields.filter(field => field.is_required);
    const missingFields = requiredFields.filter(field => !formValues[field.field_name]);

    if (missingFields.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill in: ${missingFields.map(f => f.field_label).join(', ')}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (applicationForm.id === 'default') {
        // For default form, just show success message
        toast({
          title: 'Application Submitted',
          description: 'Your application has been submitted successfully. You\'ll hear from us soon!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Debug: Log the data being sent
        console.log('Submitting application data:', {
          institution_id: selectedPost.institution_id,
          form_id: applicationForm.id,
          values: formValues
        });

        // Submit to authenticated form endpoint
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/forms/${selectedPost.institution_id}/${applicationForm.id}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            values: formValues
          }),
        });

        if (response.ok) {
          toast({
            title: 'Application Submitted',
            description: 'Your application has been submitted successfully. You\'ll hear from us soon!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          // Get the error details from the response
          let errorMessage = 'Failed to submit application';
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          console.error('Submission failed with status:', response.status, 'Error:', errorMessage);
          throw new Error(errorMessage);
        }
      }
      
      onApplyClose();
      setFormValues({});
      setApplicationForm(null);
      setFormFields([]);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit application. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (field) => {
    const value = formValues[field.field_name] || '';
    
    switch (field.field_type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={4}
          />
        );
      case 'select':
        const options = field.options ? 
          (typeof field.options === 'string' ? 
            field.options.split('\n').filter(o => o.trim()) : 
            Array.isArray(field.options) ? 
              field.options : 
              []
          ) : [];
        return (
          <Select
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </Select>
        );
      case 'radio':
        const radioOptions = field.options ? 
          (typeof field.options === 'string' ? 
            field.options.split('\n').filter(o => o.trim()) : 
            Array.isArray(field.options) ? 
              field.options : 
              []
          ) : [];
        return (
          <VStack align="start" spacing={2}>
            {radioOptions.map((option, index) => (
              <Checkbox
                key={index}
                isChecked={value === option.trim()}
                onChange={() => handleInputChange(field.field_name, option.trim())}
                colorScheme="red"
              >
                {option.trim()}
              </Checkbox>
            ))}
          </VStack>
        );
      case 'checkbox':
        return (
          <Checkbox
            isChecked={value === 'true' || value === true}
            onChange={(e) => handleInputChange(field.field_name, e.target.checked)}
          >
            {field.field_label}
          </Checkbox>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.placeholder || ''}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.placeholder || ''}
          />
        );
      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => handleInputChange(field.field_name, e.target.files[0])}
            placeholder={field.placeholder || ''}
          />
        );
      default:
        return (
          <Input
            type={field.field_type}
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.placeholder || ''}
          />
        );
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        as={FaStar}
        color={i < rating ? '#f6ad55' : '#e2e8f0'}
        boxSize="12px"
      />
    ));
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Center h="100vh">
          <VStack spacing={8}>
            <Box position="relative">
              <Box
                w="80px"
                h="80px"
                border="4px solid"
                borderColor="#640101"
                borderTopColor="transparent"
                borderRadius="50%"
                animation="spin 1s linear infinite"
                sx={{
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Icon 
                as={FaGraduationCap} 
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                boxSize={8} 
                color="#640101" 
              />
            </Box>
            <VStack spacing={2}>
              <Heading size="md" color="gray.700" fontWeight="600">
                Loading Educational Opportunities
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Discovering amazing institutions for you...
              </Text>
            </VStack>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Modern Navigation Header */}
      <Box 
        bg={headerBg} 
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky" 
        top={0} 
        zIndex={1000}
        boxShadow="sm"
      >
        <Container maxW="8xl" py={3}>
          <Flex justify="space-between" align="center">
            {/* Brand Identity */}
            <HStack spacing={6}>
              <HStack spacing={3}>
                <Box 
                  w="40px"
                  h="40px"
                  bg="#640101"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaGraduationCap} boxSize={5} color="white" />
                </Box>
                <VStack spacing={0} align="start">
                  <Heading 
                    size="md" 
                    color="#640101" 
                    fontWeight="700"
                  >
                    Dashboarder
                  </Heading>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    Educational Opportunities
                  </Text>
                </VStack>
              </HStack>

              {/* Navigation Pills */}
              <HStack spacing={1} ml={4}>
                <Button
                  size="sm"
                  bg="#640101"
                  color="white"
                  borderRadius="full"
                  px={4}
                  fontWeight="600"
                  _hover={{ bg: '#8B0000' }}
                >
                  Feed
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.600"
                  borderRadius="full"
                  px={4}
                  fontWeight="500"
                  _hover={{ bg: 'gray.100' }}
                >
                  Applications
                </Button>
              </HStack>
            </HStack>

            {/* Search and Actions */}
            <HStack spacing={4}>
              <Box w="350px">
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaSearch} color="gray.400" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search institutions and programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius="full"
                    border="1px solid"
                    borderColor="gray.300"
                    bg="white"
                    fontSize="sm"
                    fontWeight="500"
                    _placeholder={{ color: 'gray.500' }}
                    _focus={{
                      borderColor: '#640101',
                      boxShadow: '0 0 0 1px #640101'
                    }}
                  />
                </InputGroup>
              </Box>

              <HStack spacing={2}>
                {/* Dashboard Button and Profile Group */}
                <HStack spacing={2} bg={currentUser ? "gray.50" : "orange.50"} borderRadius="full" px={3} py={1}>
                  <Button
                    leftIcon={<FaTachometerAlt />}
                    onClick={handleGoToDashboard}
                    size="sm"
                    bg={currentUser ? "#640101" : "orange.400"}
                    color="white"
                    borderRadius="full"
                    px={3}
                    fontWeight="600"
                    fontSize="sm"
                    _hover={{ bg: currentUser ? "black" : "orange.500" }}
                    title={currentUser ? `Go to your ${currentUser.role} dashboard` : "Login to access dashboard"}
                  >
                    {currentUser ? 'Dashboard' : 'Login'}
                  </Button>
                  <Avatar 
                    size="sm" 
                    name={currentUser?.name || "Guest User"}
                    src={currentUser?.profile_picture}
                    bg={currentUser ? "#640101" : "gray.400"} 
                    color="white" 
                    cursor="pointer"
                    onClick={() => {
                      if (!currentUser) {
                        onLoginOpen();
                      }
                    }}
                  />
                </HStack>
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.100">
        <Container maxW="8xl" py={4}>
          <SimpleGrid columns={4} spacing={6}>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="700" color="#640101">
                {filteredPosts.length}
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="500">
                Opportunities
              </Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="700" color="#640101">
                124
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="500">
                Institutions
              </Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="700" color="#640101">
                2.4K
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="500">
                Students
              </Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="700" color="#640101">
                98%
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="500">
                Success Rate
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxW="8xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Section Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="gray.900" fontWeight="600">
                Educational Opportunities
              </Heading>
              <Text color="gray.600" fontSize="md">
                Discover programs from top institutions
              </Text>
            </VStack>
            <Button
              rightIcon={<FaArrowRight />}
              variant="outline"
              borderColor="#640101"
              color="#640101"
              fontWeight="600"
              borderRadius="lg"
              px={6}
              _hover={{ 
                bg: '#640101', 
                color: 'white'
              }}
            >
              View All
            </Button>
          </Flex>

          {/* Horizontal Cards Grid */}
          {filteredPosts.length > 0 ? (
            <Box
              overflowX="auto"
              pb={4}
              css={{
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#640101',
                  borderRadius: '3px',
                },
              }}
            >
              <HStack spacing={4} align="stretch" pb={2}>
                {filteredPosts.map((post, index) => (
                  <Card
                    key={post.id}
                    minW="350px"
                    maxW="350px"
                    bg={cardBg}
                    borderRadius="lg"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      borderColor: '#640101',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    {/* Image Section */}
                    {post.image_url && (
                      <Box position="relative" height="220px">
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          objectPosition={post.image_position || 'center center'}
                          transform={`scale(${(post.image_zoom || 100) / 100})`}
                        />
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%)"
                        />
                        {post.is_featured && (
                          <Badge
                            position="absolute"
                            top={4}
                            left={4}
                            bg="#640101"
                            color="white"
                            fontSize="xs"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="700"
                            textTransform="uppercase"
                            letterSpacing="1px"
                          >
                            Featured
                          </Badge>
                        )}
                      </Box>
                    )}

                    <CardBody p={5}>
                      <VStack align="stretch" spacing={3}>
                        {/* Institution Header */}
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={post.institution_name}
                            bg="#640101"
                            color="white"
                            fontWeight="600"
                          />
                          <VStack align="start" spacing={0} flex="1">
                            <Text fontWeight="600" fontSize="sm" color="gray.900">
                              {post.institution_name}
                            </Text>
                            <HStack spacing={2}>
                              {institutionDetails[post.institution_id] ? (
                                <>
                                  <HStack spacing={0.5}>
                                    {renderStars(Math.round(institutionDetails[post.institution_id].average_rating || 0))}
                                  </HStack>
                                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                                    {institutionDetails[post.institution_id].average_rating?.toFixed(1)} ({institutionDetails[post.institution_id].rating_count || 0})
                                  </Text>
                                </>
                              ) : (
                                <Badge colorScheme="red" fontSize="xs" variant="subtle">
                                  New
                                </Badge>
                              )}
                            </HStack>
                          </VStack>
                        </HStack>

                        {/* Location */}
                        {institutionDetails[post.institution_id]?.address && (
                          <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="#640101" boxSize={3} />
                            <Text fontSize="xs" color="gray.600" fontWeight="500" noOfLines={1}>
                              {institutionDetails[post.institution_id].address}
                            </Text>
                          </HStack>
                        )}

                        <Divider borderColor="gray.200" />

                        {/* Content */}
                        <VStack align="stretch" spacing={2}>
                          <Heading 
                            size="sm" 
                            color="gray.900" 
                            fontWeight="600"
                            lineHeight="1.3"
                            noOfLines={2}
                          >
                            {post.title}
                          </Heading>
                          {post.content && (
                            <Text 
                              color="gray.600" 
                              fontSize="xs" 
                              lineHeight="1.5"
                              noOfLines={2}
                            >
                              {post.content}
                            </Text>
                          )}
                        </VStack>

                        {/* Action Buttons */}
                        <VStack spacing={2} pt={1}>
                          <Button
                            leftIcon={<FaGraduationCap />}
                            bg="#640101"
                            color="white"
                            size="md"
                            width="100%"
                            fontWeight="600"
                            borderRadius="lg"
                            onClick={() => handleApply(post)}
                            _hover={{
                              bg: '#8B0000'
                            }}
                          >
                            Apply Now
                          </Button>
                          
                          <HStack spacing={2} width="100%">
                            <Button
                              leftIcon={<FaUser />}
                              variant="outline"
                              borderColor="gray.300"
                              color="gray.700"
                              size="sm"
                              flex="1"
                              fontWeight="500"
                              borderRadius="lg"
                              onClick={() => handleViewProfile(post.institution_id)}
                              _hover={{
                                borderColor: '#640101',
                                color: '#640101'
                              }}
                            >
                              Profile
                            </Button>
                            
                            <IconButton
                              icon={<FaHeart />}
                              variant="outline"
                              borderColor="gray.300"
                              color="gray.400"
                              size="sm"
                              borderRadius="lg"
                              onClick={() => handleLike(post.id)}
                              _hover={{
                                borderColor: '#e53e3e',
                                color: '#e53e3e'
                              }}
                            />
                            <IconButton
                              icon={<FaShare />}
                              variant="outline"
                              borderColor="gray.300"
                              color="gray.400"
                              size="sm"
                              borderRadius="lg"
                              onClick={() => handleShare(post.id)}
                              _hover={{
                                borderColor: '#640101',
                                color: '#640101'
                              }}
                            />
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </HStack>
            </Box>
          ) : (
            <Center py={16}>
              <VStack spacing={4} textAlign="center">
                <Box
                  w="80px"
                  h="80px"
                  bg="gray.100"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaSearch} boxSize={8} color="gray.400" />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.600" fontWeight="600">
                    {searchQuery ? 'No matches found' : 'No opportunities available'}
                  </Heading>
                  <Text color="gray.500" fontSize="sm" maxW="400px">
                    {searchQuery 
                      ? `We couldn't find any opportunities matching "${searchQuery}".`
                      : 'Educational opportunities will be added here soon.'
                    }
                  </Text>
                </VStack>
                {searchQuery && (
                  <Button
                    bg="#640101"
                    color="white"
                    size="md"
                    borderRadius="lg"
                    fontWeight="600"
                    px={6}
                    onClick={() => setSearchQuery('')}
                    _hover={{
                      bg: '#8B0000'
                    }}
                  >
                    Clear Search
                  </Button>
                )}
              </VStack>
            </Center>
          )}
        </VStack>
      </Container>

      {/* Application Modal */}
      <Modal isOpen={isApplyOpen} onClose={onApplyClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedPost && (
              <VStack align="start" spacing={2}>
                <Text fontSize="lg" fontWeight="700" color="#640101">
                  Apply to {selectedPost.institution_name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {selectedPost.title}
                </Text>
              </VStack>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoadingForm ? (
              <Center py={8}>
                <VStack spacing={4}>
                  <Spinner size="lg" color="#640101" />
                  <Text color="gray.600">Loading application form...</Text>
                </VStack>
              </Center>
            ) : applicationForm ? (
              <VStack spacing={6} align="stretch">
                {applicationForm.description && (
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      {applicationForm.description}
                    </Text>
                    <Divider />
                  </Box>
                )}
                
                {formFields.map((field, index) => (
                  <FormControl key={index} isRequired={field.is_required}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      {field.field_label}
                      {field.is_required && <Text as="span" color="red.500" ml={1}>*</Text>}
                    </FormLabel>
                    {renderFormField(field)}
                  </FormControl>
                ))}

                {formFields.length === 0 && (
                  <Center py={8}>
                    <Text color="gray.500">No form fields configured.</Text>
                  </Center>
                )}
              </VStack>
            ) : (
              <Center py={8}>
                <Text color="red.500">Failed to load application form.</Text>
              </Center>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onApplyClose}>
              Cancel
            </Button>
            <Button
              bg="#640101"
              color="white"
              onClick={handleSubmitApplication}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              isDisabled={!applicationForm || formFields.length === 0}
              _hover={{ bg: '#8B0000' }}
            >
              Submit Application
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
    </Box>
  );
};

export default InstructorFeed; 