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
  SimpleGrid,
  Spinner,
  Center,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaCalendarAlt,
  FaUsers,
  FaBookOpen,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaArrowLeft,
  FaGraduationCap
} from 'react-icons/fa';

const API_URL = 'http://localhost:5001/api';

const StudentViewInstitutionProfile = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Review form states
  const [reviewForm, setReviewForm] = useState({
    reviewer_name: '',
    reviewer_email: '',
    rating: 5,
    comment: ''
  });

  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchProfile();
    fetchReviews();
    fetchCourses();
  }, [institutionId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/institutions/${institutionId}/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
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
        fetchProfile(); // Refresh to get updated rating
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
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl" py={8}>
          <Center>
            <Spinner size="xl" color="#640101" />
          </Center>
        </Container>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl" py={8}>
          <Center>
            <Text>Institution not found</Text>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      {/* Header with Back Button */}
      <Container maxW="6xl" mb={6}>
        <HStack spacing={4} mb={6}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/student-feed')}
            color="#640101"
          >
            Back to Feed
          </Button>
          <Icon as={FaGraduationCap} boxSize={6} color="#640101" />
          <Heading size="lg" color="#640101">
            Institution Profile
          </Heading>
        </HStack>
      </Container>

      <Container maxW="6xl">
        {/* Cover Photo Section */}
        <Box
          position="relative"
          height="300px"
          borderRadius="xl"
          overflow="hidden"
          mb={6}
          bg="gray.200"
          backgroundImage={profile.cover_photo ? `url(${profile.cover_photo})` : 'linear-gradient(135deg, #640101 0%, #8B0000 100%)'}
          backgroundSize={profile.cover_photo ? `${profile.cover_photo_zoom || 100}%` : 'cover'}
          backgroundPosition={profile.cover_photo ? (profile.cover_photo_position || 'center center') : 'center center'}
          backgroundRepeat="no-repeat"
          boxShadow="xl"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.400"
          />
          
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

        {/* Profile Header */}
        <Card bg={cardBg} mb={6} mt="-60px" position="relative" zIndex={3} mx={8}>
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "flex-start" }} gap={6}>
              <Box position="relative">
                {profile.profile_picture ? (
                  <Box
                    width="120px"
                    height="120px"
                    borderRadius="full"
                    border="4px solid white"
                    overflow="hidden"
                    bg="gray.200"
                    boxShadow="lg"
                  >
                    <Image
                      src={profile.profile_picture}
                      alt="Profile picture"
                      width="120px"
                      height="120px"
                      objectFit="cover"
                      objectPosition={profile.profile_picture_position || 'center center'}
                      transform={`scale(${(profile.profile_picture_zoom || 100) / 100})`}
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
                
                <Button
                  leftIcon={<FaStar />}
                  colorScheme="yellow"
                  onClick={onReviewOpen}
                  mt={4}
                >
                  Write Review
                </Button>
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
                  <Heading size="md" color="#640101">About {profile.name}</Heading>
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
                    <Heading size="md" color="#640101">Available Courses</Heading>
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
                            <HStack spacing={2} fontSize="sm" flexWrap="wrap">
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
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={8}>
                      No courses available yet
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
                  <Heading size="md" color="#640101">Quick Stats</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Stat>
                      <StatLabel>Total Students</StatLabel>
                      <StatNumber color="#640101">{profile.student_count}</StatNumber>
                      <StatHelpText>Currently enrolled</StatHelpText>
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
                      <StatLabel>Courses Available</StatLabel>
                      <StatNumber color="green.500">{courses.length}</StatNumber>
                      <StatHelpText>Ready to join</StatHelpText>
                    </Stat>
                  </VStack>
                </CardBody>
              </Card>

              {/* Reviews Section */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color="#640101">Student Reviews</Heading>
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
                      No reviews yet - be the first to review!
                    </Text>
                  )}
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      {/* Add Review Modal */}
      <Modal isOpen={isReviewOpen} onClose={onReviewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write a Review for {profile.name}</ModalHeader>
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
                <FormLabel>Your Review</FormLabel>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Share your experience with this institution..."
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
    </Box>
  );
};

export default StudentViewInstitutionProfile; 