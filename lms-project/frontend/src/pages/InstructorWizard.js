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
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import {
  FaUser,
  FaChalkboardTeacher,
  FaCertificate,
  FaLightbulb,
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaPlus
} from 'react-icons/fa';

const API_URL = 'http://localhost:5001/api';

const InstructorWizard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    firstName: '',
    lastName: '',
    phone: '',
    
    // Professional Background (Step 2)
    specialization: '',
    experience: '',
    education: '',
    currentPosition: '',
    
    // Skills & Expertise (Step 3)
    skills: [],
    languages: [],
    certifications: '',
    
    // Teaching & Goals (Step 4)
    teachingExperience: '',
    teachingStyle: '',
    bio: '',
    availability: ''
  });

  const [tempSkill, setTempSkill] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Get current registration info if available
    const fetchRegistrationData = async () => {
      try {
        const authData = localStorage.getItem('authData');
        if (authData) {
          const parsedAuthData = JSON.parse(authData);
          if (parsedAuthData.user && parsedAuthData.user.role === 'instructor_pending') {
            const nameParts = parsedAuthData.user.name?.split(' ') || [];
            setFormData(prev => ({
              ...prev,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching registration data:', error);
      }
    };
    
    fetchRegistrationData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, tempSkill.trim()]
      }));
      setTempSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addLanguage = () => {
    if (tempLanguage.trim() && !formData.languages.includes(tempLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, tempLanguage.trim()]
      }));
      setTempLanguage('');
    }
  };

  const removeLanguage = (languageToRemove) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(language => language !== languageToRemove)
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
      const authData = localStorage.getItem('authData');
      if (!authData) {
        throw new Error('No registration data found');
      }

      const parsedAuthData = JSON.parse(authData);
      const registrationId = parsedAuthData.registration_id;
      
      if (!registrationId) {
        throw new Error('No registration ID found');
      }

      // Update instructor registration with wizard data
      const wizardData = {
        bio: formData.bio,
        phone: formData.phone,
        specialization: formData.specialization,
        education: formData.education,
        experience: formData.experience,
        certifications: formData.certifications,
        linkedin_profile: '', // You can add LinkedIn field if needed
        portfolio_url: ''  // You can add portfolio field if needed
      };

      const response = await fetch(`${API_URL}/instructor-registration/${registrationId}/wizard`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wizardData),
      });

      if (response.ok) {
        toast({
          title: 'Application Submitted Successfully!',
          description: 'Your instructor application has been submitted for review. You will be notified once it is approved by our admin team.',
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
        
        // Clear auth data since this is just a registration
        localStorage.removeItem('authData');
        localStorage.removeItem('authToken');
        
        // Redirect to home page with a message
        navigate('/', { 
          state: { 
            message: 'Your instructor application has been submitted for review. Please check your email for updates.' 
          } 
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update registration');
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        title: 'Submission Failed',
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
              <Icon as={FaChalkboardTeacher} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Professional Background</Heading>
              <Text color="gray.600">Tell us about your expertise and experience</Text>
            </VStack>
            
            <SimpleGrid columns={1} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Primary Specialization</FormLabel>
                <Input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Computer Science, Physics"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Years of Experience</FormLabel>
                <Select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Highest Education</FormLabel>
                <Select
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                >
                  <option value="">Select education level</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Current Position/Title</FormLabel>
                <Input
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer, Mathematics Professor"
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
            </SimpleGrid>
          </VStack>
        );
        
      case 3:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Icon as={FaCertificate} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Skills & Expertise</Heading>
              <Text color="gray.600">What skills can you teach?</Text>
            </VStack>
            
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Skills & Subjects You Can Teach</FormLabel>
                <HStack>
                  <Input
                    value={tempSkill}
                    onChange={(e) => setTempSkill(e.target.value)}
                    placeholder="Add a skill or subject"
                    borderColor="#640101"
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button
                    leftIcon={<FaPlus />}
                    onClick={addSkill}
                    bg="#640101"
                    color="white"
                    _hover={{ bg: '#8B0000' }}
                  >
                    Add
                  </Button>
                </HStack>
                <Wrap mt={2}>
                  {formData.skills.map((skill, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="red" borderRadius="full">
                        <TagLabel>{skill}</TagLabel>
                        <TagCloseButton onClick={() => removeSkill(skill)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>
              
              <FormControl>
                <FormLabel>Languages You Speak</FormLabel>
                <HStack>
                  <Input
                    value={tempLanguage}
                    onChange={(e) => setTempLanguage(e.target.value)}
                    placeholder="Add a language"
                    borderColor="#640101"
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  />
                  <Button
                    leftIcon={<FaPlus />}
                    onClick={addLanguage}
                    bg="#640101"
                    color="white"
                    _hover={{ bg: '#8B0000' }}
                  >
                    Add
                  </Button>
                </HStack>
                <Wrap mt={2}>
                  {formData.languages.map((language, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="blue" borderRadius="full">
                        <TagLabel>{language}</TagLabel>
                        <TagCloseButton onClick={() => removeLanguage(language)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>
              
              <FormControl>
                <FormLabel>Certifications & Qualifications</FormLabel>
                <Textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="List any relevant certifications, licenses, or qualifications..."
                  rows={3}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
            </VStack>
          </VStack>
        );
        
      case 4:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Icon as={FaLightbulb} boxSize={12} color="#640101" />
              <Heading size="lg" color="#640101">Teaching Profile</Heading>
              <Text color="gray.600">Complete your instructor profile</Text>
            </VStack>
            
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Teaching Experience</FormLabel>
                <Textarea
                  name="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={handleInputChange}
                  placeholder="Describe your teaching experience, where you've taught, and any notable achievements..."
                  rows={3}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Teaching Style</FormLabel>
                <Select
                  name="teachingStyle"
                  value={formData.teachingStyle}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                >
                  <option value="">Select your teaching style</option>
                  <option value="interactive">Interactive & Hands-on</option>
                  <option value="lecture">Lecture-based</option>
                  <option value="discussion">Discussion & Collaboration</option>
                  <option value="project">Project-based Learning</option>
                  <option value="mixed">Mixed Approach</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>About You</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a brief introduction about yourself, your passion for teaching, and what makes you unique as an instructor..."
                  rows={4}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Availability</FormLabel>
                <Select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  borderColor="#640101"
                  _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                >
                  <option value="">Select availability</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="weekends">Weekends only</option>
                  <option value="evenings">Evenings only</option>
                  <option value="flexible">Flexible schedule</option>
                </Select>
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
              Welcome, Instructor!
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Let's set up your teaching profile to help students find you
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

export default InstructorWizard; 