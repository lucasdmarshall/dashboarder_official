import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  Container,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Avatar,
  Badge,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Switch,
  useDisclosure,
  useColorModeValue,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon
} from '@chakra-ui/react';
import {
  FaSearch,
  FaPlus,
  FaThumbsUp,
  FaComment,
  FaBookmark,
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaFlag,
  FaSort,
  FaFilter,
  FaTags,
  FaComments
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

// Sample forum categories
const categories = [
  { id: 1, name: 'General Discussion', color: 'blue.500' },
  { id: 2, name: 'Academic Questions', color: 'green.500' },
  { id: 3, name: 'Campus Events', color: 'purple.500' },
  { id: 4, name: 'Technical Support', color: 'red.500' },
  { id: 5, name: 'Student Life', color: 'orange.500' }
];

// Sample forum posts
const samplePosts = [
  {
    id: 1,
    title: 'Tips for Studying for Final Exams',
    content: 'I wanted to share some tips that helped me prepare for final exams last semester. First, create a study schedule and stick to it. Second, use active recall techniques instead of passive reading. Third, take regular breaks to avoid burnout. What strategies work for you?',
    author: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'https://bit.ly/dan-abramov'
    },
    category: 2,
    tags: ['study tips', 'exams', 'academic success'],
    createdAt: '2025-03-15T10:30:00Z',
    likes: 24,
    comments: [
      {
        id: 101,
        content: 'Great tips! I also find that teaching concepts to others helps solidify my understanding.',
        author: {
          id: 'user2',
          name: 'Sarah Williams',
          avatar: 'https://bit.ly/ryan-florence'
        },
        createdAt: '2025-03-15T11:45:00Z',
        likes: 5
      },
      {
        id: 102,
        content: 'I use the Pomodoro technique - 25 minutes of focused study followed by a 5-minute break. Works wonders for my concentration!',
        author: {
          id: 'user3',
          name: 'Michael Chen',
          avatar: 'https://bit.ly/kent-c-dodds'
        },
        createdAt: '2025-03-15T13:20:00Z',
        likes: 8
      },
    ],
  },
  {
    id: 2,
    title: 'Campus Wi-Fi Issues in the Library',
    content: "Has anyone else been experiencing slow Wi-Fi in the west wing of the library? It seems to be particularly bad during peak hours. I've reported it to IT, but I'm wondering if others are having the same problem.",
    author: {
      id: 'user3',
      name: 'Michael Chen',
      avatar: 'https://bit.ly/kent-c-dodds'
    },
    category: 4,
    tags: ['wifi', 'library', 'technical issues'],
    createdAt: '2025-03-16T09:15:00Z',
    likes: 18,
    comments: [
      {
        id: 103,
        content: "Yes! I've noticed this too. It's been happening for about a week now.",
        author: {
          id: 'user4',
          name: 'Emily Rodriguez',
          avatar: 'https://bit.ly/prosper-baba'
        },
        createdAt: '2025-03-16T09:45:00Z',
        likes: 3
      },
    ],
  },
  {
    id: 3,
    title: 'Spring Festival Planning Committee - Volunteers Needed!',
    content: "The annual Spring Festival is coming up next month, and we're looking for volunteers to help with planning and execution. This is a great opportunity to get involved in campus life and add something valuable to your resume. If you're interested, please comment below or email events@university.edu.",
    author: {
      id: 'user5',
      name: 'Jessica Taylor',
      avatar: 'https://bit.ly/code-beast'
    },
    category: 3,
    tags: ['events', 'volunteering', 'spring festival'],
    createdAt: '2025-03-17T14:00:00Z',
    likes: 32,
    comments: [
      {
        id: 104,
        content: "I'd love to help! I have experience with event planning from last year's Winter Gala.",
        author: {
          id: 'user6',
          name: 'David Kim',
          avatar: 'https://bit.ly/sage-adebayo'
        },
        createdAt: '2025-03-17T14:30:00Z',
        likes: 2
      },
      {
        id: 105,
        content: 'Count me in! What specific roles are you looking to fill?',
        author: {
          id: 'user2',
          name: 'Sarah Williams',
          avatar: 'https://bit.ly/ryan-florence'
        },
        createdAt: '2025-03-17T15:45:00Z',
        likes: 1
      },
      {
        id: 106,
        content: 'I can help with graphic design for promotional materials if needed!',
        author: {
          id: 'user7',
          name: 'Tyler Johnson',
          avatar: 'https://bit.ly/kent-c-dodds'
        },
        createdAt: '2025-03-17T16:20:00Z',
        likes: 4
      },
    ],
  },
  {
    id: 4,
    title: 'Study Group for Advanced Data Structures',
    content: "I'm forming a study group for Advanced Data Structures (CS301). We plan to meet twice a week, and we'll be working through practice problems and reviewing lecture material. All skill levels welcome!",
    author: {
      id: 'user8',
      name: 'Leon Johnson',
      avatar: 'https://bit.ly/ryan-florence'
    },
    category: 2,
    tags: ['study group', 'computer science', 'data structures'],
    createdAt: '2025-04-02T16:30:00Z',
    likes: 14,
    comments: [
      {
        id: 107,
        content: "I'd like to join! What days were you thinking of meeting?",
        author: {
          id: 'user9',
          name: 'Aisha Patel',
          avatar: 'https://bit.ly/code-beast'
        },
        createdAt: '2025-04-02T16:45:00Z',
        likes: 1
      },
    ],
  },
];

