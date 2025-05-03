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
  MenuItem
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
  FaTags
} from 'react-icons/fa';

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
];

const Forum = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('forumPosts');
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
  
  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
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
    
    const postId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    const tagsArray = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const newPostObj = {
      id: postId,
      title: newPost.title,
      content: newPost.content,
      author: newPost.isAnonymous ? {
        id: 'anonymous',
        name: 'Anonymous User',
        avatar: 'https://bit.ly/broken-link'
      } : {
        id: 'currentUser',
        name: 'Current User',
        avatar: 'https://bit.ly/dan-abramov'
      },
      category: parseInt(newPost.category),
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    setPosts([...posts, newPostObj]);
    
    // Reset form and close modal
    setNewPost({
      title: '',
      content: '',
      category: 1,
      tags: '',
      isAnonymous: false
    });
    onNewPostClose();
    
    toast({
      title: 'Post Created',
      description: 'Your post has been published successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };
  
  // Function to handle liking a post
  const handleLikePost = (postId) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
  };
  
  // Function to handle adding a comment
  const handleAddComment = () => {
    if (!newComment || !selectedPost) return;
    
    const commentId = selectedPost.comments.length > 0 
      ? Math.max(...selectedPost.comments.map(c => c.id)) + 1 
      : 1;
    
    const newCommentObj = {
      id: commentId,
      content: newComment,
      author: {
        id: 'currentUser',
        name: 'Current User',
        avatar: 'https://bit.ly/dan-abramov'
      },
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    const updatedPosts = posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, comments: [...post.comments, newCommentObj] } 
        : post
    );
    
    setPosts(updatedPosts);
    setSelectedPost({...selectedPost, comments: [...selectedPost.comments, newCommentObj]});
    setNewComment('');
    
    toast({
      title: 'Comment Added',
      description: 'Your comment has been added successfully',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
  };
  
  // Function to handle liking a comment
  const handleLikeComment = (postId, commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => 
          comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    
    if (selectedPost && selectedPost.id === postId) {
      const updatedComments = selectedPost.comments.map(comment => 
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      );
      setSelectedPost({ ...selectedPost, comments: updatedComments });
    }
  };
  
  // Function to open post detail
  const handleOpenPostDetail = (post) => {
    setSelectedPost(post);
    onPostDetailOpen();
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold">Forum</Text>
            <Button
              bg="#640101"
              color="white"
              leftIcon={<FaPlus />}
              _hover={{ bg: 'black' }}
              onClick={onNewPostOpen}
            >
              New Post
            </Button>
          </Flex>
          
          {/* Search and Filter Bar */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            gap={4} 
            mb={6}
            p={4}
            bg={cardBgColor}
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor={borderColor}
          >
            <InputGroup flex="2">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search posts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderColor="#640101"
                _hover={{ borderColor: '#640101' }}
                _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
              />
            </InputGroup>
            
            <Select 
              placeholder="All Categories" 
              flex="1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
              borderColor="#640101"
              _hover={{ borderColor: '#640101' }}
              _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
            >
              <option value={0}>All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            
            <Select 
              placeholder="Sort By" 
              flex="1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              borderColor="#640101"
              _hover={{ borderColor: '#640101' }}
              _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostCommented">Most Commented</option>
            </Select>
          </Flex>
          
          {/* Forum Posts */}
          <VStack spacing={4} align="stretch">
            {sortedPosts.length === 0 ? (
              <Box 
                p={8} 
                textAlign="center" 
                bg={cardBgColor}
                borderRadius="lg"
                boxShadow="sm"
                border="1px solid"
                borderColor={borderColor}
              >
                <Text fontSize="lg" color="gray.500">No posts found matching your criteria.</Text>
              </Box>
            ) : (
              sortedPosts.map(post => (
                <Box 
                  key={post.id}
                  p={5}
                  bg={cardBgColor}
                  borderRadius="lg"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor={borderColor}
                  _hover={{ boxShadow: 'md', borderColor: '#640101' }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => handleOpenPostDetail(post)}
                >
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <HStack spacing={4} align="flex-start">
                      <Avatar size="md" src={post.author.avatar} name={post.author.name} />
                      <Box>
                        <Text fontSize="lg" fontWeight="bold" mb={1}>{post.title}</Text>
                        <HStack mb={2}>
                          <Text fontSize="sm" color="gray.500">
                            Posted by {post.author.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            • {formatDate(post.createdAt)}
                          </Text>
                        </HStack>
                        <Badge 
                          colorScheme={
                            categories.find(c => c.id === post.category)?.name === 'General Discussion' ? 'blue' :
                            categories.find(c => c.id === post.category)?.name === 'Academic Questions' ? 'green' :
                            categories.find(c => c.id === post.category)?.name === 'Campus Events' ? 'purple' :
                            categories.find(c => c.id === post.category)?.name === 'Technical Support' ? 'red' : 'orange'
                          }
                          mb={2}
                        >
                          {categories.find(c => c.id === post.category)?.name}
                        </Badge>
                        <Text noOfLines={2} mb={3}>{post.content}</Text>
                        <HStack spacing={2}>
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" colorScheme="gray">
                              #{tag}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    </HStack>
                  </Flex>
                  
                  <Divider my={3} />
                  
                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack spacing={4}>
                      <HStack spacing={1} onClick={(e) => { e.stopPropagation(); handleLikePost(post.id); }}>
                        <IconButton
                          aria-label="Like post"
                          icon={<FaThumbsUp />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                        />
                        <Text>{post.likes}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Comments"
                          icon={<FaComment />}
                          size="sm"
                          variant="ghost"
                          colorScheme="green"
                        />
                        <Text>{post.comments.length}</Text>
                      </HStack>
                    </HStack>
                    
                    <IconButton
                      aria-label="More options"
                      icon={<FaEllipsisV />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Flex>
                </Box>
              ))
            )}
          </VStack>
        </VStack>
      </Container>
      
      {/* New Post Modal */}
      <Modal isOpen={isNewPostOpen} onClose={onNewPostClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">Create New Post</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  placeholder="Enter post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Tags (comma separated)</FormLabel>
                <Input 
                  placeholder="e.g. homework, math, help"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea 
                  placeholder="Write your post content here..."
                  minHeight="200px"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="anonymous-post" mb="0">
                  Post anonymously
                </FormLabel>
                <Switch 
                  id="anonymous-post" 
                  colorScheme="red" 
                  isChecked={newPost.isAnonymous}
                  onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNewPostClose}>
              Cancel
            </Button>
            <Button bg="#640101" color="white" onClick={handleCreatePost} _hover={{ bg: 'black' }}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Post Detail Modal */}
      {selectedPost && (
        <Modal isOpen={isPostDetailOpen} onClose={onPostDetailClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg="#640101" color="white">{selectedPost.title}</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={6} align="stretch">
                {/* Post Content */}
                <Box>
                  <Flex mb={4}>
                    <Avatar src={selectedPost.author.avatar} name={selectedPost.author.name} mr={3} />
                    <Box>
                      <Text fontWeight="bold">{selectedPost.author.name}</Text>
                      <Text fontSize="sm" color="gray.500">{formatDate(selectedPost.createdAt)}</Text>
                    </Box>
                  </Flex>
                  
                  <Text mb={4} whiteSpace="pre-wrap">{selectedPost.content}</Text>
                  
                  <HStack spacing={2} mb={4}>
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" colorScheme="gray">
                        #{tag}
                      </Badge>
                    ))}
                  </HStack>
                  
                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack spacing={4}>
                      <HStack spacing={1} onClick={() => handleLikePost(selectedPost.id)}>
                        <IconButton
                          aria-label="Like post"
                          icon={<FaThumbsUp />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                        />
                        <Text>{selectedPost.likes}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Comments"
                          icon={<FaComment />}
                          size="sm"
                          variant="ghost"
                          colorScheme="green"
                        />
                        <Text>{selectedPost.comments.length}</Text>
                      </HStack>
                    </HStack>
                    
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<FaEllipsisV />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem icon={<FaBookmark />}>Bookmark</MenuItem>
                        <MenuItem icon={<FaFlag />}>Report</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </Box>
                
                <Divider />
                
                {/* Comments Section */}
                <Box>
                  <Text fontWeight="bold" mb={4}>
                    Comments ({selectedPost.comments.length})
                  </Text>
                  
                  {selectedPost.comments.length === 0 ? (
                    <Text color="gray.500" mb={4}>No comments yet. Be the first to comment!</Text>
                  ) : (
                    <VStack spacing={4} align="stretch" mb={6}>
                      {selectedPost.comments.map(comment => (
                        <Box 
                          key={comment.id}
                          p={4}
                          bg="gray.50"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <Flex mb={2}>
                            <Avatar 
                              size="sm" 
                              src={comment.author.avatar} 
                              name={comment.author.name} 
                              mr={2} 
                            />
                            <Box>
                              <Text fontWeight="bold" fontSize="sm">{comment.author.name}</Text>
                              <Text fontSize="xs" color="gray.500">{formatDate(comment.createdAt)}</Text>
                            </Box>
                          </Flex>
                          
                          <Text mb={3}>{comment.content}</Text>
                          
                          <Flex justifyContent="space-between" alignItems="center">
                            <HStack spacing={1} onClick={() => handleLikeComment(selectedPost.id, comment.id)}>
                              <IconButton
                                aria-label="Like comment"
                                icon={<FaThumbsUp />}
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                              />
                              <Text fontSize="sm">{comment.likes}</Text>
                            </HStack>
                            
                            <Button 
                              size="xs" 
                              variant="ghost"
                              onClick={() => setReplyingTo(comment.id)}
                            >
                              Reply
                            </Button>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  )}
                  
                  {/* Add Comment Form */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      {replyingTo ? 'Reply to Comment' : 'Add a Comment'}
                    </Text>
                    <Textarea
                      placeholder="Write your comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      mb={3}
                    />
                    <Flex justifyContent="flex-end">
                      {replyingTo && (
                        <Button 
                          variant="ghost" 
                          mr={2}
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button 
                        bg="#640101" 
                        color="white" 
                        onClick={handleAddComment}
                        _hover={{ bg: 'black' }}
                      >
                        {replyingTo ? 'Reply' : 'Comment'}
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Forum;
