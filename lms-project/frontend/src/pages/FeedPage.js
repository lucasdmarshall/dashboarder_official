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
} from '@chakra-ui/react';
import { FaImage, FaVideo, FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaHeart } from 'react-icons/fa';
import PostModal from '../components/PostModal';
import MediaUploadModal from '../components/MediaUploadModal';

const FeedPage = () => {
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();
  const { isOpen: isMediaModalOpen, onOpen: onMediaModalOpen, onClose: onMediaModalClose } = useDisclosure();
  
  // State to store feed posts
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

  // Function to add a new post to the feed
  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  
  return (
    <Box bg="gray.100" minH="100vh">
      <Grid templateColumns="1fr" gap={4} maxW="800px" mx="auto" p={4} mt={14}>
        {/* Main Content */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Post Creation Card */}
            <Card shadow="md" borderRadius="lg" overflow="hidden">
              <CardBody>
                <HStack spacing={3}>
                  <Avatar size="md" name="User Name" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" />
                  <Input 
                    placeholder="Start a post" 
                    borderRadius="full" 
                    bg="gray.50"
                    p={3}
                    cursor="pointer"
                    onClick={onPostModalOpen}
                    readOnly
                  />
                </HStack>
                <Divider my={4} />
                <HStack spacing={0} justify="space-around">
                  <Button 
                    leftIcon={<FaImage color="#70B5F9" />} 
                    variant="ghost" 
                    flex={1}
                    onClick={onMediaModalOpen}
                  >
                    Photo
                  </Button>
                  <Button 
                    leftIcon={<FaVideo color="#7FC15E" />} 
                    variant="ghost" 
                    flex={1}
                    onClick={onMediaModalOpen}
                  >
                    Video
                  </Button>
                </HStack>
              </CardBody>
            </Card>
            
            {/* Feed Posts */}
            {posts.map((post, index) => (
              <Card key={index} shadow="md" borderRadius="lg" overflow="hidden">
                <CardBody>
                  <HStack mb={4} align="start">
                    <Avatar size="md" name={post.author} />
                    <Box>
                      <Text fontWeight="bold">{post.author}</Text>
                      <Text fontSize="sm" color="gray.500">{post.role}</Text>
                      <Text fontSize="xs" color="gray.400">{post.time} • <Badge colorScheme="green" variant="subtle" fontSize="xs">Public</Badge></Text>
                    </Box>
                    <Spacer />
                    <IconButton 
                      icon={<FaEllipsisH />} 
                      variant="ghost" 
                      aria-label="More options" 
                      size="sm"
                    />
                  </HStack>
                  
                  <Text mb={4} fontSize="md">
                    {post.content}
                  </Text>
                  
                  {post.image && (
                    <Box borderRadius="md" overflow="hidden" mb={4}>
                      <Image 
                        src={post.image} 
                        alt="Post image" 
                        width="100%"
                      />
                    </Box>
                  )}
                  
                  <Flex align="center" mb={2}>
                    <Box bg="blue.50" p={1} borderRadius="full">
                      <FaThumbsUp size="12px" color="#0A66C2" />
                    </Box>
                    <Box bg="red.50" p={1} borderRadius="full" ml="-1">
                      <FaHeart size="12px" color="#E11D48" />
                    </Box>
                    <Text fontSize="sm" color="gray.500" ml={2}>{post.likes}</Text>
                    <Text fontSize="sm" color="gray.500" ml="auto">{post.comments} comments</Text>
                  </Flex>
                  
                  <Divider mb={2} />
                  
                  <HStack justify="space-around" mt={2}>
                    <Button leftIcon={<FaThumbsUp />} variant="ghost" size="sm" flex={1}>Like</Button>
                    <Button leftIcon={<FaComment />} variant="ghost" size="sm" flex={1}>Comment</Button>
                    <Button leftIcon={<FaShare />} variant="ghost" size="sm" flex={1}>Share</Button>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </GridItem>
      </Grid>
      
      {/* Modals */}
      <PostModal isOpen={isPostModalOpen} onClose={onPostModalClose} addNewPost={addNewPost} />
      <MediaUploadModal isOpen={isMediaModalOpen} onClose={onMediaModalClose} addNewPost={addNewPost} />
    </Box>
  );
};

export default FeedPage;
