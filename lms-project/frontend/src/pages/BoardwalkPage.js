import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Input, 
  Avatar, 
  Button, 
  Image, 
  Grid, 
  GridItem,
  Card,
  CardBody,
  Spacer,
  IconButton,
  useDisclosure,
  Divider,
  Badge,
  Flex,
  Center,
  Heading,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaImage, FaVideo, FaEllipsisH, FaThumbsUp, FaHeart, FaTimes, FaCheck, FaFire, FaStar, FaBookmark } from 'react-icons/fa';
import PostModal from '../components/PostModal';
import MediaUploadModal from '../components/MediaUploadModal';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// Animation keyframes for the background only (not cards)
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Particle component for the animated background
const Particle = ({ index }) => {
  const size = Math.random() * 4 + 2;
  const duration = Math.random() * 20 + 10;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const delay = Math.random() * 5;

  const floatAnimation = keyframes`
    0% { transform: translate(${initialX}vw, ${initialY}vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(${initialX + (Math.random() * 20 - 10)}vw, ${initialY - 30}vh) rotate(360deg); opacity: 0; }
  `;

  return (
    <Box
      position="absolute"
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="full"
      bg="rgba(255, 0, 0, 0.6)"
      sx={{
        animation: `${floatAnimation} ${duration}s infinite`,
        animationDelay: `${delay}s`,
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)',
      }}
    />
  );
};

const BoardwalkPage = () => {
  // Generate particles for the background
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push(<Particle key={i} index={i} />);
  }
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();
  const { isOpen: isMediaModalOpen, onOpen: onMediaModalOpen, onClose: onMediaModalClose } = useDisclosure();
  
  // State to store boardwalk posts
  const [posts, setPosts] = useState([
    {
      author: "Jane Cooper",
      role: "UX Designer at Dashboarder",
      time: "2h",
      content: "Just finished designing our new dashboard interface! What do you think?",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      likes: 24,
      comments: 5
    },
    {
      author: "Devon Lane",
      role: "Software Engineer",
      time: "1d",
      content: "A salary increase makes you happy once a year. A healthy workplace makes you happy every day.",
      likes: 156,
      comments: 23
    },
    {
      author: "Esther Howard",
      role: "Product Manager",
      time: "3d",
      content: "No amount of money can fix a toxic environment. Focus on building a culture where people feel valued and respected.",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      likes: 89,
      comments: 12
    },
    {
      author: "Cameron Williamson",
      role: "Data Scientist",
      time: "1w",
      content: "Just published my research on machine learning applications in education. Link in comments!",
      likes: 45,
      comments: 8
    },
  ]);

  // Current post index for swiping
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  // Track if we're out of posts
  const [noMorePosts, setNoMorePosts] = useState(false);
  // Track drag direction
  const [dragDirection, setDragDirection] = useState(null);
  // Animation controls
  const controls = useAnimation();

  // Function to add a new post to the boardwalk
  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
    // Reset to first post when new content is added
    setCurrentPostIndex(0);
    setNoMorePosts(false);
  };

  // Handle swipe left (dislike)
  const handleSwipeLeft = () => {
    controls.start({ 
      x: -500, 
      opacity: 0,
      rotate: -20,
      transition: { duration: 0.5 }
    }).then(() => {
      moveToNextPost();
    });
  };

  // Handle swipe right (like)
  const handleSwipeRight = () => {
    controls.start({ 
      x: 500, 
      opacity: 0,
      rotate: 20,
      transition: { duration: 0.5 }
    }).then(() => {
      // Like the post
      const updatedPosts = [...posts];
      updatedPosts[currentPostIndex].likes += 1;
      setPosts(updatedPosts);
      moveToNextPost();
    });
  };

  // Move to next post
  const moveToNextPost = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    } else {
      setNoMorePosts(true);
    }
  };

  // Reset to first post
  const resetPosts = () => {
    setCurrentPostIndex(0);
    setNoMorePosts(false);
    controls.set({ x: 0, opacity: 1, rotate: 0 });
  };

  // Handle drag end
  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleSwipeLeft();
    } else if (info.offset.x > threshold) {
      handleSwipeRight();
    } else {
      controls.start({ x: 0, opacity: 1, rotate: 0 });
    }
    setDragDirection(null);
  };

  // Handle drag
  const handleDrag = (event, info) => {
    if (info.offset.x < 0) {
      setDragDirection('left');
    } else if (info.offset.x > 0) {
      setDragDirection('right');
    } else {
      setDragDirection(null);
    }
  };

  return (
    <Box 
      minH="100vh" 
      position="relative"
      bgGradient="linear(to-br, black, #300)"
      sx={{
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 15s ease infinite`,
      }}
    >
      {/* Animated particles */}
      {particles}
      
      {/* Main content */}
      <Box maxW="1200px" mx="auto" px={4} py={8} pt={16}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={8}>
          <GridItem>
            {/* Create Post Card */}
            <Card bg="rgba(0, 0, 0, 0.7)" color="white" shadow="lg" mb={6}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Avatar size="md" />
                    <Input 
                      placeholder="Share your thoughts..." 
                      variant="filled" 
                      bg="rgba(255, 255, 255, 0.1)"
                      _hover={{ bg: "rgba(255, 255, 255, 0.15)" }}
                      _focus={{ bg: "rgba(255, 255, 255, 0.15)" }}
                      onClick={onPostModalOpen}
                      readOnly
                    />
                  </HStack>
                  <Divider borderColor="rgba(255, 255, 255, 0.2)" />
                  <HStack justify="space-around">
                    <Button 
                      leftIcon={<FaImage />} 
                      variant="ghost" 
                      color="red.300"
                      onClick={onMediaModalOpen}
                      _hover={{ bg: "rgba(255, 0, 0, 0.2)" }}
                    >
                      Image
                    </Button>
                    <Button 
                      leftIcon={<FaVideo />} 
                      variant="ghost" 
                      color="red.300"
                      onClick={onMediaModalOpen}
                      _hover={{ bg: "rgba(255, 0, 0, 0.2)" }}
                    >
                      Video
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Portrait Card Design */}
            <Box position="relative" h="600px" mt={8} maxW="320px" mx="auto">
              {noMorePosts ? (
                <Center h="100%">
                  <VStack spacing={4}>
                    <Text color="white" fontSize="xl">No more posts to show</Text>
                    <Button 
                      leftIcon={<FaFire />} 
                      colorScheme="red" 
                      onClick={resetPosts}
                      size="lg"
                    >
                      Start Over
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <AnimatePresence>
                  <Box position="relative" h="100%">
                    <motion.div
                      key={currentPostIndex}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      onDrag={handleDrag}
                      animate={controls}
                      initial={{ x: 0, opacity: 1 }}
                      style={{ 
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Card 
                        shadow="lg" 
                        borderRadius="md" 
                        overflow="hidden" 
                        h="100%"
                        position="relative"
                        bg="#111"
                        color="white"
                        borderWidth="0"
                        maxW="320px"
                        mx="auto"
                      >
                        <CardBody p={0}>
                          <VStack h="100%" spacing={0} align="stretch">
                            {/* Main Image First */}
                            {posts[currentPostIndex].image ? (
                              <Box 
                                overflow="hidden" 
                                h="450px"
                                position="relative"
                              >
                                <Image 
                                  src={posts[currentPostIndex].image} 
                                  alt="Post image" 
                                  width="100%"
                                  height="100%"
                                  objectFit="cover"
                                  objectPosition="center"
                                />
                                
                                {/* Gradient overlay for text readability */}
                                <Box 
                                  position="absolute"
                                  bottom="0"
                                  left="0"
                                  right="0"
                                  height="150px"
                                  bgGradient="linear(to-t, black, transparent)"
                                  zIndex="1"
                                />
                                
                                {/* Author info positioned at the bottom of the image */}
                                <HStack 
                                  position="absolute" 
                                  bottom="0" 
                                  left="0" 
                                  width="100%" 
                                  p={4} 
                                  zIndex="2"
                                  align="center"
                                >
                                  <Avatar 
                                    size="md" 
                                    name={posts[currentPostIndex].author} 
                                    border="2px solid white"
                                  />
                                  <Box>
                                    <Text fontWeight="bold" color="white" fontSize="lg">{posts[currentPostIndex].author}</Text>
                                    <Text fontSize="sm" color="gray.300">{posts[currentPostIndex].role}</Text>
                                  </Box>
                                  <Spacer />
                                  <Badge bg="red.600" color="white" fontSize="xs">
                                    {posts[currentPostIndex].time}
                                  </Badge>
                                </HStack>
                              </Box>
                            ) : (
                              <Box 
                                h="250px" 
                                bg="gray.900" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                              >
                                <VStack>
                                  <Avatar 
                                    size="xl" 
                                    name={posts[currentPostIndex].author} 
                                    border="2px solid #640101"
                                  />
                                  <Heading size="md" mt={2}>{posts[currentPostIndex].author}</Heading>
                                  <Text fontSize="sm" color="gray.400">{posts[currentPostIndex].role}</Text>
                                </VStack>
                              </Box>
                            )}
                            
                            {/* Content Section */}
                            <Box p={4} bg="#111">
                              <Text 
                                fontSize="md" 
                                color="white"
                                lineHeight="1.6"
                                mb={3}
                              >
                                {posts[currentPostIndex].content}
                              </Text>
                              
                              <HStack spacing={4} mt={2}>
                                <HStack>
                                  <IconButton
                                    icon={<FaHeart />}
                                    variant="ghost"
                                    color="red.500"
                                    aria-label="Like"
                                    size="sm"
                                  />
                                  <Text fontSize="sm" color="gray.400">{posts[currentPostIndex].likes}</Text>
                                </HStack>
                                
                                <HStack>
                                  <IconButton
                                    icon={<FaBookmark />}
                                    variant="ghost"
                                    color="gray.400"
                                    aria-label="Save"
                                    size="sm"
                                  />
                                </HStack>
                                
                                <Spacer />
                                
                                <Text fontSize="sm" color="gray.400">{posts[currentPostIndex].comments} comments</Text>
                              </HStack>
                            </Box>
                          </VStack>

                          {/* Swipe indicators */}
                          {dragDirection === 'left' && (
                            <Box 
                              position="absolute" 
                              top="50%" 
                              left="20px" 
                              transform="translateY(-50%)"
                              bg="rgba(0, 0, 0, 0.8)"
                              borderRadius="full"
                              p={4}
                              opacity={0.9}
                              borderWidth="2px"
                              borderColor="red.500"
                            >
                              <FaTimes color="white" size="24px" />
                            </Box>
                          )}
                          
                          {dragDirection === 'right' && (
                            <Box 
                              position="absolute" 
                              top="50%" 
                              right="20px" 
                              transform="translateY(-50%)"
                              bg="rgba(0, 0, 0, 0.8)"
                              borderRadius="full"
                              p={4}
                              opacity={0.9}
                              borderWidth="2px"
                              borderColor="red.500"
                            >
                              <FaStar color="yellow" size="24px" />
                            </Box>
                          )}
                        </CardBody>
                      </Card>
                    </motion.div>
                  </Box>
                </AnimatePresence>
              )}
            </Box>

            {/* Swipe Buttons */}
            {!noMorePosts && (
              <HStack justify="center" spacing={8} mt={4}>
                <IconButton
                  icon={<FaTimes />}
                  bg="#222"
                  color="red.500"
                  size="lg"
                  isRound
                  onClick={handleSwipeLeft}
                  aria-label="Skip"
                  borderWidth="1px"
                  borderColor="red.500"
                />
                <IconButton
                  icon={<FaStar />}
                  bg="#222"
                  color="yellow.400"
                  size="lg"
                  isRound
                  onClick={handleSwipeRight}
                  aria-label="Star"
                  borderWidth="1px"
                  borderColor="yellow.400"
                />
              </HStack>
            )}
          </GridItem>
          
          <GridItem display={{ base: "none", md: "block" }}>
            {/* Right side content - hidden on mobile */}
            <Box bg="rgba(0, 0, 0, 0.7)" p={6} borderRadius="lg" color="white">
              <Heading size="md" mb={4}>Trending Topics</Heading>
              <VStack align="stretch" spacing={4}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <HStack key={item} p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="md" _hover={{ bg: "rgba(255, 0, 0, 0.1)" }}>
                    <Text fontWeight="bold">#{["Design", "Programming", "AI", "Learning", "Career"][item-1]}</Text>
                    <Spacer />
                    <Badge colorScheme="red">{Math.floor(Math.random() * 1000) + 100}</Badge>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
      
      {/* Modals */}
      <PostModal isOpen={isPostModalOpen} onClose={onPostModalClose} onPostSubmit={addNewPost} />
      <MediaUploadModal isOpen={isMediaModalOpen} onClose={onMediaModalClose} />
    </Box>
  );
};

export default BoardwalkPage;
