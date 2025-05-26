import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Button,
  Badge,
  Flex,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Icon,
  IconButton,
  Image,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Spinner,
  Stack,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Checkbox
} from '@chakra-ui/react';
import {
  FaEdit,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaCalendarAlt,
  FaUsers,
  FaGraduationCap,
  FaPlus,
  FaTrash,
  FaUpload,
  FaLink,
  FaBookOpen,
  FaClock,
  FaDollarSign,
  FaBuilding
} from 'react-icons/fa';
import InstitutionSidebar from '../components/InstitutionSidebar';

const API_URL = 'http://localhost:5001/api';

const InstitutionProfile = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Profile edit states
  const [editedProfile, setEditedProfile] = useState({});
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isCourseOpen, onOpen: onCourseOpen, onClose: onCourseClose } = useDisclosure();
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();
  const { isOpen: isPhotoOpen, onOpen: onPhotoOpen, onClose: onPhotoClose } = useDisclosure();
  const { isOpen: isCropOpen, onOpen: onCropOpen, onClose: onCropClose } = useDisclosure();
  
  // Photo upload states
  const [photoType, setPhotoType] = useState('cover'); // 'cover' or 'profile'
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'device'
  
  // Image cropping states
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [cropPosition, setCropPosition] = useState({ x: 50, y: 50 }); // percentage
  const [cropZoom, setCropZoom] = useState(100); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Course form states
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    duration: '',
    level: 'Beginner',
    price: '',
    image_url: ''
  });
  
  // Review form states
  const [reviewForm, setReviewForm] = useState({
    reviewer_name: '',
    reviewer_email: '',
    rating: 5,
    comment: ''
  });

  // Post form states
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image_url: '',
    is_featured: false
  });
  const [posts, setPosts] = useState([]);
  const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure();
  const { isOpen: isPostCropOpen, onOpen: onPostCropOpen, onClose: onPostCropClose } = useDisclosure();
  const [postPhotoUrl, setPostPhotoUrl] = useState('');
  const [postCropImageUrl, setPostCropImageUrl] = useState('');
  const [postCropPosition, setPostCropPosition] = useState({ x: 50, y: 50 });
  const [postCropZoom, setPostCropZoom] = useState(100);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchProfile();
    fetchReviews();
    fetchCourses();
    fetchPosts();
    checkIfOwner();
  }, [institutionId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/institutions/${institutionId}/profile`);
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data); // Debug log
        console.log('Image URLs:', {
          cover_photo: data.cover_photo,
          cover_photo_position: data.cover_photo_position,
          cover_photo_zoom: data.cover_photo_zoom,
          profile_picture: data.profile_picture,
          profile_picture_position: data.profile_picture_position,
          profile_picture_zoom: data.profile_picture_zoom
        });
        setProfile(data);
        setEditedProfile(data);
      } else {
        console.error('Failed to fetch profile, status:', response.status);
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load institution profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/institutions/${institutionId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/institutions/${institutionId}/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/institutions/${institutionId}/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const checkIfOwner = () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    setIsOwner(userId === institutionId && userRole === 'institution');
  };

  const handleProfileUpdate = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/institutions/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(editedProfile)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        onEditClose();
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.text();
        console.error('Profile update error:', response.status, errorData);
        throw new Error(`Failed to update profile: ${response.status}`);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoUrl) return;
    
    // Open crop modal instead of directly uploading
    setCropImageUrl(photoUrl);
    setCropPosition({ x: 50, y: 50 });
    setCropZoom(100);
    onPhotoClose();
    onCropOpen();
  };

  const handleCropSave = async () => {
    try {
      const updatedData = {
        [photoType === 'cover' ? 'cover_photo' : 'profile_picture']: cropImageUrl,
        [photoType === 'cover' ? 'cover_photo_position' : 'profile_picture_position']: `${cropPosition.x}% ${cropPosition.y}%`,
        [photoType === 'cover' ? 'cover_photo_zoom' : 'profile_picture_zoom']: cropZoom
      };

      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/institutions/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setPhotoUrl('');
        setCropImageUrl('');
        onCropClose();
        toast({
          title: 'Success',
          description: `${photoType === 'cover' ? 'Cover' : 'Profile'} photo updated successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.text();
        console.error('Profile update error:', errorData);
        throw new Error('Failed to update photo');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update photo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Image cropping handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (cropPosition.x * 4), // Adjust for sensitivity
      y: e.clientY - (cropPosition.y * 4)
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(100, (e.clientX - dragStart.x) / 4));
    const newY = Math.max(0, Math.min(100, (e.clientY - dragStart.y) / 4));
    
    setCropPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (value) => {
    setCropZoom(value);
  };

  const handleCreatePost = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(postForm)
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setPostForm({
          title: '',
          content: '',
          image_url: '',
          is_featured: false
        });
        onPostClose();
        toast({
          title: 'Success',
          description: 'Post created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePostPhotoUpload = async () => {
    if (!postPhotoUrl) return;
    
    // Open crop modal for post image
    setPostCropImageUrl(postPhotoUrl);
    setPostCropPosition({ x: 50, y: 50 });
    setPostCropZoom(100);
    setPostPhotoUrl('');
    onPostCropOpen();
  };

  const handlePostCropSave = async () => {
    try {
      setPostForm({
        ...postForm,
        image_url: postCropImageUrl,
        image_position: `${postCropPosition.x}% ${postCropPosition.y}%`,
        image_zoom: postCropZoom
      });
      setPostCropImageUrl('');
      onPostCropClose();
      toast({
        title: 'Success',
        description: 'Image added to post',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateCourse = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(courseForm)
      });

      if (response.ok) {
        const newCourse = await response.json();
        setCourses([newCourse, ...courses]);
        setCourseForm({
          name: '',
          description: '',
          duration: '',
          level: 'Beginner',
          price: '',
          image_url: ''
        });
        onCourseClose();
        toast({
          title: 'Success',
          description: 'Course created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to create course');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create course',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateReview = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...reviewForm,
          institution_id: institutionId
        })
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setReviewForm({
          reviewer_name: '',
          reviewer_email: '',
          rating: 5,
          comment: ''
        });
        onReviewClose();
        // Refresh profile to get updated rating
        fetchProfile();
        toast({
          title: 'Success',
          description: 'Review submitted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        as={FaStar}
        color={i < rating ? 'yellow.400' : 'gray.300'}
        boxSize={4}
      />
    ));
  };

  if (loading) {
    return (
      <Box display="flex">
        <InstitutionSidebar />
        <Box flex="1" ml="250px" bg={bgColor} minH="100vh" pt="80px">
          <Container maxW="6xl" py={8}>
            <Center>
              <Spinner size="xl" color="#640101" />
            </Center>
          </Container>
        </Box>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex">
        <InstitutionSidebar />
        <Box flex="1" ml="250px" bg={bgColor} minH="100vh" pt="80px">
          <Container maxW="6xl" py={8}>
            <Center>
              <Text>Institution not found</Text>
            </Center>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex">
      <InstitutionSidebar />
      <Box flex="1" ml="250px" bg={bgColor} minH="100vh" pt="80px">
        <Container maxW="6xl" py={8}>
          {/* Cover Photo Section - Made Much More Visible */}
          <Box
            position="relative"
            height="350px" // Increased from 200px
            borderRadius="xl"
            overflow="hidden"
            mb={6} // Increased margin
            bg="gray.200"
            backgroundImage={profile.cover_photo ? `url(${profile.cover_photo})` : 'linear-gradient(135deg, #640101 0%, #8B0000 100%)'}
            backgroundSize={profile.cover_photo ? `${profile.cover_photo_zoom || 100}%` : 'cover'}
            backgroundPosition={profile.cover_photo ? (profile.cover_photo_position || 'center center') : 'center center'}
            backgroundRepeat="no-repeat"
            boxShadow="xl"
            border="2px solid white"
          >
            {/* Dark overlay for better text visibility */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.300"
              zIndex={1}
            />
            
            {isOwner && (
              <IconButton
                icon={<FaEdit />}
                position="absolute"
                top={4}
                right={4}
                colorScheme="whiteAlpha"
                size="lg"
                zIndex={2}
                onClick={() => {
                  setPhotoType('cover');
                  onPhotoOpen();
                }}
              />
            )}
            
            {/* Institution name overlay on cover photo */}
            <Box
              position="absolute"
              bottom={8}
              left={8}
              zIndex={2}
            >
              <Heading size="2xl" color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">
                {profile.name}
              </Heading>
              <HStack spacing={6} mt={2}>
                <HStack>
                  <Icon as={FaUsers} color="white" />
                  <Text color="white" fontSize="lg">{profile.student_count} Students</Text>
                </HStack>
                <HStack>
                  {renderStars(Math.round(profile.average_rating))}
                  <Text color="white" fontSize="lg">({profile.rating_count} reviews)</Text>
                </HStack>
              </HStack>
            </Box>
          </Box>

          {/* Header Section - Adjusted positioning */}
          <Card bg={cardBg} mb={6} mt="-80px" position="relative" zIndex={3} mx={8}>
            <CardBody>
              <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "flex-start" }} gap={6}>
                <Box position="relative">
                  {profile.profile_picture ? (
                    <Box
                      width="128px"
                      height="128px"
                      borderRadius="full"
                      border="4px solid white"
                      overflow="hidden"
                      bg="gray.200"
                      boxShadow="lg"
                    >
                      <Image
                        src={profile.profile_picture}
                        alt="Profile picture"
                        width="128px"
                        height="128px"
                        objectFit="cover"
                        objectPosition={profile.profile_picture_position || 'center center'}
                        transform={`scale(${(profile.profile_picture_zoom || 100) / 100})`}
                        borderRadius="full"
                      />
                    </Box>
                  ) : (
                    <Avatar
                      size="2xl"
                      name={profile.name}
                      bg="#640101"
                      color="white"
                      border="4px solid white"
                      boxShadow="lg"
                    />
                  )}
                  {isOwner && (
                    <IconButton
                      icon={<FaEdit />}
                      size="sm"
                      position="absolute"
                      bottom={0}
                      right={0}
                      borderRadius="full"
                      bg="white"
                      color="#640101"
                      boxShadow="md"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => {
                        setPhotoType('profile');
                        onPhotoOpen();
                      }}
                    />
                  )}
                </Box>
                
                <VStack align={{ base: "center", md: "flex-start" }} flex="1" spacing={3}>
                  <Heading size="xl" color="#640101">{profile.name}</Heading>
                  <HStack spacing={6} flexWrap="wrap">
                    <HStack>
                      <Icon as={FaUsers} color="gray.500" />
                      <Text>{profile.student_count} Students</Text>
                    </HStack>
                    <HStack>
                      {renderStars(Math.round(profile.average_rating))}
                      <Text>({profile.rating_count} reviews)</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaBookOpen} color="gray.500" />
                      <Text>{courses.length} Courses</Text>
                    </HStack>
                  </HStack>
                  
                  {/* Action Buttons */}
                  <HStack spacing={3} mt={4}>
                    {!isOwner && (
                      <Button
                        leftIcon={<FaStar />}
                        colorScheme="yellow"
                        onClick={onReviewOpen}
                      >
                        Write Review
                      </Button>
                    )}
                    {isOwner && (
                      <>
                        <Button
                          leftIcon={<FaEdit />}
                          colorScheme="blue"
                          onClick={onEditOpen}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme="green"
                          onClick={onCourseOpen}
                        >
                          Add Course
                        </Button>
                      </>
                    )}
                  </HStack>
                </VStack>
              </Flex>
            </CardBody>
          </Card>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
            {/* Main Content */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* About Section */}
                <Card bg={cardBg}>
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color="#640101">About</Heading>
                      {isOwner && (
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          onClick={onPostOpen}
                        >
                          Create Post
                        </Button>
                      )}
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {profile.description && (
                        <Text>{profile.description}</Text>
                      )}
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {profile.address && (
                          <HStack>
                            <Icon as={FaMapMarkerAlt} color="gray.500" />
                            <Text>{profile.address}</Text>
                          </HStack>
                        )}
                        {profile.phone && (
                          <HStack>
                            <Icon as={FaPhone} color="gray.500" />
                            <Text>{profile.phone}</Text>
                          </HStack>
                        )}
                        {profile.website && (
                          <HStack>
                            <Icon as={FaGlobe} color="gray.500" />
                            <Text as="a" href={profile.website} target="_blank" color="blue.500">
                              {profile.website}
                            </Text>
                          </HStack>
                        )}
                        {profile.established_year && (
                          <HStack>
                            <Icon as={FaCalendarAlt} color="gray.500" />
                            <Text>Established {profile.established_year}</Text>
                          </HStack>
                        )}
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Courses Section */}
                <Card bg={cardBg}>
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color="#640101">Offered Courses</Heading>
                      <Badge colorScheme="blue">{courses.length} Courses</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {courses.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {courses.map((course) => (
                          <Card key={course.id} size="sm" variant="outline" borderColor="gray.200">
                            <CardBody>
                              {course.image_url && (
                                <Image
                                  src={course.image_url}
                                  alt={course.name}
                                  borderRadius="md"
                                  mb={3}
                                  height="120px"
                                  width="100%"
                                  objectFit="cover"
                                />
                              )}
                              <Heading size="sm" mb={2} color="#640101">{course.name}</Heading>
                              {course.description && (
                                <Text fontSize="sm" color="gray.600" mb={2} noOfLines={2}>
                                  {course.description}
                                </Text>
                              )}
                              <Stack direction="row" spacing={2} fontSize="sm" flexWrap="wrap">
                                {course.duration && (
                                  <HStack>
                                    <Icon as={FaClock} color="gray.500" />
                                    <Text>{course.duration}</Text>
                                  </HStack>
                                )}
                                {course.level && (
                                  <Badge colorScheme="purple">{course.level}</Badge>
                                )}
                                {course.price && (
                                  <HStack>
                                    <Icon as={FaDollarSign} color="green.500" />
                                    <Text color="green.500" fontWeight="bold">{course.price}</Text>
                                  </HStack>
                                )}
                              </Stack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Text color="gray.500" textAlign="center" py={8}>
                        No courses offered yet
                      </Text>
                    )}
                  </CardBody>
                </Card>
              </VStack>
            </GridItem>

            {/* Sidebar */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Stats Card */}
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md" color="#640101">Statistics</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Stat>
                        <StatLabel>Total Students</StatLabel>
                        <StatNumber color="#640101">{profile.student_count}</StatNumber>
                        <StatHelpText>Enrolled students</StatHelpText>
                      </Stat>
                      <Divider />
                      <Stat>
                        <StatLabel>Average Rating</StatLabel>
                        <StatNumber>{profile.average_rating.toFixed(1)}</StatNumber>
                        <StatHelpText>
                          <HStack>
                            {renderStars(Math.round(profile.average_rating))}
                            <Text>({profile.rating_count} reviews)</Text>
                          </HStack>
                        </StatHelpText>
                      </Stat>
                      <Divider />
                      <Stat>
                        <StatLabel>Courses Offered</StatLabel>
                        <StatNumber color="green.500">{courses.length}</StatNumber>
                        <StatHelpText>Active courses</StatHelpText>
                      </Stat>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Reviews Section */}
                <Card bg={cardBg}>
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color="#640101">Reviews</Heading>
                      <Badge colorScheme="yellow">{reviews.length} Reviews</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {reviews.length > 0 ? (
                      <VStack spacing={4} align="stretch">
                        {reviews.slice(0, 3).map((review) => (
                          <Box key={review.id} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                            <HStack justify="space-between" mb={2}>
                              <Text fontWeight="bold">{review.reviewer_name}</Text>
                              <HStack>
                                {renderStars(review.rating)}
                              </HStack>
                            </HStack>
                            {review.comment && (
                              <Text fontSize="sm" color="gray.600">
                                {review.comment}
                              </Text>
                            )}
                            <Text fontSize="xs" color="gray.400" mt={1}>
                              {new Date(review.created_at).toLocaleDateString()}
                            </Text>
                          </Box>
                        ))}
                        {reviews.length > 3 && (
                          <Button variant="ghost" size="sm">
                            View all {reviews.length} reviews
                          </Button>
                        )}
                      </VStack>
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No reviews yet
                      </Text>
                    )}
                  </CardBody>
                </Card>
              </VStack>
            </GridItem>
          </Grid>
        </Container>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Institution Name</FormLabel>
                  <Input
                    value={editedProfile.name || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={editedProfile.email || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editedProfile.description || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, description: e.target.value})}
                    rows={4}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={editedProfile.phone || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    value={editedProfile.address || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input
                    value={editedProfile.website || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Established Year</FormLabel>
                  <Input
                    type="number"
                    value={editedProfile.established_year || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, established_year: parseInt(e.target.value)})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleProfileUpdate}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Photo Upload Modal */}
        <Modal isOpen={isPhotoOpen} onClose={onPhotoClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update {photoType === 'cover' ? 'Cover' : 'Profile'} Photo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Tabs variant="enclosed" width="100%">
                  <TabList>
                    <Tab onClick={() => setUploadMethod('url')}>From URL</Tab>
                    <Tab onClick={() => setUploadMethod('device')}>From Device</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <FormControl>
                        <FormLabel>Image URL</FormLabel>
                        <Input
                          placeholder="Enter image URL"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                        />
                      </FormControl>
                    </TabPanel>
                    <TabPanel>
                      <FormControl>
                        <FormLabel>Upload from Device</FormLabel>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            // Handle file upload here
                            const file = e.target.files[0];
                            if (file) {
                              // For now, just show a placeholder URL
                              setPhotoUrl(`placeholder_${file.name}`);
                            }
                          }}
                        />
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Note: File upload functionality would be implemented with a file storage service
                        </Text>
                      </FormControl>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onPhotoClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handlePhotoUpload}
                isDisabled={!photoUrl}
              >
                Update {photoType === 'cover' ? 'Cover' : 'Profile'} Photo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Course Modal */}
        <Modal isOpen={isCourseOpen} onClose={onCourseClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Course</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Course Name</FormLabel>
                  <Input
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    rows={3}
                  />
                </FormControl>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
                  <FormControl>
                    <FormLabel>Duration</FormLabel>
                    <Input
                      placeholder="e.g., 6 months"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Level</FormLabel>
                    <Select
                      value={courseForm.level}
                      onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Select>
                  </FormControl>
                </Grid>
                
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    placeholder="e.g., $299"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Course Image URL</FormLabel>
                  <Input
                    placeholder="Enter image URL"
                    value={courseForm.image_url}
                    onChange={(e) => setCourseForm({...courseForm, image_url: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCourseClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="green" 
                onClick={handleCreateCourse}
                isDisabled={!courseForm.name}
              >
                Add Course
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Review Modal */}
        <Modal isOpen={isReviewOpen} onClose={onReviewClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Write a Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    value={reviewForm.reviewer_name}
                    onChange={(e) => setReviewForm({...reviewForm, reviewer_name: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email (Optional)</FormLabel>
                  <Input
                    type="email"
                    value={reviewForm.reviewer_email}
                    onChange={(e) => setReviewForm({...reviewForm, reviewer_email: e.target.value})}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Share your experience..."
                    rows={4}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onReviewClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="yellow" 
                onClick={handleCreateReview}
                isDisabled={!reviewForm.reviewer_name}
              >
                Submit Review
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Post Modal */}
        <Modal isOpen={isPostOpen} onClose={onPostClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Post Title</FormLabel>
                  <Input
                    placeholder="Enter an engaging title for your post..."
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    placeholder="Share what's happening at your institution..."
                    value={postForm.content}
                    onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                    rows={4}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Add Photo</FormLabel>
                  <HStack>
                    <Input
                      placeholder="Enter image URL"
                      value={postPhotoUrl}
                      onChange={(e) => setPostPhotoUrl(e.target.value)}
                      flex="1"
                    />
                    <Button 
                      colorScheme="blue" 
                      onClick={handlePostPhotoUpload}
                      isDisabled={!postPhotoUrl}
                      size="sm"
                    >
                      Add Image
                    </Button>
                  </HStack>
                  {postForm.image_url && (
                    <Box mt={2} p={2} borderWidth="1px" borderRadius="md">
                      <Text fontSize="sm" color="green.600">✓ Image added to post</Text>
                      <Image 
                        src={postForm.image_url} 
                        alt="Post preview" 
                        maxH="100px" 
                        borderRadius="md"
                        mt={1}
                      />
                    </Box>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onPostClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleCreatePost}
                isDisabled={!postForm.title}
              >
                Create Post
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Post Image Cropping Modal */}
        <Modal isOpen={isPostCropOpen} onClose={onPostCropClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adjust Post Image</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                <Text fontSize="sm" color="gray.600">
                  Drag to reposition the image and use the zoom slider to adjust the size
                </Text>
                
                {/* Preview Area */}
                <Box position="relative" width="100%">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>Preview:</Text>
                  <Box
                    width="100%"
                    height="300px"
                    borderRadius="lg"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="gray.300"
                    bg="gray.100"
                    position="relative"
                    cursor={isDragging ? "grabbing" : "grab"}
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      setDragStart({
                        x: e.clientX - (postCropPosition.x * 4),
                        y: e.clientY - (postCropPosition.y * 4)
                      });
                    }}
                    onMouseMove={(e) => {
                      if (!isDragging) return;
                      const newX = Math.max(0, Math.min(100, (e.clientX - dragStart.x) / 4));
                      const newY = Math.max(0, Math.min(100, (e.clientY - dragStart.y) / 4));
                      setPostCropPosition({ x: newX, y: newY });
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    backgroundImage={`url(${postCropImageUrl})`}
                    backgroundSize={`${postCropZoom}%`}
                    backgroundPosition={`${postCropPosition.x}% ${postCropPosition.y}%`}
                    backgroundRepeat="no-repeat"
                  >
                    <Box
                      position="absolute"
                      bottom={2}
                      right={2}
                      bg="blackAlpha.700"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                    >
                      Post Image Preview
                    </Box>
                  </Box>
                </Box>

                {/* Controls */}
                <VStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Zoom: {postCropZoom}%</FormLabel>
                    <Slider
                      min={50}
                      max={200}
                      step={5}
                      value={postCropZoom}
                      onChange={(value) => setPostCropZoom(value)}
                    >
                      <SliderTrack>
                        <SliderFilledTrack bg="#640101" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                  
                  <HStack spacing={4} width="100%">
                    <Button 
                      size="sm" 
                      onClick={() => setPostCropPosition({ x: 50, y: 50 })}
                    >
                      Center
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setPostCropZoom(100)}
                    >
                      Reset Zoom
                    </Button>
                  </HStack>
                </VStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onPostCropClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handlePostCropSave}
              >
                Use This Image
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Image Cropping Modal */}
        <Modal isOpen={isCropOpen} onClose={onCropClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adjust {photoType === 'cover' ? 'Cover' : 'Profile'} Photo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                <Text fontSize="sm" color="gray.600">
                  Drag to reposition the image and use the zoom slider to adjust the size
                </Text>
                
                {/* Preview Area */}
                <Box position="relative" width="100%">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>Preview:</Text>
                  <Box
                    width="100%"
                    height={photoType === 'cover' ? "200px" : "200px"}
                    borderRadius={photoType === 'cover' ? "lg" : "lg"}
                    overflow="hidden"
                    border="2px solid"
                    borderColor="gray.300"
                    bg="gray.100"
                    position="relative"
                    cursor={isDragging ? "grabbing" : "grab"}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    backgroundImage={`url(${cropImageUrl})`}
                    backgroundSize={`${cropZoom}%`}
                    backgroundPosition={`${cropPosition.x}% ${cropPosition.y}%`}
                    backgroundRepeat="no-repeat"
                  >
                    {photoType === 'profile' && (
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        width="150px"
                        height="150px"
                        borderRadius="full"
                        border="3px solid white"
                        boxShadow="0 0 10px rgba(0,0,0,0.3)"
                        overflow="hidden"
                        backgroundImage={`url(${cropImageUrl})`}
                        backgroundSize={`${(cropZoom * 200) / 150}%`}
                        backgroundPosition={`${cropPosition.x}% ${cropPosition.y}%`}
                        backgroundRepeat="no-repeat"
                      />
                    )}
                    
                    {/* Overlay text to show this is how it will appear */}
                    <Box
                      position="absolute"
                      bottom={2}
                      right={2}
                      bg="blackAlpha.700"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                    >
                      {photoType === 'cover' ? 'Cover Preview' : 'Profile Preview'}
                    </Box>
                  </Box>
                </Box>

                {/* Controls */}
                <VStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Zoom: {cropZoom}%</FormLabel>
                    <Slider
                      min={50}
                      max={200}
                      step={5}
                      value={cropZoom}
                      onChange={handleZoomChange}
                    >
                      <SliderTrack>
                        <SliderFilledTrack bg="#640101" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                  
                  <HStack spacing={4} width="100%">
                    <Button 
                      size="sm" 
                      onClick={() => setCropPosition({ x: 50, y: 50 })}
                    >
                      Center
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setCropZoom(100)}
                    >
                      Reset Zoom
                    </Button>
                  </HStack>
                </VStack>

                {/* Original Image Preview */}
                <Box width="100%">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>Original Image:</Text>
                  <Image
                    src={cropImageUrl}
                    alt="Original"
                    maxHeight="150px"
                    objectFit="contain"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                  />
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCropClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleCropSave}
              >
                Save {photoType === 'cover' ? 'Cover' : 'Profile'} Photo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default InstitutionProfile; 