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
import InstructorSidebar from '../components/InstructorSidebar';

// Sample forum categories
const categories = [
  { id: 1, name: 'General Discussion', color: 'blue.500' },
  { id: 2, name: 'Teaching Methods', color: 'green.500' },
  { id: 3, name: 'Course Materials', color: 'purple.500' },
  { id: 4, name: 'Technical Support', color: 'red.500' },
  { id: 5, name: 'Professional Development', color: 'orange.500' }
];

// Sample forum posts
const samplePosts = [
  {
    id: 1,
    title: 'Best Practices for Remote Teaching',
    content: 'I wanted to share some best practices that have helped me with remote teaching this semester. First, establish clear communication channels. Second, create interactive lessons using various digital tools. Third, provide regular feedback to keep students engaged. What strategies work for you?',
    author: {
      id: 'instructor1',
      name: 'Prof. Johnson',
      avatar: 'https://bit.ly/dan-abramov'
    },
    category: 2,
    tags: ['remote teaching', 'best practices', 'digital tools'],
    createdAt: '2025-03-15T10:30:00Z',
    likes: 24,
    comments: [
      {
        id: 101,
        content: 'I\'ve found that breakout rooms work really well for group discussions in remote settings.',
        author: {
          id: 'instructor2',
          name: 'Dr. Williams',
          avatar: 'https://bit.ly/ryan-florence'
        },
        createdAt: '2025-03-15T11:45:00Z',
        likes: 5
      },
      {
        id: 102,
        content: 'I use Kahoot for quick assessments to check understanding. Students love the gamification aspect!',
        author: {
          id: 'instructor3',
          name: 'Prof. Chen',
          avatar: 'https://bit.ly/kent-c-dodds'
        },
        createdAt: '2025-03-15T13:20:00Z',
        likes: 8
      },
    ],
  },
  {
    id: 2,
    title: 'Issues with the Grading System',
    content: "Has anyone else been experiencing glitches in the grading system? Sometimes grades don't seem to save properly, especially when I'm updating multiple assignments at once. I've reported it to IT, but I'm wondering if others have found workarounds.",
    author: {
      id: 'instructor3',
      name: 'Prof. Chen',
      avatar: 'https://bit.ly/kent-c-dodds'
    },
    category: 4,
    tags: ['grading', 'technical issues', 'workarounds'],
    createdAt: '2025-03-16T09:15:00Z',
    likes: 18,
    comments: [
      {
        id: 103,
        content: "Yes! I\'ve noticed this too. I find that saving after each individual change helps prevent data loss.",
        author: {
          id: 'instructor4',
          name: 'Dr. Rodriguez',
          avatar: 'https://bit.ly/prosper-baba'
        },
        createdAt: '2025-03-16T09:45:00Z',
        likes: 3
      },
    ],
  },
  {
    id: 3,
    title: 'Department Conference Planning - Presenters Needed!',
    content: "The annual department conference is coming up next month, and we're looking for faculty presenters to share research and teaching innovations. This is a great opportunity to showcase your work and collaborate with colleagues. If you're interested, please comment below or email events@university.edu.",
    author: {
      id: 'instructor5',
      name: 'Dr. Taylor',
      avatar: 'https://bit.ly/code-beast'
    },
    category: 3,
    tags: ['conference', 'presentations', 'professional development'],
    createdAt: '2025-03-17T14:00:00Z',
    likes: 32,
    comments: [
      {
        id: 104,
        content: "I'd love to present my research on adaptive learning technologies. I can prepare a 30-minute session.",
        author: {
          id: 'instructor6',
          name: 'Dr. Kim',
          avatar: 'https://bit.ly/sage-adebayo'
        },
        createdAt: '2025-03-17T14:30:00Z',
        likes: 2
      },
      {
        id: 105,
        content: 'Count me in! I could present on innovative assessment methods that I\'ve been testing this semester.',
        author: {
          id: 'instructor2',
          name: 'Dr. Williams',
          avatar: 'https://bit.ly/ryan-florence'
        },
        createdAt: '2025-03-17T15:45:00Z',
        likes: 1
      },
    ],
  },
];

