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
  Image
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
  FaEdit
} from 'react-icons/fa';

import InstructorSidebar from '../components/InstructorSidebar';
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
  const cardBg = useColorModeValue(ENHANCED_THEME_COLORS.cardBackground, ENHANCED_THEME_COLORS.cardBackground);
  const textColor = useColorModeValue(ENHANCED_THEME_COLORS.text.primary, ENHANCED_THEME_COLORS.text.primary);

  // State for editable sections
  const [aboutMe, setAboutMe] = useState('');
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

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
              // Reset to original bio if cancelled
              setAboutMe(profile.bio);
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
              onClick={() => {
                // Update aboutMe state
                setAboutMe(tempAboutMe);
                // TODO: Implement actual backend save
                onAboutMeClose();
                toast({
                  title: "About Me Updated",
                  description: tempAboutMe,
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                // Reset to original bio
                setAboutMe(profile.bio);
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
    const [newSkill, setNewSkill] = useState('');

    return (
      <Modal 
        isOpen={isSkillsOpen} 
        onClose={onSkillsClose} 
        size="xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Skills</ModalHeader>
          <ModalCloseButton 
            onClick={(e) => {
              e.stopPropagation();
              // Reset to original skills
              setTempSkills([...skills]);
              onSkillsClose();
            }} 
          />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Wrap>
                {tempSkills.map((skill, index) => (
                  <WrapItem key={index}>
                    <Tag 
                      size="md" 
                      variant="solid" 
                      colorScheme="blue"
                    >
                      <TagLabel>{skill}</TagLabel>
                      <TagCloseButton 
                        onClick={() => {
                          const newSkills = tempSkills.filter((_, i) => i !== index);
                          setTempSkills(newSkills);
                        }} 
                      />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <FormControl>
                <FormLabel>Add New Skill</FormLabel>
                <Input 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a new skill"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkill.trim()) {
                      setTempSkills([...tempSkills, newSkill.trim()]);
                      setNewSkill('');
                    }
                  }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                // Update skills state
                setSkills(tempSkills);
                // TODO: Save skills to backend
                onSkillsClose();
                toast({
                  title: "Skills Updated",
                  description: `${tempSkills.length} skill${tempSkills.length !== 1 ? 's' : ''} added`,
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                // Reset to original skills
                setTempSkills([...skills]);
                onSkillsClose();
              }}
            >
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
    const [newEducation, setNewEducation] = useState({
      degree: '',
      institution: '',
      year: ''
    });

    return (
      <Modal 
        isOpen={isEducationOpen} 
        onClose={onEducationClose} 
        size="xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Education</ModalHeader>
          <ModalCloseButton 
            onClick={(e) => {
              e.stopPropagation();
              // Reset to original education
              setTempEducation([...education]);
              onEducationClose();
            }} 
          />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {tempEducation.map((edu, index) => (
                <Flex key={index} alignItems="center">
                  <Box flex={1} bg="white" p={3} borderRadius="md" mr={3}>
                    <Text fontWeight="bold">{edu.degree}</Text>
                    <Text color={ENHANCED_THEME_COLORS.text.muted}>{edu.institution} ({edu.year})</Text>
                  </Box>
                  <IconButton 
                    icon={<FaEdit />} 
                    variant="ghost" 
                    colorScheme="red"
                    onClick={() => {
                      const newEducations = tempEducation.filter((_, i) => i !== index);
                      setTempEducation(newEducations);
                    }}
                  />
                </Flex>
              ))}
              
              <FormControl>
                <FormLabel>Degree</FormLabel>
                <Input 
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Institution</FormLabel>
                <Input 
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                  placeholder="e.g., Stanford University"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Graduation Year</FormLabel>
                <Input 
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                  placeholder="e.g., 2020"
                  type="number"
                />
              </FormControl>
              <Button 
                colorScheme="green" 
                onClick={() => {
                  if (newEducation.degree && newEducation.institution && newEducation.year) {
                    setTempEducation([...tempEducation, newEducation]);
                    setNewEducation({degree: '', institution: '', year: ''});
                  }
                }}
              >
                Add Education
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                // Update education state
                setEducation(tempEducation);
                // TODO: Save education to backend
                onEducationClose();
                toast({
                  title: "Education Updated",
                  description: `${tempEducation.length} education entr${tempEducation.length !== 1 ? 'ies' : 'y'}`,
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                // Reset to original education
                setTempEducation([...education]);
                onEducationClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Edit Certification Modal
  const CertificationModal = () => {
    const [tempCertifications, setTempCertifications] = useState([...certifications]);
    const [newCertification, setNewCertification] = useState({
      name: '',
      issuer: '',
      year: ''
    });

    return (
      <Modal 
        isOpen={isCertificationOpen} 
        onClose={onCertificationClose} 
        size="xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Certifications</ModalHeader>
          <ModalCloseButton 
            onClick={(e) => {
              e.stopPropagation();
              // Reset to original certifications
              setTempCertifications([...certifications]);
              onCertificationClose();
            }} 
          />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {tempCertifications.map((cert, index) => (
                <Flex key={index} alignItems="center">
                  <Box flex={1} bg="white" p={3} borderRadius="md" mr={3}>
                    <Text fontWeight="bold">{cert.name}</Text>
                    <Text color={ENHANCED_THEME_COLORS.text.muted}>{cert.issuer} ({cert.year})</Text>
                  </Box>
                  <IconButton 
                    icon={<FaEdit />} 
                    variant="ghost" 
                    colorScheme="red"
                    onClick={() => {
                      const newCerts = tempCertifications.filter((_, i) => i !== index);
                      setTempCertifications(newCerts);
                    }}
                  />
                </Flex>
              ))}
              
              <FormControl>
                <FormLabel>Certification Name</FormLabel>
                <Input 
                  value={newCertification.name}
                  onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Issuer</FormLabel>
                <Input 
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                  placeholder="e.g., Amazon Web Services"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Year Obtained</FormLabel>
                <Input 
                  value={newCertification.year}
                  onChange={(e) => setNewCertification({...newCertification, year: e.target.value})}
                  placeholder="e.g., 2022"
                  type="number"
                />
              </FormControl>
              <Button 
                colorScheme="green" 
                onClick={() => {
                  if (newCertification.name && newCertification.issuer && newCertification.year) {
                    setTempCertifications([...tempCertifications, newCertification]);
                    setNewCertification({name: '', issuer: '', year: ''});
                  }
                }}
              >
                Add Certification
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                // Update certifications state
                setCertifications(tempCertifications);
                // TODO: Save certifications to backend
                onCertificationClose();
                toast({
                  title: "Certifications Updated",
                  description: `${tempCertifications.length} certification${tempCertifications.length !== 1 ? 's' : ''}`,
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                // Reset to original certifications
                setTempCertifications([...certifications]);
                onCertificationClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const [profile] = useState({
    name: 'Dr. Elena Rodriguez',
    teacherCode: 'IS35712',
    title: 'Senior Machine Learning & AI Instructor',
    email: 'elena.rodriguez@techacademy.com',
    location: 'San Francisco, CA',
    languages: ['English', 'Spanish', 'Portuguese'],
    rating: 4.9,
    totalReviews: 245,
    responseTime: '1 hour',
    skills: [
      'Machine Learning', 'Deep Learning', 'Python', 
      'TensorFlow', 'Data Science', 'Neural Networks', 
      'AI Ethics', 'Research'
    ],
    education: [
      {
        degree: 'Ph.D. in Artificial Intelligence',
        institution: 'Stanford University',
        year: 2015
      },
      {
        degree: 'M.S. in Computer Science',
        institution: 'MIT',
        year: 2010
      }
    ],
    certifications: [
      {
        name: 'AWS Machine Learning Specialty',
        issuer: 'Amazon Web Services',
        year: 2022
      },
      {
        name: 'Google Cloud Professional ML Engineer',
        issuer: 'Google Cloud',
        year: 2021
      }
    ],
    courses: [
      {
        title: 'Advanced Deep Learning',
        students: 350,
        rating: 4.9
      },
      {
        title: 'AI Ethics and Responsible ML',
        students: 250,
        rating: 4.8
      }
    ],
    reviews: [
      {
        studentName: 'Alex Johnson',
        studentAvatar: 'https://bit.ly/kent-c-dodds',
        rating: 5,
        date: 'Jan 15, 2024',
        comment: 'Dr. Rodriguez is an exceptional instructor. Her deep understanding of machine learning and ability to explain complex concepts made this course incredibly valuable.',
        course: 'Advanced Deep Learning'
      },
      {
        studentName: 'Michael Chen',
        studentAvatar: 'https://bit.ly/prosper-otemuyiwa',
        rating: 5,
        date: 'Nov 22, 2023',
        comment: 'Comprehensive and practical approach to machine learning. The hands-on projects were challenging and truly helped me understand the subject deeply.',
        course: 'Advanced Deep Learning'
      },
      {
        studentName: 'Sarah Kim',
        studentAvatar: 'https://bit.ly/ryan-florence',
        rating: 4,
        date: 'Dec 3, 2023',
        comment: 'Great course on AI ethics. The instructor provided real-world insights and challenged us to think critically about the societal implications of AI.',
        course: 'AI Ethics and Responsible ML'
      },
      {
        studentName: 'Emma Rodriguez',
        studentAvatar: 'https://bit.ly/code-beast',
        rating: 4,
        date: 'Oct 10, 2023',
        comment: 'Fantastic instructor who goes above and beyond to ensure students understand the material. Highly recommended for anyone serious about machine learning.',
        course: 'AI Ethics and Responsible ML'
      },
      {
        studentName: 'David Lee',
        studentAvatar: 'https://bit.ly/dan-abramov',
        rating: 3,
        date: 'Sep 5, 2023',
        comment: 'Good course, but some topics were a bit complex and could have been explained more clearly.',
        course: 'Advanced Deep Learning'
      },
      {
        studentName: 'Rachel Green',
        studentAvatar: 'https://bit.ly/ryan-florence',
        rating: 2,
        date: 'Aug 15, 2023',
        comment: 'The course was challenging, and I struggled to keep up with the pace.',
        course: 'AI Ethics and Responsible ML'
      },
      {
        studentName: 'Tom Harris',
        studentAvatar: 'https://bit.ly/kent-c-dodds',
        rating: 1,
        date: 'Jul 20, 2023',
        comment: 'Not what I expected. The course did not meet my learning objectives.',
        course: 'Advanced Deep Learning'
      }
    ],
    bio: 'Passionate AI researcher and educator with over 12 years of experience in machine learning, dedicated to bridging academic research with practical industry applications. Committed to empowering the next generation of tech innovators.',
    avatar: 'https://bit.ly/dan-abramov',
    level: 5,
  });

  useEffect(() => {
    setAboutMe(profile.bio);
    setSkills(profile.skills);
    setEducation(profile.education);
    setCertifications(profile.certifications);
  }, [profile]);

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
                    <HStack spacing={2} alignItems="center">
                      <HStack spacing={2} alignItems="center">
                        <Heading 
                          size="lg" 
                          color={ENHANCED_THEME_COLORS.text.primary} 
                          fontWeight="bold"
                          display="inline-flex"
                          alignItems="center"
                        >
                          {profile.name}
                          <Tooltip 
                            label="Verified Dashboarder" 
                            placement="top" 
                            hasArrow 
                            bg="#640101"
                            color="white"
                            ml={2}
                          >
                            <Flex 
                              position="relative" 
                              alignItems="center" 
                              justifyContent="center"
                            >
                              <video 
                                width="40" 
                                height="40" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                                style={{
                                  borderRadius: '50%',
                                  border: '1px solid',
                                  borderColor: '#640101',
                                  animationDuration: '3s', 
                                  animationTimingFunction: 'ease-in-out', 
                                  objectFit: 'cover'
                                }}
                              >
                                <source src={verifiedIcon} type="video/webm" />
                              </video>
                            </Flex>
                          </Tooltip>
                        </Heading>
                      </HStack>
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
                      <Tag 
                        bg="#640101"
                        color="white"
                        size="md"
                        variant="solid"
                      >
                        Level 5
                      </Tag>
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
                        >
                          {profile.location}
                        </Text>
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
                  value={profile.courses.reduce((sum, course) => sum + course.students, 0)} 
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
                        {profile.rating}
                      </Heading>
                      <HStack spacing={1} alignItems="center">
                        <Text fontWeight="bold" color={ENHANCED_THEME_COLORS.text.primary}>5</Text>
                        <FaMoon color={ENHANCED_THEME_COLORS.accent.primary} size={16} />
                      </HStack>
                      <Text fontSize="sm" color={ENHANCED_THEME_COLORS.text.secondary}>
                        {profile.totalReviews} Reviews
                      </Text>
                    </VStack>
                    
                    <RatingBreakdown 
                      reviews={profile.reviews} 
                      selectedRating={selectedRating}
                      onRatingSelect={handleRatingSelect} 
                    />
                  </HStack>

                  {/* Filtered Reviews */}
                  {selectedRating && (
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
                {profile.courses.map((course, index) => (
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
                ))}
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <AboutMeModal />
      <SkillsModal />
      <EducationModal />
      <CertificationModal />
    </Flex>
  );
};

export default InstructorProfile;
