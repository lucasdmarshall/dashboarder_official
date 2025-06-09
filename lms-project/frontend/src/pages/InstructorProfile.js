import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Wrap,
  WrapItem,
  Container,
  HStack,
  Avatar,
  Button,
  useColorModeValue,
  useToast,
  Tooltip,
  Progress,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tag,
  TagLabel,
  TagCloseButton,  
  Grid,
  GridItem,
  SimpleGrid,
  Badge,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Input,
  FormControl,
  FormLabel,
  extendTheme,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  CloseButton
} from '@chakra-ui/react';
import {
  FaMoon,
  FaEnvelope,
  FaLanguage,
  FaQuoteLeft,
  FaQuoteRight,
  FaMapMarkerAlt,
  FaCheck,
  FaUniversity,
  FaCertificate,
  FaBook,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaEdit,
  FaTimes
} from 'react-icons/fa';

import InstructorSidebar from '../components/InstructorSidebar';
import { useSubscription } from '../contexts/subscriptionContext';
import VerifiedBadge from '../components/VerifiedBadge';
import verifiedIcon from '../icons/verified.webm';

const ENHANCED_THEME_COLORS = {
  background: '#F7FAFC',     // Soft light background
  cardBackground: '#FFFFFF', // Pure white for cards
  text: {
    primary: '#640101',      // Deep red for primary text
    secondary: '#8B0000',    // Darker red for secondary text
    muted: '#A52A2A'         // Brownish red for muted text
  },
  border: {
    light: 'rgba(100, 1, 1, 0.2)',  // Soft red border
    medium: 'rgba(100, 1, 1, 0.3)'  // Medium red border
  },
  accent: {
    primary: '#640101',      // Deep red for accents
    hover: '#8B0000'         // Darker red for hover states
  }
};

const API_URL = 'http://localhost:5001/api';

// Enhanced global styles
const enhancedTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: ENHANCED_THEME_COLORS.background,
        color: ENHANCED_THEME_COLORS.text.primary,
        fontFamily: 'Inter, sans-serif'
      }
    }
  },
  components: {
    Box: {
      baseStyle: {
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-4px)',
          boxShadow: 'lg'
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: ENHANCED_THEME_COLORS.cardBackground,
          borderColor: ENHANCED_THEME_COLORS.border.light,
          borderWidth: '1px',
          boxShadow: 'md',
          borderRadius: 'xl'
        }
      }
    },
    Text: {
      baseStyle: {
        lineHeight: 'tall',
        letterSpacing: 'wide'
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        color: ENHANCED_THEME_COLORS.text.primary
      }
    }
  }
});

const RatingBreakdown = ({ reviews, selectedRating, onRatingSelect }) => {
  // Calculate rating counts
  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      counts[review.rating - 1]++;
    });
    return counts.reverse(); // Reverse to show 5-moon first
  }, [reviews]);

  const totalReviews = reviews.length;

  return (
    <VStack align="stretch" spacing={2} width="full">
      {ratingCounts.map((count, index) => {
        const moons = 5 - index;
        const percentage = (count / totalReviews) * 100;
        
        return (
          <HStack 
            key={moons} 
            spacing={2} 
            cursor="pointer" 
            onClick={() => onRatingSelect(moons)}
            bg={selectedRating === moons ? 'gray.100' : 'transparent'}
            p={1}
            borderRadius="md"
            alignItems="center"
          >
            <HStack width="50px" spacing={1} justifyContent="flex-end" alignItems="center">
              <FaMoon color={ENHANCED_THEME_COLORS.accent.primary} size={12} />
              <Text fontWeight="bold" color={ENHANCED_THEME_COLORS.text.primary}>{moons}</Text>
            </HStack>
            <Progress 
              value={percentage} 
              size="sm" 
              width="full"
              backgroundColor="gray.100"  
              borderRadius="full"
              colorScheme="gray"
            >
              <Box 
                bg="gray.300"
                height="100%" 
                borderRadius="full"
                width={`${percentage}%`}
                position="absolute"
                top="0"
                left="0"
              />
            </Progress>
            <Text width="50px" textAlign="left">({count})</Text>
          </HStack>
        );
      })}
    </VStack>
  );
};