const InstructorForum = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('instructorForumPosts');
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
    localStorage.setItem('instructorForumPosts', JSON.stringify(posts));
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
    
    // Create a new post with the provided details
    const newPostObj = {
      id: Date.now(), // Simple way to generate a unique ID
      title: newPost.title,
      content: newPost.content,
      author: {
        id: 'current-instructor', // This would come from auth context in a real app
        name: 'Current Instructor', // This would come from auth context in a real app
        avatar: 'https://bit.ly/dan-abramov', // This would come from auth context in a real app
      },
      category: parseInt(newPost.category),
      tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    
    // Add the new post to the posts array
    setPosts([newPostObj, ...posts]);
    
    // Reset the form fields
    setNewPost({
      title: '',
      content: '',
      category: 1,
      tags: '',
      isAnonymous: false,
    });
    
    // Close the modal
    onNewPostClose();
    
    // Show a success message
    toast({
      title: 'Post Created',
      description: 'Your post has been successfully created',
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
    if (!newComment) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create a new comment with the provided details
    const newCommentObj = {
      id: Date.now(), // Simple way to generate a unique ID
      content: newComment,
      author: {
        id: 'current-instructor', // This would come from auth context in a real app
        name: 'Current Instructor', // This would come from auth context in a real app
        avatar: 'https://bit.ly/dan-abramov', // This would come from auth context in a real app
      },
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    
    // Add the new comment to the selected post
    setPosts(posts.map(post => 
      post.id === selectedPost.id 
        ? { 
            ...post, 
            comments: [...post.comments, newCommentObj] 
          } 
        : post
    ));
    
    // Reset the form field
    setNewComment('');
    
    // Set the updated post as the selected post
    const updatedPost = posts.find(post => post.id === selectedPost.id);
    if (updatedPost) {
      setSelectedPost({
        ...updatedPost,
        comments: [...updatedPost.comments, newCommentObj]
      });
    }
    
    // Show a success message
    toast({
      title: 'Comment Added',
      description: 'Your comment has been successfully added',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to handle liking a comment
  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: post.comments.map(comment => 
              comment.id === commentId 
                ? { ...comment, likes: comment.likes + 1 } 
                : comment
            ) 
          } 
        : post
    ));
    
    // Update the selected post if it's currently open
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        )
      });
    }
  };
  
  // Function to open the post detail modal
  const handleOpenPostDetail = (post) => {
    setSelectedPost(post);
    onPostDetailOpen();
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Flex direction="column" minH="100vh">
      <InstructorSidebar />
      <Box
        ml={{ base: 0, md: "250px" }}
        transition="margin-left 0.3s"
        w={{ base: "100%", md: "calc(100% - 250px)" }}
        p={5}
        mt="85px"
      >
        <Container maxW="container.xl" pt={8}>
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align={{ base: 'flex-start', md: 'center' }}
            mb={8}
            bg={headerBgColor}
            p={4}
            borderRadius="md"
            boxShadow="sm"
          >
            <Flex align="center" mb={{ base: 4, md: 0 }}>
              <Icon as={FaComments} boxSize={8} color={accentColor} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Instructor Forum</Text>
            </Flex>
            <Button
              leftIcon={<FaPlus />}
              color="white"
              bg={accentColor}
              _hover={{ bg: 'red.700' }}
              onClick={onNewPostOpen}
            >
              New Post
            </Button>
          </Flex>
          
          <HStack spacing={4} mb={6} overflowX="auto" py={2}>
            <Badge
              px={3}
              py={2}
              borderRadius="full"
              colorScheme={selectedCategory === 0 ? 'red' : 'gray'}
              cursor="pointer"
              onClick={() => setSelectedCategory(0)}
            >
              All Topics
            </Badge>
            {categories.map(category => (
              <Badge
                key={category.id}
                px={3}
                py={2}
                borderRadius="full"
                bg={selectedCategory === category.id ? category.color : 'gray.100'}
                color={selectedCategory === category.id ? 'white' : 'gray.800'}
                cursor="pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </HStack>
          
          <Flex
            mb={6}
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            gap={4}
          >
            <InputGroup flex={{ base: '1', md: '2' }}>
              <InputLeftElement pointerEvents='none'>
                <FaSearch color='gray.300' />
              </InputLeftElement>
              <Input
                placeholder='Search forum posts...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderColor={borderColor}
              />
            </InputGroup>
            
            <Select
              flex="1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              borderColor={borderColor}
              maxW={{ base: 'full', md: '200px' }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostCommented">Most Commented</option>
            </Select>
          </Flex>
          
          {/* Forum Posts */}
          <VStack spacing={4} align="stretch" mb={8}>
            {sortedPosts.length > 0 ? (
              sortedPosts.map(post => (
                <Card 
                  key={post.id} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  overflow="hidden"
                  borderColor={borderColor}
                  transition="transform 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  bg="white"
                >
                  <CardHeader pb={0}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <HStack>
                        <Avatar size="sm" src={post.author.avatar} name={post.author.name} />
                        <Text fontWeight="medium">{post.author.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {formatDate(post.createdAt)}
                        </Text>
                      </HStack>
                      <Badge colorScheme={categories.find(cat => cat.id === post.category)?.color.split('.')[0] || 'gray'}>
                        {categories.find(cat => cat.id === post.category)?.name}
                      </Badge>
                    </Flex>
                    <Heading size="md" mb={2} cursor="pointer" onClick={() => handleOpenPostDetail(post)}>
                      {post.title}
                    </Heading>
                  </CardHeader>
                  
                  <CardBody>
                    <Text noOfLines={3} mb={4}>{post.content}</Text>
                    
                    <HStack spacing={2} mb={3} flexWrap="wrap">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} colorScheme="gray" variant="subtle">
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                    
                    <Divider my={2} />
                    
                    <Flex justify="space-between" align="center">
                      <HStack>
                        <Button
                          size="sm"
                          leftIcon={<FaThumbsUp />}
                          variant="ghost"
                          onClick={() => handleLikePost(post.id)}
                        >
                          {post.likes}
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<FaComment />}
                          variant="ghost"
                          onClick={() => handleOpenPostDetail(post)}
                        >
                          {post.comments.length}
                        </Button>
                      </HStack>
                      
                      <HStack>
                        <IconButton
                          aria-label="Bookmark post"
                          icon={<FaBookmark />}
                          size="sm"
                          variant="ghost"
                          color="gray.500"
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More options"
                            icon={<FaEllipsisV />}
                            size="sm"
                            variant="ghost"
                            color="gray.500"
                          />
                          <MenuList>
                            <MenuItem icon={<FaFlag />}>Report</MenuItem>
                            <MenuItem icon={<FaEdit />}>Edit</MenuItem>
                            <MenuItem icon={<FaTrash />}>Delete</MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Flex>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Box p={8} textAlign="center">
                <Text fontSize="lg" color="gray.500">No posts found. Try changing your search criteria or create a new post.</Text>
              </Box>
            )}
          </VStack>
        </Container>
        
        {/* New Post Modal */}
        <Modal isOpen={isNewPostOpen} onClose={onNewPostClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input 
                    placeholder="Enter post title" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Content</FormLabel>
                  <Textarea 
                    placeholder="Write your post content here..."
                    rows={6}
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    placeholder="Select category"
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Input 
                    placeholder="Enter tags separated by commas" 
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Post Anonymously</FormLabel>
                  <Switch 
                    colorScheme="red"
                    isChecked={newPost.isAnonymous}
                    onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
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
                onClick={handleCreatePost}
              >
                Create Post
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Post Detail Modal */}
        {selectedPost && (
          <Modal isOpen={isPostDetailOpen} onClose={onPostDetailClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Text fontSize="xl" mb={1}>{selectedPost.title}</Text>
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Avatar size="sm" src={selectedPost.author.avatar} name={selectedPost.author.name} />
                    <Text fontSize="sm">{selectedPost.author.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatDate(selectedPost.createdAt)}
                    </Text>
                  </HStack>
                  <Badge colorScheme={categories.find(cat => cat.id === selectedPost.category)?.color.split('.')[0] || 'gray'}>
                    {categories.find(cat => cat.id === selectedPost.category)?.name}
                  </Badge>
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb={6} whiteSpace="pre-wrap">{selectedPost.content}</Text>
                
                <HStack spacing={2} mb={4} flexWrap="wrap">
                  {selectedPost.tags.map((tag, index) => (
                    <Badge key={index} colorScheme="gray" variant="subtle">
                      {tag}
                    </Badge>
                  ))}
                </HStack>
                
                <Divider my={4} />
                
                <Flex justify="space-between" align="center" mb={6}>
                  <HStack>
                    <Button
                      size="sm"
                      leftIcon={<FaThumbsUp />}
                      variant="ghost"
                      onClick={() => handleLikePost(selectedPost.id)}
                    >
                      {selectedPost.likes}
                    </Button>
                    <Text fontSize="sm">
                      {selectedPost.comments.length} comments
                    </Text>
                  </HStack>
                  
                  <HStack>
                    <IconButton
                      aria-label="Bookmark post"
                      icon={<FaBookmark />}
                      size="sm"
                      variant="ghost"
                      color="gray.500"
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<FaEllipsisV />}
                        size="sm"
                        variant="ghost"
                        color="gray.500"
                      />
                      <MenuList>
                        <MenuItem icon={<FaFlag />}>Report</MenuItem>
                        <MenuItem icon={<FaEdit />}>Edit</MenuItem>
                        <MenuItem icon={<FaTrash />}>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Flex>
                
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Comments
                </Text>
                
                <VStack spacing={4} align="stretch" mb={6}>
                  {selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map(comment => (
                      <Box 
                        key={comment.id} 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="md"
                        borderColor={borderColor}
                      >
                        <Flex justify="space-between" align="center" mb={2}>
                          <HStack>
                            <Avatar size="xs" src={comment.author.avatar} name={comment.author.name} />
                            <Text fontSize="sm" fontWeight="medium">{comment.author.name}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatDate(comment.createdAt)}
                            </Text>
                          </HStack>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="More options"
                              icon={<FaEllipsisV />}
                              size="xs"
                              variant="ghost"
                              color="gray.500"
                            />
                            <MenuList>
                              <MenuItem icon={<FaFlag />}>Report</MenuItem>
                              <MenuItem icon={<FaEdit />}>Edit</MenuItem>
                              <MenuItem icon={<FaTrash />}>Delete</MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                        <Text fontSize="sm" mb={2}>{comment.content}</Text>
                        <Button
                          size="xs"
                          leftIcon={<FaThumbsUp />}
                          variant="ghost"
                          onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                        >
                          {comment.likes}
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500">No comments yet. Be the first to comment!</Text>
                  )}
                </VStack>
                
                <Textarea 
                  placeholder="Add a comment..."
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  mb={4}
                  borderColor={borderColor}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onPostDetailClose}>
                  Close
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={handleAddComment}
                  isDisabled={!newComment}
                >
                  Post Comment
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Flex>
  );
};

export default InstructorForum; 