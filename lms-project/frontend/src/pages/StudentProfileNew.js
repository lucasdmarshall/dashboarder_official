import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Flex, 
  Avatar, 
  Button, 
  Grid, 
  GridItem,
  Icon,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Divider,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaEdit,
  FaSave,
  FaUniversity,
  FaGraduationCap
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';

const API_URL = 'http://localhost:5001/api';

const StudentProfileNew = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Profile data state with default values
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    university: '',
    major: '',
    graduationYear: '',
    bio: ''
  });

  const primaryColor = '#640101';
  const secondaryColor = '#000000';
  const accentColor = '#FFFFFF';

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue(accentColor, primaryColor);
  const textColor = useColorModeValue(secondaryColor, accentColor);

  // Fetch current user data from API
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to view your profile.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/student-feed');
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        
        // Parse the name into firstName and lastName
        const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Get institution name if user has institution_id
        let institutionName = userData.institution_name || '';
        if (userData.institution_id && !institutionName) {
          try {
            const institutionResponse = await fetch(`${API_URL}/institutions/${userData.institution_id}/profile`);
            if (institutionResponse.ok) {
              const institutionData = await institutionResponse.json();
              institutionName = institutionData.name || '';
            }
          } catch (error) {
            console.log('Could not fetch institution data:', error);
          }
        }
        
        // Set profile data from user data
        setProfileData({
          firstName,
          lastName,
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          dateOfBirth: '', // Not available in current user model
          university: institutionName,
          major: userData.specialization || '',
          graduationYear: '', // Not available in current user model
          bio: userData.bio || ''
        });
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/student-feed');
      } else {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      toast({
        title: 'Error Loading Profile',
        description: 'Failed to load your profile data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Combine firstName and lastName back into name
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
      
      // Prepare update data
      const updateData = {
        name: fullName,
        bio: profileData.bio,
        phone: profileData.phone,
        address: profileData.address,
        // Note: Some fields like dateOfBirth, graduationYear may need 
        // additional backend support to be stored
      };

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        setIsEditing(false);
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/student-feed');
      } else {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save your profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Flex bg={bgColor}>
        <StudentSidebar />
        <Container 
          maxW="container.xl" 
          ml="250px" 
          mt="85px" 
          pb={8} 
          px={6}
        >
          <Center minH="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color={primaryColor} thickness="4px" />
              <Text color={textColor}>Loading your profile...</Text>
            </VStack>
          </Center>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex bg={bgColor}>
      <StudentSidebar />
      <Container 
        maxW="container.xl" 
        ml="250px" 
        mt="85px" 
        pb={8} 
        px={6}
        color={textColor}
      >
        <Button 
          leftIcon={<FaUser />} 
          mb={6} 
          onClick={() => navigate('/student-home')}
          variant="outline"
          borderColor={primaryColor}
          color={primaryColor}
          _hover={{ 
            bg: primaryColor, 
            color: accentColor 
          }}
        >
          Back to Dashboard
        </Button>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {/* Profile Overview */}
          <GridItem colSpan={1}>
            <Box 
              bg={cardBg} 
              borderWidth="2px" 
              borderColor={primaryColor}
              borderRadius="lg"
              boxShadow="xl"
              p={6}
              textAlign="center"
            >
              <Avatar 
                size="2xl" 
                src={currentUser?.profile_picture || "https://bit.ly/dan-abramov"} 
                name={`${profileData.firstName} ${profileData.lastName}`}
                mb={4}
                border="4px solid"
                borderColor={primaryColor}
              />
              <Heading 
                size="lg" 
                color={primaryColor}
                mb={2}
              >
                {profileData.firstName} {profileData.lastName}
              </Heading>
              <Text 
                color={textColor}
                opacity={0.7}
                mb={4}
              >
                {profileData.major || 'Student'}
              </Text>
              {profileData.university && (
                <HStack 
                  spacing={3} 
                  justifyContent="center"
                  mb={4}
                >
                  <Icon as={FaUniversity} color={primaryColor} />
                  <Text>{profileData.university}</Text>
                </HStack>
              )}
              {profileData.graduationYear && (
                <HStack 
                  spacing={3} 
                  justifyContent="center"
                >
                  <Icon as={FaGraduationCap} color={primaryColor} />
                  <Text>Expected Graduation: {profileData.graduationYear}</Text>
                </HStack>
              )}
              {currentUser?.student_id && (
                <Text 
                  fontSize="sm" 
                  color={textColor}
                  opacity={0.6}
                  mt={2}
                >
                  Student ID: {currentUser.student_id}
                </Text>
              )}
            </Box>
          </GridItem>

          {/* Profile Details */}
          <GridItem colSpan={2}>
            <Box 
              bg={cardBg} 
              borderWidth="2px" 
              borderColor={primaryColor}
              borderRadius="lg"
              boxShadow="xl"
              p={6}
            >
              <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Heading 
                  size="md" 
                  color={primaryColor}
                >
                  Personal Information
                </Heading>
                <Button 
                  leftIcon={isEditing ? <FaSave /> : <FaEdit />}
                  size="sm"
                  variant="outline"
                  borderColor={primaryColor}
                  color={primaryColor}
                  onClick={isEditing ? saveProfile : toggleEditMode}
                  isLoading={isSaving}
                  loadingText="Saving..."
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    borderColor={primaryColor}
                    _focus={{ 
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`
                    }}
                  />
                </FormControl>

                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    borderColor={primaryColor}
                    _focus={{ 
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email"
                    name="email"
                    value={profileData.email}
                    isReadOnly
                    borderColor={primaryColor}
                  />
                </FormControl>

                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>Phone</FormLabel>
                  <Input 
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    borderColor={primaryColor}
                    _focus={{ 
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`
                    }}
                  />
                </FormControl>

                <FormControl isReadOnly={!isEditing} colSpan={2}>
                  <FormLabel>Address</FormLabel>
                  <Input 
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    borderColor={primaryColor}
                    _focus={{ 
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`
                    }}
                  />
                </FormControl>

                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input 
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    borderColor={primaryColor}
                    _focus={{ 
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`
                    }}
                  />
                </FormControl>
              </Grid>

              <Divider my={6} borderColor={primaryColor} />

              <FormControl isReadOnly={!isEditing}>
                <FormLabel>Bio</FormLabel>
                <Textarea 
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  borderColor={primaryColor}
                  _focus={{ 
                    borderColor: primaryColor,
                    boxShadow: `0 0 0 1px ${primaryColor}`
                  }}
                  rows={4}
                />
              </FormControl>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Flex>
  );
};

export default StudentProfileNew;