const ReviewCard = ({ review }) => (
  <Box 
    bg={ENHANCED_THEME_COLORS.cardBackground}
    p={4} 
    borderRadius="md" 
    mb={3}
    position="relative"
    boxShadow="sm"
    borderWidth="1px"
    borderColor={ENHANCED_THEME_COLORS.border.light}
    transition="all 0.3s ease"
    _hover={{
      transform: 'translateY(-5px)',
      boxShadow: 'md'
    }}
  >
    <Icon 
      as={FaQuoteLeft} 
      position="absolute" 
      top={3} 
      left={3} 
      color={ENHANCED_THEME_COLORS.accent.primary}
      opacity={0.5} 
    />
    <Icon 
      as={FaQuoteRight} 
      position="absolute" 
      bottom={3} 
      right={3} 
      color={ENHANCED_THEME_COLORS.accent.primary}
      opacity={0.5} 
    />
    <VStack align="start" spacing={3}>
      <HStack width="full">
        <Avatar 
          size="sm" 
          name={review.studentName} 
          src={review.studentAvatar} 
          mr={2} 
        />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold" fontSize="sm">{review.studentName}</Text>
          <HStack>
            {[...Array(5)].map((_, i) => (
              <FaMoon 
                key={i} 
                color={i < review.rating ? ENHANCED_THEME_COLORS.accent.primary : ENHANCED_THEME_COLORS.border.light} 
                size={12} 
              />
            ))}
          </HStack>
        </VStack>
        <Spacer />
        <Text 
          color={ENHANCED_THEME_COLORS.text.muted} 
          fontSize="xs"
        >
          {review.date}
        </Text>
      </HStack>
      <Text 
        color={ENHANCED_THEME_COLORS.text.secondary} 
        fontSize="sm"
      >
        {review.comment}
      </Text>
      <Badge 
        size="sm"
        bg={ENHANCED_THEME_COLORS.border.light}  
        color={ENHANCED_THEME_COLORS.text.primary}  
        borderRadius="md"
        m={1}
      >
        {review.course}
      </Badge>
      {review.skills && (
        <Wrap>
          {review.skills.map((skill, index) => (
            <WrapItem key={index}>
              <Tag 
                size="sm" 
                bg={ENHANCED_THEME_COLORS.border.light}  
                color={ENHANCED_THEME_COLORS.text.primary}  
                m={1}
              >
                {skill}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  </Box>
);

const SkillTag = ({ skill }) => (
  <Tag 
    size="md" 
    bg={ENHANCED_THEME_COLORS.border.light}  
    color={ENHANCED_THEME_COLORS.text.primary}  
    borderRadius="md"
    m={1}
  >
    {skill}
  </Tag>
);

const StatCard = ({ icon, label, value, color }) => (
  <Box 
    bg={ENHANCED_THEME_COLORS.cardBackground} 
    borderWidth="1px" 
    borderRadius="lg" 
    p={4} 
    textAlign="center"
    borderColor={ENHANCED_THEME_COLORS.border.light}
    boxShadow="md"
    transition="all 0.3s ease"
    _hover={{
      transform: 'translateY(-5px)',
      boxShadow: 'lg'
    }}
  >
    <Icon 
      as={icon} 
      color={color} 
      mb={2} 
      boxSize={8}
    />
    <Text 
      fontWeight="semibold" 
      color={ENHANCED_THEME_COLORS.text.secondary}
      mb={1}
    >
      {label}
    </Text>
    <Text 
      fontSize="xl" 
      fontWeight="bold" 
      color={ENHANCED_THEME_COLORS.text.primary}
    >
      {value}
    </Text>
  </Box>
);

const InstructorProfile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { hasActiveRedMark, getCurrentUserId } = useSubscription();
  const cardBg = useColorModeValue(ENHANCED_THEME_COLORS.cardBackground, ENHANCED_THEME_COLORS.cardBackground);
  const textColor = useColorModeValue(ENHANCED_THEME_COLORS.text.primary, ENHANCED_THEME_COLORS.text.primary);

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for editable sections
  const [aboutMe, setAboutMe] = useState('');
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', year: '' });

  // State for new editable fields
  const [instructorName, setInstructorName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [location, setLocation] = useState('');
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState('');

  // State for profile data
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    teacherCode: '',
    title: '',
    email: '',
    location: null,  // Can be NULL
    languages: [],
    rating: 0,
    totalReviews: 0,
    responseTime: '',
    skills: [],
    education: [],
    certifications: [],
    courses: [],  // Empty array for non-assigned instructors
    reviews: [],  // Empty array for non-reviewed instructors
    bio: '',
    avatar: '',
    level: null,  // NULL if not purchased
    red_mark: null,  // NULL if not purchased
  });

  // Generate instructor ID based on profile data
  const getInstructorId = () => {
    if (profile.id) return profile.id;
    if (profile.teacherCode) return `instructor-${profile.teacherCode.toLowerCase()}`;
    if (profile.name) return `instructor-${profile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    return null;
  };

  // Modal controls
  const {
    isOpen: isAboutMeOpen, 
    onOpen: onAboutMeOpen, 
    onClose: onAboutMeClose
  } = useDisclosure();
  const {
    isOpen: isSkillsOpen, 
    onOpen: onSkillsOpen, 
    onClose: onSkillsClose
  } = useDisclosure();
  const {
    isOpen: isEducationOpen, 
    onOpen: onEducationOpen, 
    onClose: onEducationClose
  } = useDisclosure();
  const {
    isOpen: isCertificationOpen, 
    onOpen: onCertificationOpen, 
    onClose: onCertificationClose
  } = useDisclosure();

  // New modal controls
  const {
    isOpen: isNameOpen,
    onOpen: onNameOpen,
    onClose: onNameClose
  } = useDisclosure();
  const {
    isOpen: isPhotoOpen,
    onOpen: onPhotoOpen,
    onClose: onPhotoClose
  } = useDisclosure();
  const {
    isOpen: isLocationOpen,
    onOpen: onLocationOpen,
    onClose: onLocationClose
  } = useDisclosure();
  const {
    isOpen: isLanguagesOpen,
    onOpen: onLanguagesOpen,
    onClose: onLanguagesClose
  } = useDisclosure();

  // Fetch instructor profile data
  useEffect(() => {
    const fetchInstructorProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/instructor-login');
          return;
        }

        const response = await fetch(`${API_URL}/instructors/me/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/instructor-login');
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform API data to match component structure
        const transformedProfile = {
          id: data.profile.id || '',
          name: data.instructor.name || 'Unknown Instructor',
          teacherCode: data.profile.teacherCode || 'IS000000',
          title: data.profile.title || 'Subject Matter Expert',
          email: data.instructor.email || '',
          location: data.profile.location || null,  // Can be NULL if not purchased
          languages: data.profile.languages || ['English'],
          rating: data.profile.rating || 0,  // From reviews when they exist
          totalReviews: data.profile.totalReviews || 0,  // From reviews when they exist
          responseTime: data.profile.responseTime || '1 hour',
          skills: data.profile.skills || [],  // From database, editable
          education: data.profile.education || [],  // From database, editable
          certifications: data.profile.certifications || [],  // From database, editable
          courses: data.courses || [],  // Empty array until assigned to institution
          reviews: data.reviews || [],  // Empty array until students review
          bio: data.instructor.bio || 'Passionate educator dedicated to helping students achieve their goals.',
          avatar: data.profile.avatar || 'https://bit.ly/dan-abramov',
          level: data.profile.level,  // NULL if not purchased
          red_mark: data.profile.red_mark,  // NULL if not purchased
        };

        setProfile(transformedProfile);
        setAboutMe(transformedProfile.bio);
        setSkills(transformedProfile.skills);
        setEducation(transformedProfile.education);
        setCertifications(transformedProfile.certifications);

        // Initialize new editable fields
        setInstructorName(transformedProfile.name);
        setProfilePhoto(transformedProfile.avatar);
        setLocation(transformedProfile.location || '');
        setLanguages(transformedProfile.languages);

      } catch (err) {
        console.error('Error fetching instructor profile:', err);
        setError(err.message);
        toast({
          title: 'Error Loading Profile',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorProfile();
  }, [navigate, toast]);

  // Save profile updates to backend
  const saveProfileUpdate = async (updateData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/instructor-login');
        return;
      }

      const response = await fetch(`${API_URL}/instructors/me/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      toast({
        title: 'Profile Updated',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Update Failed',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw err;
    }
  };

  const [selectedRating, setSelectedRating] = useState(null);

  const filteredReviews = useMemo(() => {
    return selectedRating 
      ? profile.reviews.filter(review => review.rating === selectedRating)
      : profile.reviews;
  }, [profile.reviews, selectedRating]);

  const handleRatingSelect = (rating) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const bgColor = useColorModeValue(ENHANCED_THEME_COLORS.background, ENHANCED_THEME_COLORS.background);

  useEffect(() => {
    // Set instructor name and code in localStorage for course creation
    localStorage.setItem('instructorName', profile.name);
    localStorage.setItem('instructorCode', profile.teacherCode);
  }, [profile.name, profile.teacherCode]);

  // Edit About Me Modal
  const AboutMeModal = () => {
    const [tempAboutMe, setTempAboutMe] = useState(aboutMe);

    return (
      <Modal 
        isOpen={isAboutMeOpen} 
        onClose={onAboutMeClose} 
        size="xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit About Me</ModalHeader>
          <ModalCloseButton 
            onClick={(e) => {
              e.stopPropagation();
              setTempAboutMe(aboutMe);
              onAboutMeClose();
            }} 
          />
          <ModalBody>
            <Textarea 
              value={tempAboutMe} 
              onChange={(e) => setTempAboutMe(e.target.value)}
              placeholder="Tell us about yourself..."
              size="lg"
              height="200px"
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ bio: tempAboutMe });
                  setAboutMe(tempAboutMe);
                  setProfile(prev => ({ ...prev, bio: tempAboutMe }));
                  onAboutMeClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                setTempAboutMe(aboutMe);
                onAboutMeClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Skills Modal
  const SkillsModal = () => {
    const [tempSkills, setTempSkills] = useState([...skills]);
    const [localNewSkill, setLocalNewSkill] = useState('');

    // Reset local state when modal opens
    useEffect(() => {
      if (isSkillsOpen) {
        setTempSkills([...skills]);
        setLocalNewSkill('');
      }
    }, [isSkillsOpen, skills]);

    const addSkill = () => {
      if (localNewSkill.trim() && !tempSkills.includes(localNewSkill.trim())) {
        setTempSkills([...tempSkills, localNewSkill.trim()]);
        setLocalNewSkill('');
      }
    };

    const removeSkill = (skillToRemove) => {
      setTempSkills(tempSkills.filter(skill => skill !== skillToRemove));
    };

    return (
      <Modal isOpen={isSkillsOpen} onClose={onSkillsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Skills</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Input 
                  value={localNewSkill}
                  onChange={(e) => setLocalNewSkill(e.target.value)}
                  placeholder="Add a new skill..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button onClick={addSkill} colorScheme="blue">Add</Button>
              </HStack>
              <Wrap spacing={2}>
                {tempSkills.map((skill, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" variant="solid" colorScheme="blue">
                      <TagLabel>{skill}</TagLabel>
                      <TagCloseButton onClick={() => removeSkill(skill)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ skills: tempSkills });
                  setSkills(tempSkills);
                  setProfile(prev => ({ ...prev, skills: tempSkills }));
                  onSkillsClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onSkillsClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Education Modal
  const EducationModal = () => {
    const [tempEducation, setTempEducation] = useState([...education]);
    const [localNewEducation, setLocalNewEducation] = useState({ degree: '', institution: '', year: '' });

    // Reset local state when modal opens
    useEffect(() => {
      if (isEducationOpen) {
        setTempEducation([...education]);
        setLocalNewEducation({ degree: '', institution: '', year: '' });
      }
    }, [isEducationOpen, education]);

    const addEducation = () => {
      if (localNewEducation.degree.trim() && localNewEducation.institution.trim()) {
        setTempEducation([...tempEducation, { ...localNewEducation }]);
        setLocalNewEducation({ degree: '', institution: '', year: '' });
      }
    };

    const removeEducation = (index) => {
      setTempEducation(tempEducation.filter((_, i) => i !== index));
    };

    return (
      <Modal isOpen={isEducationOpen} onClose={onEducationClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Education</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Degree</FormLabel>
                  <Input 
                    value={localNewEducation.degree}
                    onChange={(e) => setLocalNewEducation({...localNewEducation, degree: e.target.value})}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Institution</FormLabel>
                  <Input 
                    value={localNewEducation.institution}
                    onChange={(e) => setLocalNewEducation({...localNewEducation, institution: e.target.value})}
                    placeholder="e.g., Harvard University"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <Input 
                    value={localNewEducation.year}
                    onChange={(e) => setLocalNewEducation({...localNewEducation, year: e.target.value})}
                    placeholder="e.g., 2020"
                  />
                </FormControl>
                <Button onClick={addEducation} colorScheme="blue" width="full">Add Education</Button>
              </VStack>
              
              <VStack spacing={2} align="stretch">
                {tempEducation.map((edu, index) => (
                  <Box key={index} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{edu.degree}</Text>
                        <Text fontSize="sm" color="gray.600">{edu.institution} ({edu.year})</Text>
                      </VStack>
                      <IconButton 
                        icon={<FaTimes />} 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeEducation(index)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ education: tempEducation });
                  setEducation(tempEducation);
                  setProfile(prev => ({ ...prev, education: tempEducation }));
                  onEducationClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onEducationClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Certifications Modal
  const CertificationsModal = () => {
    const [tempCertifications, setTempCertifications] = useState([...certifications]);
    const [localNewCertification, setLocalNewCertification] = useState({ name: '', issuer: '', year: '' });

    // Reset local state when modal opens
    useEffect(() => {
      if (isCertificationOpen) {
        setTempCertifications([...certifications]);
        setLocalNewCertification({ name: '', issuer: '', year: '' });
      }
    }, [isCertificationOpen, certifications]);

    const addCertification = () => {
      if (localNewCertification.name.trim() && localNewCertification.issuer.trim()) {
        setTempCertifications([...tempCertifications, { ...localNewCertification }]);
        setLocalNewCertification({ name: '', issuer: '', year: '' });
      }
    };

    const removeCertification = (index) => {
      setTempCertifications(tempCertifications.filter((_, i) => i !== index));
    };

    return (
      <Modal isOpen={isCertificationOpen} onClose={onCertificationClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Certifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Certification Name</FormLabel>
                  <Input 
                    value={localNewCertification.name}
                    onChange={(e) => setLocalNewCertification({...localNewCertification, name: e.target.value})}
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Issuing Organization</FormLabel>
                  <Input 
                    value={localNewCertification.issuer}
                    onChange={(e) => setLocalNewCertification({...localNewCertification, issuer: e.target.value})}
                    placeholder="e.g., Amazon Web Services"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <Input 
                    value={localNewCertification.year}
                    onChange={(e) => setLocalNewCertification({...localNewCertification, year: e.target.value})}
                    placeholder="e.g., 2023"
                  />
                </FormControl>
                <Button onClick={addCertification} colorScheme="blue" width="full">Add Certification</Button>
              </VStack>
              
              <VStack spacing={2} align="stretch">
                {tempCertifications.map((cert, index) => (
                  <Box key={index} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{cert.name}</Text>
                        <Text fontSize="sm" color="gray.600">{cert.issuer} ({cert.year})</Text>
                      </VStack>
                      <IconButton 
                        icon={<FaTimes />} 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeCertification(index)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ certifications: tempCertifications });
                  setCertifications(tempCertifications);
                  setProfile(prev => ({ ...prev, certifications: tempCertifications }));
                  onCertificationClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onCertificationClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Name Modal
  const NameModal = () => {
    const [tempName, setTempName] = useState(instructorName);

    return (
      <Modal isOpen={isNameOpen} onClose={onNameClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your full name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ name: tempName });
                  setInstructorName(tempName);
                  setProfile(prev => ({ ...prev, name: tempName }));
                  onNameClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onNameClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Profile Photo Modal
  const ProfilePhotoModal = () => {
    const [tempPhoto, setTempPhoto] = useState(profilePhoto);

    return (
      <Modal isOpen={isPhotoOpen} onClose={onPhotoClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Avatar size="xl" src={tempPhoto} name={instructorName} />
              <FormControl>
                <FormLabel>Photo URL</FormLabel>
                <Input 
                  value={tempPhoto}
                  onChange={(e) => setTempPhoto(e.target.value)}
                  placeholder="Enter image URL"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ avatar: tempPhoto });
                  setProfilePhoto(tempPhoto);
                  setProfile(prev => ({ ...prev, avatar: tempPhoto }));
                  onPhotoClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onPhotoClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Location Modal
  const LocationModal = () => {
    const [tempLocation, setTempLocation] = useState(location);

    return (
      <Modal isOpen={isLocationOpen} onClose={onLocationClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input 
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ location: tempLocation });
                  setLocation(tempLocation);
                  setProfile(prev => ({ ...prev, location: tempLocation }));
                  onLocationClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onLocationClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Languages Modal
  const LanguagesModal = () => {
    const [tempLanguages, setTempLanguages] = useState([...languages]);
    const [localNewLanguage, setLocalNewLanguage] = useState('');

    // Reset local state when modal opens
    useEffect(() => {
      if (isLanguagesOpen) {
        setTempLanguages([...languages]);
        setLocalNewLanguage('');
      }
    }, [isLanguagesOpen, languages]);

    const addLanguage = () => {
      if (localNewLanguage.trim() && !tempLanguages.includes(localNewLanguage.trim())) {
        setTempLanguages([...tempLanguages, localNewLanguage.trim()]);
        setLocalNewLanguage('');
      }
    };

    const removeLanguage = (languageToRemove) => {
      setTempLanguages(tempLanguages.filter(lang => lang !== languageToRemove));
    };

    return (
      <Modal isOpen={isLanguagesOpen} onClose={onLanguagesClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Languages</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Input 
                  value={localNewLanguage}
                  onChange={(e) => setLocalNewLanguage(e.target.value)}
                  placeholder="Add a language..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                />
                <Button onClick={addLanguage} colorScheme="blue">Add</Button>
              </HStack>
              <Wrap spacing={2}>
                {tempLanguages.map((language, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" variant="solid" colorScheme="blue">
                      <TagLabel>{language}</TagLabel>
                      <TagCloseButton onClick={() => removeLanguage(language)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={async () => {
                try {
                  await saveProfileUpdate({ languages: tempLanguages });
                  setLanguages(tempLanguages);
                  setProfile(prev => ({ ...prev, languages: tempLanguages }));
                  onLanguagesClose();
                } catch (err) {
                  // Error handling is done in saveProfileUpdate
                }
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onLanguagesClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Flex>
        <InstructorSidebar />
        <Container maxW="container.xl" ml="250px" mt="80px" p={8}>
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Spinner size="xl" color={ENHANCED_THEME_COLORS.accent.primary} thickness="4px" />
            <Text color={ENHANCED_THEME_COLORS.text.secondary}>Loading your profile...</Text>
          </VStack>
        </Container>
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex>
        <InstructorSidebar />
        <Container maxW="container.xl" ml="250px" mt="80px" p={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Failed to load profile</Text>
              <Text>{error}</Text>
            </Box>
          </Alert>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex bg={ENHANCED_THEME_COLORS.background} minHeight="100vh">
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="48px" width="calc(100% - 250px)" py={10} px={6}>
        <Grid 
          templateColumns={{ base: '1fr', lg: '3fr 4fr' }} 
          gap={8}
        >
          {/* Left Column: Profile Overview */}
          <GridItem>
            <VStack 
              spacing={6} 
              align="stretch"
            >
              {/* Profile Header */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
                position="relative"
                overflow="hidden"
                display="flex"
                alignItems="center"
                border="2px solid #640101"
              >
                {/* Photo Section - Left Side */}
                <VStack 
                  spacing={3} 
                  align="center" 
                  mr={6} 
                  position="relative" 
                  zIndex={1}
                >
                  <Box 
                    position="relative" 
                    mb={2}
                  >
                    <Avatar 
                      size="2xl" 
                      name={profile.name} 
                      src={profile.avatar} 
                      border="3px solid #640101"
                      boxShadow={`0 0 15px #64010140`}
                    />
                    <IconButton
                      icon={<FaEdit />}
                      position="absolute"
                      bottom={0}
                      right={0}
                      size="sm"
                      variant="solid"
                      colorScheme="blue"
                      borderRadius="full"
                      onClick={onPhotoOpen}
                    />
                  </Box>
                </VStack>

                {/* Information Section - Right Side */}
                <VStack 
                  spacing={3} 
                  align="start" 
                  flex={1} 
                  position="relative" 
                  zIndex={1}
                >
                  {/* Name and Verification */}
                  <VStack spacing={1} align="start" width="full">
                    <HStack spacing={2} alignItems="center" width="full">
                      <HStack spacing={2} alignItems="center" flex={1}>
                        <Heading 
                          size="lg" 
                          color={ENHANCED_THEME_COLORS.text.primary} 
                          fontWeight="bold"
                          display="inline-flex"
                          alignItems="center"
                        >
                          {profile.name}
                          {/* Red Mark Verified Badge */}
                          <VerifiedBadge 
                            instructorId={getInstructorId()} 
                            size="md" 
                            variant="shield" 
                            showTooltip={true}
                          />
                        </Heading>
                      </HStack>
                      <IconButton
                        icon={<FaEdit />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={onNameOpen}
                      />
                    </HStack>

                    {/* Teacher Code */}
                    <Text 
                      color={ENHANCED_THEME_COLORS.text.secondary}
                      fontSize="md" 
                      fontWeight="semibold" 
                      letterSpacing="wider"
                    >
                      {profile.teacherCode}
                    </Text>

                    {/* Profession */}
                    <Text 
                      color={ENHANCED_THEME_COLORS.text.secondary}
                      fontSize="sm" 
                      fontStyle="italic" 
                      mt={2}
                    >
                      {profile.title}
                    </Text>

                    {/* Certification */}
                    <HStack spacing={2} mt={2}>
                      {/* Level tag - only show if purchased */}
                      {profile.level !== null && (
                        <Tag 
                          bg="#640101"
                          color="white"
                          size="md"
                          variant="solid"
                        >
                          Level {profile.level}
                        </Tag>
                      )}
                      
                      {/* Always show Dashboarder Certified - NOT payment-based */}
                      <Tag 
                        bg="#000000"
                        color="white"
                        size="md"
                        variant="solid"
                      >
                        Dashboarder Certified
                      </Tag>
                    </HStack>

                    {/* Contact Info */}
                    <VStack 
                      spacing={1} 
                      align="start" 
                      width="full" 
                      mt={4} 
                      borderTop="1px" 
                      borderColor={ENHANCED_THEME_COLORS.border.light}
                      pt={3}
                    >
                      <HStack>
                        <Icon 
                          as={FaEnvelope} 
                          color={ENHANCED_THEME_COLORS.accent.primary} 
                          boxSize={4}
                        />
                        <Text 
                          fontSize="sm" 
                          color={ENHANCED_THEME_COLORS.text.secondary}
                        >
                          {profile.email}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon 
                          as={FaMapMarkerAlt} 
                          color={ENHANCED_THEME_COLORS.accent.primary} 
                          boxSize={4}
                        />
                        <Text 
                          fontSize="sm" 
                          color={ENHANCED_THEME_COLORS.text.secondary}
                          flex={1}
                        >
                          {profile.location || "Location not set"}
                        </Text>
                        <IconButton
                          icon={<FaEdit />}
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={onLocationOpen}
                        />
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </Box>

              {/* Contact & Stats */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
              >
                <IconButton
                  icon={<FaEdit />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={onLanguagesOpen}
                />
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <FaLanguage color="gray" />
                    <Text>{profile.languages.join(', ')}</Text>
                  </HStack>
                  <HStack>
                    <Icon 
                      as={FaCheck} 
                      color={ENHANCED_THEME_COLORS.accent.primary}  
                      mr={2} 
                    />
                    <Text>Avg. Response: {profile.responseTime}</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Quick Stats */}
              <SimpleGrid columns={3} spacing={4}>
                <StatCard 
                  icon={FaBook} 
                  label="Courses" 
                  value={profile.courses.length} 
                  color={ENHANCED_THEME_COLORS.accent.primary} 
                />
                <StatCard 
                  icon={FaChalkboardTeacher} 
                  label="Total Students" 
                  value={profile.courses.reduce((sum, course) => sum + (course.students || 0), 0)} 
                  color={ENHANCED_THEME_COLORS.accent.primary} 
                />
                <StatCard 
                  icon={FaGraduationCap} 
                  label="Certifications" 
                  value={profile.certifications.length} 
                  color={ENHANCED_THEME_COLORS.accent.primary} 
                />
              </SimpleGrid>

              {/* Reviews Section */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
              >
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <VStack spacing={1} align="center" width="100px">
                      <Heading size="3xl" color={ENHANCED_THEME_COLORS.text.primary}>
                        {profile.rating || 0}
                      </Heading>
                      <HStack spacing={1} alignItems="center">
                        <Text fontWeight="bold" color={ENHANCED_THEME_COLORS.text.primary}>5</Text>
                        <FaMoon color={ENHANCED_THEME_COLORS.accent.primary} size={16} />
                      </HStack>
                      <Text fontSize="sm" color={ENHANCED_THEME_COLORS.text.secondary}>
                        {profile.totalReviews || 0} Reviews
                      </Text>
                    </VStack>
                    
                    <RatingBreakdown 
                      reviews={profile.reviews || []} 
                      selectedRating={selectedRating}
                      onRatingSelect={handleRatingSelect} 
                    />
                  </HStack>

                  {/* Show message when no reviews yet */}
                  {(!profile.reviews || profile.reviews.length === 0) && (
                    <Box 
                      bg="gray.50" 
                      p={4} 
                      borderRadius="md" 
                      textAlign="center"
                      mt={4}
                    >
                      <Text color="gray.500" fontSize="sm" mb={1}>
                        No reviews yet
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        Reviews will appear here once students rate your teaching
                      </Text>
                    </Box>
                  )}

                  {/* Filtered Reviews */}
                  {selectedRating && profile.reviews && profile.reviews.length > 0 && (
                    <Box mt={4}>
                      <Heading size="sm" mb={3} color={ENHANCED_THEME_COLORS.text.primary}>
                        {selectedRating}-Moon Reviews
                      </Heading>
                      <VStack spacing={3} align="stretch">
                        {filteredReviews.map((review, index) => (
                          <ReviewCard key={index} review={review} />
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          {/* Right Column: Detailed Information */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* About Me */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
                position="relative"
              >
                <IconButton 
                  icon={<FaEdit />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={onAboutMeOpen}
                />
                <Heading size="md" mb={4}>
                  About Me
                </Heading>
                <Text color={ENHANCED_THEME_COLORS.text.secondary}>{aboutMe}</Text>
              </Box>

              {/* Skills */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
                position="relative"
              >
                <IconButton 
                  icon={<FaEdit />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={onSkillsOpen}
                />
                <Heading size="md" mb={4}>
                  Skills
                </Heading>
                <Wrap spacing={0}>
                  {skills.map((skill, index) => (
                    <WrapItem key={index}>
                      <SkillTag skill={skill} />
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              {/* Education */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
                position="relative"
              >
                <IconButton 
                  icon={<FaEdit />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={onEducationOpen}
                />
                <Heading size="md" mb={4}>
                  Education
                </Heading>
                {education.map((edu, index) => (
                  <Box 
                    key={index} 
                    bg="white" 
                    p={4} 
                    borderRadius="md" 
                    mb={3}
                  >
                    <Text fontWeight="bold" color={ENHANCED_THEME_COLORS.text.primary}>{edu.degree}</Text>
                    <Text color={ENHANCED_THEME_COLORS.text.muted}>{edu.institution} ({edu.year})</Text>
                  </Box>
                ))}
              </Box>

              {/* Certifications */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
                position="relative"
              >
                <IconButton 
                  icon={<FaEdit />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={onCertificationOpen}
                />
                <Heading size="md" mb={4}>
                  Certifications
                </Heading>
                {certifications.map((cert, index) => (
                  <Box 
                    key={index} 
                    bg="white" 
                    p={4} 
                    borderRadius="md" 
                    mb={3}
                  >
                    <Text fontWeight="bold" color={ENHANCED_THEME_COLORS.text.primary}>{cert.name}</Text>
                    <Text color={ENHANCED_THEME_COLORS.text.muted}>{cert.issuer} ({cert.year})</Text>
                  </Box>
                ))}
              </Box>

              {/* Courses */}
              <Box 
                bg={ENHANCED_THEME_COLORS.cardBackground} 
                borderRadius="xl" 
                p={6} 
                boxShadow="md"
              >
                <Heading size="md" mb={4}>
                  Recent Courses
                </Heading>
                {profile.courses && profile.courses.length > 0 ? (
                  profile.courses.map((course, index) => (
                    <Box 
                      key={index} 
                      bg="white" 
                      p={4} 
                      borderRadius="md" 
                      mb={3}
                    >
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color={ENHANCED_THEME_COLORS.text.primary}>{course.title}</Text>
                          <Text color={ENHANCED_THEME_COLORS.text.muted} fontSize="sm">
                            {course.students} Students Enrolled
                          </Text>
                        </VStack>
                        <Tooltip label={`Course Rating: ${course.rating}`}>
                          <Badge 
                            colorScheme="gray"
                            color={ENHANCED_THEME_COLORS.text.primary}
                            display="flex" 
                            alignItems="center"
                          >
                            <FaMoon color={ENHANCED_THEME_COLORS.accent.primary} mr={1} />
                            {course.rating}
                          </Badge>
                        </Tooltip>
                      </Flex>
                    </Box>
                  ))
                ) : (
                  <Box 
                    bg="gray.50" 
                    p={4} 
                    borderRadius="md" 
                    textAlign="center"
                  >
                    <Text color="gray.500" fontSize="sm" mb={2}>
                      No courses assigned yet
                    </Text>
                    <Text color="gray.400" fontSize="xs">
                      Courses will appear here once you're assigned to an institution
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <AboutMeModal />
      <SkillsModal />
      <EducationModal />
      <CertificationsModal />
      <NameModal />
      <ProfilePhotoModal />
      <LocationModal />
      <LanguagesModal />
    </Flex>
  );
};

export default InstructorProfile;
