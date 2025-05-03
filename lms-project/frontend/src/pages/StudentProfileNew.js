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
  Divider
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

const StudentProfileNew = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Learning Street, Education City, ED 12345',
    dateOfBirth: '1998-05-15',
    university: 'Tech University',
    major: 'Computer Science',
    graduationYear: '2025',
    bio: 'Passionate learner with a keen interest in web development and artificial intelligence.'
  });

  const primaryColor = '#640101';
  const secondaryColor = '#000000';
  const accentColor = '#FFFFFF';

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue(accentColor, primaryColor);
  const textColor = useColorModeValue(secondaryColor, accentColor);

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

  const saveProfile = () => {
    // In a real app, this would send data to backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

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
                src="https://bit.ly/dan-abramov" 
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
                {profileData.major} Student
              </Text>
              <HStack 
                spacing={3} 
                justifyContent="center"
                mb={4}
              >
                <Icon as={FaUniversity} color={primaryColor} />
                <Text>{profileData.university}</Text>
              </HStack>
              <HStack 
                spacing={3} 
                justifyContent="center"
              >
                <Icon as={FaGraduationCap} color={primaryColor} />
                <Text>Expected Graduation: {profileData.graduationYear}</Text>
              </HStack>
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
