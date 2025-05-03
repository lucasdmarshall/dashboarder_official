import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Select,
  IconButton,
  Divider,
  useColorModeValue,
  Avatar,
  Card,
  CardHeader,
  CardBody,
  CardFooter,

  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { 
  FaBullhorn, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaThumbtack, 
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

// Mock data for notices
const mockNotices = [
  {
    id: 1,
    title: 'End of Semester Examination Schedule',
    content: 'The end of semester examinations will commence on December 10th, 2023. All students are required to check their examination timetables and prepare accordingly.',
    category: 'Examination',
    priority: 'high',
    isPinned: true,
    author: 'Admin',
    authorAvatar: 'https://bit.ly/sage-adebayo',
    createdAt: '2023-11-15T10:30:00',
    expiresAt: '2023-12-20T23:59:59',
    attachments: []
  },
  {
    id: 2,
    title: 'Holiday Break Announcement',
    content: 'The institution will be closed for the winter holiday from December 22nd, 2023 to January 5th, 2024. Classes will resume on January 8th, 2024.',
    category: 'General',
    priority: 'medium',
    isPinned: false,
    author: 'Principal',
    authorAvatar: 'https://bit.ly/kent-c-dodds',
    createdAt: '2023-11-20T14:15:00',
    expiresAt: '2024-01-10T23:59:59',
    attachments: []
  },
  {
    id: 3,
    title: 'New Course Registration Open',
    content: 'Registration for Spring 2024 courses is now open. Students can register through the student portal until January 15th, 2024.',
    category: 'Registration',
    priority: 'high',
    isPinned: true,
    author: 'Registrar',
    authorAvatar: 'https://bit.ly/ryan-florence',
    createdAt: '2023-11-25T09:00:00',
    expiresAt: '2024-01-15T23:59:59',
    attachments: []
  },
  {
    id: 4,
    title: 'Campus Maintenance Notice',
    content: 'The main library will be closed for renovations from December 1st to December 5th, 2023. Alternative study spaces will be available in the Student Center.',
    category: 'Facilities',
    priority: 'low',
    isPinned: false,
    author: 'Facilities Manager',
    authorAvatar: 'https://bit.ly/prosper-baba',
    createdAt: '2023-11-28T11:45:00',
    expiresAt: '2023-12-06T23:59:59',
    attachments: []
  }
];

const categories = ['General', 'Examination', 'Registration', 'Events', 'Facilities', 'Academic', 'Administrative'];
const priorities = [
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'medium', label: 'Medium', color: 'orange' },
  { value: 'high', label: 'High', color: 'red' }
];

const Noticeboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const headerBgColor = '#640101';
  const headerColor = 'white';

  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showExpired, setShowExpired] = useState(false);
  
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'medium',
    isPinned: false,
    expiresAt: ''
  });

  // Set default expiry date to 30 days from now
  useEffect(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const formattedDate = thirtyDaysFromNow.toISOString().split('T')[0];
    
    setNewNotice(prev => ({
      ...prev,
      expiresAt: formattedDate
    }));

    // Load mock data
    setNotices(mockNotices);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewNotice({
      ...newNotice,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    const currentDate = new Date();
    const expiryDate = new Date(newNotice.expiresAt);
    
    if (expiryDate <= currentDate) {
      toast({
        title: 'Invalid expiry date',
        description: 'Expiry date must be in the future',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Create new notice
    const createdNotice = {
      id: notices.length + 1,
      ...newNotice,
      author: user?.name || 'Admin',
      authorAvatar: user?.avatar || 'https://bit.ly/sage-adebayo',
      createdAt: new Date().toISOString(),
      attachments: []
    };

    setNotices([createdNotice, ...notices]);
    
    toast({
      title: 'Notice created',
      description: 'Your notice has been published successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });

    // Reset form and close modal
    setNewNotice({
      title: '',
      content: '',
      category: 'General',
      priority: 'medium',
      isPinned: false,
      expiresAt: newNotice.expiresAt // Keep the expiry date
    });
    
    onClose();
  };

  const handlePinToggle = (id) => {
    setNotices(notices.map(notice => 
      notice.id === id ? { ...notice, isPinned: !notice.isPinned } : notice
    ));
  };

  const handleDeleteNotice = (id) => {
    setNotices(notices.filter(notice => notice.id !== id));
    
    toast({
      title: 'Notice deleted',
      description: 'The notice has been deleted successfully',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  // Filter and sort notices
  const filteredNotices = notices.filter(notice => {
    const isExpired = new Date(notice.expiresAt) < new Date();
    if (!showExpired && isExpired) return false;
    
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? notice.category === categoryFilter : true;
    const matchesPriority = priorityFilter ? notice.priority === priorityFilter : true;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort notices: pinned first, then by creation date (newest first)
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'gray';
  };

  // Navigate to recipients selection page
  const handleNavigateToRecipients = () => {
    navigate('/noticeboard/recipients');
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading 
              as="h1" 
              size="xl" 
              color="#640101"
              borderBottom="2px solid #640101"
              pb={2}
              display="flex"
              alignItems="center"
            >
              <FaBullhorn style={{ marginRight: '15px' }} />
              Noticeboard
            </Heading>
            <HStack spacing={3}>
              <Button 
                leftIcon={<FaPlus />} 
                onClick={onOpen}
                colorScheme="red"
                bg="#640101"
                _hover={{ bg: 'black' }}
              >
                Create Notice
              </Button>
              <Button
                leftIcon={<FaUsers />}
                onClick={handleNavigateToRecipients}
                colorScheme="blue"
                variant="outline"
              >
                Send to Classes/Students
              </Button>
            </HStack>
          </Flex>

          {/* Filters */}
          <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="Search notices..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              
              <Select 
                placeholder="All Categories" 
                maxW="200px"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              
              <Select 
                placeholder="All Priorities" 
                maxW="200px"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </Select>
              
              <Button 
                variant="outline" 
                colorScheme="red"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setPriorityFilter('');
                }}
              >
                Clear Filters
              </Button>
              
              <Flex alignItems="center" ml="auto">
                <input 
                  type="checkbox" 
                  id="showExpired" 
                  checked={showExpired}
                  onChange={(e) => setShowExpired(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="showExpired">Show Expired</label>
              </Flex>
            </HStack>
          </Box>

          {/* Notices */}
          {sortedNotices.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {sortedNotices.map(notice => {
                const isExpired = new Date(notice.expiresAt) < new Date();
                
                return (
                  <Card 
                    key={notice.id} 
                    boxShadow="md" 
                    bg={cardBgColor}
                    opacity={isExpired ? 0.7 : 1}
                    position="relative"
                    overflow="hidden"
                  >
                    {notice.isPinned && (
                      <Box 
                        position="absolute" 
                        top={0} 
                        right={0} 
                        bg="#640101" 
                        color="white" 
                        p={1}
                        borderBottomLeftRadius="md"
                      >
                        <FaThumbtack />
                      </Box>
                    )}
                    
                    <CardHeader pb={2}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="md" color="#640101">{notice.title}</Heading>
                        <HStack>
                          <IconButton
                            icon={<FaThumbtack />}
                            size="sm"
                            colorScheme={notice.isPinned ? "red" : "gray"}
                            variant="ghost"
                            onClick={() => handlePinToggle(notice.id)}
                            aria-label={notice.isPinned ? "Unpin notice" : "Pin notice"}
                          />
                          <IconButton
                            icon={<FaEdit />}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            aria-label="Edit notice"
                          />
                          <IconButton
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteNotice(notice.id)}
                            aria-label="Delete notice"
                          />
                        </HStack>
                      </Flex>
                      
                      <HStack mt={2} spacing={3}>
                        <Badge colorScheme={getPriorityColor(notice.priority)}>
                          {priorities.find(p => p.value === notice.priority)?.label || 'Unknown'}
                        </Badge>
                        <Badge colorScheme="purple">{notice.category}</Badge>
                        {isExpired && <Badge colorScheme="gray">Expired</Badge>}
                      </HStack>
                    </CardHeader>
                    
                    <Divider />
                    
                    <CardBody py={4}>
                      <Text>{notice.content}</Text>
                    </CardBody>
                    
                    <Divider />
                    
                    <CardFooter pt={2}>
                      <Flex width="100%" justifyContent="space-between" alignItems="center">
                        <HStack>
                          <Avatar src={notice.authorAvatar} size="xs" />
                          <Text fontSize="sm">{notice.author}</Text>
                        </HStack>
                        
                        <HStack spacing={4}>
                          <HStack>
                            <FaCalendarAlt size="12px" />
                            <Text fontSize="xs">Posted: {formatDate(notice.createdAt)}</Text>
                          </HStack>
                          <HStack>
                            <FaCalendarAlt size="12px" />
                            <Text fontSize="xs">Expires: {formatDate(notice.expiresAt)}</Text>
                          </HStack>
                        </HStack>
                      </Flex>
                    </CardFooter>
                  </Card>
                );
              })}
            </VStack>
          ) : (
            <Box 
              textAlign="center" 
              p={8} 
              bg="white" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Text fontSize="lg" color="gray.500">No notices found</Text>
            </Box>
          )}
        </VStack>
      </Container>

      {/* Create Notice Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg={headerBgColor} color={headerColor}>Create New Notice</ModalHeader>
          <ModalCloseButton color={headerColor} />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title"
                  value={newNotice.title}
                  onChange={handleInputChange}
                  placeholder="Enter notice title"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea 
                  name="content"
                  value={newNotice.content}
                  onChange={handleInputChange}
                  placeholder="Enter notice content"
                  rows={6}
                />
              </FormControl>
              
              <HStack spacing={6}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    name="category"
                    value={newNotice.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    name="priority"
                    value={newNotice.priority}
                    onChange={handleInputChange}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
              
              <HStack spacing={6}>
                <FormControl>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input 
                    name="expiresAt"
                    type="date"
                    value={newNotice.expiresAt}
                    onChange={handleInputChange}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center" mt={8}>
                  <input 
                    type="checkbox" 
                    id="isPinned" 
                    name="isPinned"
                    checked={newNotice.isPinned}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  <FormLabel htmlFor="isPinned" mb={0}>Pin this notice</FormLabel>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              bg="#640101"
              _hover={{ bg: 'black' }}
              onClick={handleCreateNotice}
            >
              Create Notice
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Noticeboard;