const StudentForum = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('studentForumPosts');
    return savedPosts ? JSON.parse(savedPosts) : samplePosts;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 means all categories
  const [sortOption, setSortOption] = useState('latest');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 1,
    tags: '',
    isAnonymous: false,
  });
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  
  const { isOpen: isNewPostOpen, onOpen: onNewPostOpen, onClose: onNewPostClose } = useDisclosure();
  const { isOpen: isPostDetailOpen, onOpen: onPostDetailOpen, onClose: onPostDetailClose } = useDisclosure();
  
  const toast = useToast();
  const accentColor = useColorModeValue('#640101', 'red.200');
  const headerBgColor = useColorModeValue(`${accentColor}10`, 'gray.700');
  const borderColor = useColorModeValue(`${accentColor}20`, 'gray.600');
  
  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studentForumPosts', JSON.stringify(posts));
  }, [posts]);
  
  // Function to filter posts based on search query and selected category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 0 || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Function to sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortOption) {
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostLiked':
        return b.likes - a.likes;
      case 'mostCommented':
        return b.comments.length - a.comments.length;
      default:
        return 0;
    }
  });
  
  // Function to handle creating a new post
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Process tags
    const processedTags = newPost.tags
      ? newPost.tags.split(',').map(tag => tag.trim().toLowerCase())
      : [];
    
    const currentUser = {
      id: 'user8', // In a real app, this would be the logged-in user's ID
      name: 'Leon Johnson', // This would be the current user's name
      avatar: 'https://bit.ly/ryan-florence', // This would be the current user's avatar
    };
    
    const newPostObj = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: newPost.isAnonymous 
        ? { id: 'anonymous', name: 'Anonymous', avatar: 'https://bit.ly/broken-link' }
        : currentUser,
      category: parseInt(newPost.category),
      tags: processedTags,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    
    setPosts([newPostObj, ...posts]);
    
    setNewPost({
      title: '',
      content: '',
      category: 1,
      tags: '',
      isAnonymous: false,
    });
    
    onNewPostClose();
    
    toast({
      title: 'Success',
      description: 'Your post has been created',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to handle liking a post
  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };
  
  // Function to handle adding a comment to a post
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const currentUser = {
      id: 'user8', // In a real app, this would be the logged-in user's ID
      name: 'Leon Johnson', // This would be the current user's name
      avatar: 'https://bit.ly/ryan-florence', // This would be the current user's avatar
    };
    
    const newCommentObj = {
      id: Math.max(0, ...selectedPost.comments.map(c => c.id)) + 1,
      content: newComment,
      author: currentUser,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    
    setPosts(posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, comments: [...post.comments, newCommentObj] } 
        : post
    ));
    
    setNewComment('');
    
    // Update selected post with the new comment
    setSelectedPost({
      ...selectedPost,
      comments: [...selectedPost.comments, newCommentObj],
    });
    
    toast({
      title: 'Success',
      description: 'Your comment has been added',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to handle liking a comment
  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    }));
    
    // Update selected post if it's open
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        ),
      });
    }
  };
  
  // Function to handle opening post detail
  const handleOpenPostDetail = (post) => {
    setSelectedPost(post);
    onPostDetailOpen();
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Flex>
      <StudentSidebar />
      
      <Box 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="85px" 
        pb={8} 
        px={6} 
        position="relative"
        bg="gray.50"
      >
        <Container maxW="container.xl">
          {/* Header */}
          <Card borderRadius="lg" boxShadow="md" bg="white" mb={6}>
            <CardHeader 
              bg={headerBgColor} 
              borderBottom={`1px solid ${borderColor}`}
              borderTopRadius="lg"
              p={4}
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                  <Icon as={FaComments} boxSize={6} color={accentColor} />
                  <Heading size="lg" ml={4} color={accentColor}>
                    My Forum
                  </Heading>
                </Flex>
                <Button
                  leftIcon={<FaPlus />}
                  onClick={onNewPostOpen}
                  colorScheme="red"
                  bg={accentColor}
                  _hover={{ bg: "#8B0000" }}
                >
                  New Post
                </Button>
              </Flex>
            </CardHeader>
            <CardBody p={4}>
              {/* Search and Filter Controls */}
              <Flex 
                direction={{ base: 'column', md: 'row' }} 
                justify="space-between" 
                align={{ base: 'stretch', md: 'center' }}
                mb={6}
                gap={4}
              >
                <InputGroup maxW={{ base: '100%', md: '400px' }}>
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="gray.300" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search discussions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderColor="gray.300"
                    _hover={{ borderColor: accentColor }}
                  />
                </InputGroup>
                <HStack spacing={4}>
                  <Select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                    w={{ base: '100%', md: '200px' }}
                    borderColor="gray.300"
                    _hover={{ borderColor: accentColor }}
                  >
                    <option value={0}>All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Select>
                  <Select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    w={{ base: '100%', md: '200px' }}
                    borderColor="gray.300"
                    _hover={{ borderColor: accentColor }}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostLiked">Most Liked</option>
                    <option value="mostCommented">Most Active</option>
                  </Select>
                </HStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Posts List */}
          <VStack spacing={4} align="stretch">
            {sortedPosts.length > 0 ? (
              sortedPosts.map(post => (
                <Card 
                  key={post.id} 
                  p={0} 
                  borderRadius="lg" 
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  transition="all 0.2s"
                  _hover={{ 
                    borderColor: accentColor,
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  bg="white"
                >
                  <CardBody p={6}>
                    <Flex justify="space-between" align="flex-start" mb={4}>
                      <Flex>
                        <Avatar src={post.author.avatar} size="md" mr={4} />
                        <Box>
                          <Heading size="md" mb={1} cursor="pointer" onClick={() => handleOpenPostDetail(post)}>
                            {post.title}
                          </Heading>
                          <Flex align="center" color="gray.500" fontSize="sm">
                            <Text fontWeight="bold" mr={1}>{post.author.name}</Text>
                            <Text>• {formatDate(post.createdAt)}</Text>
                          </Flex>
                        </Box>
                      </Flex>
                      <Badge 
                        colorScheme={categories.find(c => c.id === post.category)?.color.split('.')[0] || 'gray'}
                        px={2} 
                        py={1}
                        borderRadius="full"
                      >
                        {categories.find(c => c.id === post.category)?.name}
                      </Badge>
                    </Flex>
                    
                    <Text noOfLines={3} mb={4}>
                      {post.content}
                    </Text>
                    
                    <HStack spacing={2} mb={4}>
                      {post.tags.map((tag, idx) => (
                        <Badge key={idx} colorScheme="gray" borderRadius="full" px={2}>
                          #{tag}
                        </Badge>
                      ))}
                    </HStack>
                    
                    <Divider mb={4} />
                    
                    <Flex justify="space-between" align="center">
                      <HStack spacing={4}>
                        <Button 
                          leftIcon={<FaThumbsUp />} 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleLikePost(post.id)}
                        >
                          {post.likes}
                        </Button>
                        <Button 
                          leftIcon={<FaComment />} 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleOpenPostDetail(post)}
                        >
                          {post.comments.length}
                        </Button>
                      </HStack>
                      <Button 
                        rightIcon={<FaComment />}
                        size="sm"
                        colorScheme="red"
                        bg={accentColor}
                        _hover={{ bg: "#8B0000" }}
                        onClick={() => handleOpenPostDetail(post)}
                      >
                        Join Discussion
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Box p={10} textAlign="center" bg="white" borderRadius="lg" boxShadow="md">
                <Text fontSize="lg" color="gray.500">
                  No posts found. Be the first to start a discussion!
                </Text>
                <Button 
                  mt={4} 
                  colorScheme="red"
                  bg={accentColor}
                  _hover={{ bg: "#8B0000" }}
                  leftIcon={<FaPlus />}
                  onClick={onNewPostOpen}
                >
                  Create New Post
                </Button>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
      
      {/* New Post Modal */}
      <Modal isOpen={isNewPostOpen} onClose={onNewPostClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg={headerBgColor} color={accentColor}>Create New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  placeholder="Enter a descriptive title" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea 
                  placeholder="What would you like to discuss?" 
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Input 
                  placeholder="Enter tags separated by commas (e.g. homework, math, help)" 
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Post Anonymously</FormLabel>
                <Switch 
                  isChecked={newPost.isAnonymous}
                  onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                  colorScheme="red"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNewPostClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red"
              bg={accentColor}
              _hover={{ bg: "#8B0000" }}
              onClick={handleCreatePost}
            >
              Create Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Post Detail Modal */}
      {selectedPost && (
        <Modal isOpen={isPostDetailOpen} onClose={onPostDetailClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg={headerBgColor} color={accentColor}>
              {selectedPost.title}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6}>
              <Flex mb={6}>
                <Avatar src={selectedPost.author.avatar} size="md" mr={4} />
                <Box>
                  <Text fontWeight="bold">{selectedPost.author.name}</Text>
                  <Text color="gray.500" fontSize="sm">{formatDate(selectedPost.createdAt)}</Text>
                </Box>
              </Flex>
              
              <Text whiteSpace="pre-wrap" mb={4}>
                {selectedPost.content}
              </Text>
              
              <HStack spacing={2} mb={6}>
                {selectedPost.tags.map((tag, idx) => (
                  <Badge key={idx} colorScheme="gray" borderRadius="full" px={2}>
                    #{tag}
                  </Badge>
                ))}
              </HStack>
              
              <Flex justify="space-between" align="center" mb={6}>
                <Button 
                  leftIcon={<FaThumbsUp />} 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleLikePost(selectedPost.id)}
                >
                  {selectedPost.likes} Likes
                </Button>
                <Badge 
                  colorScheme={categories.find(c => c.id === selectedPost.category)?.color.split('.')[0] || 'gray'}
                  px={2} 
                  py={1}
                  borderRadius="full"
                >
                  {categories.find(c => c.id === selectedPost.category)?.name}
                </Badge>
              </Flex>
              
              <Divider mb={6} />
              
              <Heading size="md" mb={4}>
                Comments ({selectedPost.comments.length})
              </Heading>
              
              <VStack spacing={4} align="stretch" mb={6}>
                {selectedPost.comments.map(comment => (
                  <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md">
                    <Flex mb={2}>
                      <Avatar src={comment.author.avatar} size="sm" mr={2} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">{comment.author.name}</Text>
                        <Text color="gray.500" fontSize="xs">{formatDate(comment.createdAt)}</Text>
                      </Box>
                    </Flex>
                    <Text mb={2} fontSize="sm">{comment.content}</Text>
                    <Flex justify="space-between" align="center">
                      <Button 
                        leftIcon={<FaThumbsUp />} 
                        size="xs" 
                        variant="ghost"
                        onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                      >
                        {comment.likes}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </VStack>
              
              <Box>
                <Heading size="sm" mb={2}>Add Your Comment</Heading>
                <Textarea 
                  placeholder="Share your thoughts..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  mb={2}
                />
                <Button 
                  colorScheme="red"
                  bg={accentColor}
                  _hover={{ bg: "#8B0000" }}
                  size="sm"
                  onClick={handleAddComment}
                >
                  Post Comment
                </Button>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onPostDetailClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default StudentForum;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */ 