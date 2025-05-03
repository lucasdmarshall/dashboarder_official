import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Flex,
  Badge,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FaBook, FaPlus, FaSearch, FaUserTie, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
// Will be used later when connecting to backend
// import { useAuth } from '../contexts/authContext';

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'A comprehensive introduction to computer science concepts and programming fundamentals.',
    materials: 'Textbook: "Computer Science: An Overview", Online resources, Lab materials',
    objective: 'Understand basic programming concepts and develop problem-solving skills',
    instructor: 'Jane Smith',
    instructorAvatar: 'https://bit.ly/sage-adebayo',
    students: 45,
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    title: 'Data Structures and Algorithms',
    code: 'CS201',
    description: 'Study of fundamental data structures and algorithms used in computer programming.',
    materials: 'Textbook: "Algorithms Unlocked", Online coding platforms, Reference materials',
    objective: 'Master common data structures and algorithm design techniques',
    instructor: 'Robert Johnson',
    instructorAvatar: 'https://bit.ly/kent-c-dodds',
    students: 38,
    createdAt: '2023-02-20'
  },
  {
    id: 3,
    title: 'Web Development Fundamentals',
    code: 'WD101',
    description: 'Introduction to HTML, CSS, and JavaScript for building modern web applications.',
    materials: 'Online tutorials, Code editors, Web hosting accounts',
    objective: 'Build responsive and interactive websites using modern web technologies',
    instructor: 'Emily Davis',
    instructorAvatar: 'https://bit.ly/ryan-florence',
    students: 52,
    createdAt: '2023-03-10'
  },
  {
    id: 4,
    title: 'Database Management Systems',
    code: 'DB301',
    description: 'Principles and practices of database design, implementation, and management.',
    materials: 'SQL workbench, Database server access, Reference guides',
    objective: 'Design efficient databases and write complex queries',
    instructor: 'Michael Brown',
    instructorAvatar: 'https://bit.ly/prosper-baba',
    students: 30,
    createdAt: '2023-04-05'
  }
];

const CreateCourse = () => {
  const toast = useToast();
  // Auth context will be used for user info when connecting to backend later
  // const auth = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [courses, setCourses] = useState([]);
  const [approvedInstructors, setApprovedInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [courseData, setCourseData] = useState({
    title: '',
    code: '',
    description: '',
    materials: '',
    objective: '',
    instructorId: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  
  // Load mock courses and approved instructors from localStorage
  useEffect(() => {
    setCourses(mockCourses);
    
    // Get approved instructors from localStorage
    const storedInstructors = JSON.parse(localStorage.getItem('approvedInstructors') || '[]');
    setApprovedInstructors(storedInstructors);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value
    });
  };
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!courseData.title || !courseData.code || !courseData.description || !courseData.objective || !courseData.instructorId) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Find the selected instructor
    const selectedInstructor = approvedInstructors.find(instructor => instructor.id === courseData.instructorId);
    const instructorName = selectedInstructor ? selectedInstructor.name : 'Unknown Instructor';
    const instructorAvatar = 'https://bit.ly/sage-adebayo'; // Default avatar
    
    if (isEditing) {
      // Update existing course
      const updatedCourses = courses.map(course => {
        if (course.id === editingCourseId) {
          return {
            ...course,
            ...courseData,
            instructor: instructorName,
            instructorAvatar: instructorAvatar
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      toast({
        title: 'Course updated',
        description: `Course "${courseData.title}" has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } else {
      // Create new course
      const newCourse = {
        id: courses.length + 1,
        ...courseData,
        instructor: instructorName,
        instructorAvatar: instructorAvatar,
        students: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Add to courses list
      setCourses([newCourse, ...courses]);

      toast({
        title: 'Course created',
        description: `Course "${courseData.title}" has been created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }

    // Reset form and close modal
    setCourseData({
      title: '',
      code: '',
      description: '',
      materials: '',
      objective: '',
      instructorId: ''
    });
    setIsEditing(false);
    setEditingCourseId(null);
    onClose();
  };
  
  const handleEdit = (course) => {
    // Find the instructor ID based on the instructor name
    const instructor = approvedInstructors.find(inst => inst.name === course.instructor);
    const instructorId = instructor ? instructor.id : '';
    
    // Set form data with course details
    setCourseData({
      title: course.title,
      code: course.code,
      description: course.description,
      materials: course.materials,
      objective: course.objective,
      instructorId: instructorId
    });
    
    // Set editing state
    setIsEditing(true);
    setEditingCourseId(course.id);
    
    // Open modal
    onOpen();
  };
  
  const handleDelete = (courseId) => {
    // Filter out the course to delete
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    
    toast({
      title: 'Course deleted',
      description: 'The course has been deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
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
              <FaBook style={{ marginRight: '15px' }} />
              Course Library
            </Heading>
            <Button
              leftIcon={<FaPlus />}
              bg="#640101"
              color="white"
              onClick={onOpen}
              _hover={{ bg: 'black' }}
            >
              Create Course
            </Button>
          </Flex>
          
          {/* Search Bar */}
          <Box mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search courses by title, code, or instructor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderColor="#640101"
                _hover={{ borderColor: '#640101' }}
                _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
              />
            </InputGroup>
          </Box>
          
          {/* Course Cards - Enhanced Landscape Layout */}
          <SimpleGrid columns={{ base: 1 }} spacing={6}>
            {filteredCourses.map(course => (
              <Card 
                key={course.id} 
                bg={cardBgColor} 
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)" 
                borderRadius="xl" 
                overflow="hidden" 
                position="relative"
                transition="all 0.3s ease"
                direction="row"
                height="200px"
                borderLeft="5px solid #640101"
                _hover={{ 
                  transform: 'translateY(-5px) translateX(5px)', 
                  boxShadow: '0 12px 24px rgba(100, 1, 1, 0.15)',
                  borderColor: '#640101'
                }}
              >
                <CardHeader 
                  bg="#640101" 
                  color="white" 
                  p={5}
                  width="280px"
                  backgroundImage="linear-gradient(135deg, #640101 0%, #8a0303 100%)"
                  position="relative"
                  overflow="hidden"
                >
                  {/* Decorative elements */}
                  <Box 
                    position="absolute" 
                    top="-30px" 
                    right="-30px" 
                    width="100px" 
                    height="100px" 
                    borderRadius="full" 
                    bg="rgba(255, 255, 255, 0.1)" 
                  />
                  <Box 
                    position="absolute" 
                    bottom="-20px" 
                    left="-20px" 
                    width="80px" 
                    height="80px" 
                    borderRadius="full" 
                    bg="rgba(255, 255, 255, 0.05)" 
                  />
                  
                  <VStack height="100%" alignItems="flex-start" justifyContent="space-between" spacing={4} zIndex="1" position="relative">
                    <Box>
                      <Heading size="md" fontWeight="700" letterSpacing="tight" noOfLines={2} mb={2}>{course.title}</Heading>
                      <Badge 
                        colorScheme="red" 
                        px={3} 
                        py={1} 
                        borderRadius="full"
                        fontWeight="600"
                        letterSpacing="0.5px"
                        bg="rgba(255, 255, 255, 0.2)"
                        color="white"
                      >
                        {course.code}
                      </Badge>
                    </Box>
                    
                    <Flex 
                      alignItems="center" 
                      width="100%"
                      bg="rgba(255, 255, 255, 0.15)" 
                      p={3} 
                      borderRadius="lg"
                      backdropFilter="blur(8px)"
                    >
                      <Avatar 
                        size="md" 
                        src={course.instructorAvatar} 
                        mr={3} 
                        border="2px solid white"
                        boxShadow="0 0 0 2px rgba(255,255,255,0.2)"
                      />
                      <Box>
                        <Text fontSize="xs" color="gray.200" textTransform="uppercase" letterSpacing="wider">Instructor</Text>
                        <Text fontWeight="bold" fontSize="sm">{course.instructor}</Text>
                      </Box>
                    </Flex>
                    
                    <Flex alignItems="center">
                      <Box 
                        as="span" 
                        w="10px" 
                        h="10px" 
                        borderRadius="full" 
                        bg="green.400" 
                        mr={2} 
                        boxShadow="0 0 0 2px rgba(255,255,255,0.3)"
                      />
                      <Text fontSize="xs" color="gray.200" fontStyle="italic">
                        Created: {course.createdAt}
                      </Text>
                    </Flex>
                  </VStack>
                </CardHeader>
                <Box flex="1" display="flex" flexDirection="column">
                  <CardBody p={5} flex="1" overflowY="auto">
                    <VStack align="start" spacing={4} w="100%">
                      <Box w="100%" pb={3} borderBottom="1px solid" borderColor="gray.100">
                        <Flex align="center" mb={2}>
                          <Box as="span" w="4px" h="18px" bg="#640101" mr={2} borderRadius="sm"/>
                          <Text fontSize="sm" fontWeight="bold" color="#640101" textTransform="uppercase" letterSpacing="wide">Description</Text>
                        </Flex>
                        <Text noOfLines={2} fontSize="md" lineHeight="taller">{course.description}</Text>
                      </Box>
                      <Box w="100%" pb={3} borderBottom="1px solid" borderColor="gray.100">
                        <Flex align="center" mb={2}>
                          <Box as="span" w="4px" h="18px" bg="#640101" mr={2} borderRadius="sm"/>
                          <Text fontSize="sm" fontWeight="bold" color="#640101" textTransform="uppercase" letterSpacing="wide">Materials</Text>
                        </Flex>
                        <Text noOfLines={1} fontSize="md" lineHeight="taller">{course.materials}</Text>
                      </Box>
                      <Box w="100%" pb={2}>
                        <Flex align="center" mb={2}>
                          <Box as="span" w="4px" h="18px" bg="#640101" mr={2} borderRadius="sm"/>
                          <Text fontSize="sm" fontWeight="bold" color="#640101" textTransform="uppercase" letterSpacing="wide">Objective</Text>
                        </Flex>
                        <Text noOfLines={1} fontSize="md" lineHeight="taller">{course.objective}</Text>
                      </Box>
                    </VStack>
                  </CardBody>
                  <CardFooter 
                    bg="gray.50" 
                    p={4} 
                    justifyContent="space-between" 
                    alignItems="center"
                    borderTop="1px solid" 
                    borderColor="gray.100"
                    position="relative"
                    overflow="hidden"
                  >
                    {/* Decorative element */}
                    <Box 
                      position="absolute" 
                      right="-10px" 
                      bottom="-10px" 
                      width="70px" 
                      height="70px" 
                      borderRadius="full" 
                      bg="rgba(100, 1, 1, 0.03)" 
                      zIndex="0"
                    />
                    
                    <Flex align="center">
                      <Box 
                        bg="#640101" 
                        color="white" 
                        borderRadius="full" 
                        p={1} 
                        mr={3}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxSize="32px"
                      >
                        <Text fontSize="xs" fontWeight="bold">{course.students}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="medium">Students Enrolled</Text>
                        <Text fontSize="sm" fontWeight="bold" color="#640101">{course.students > 0 ? `${course.students} students` : 'No students yet'}</Text>
                      </Box>
                    </Flex>
                    
                    <HStack spacing={3} zIndex="1">
                      <IconButton
                        icon={<FaEdit />}
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        aria-label="Edit course"
                        onClick={() => handleEdit(course)}
                        _hover={{ bg: '#640101', color: 'white' }}
                        boxShadow="sm"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        aria-label="Delete course"
                        onClick={() => handleDelete(course.id)}
                        _hover={{ bg: '#640101', color: 'white' }}
                        boxShadow="sm"
                      />
                      <IconButton
                        icon={<FaEye />}
                        variant="solid"
                        bg="#640101"
                        color="white"
                        size="sm"
                        aria-label="View details"
                        _hover={{ bg: 'black' }}
                        boxShadow="sm"
                      />
                    </HStack>
                  </CardFooter>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
          
          {/* Create Course Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader bg="#640101" color="white">
                <Flex alignItems="center">
                  <FaBook style={{ marginRight: '10px' }} />
                  {isEditing ? 'Edit Course' : 'Create New Course'}
                </Flex>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <VStack spacing={4} as="form" id="course-form">
                  <FormControl isRequired>
                    <FormLabel>Course Title</FormLabel>
                    <Input 
                      name="title"
                      value={courseData.title}
                      onChange={handleChange}
                      placeholder="e.g. Introduction to Computer Science"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Course Code</FormLabel>
                    <Input 
                      name="code"
                      value={courseData.code}
                      onChange={handleChange}
                      placeholder="e.g. CS101"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Course Description</FormLabel>
                    <Textarea 
                      name="description"
                      value={courseData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of the course"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Course Materials</FormLabel>
                    <Textarea 
                      name="materials"
                      value={courseData.materials}
                      onChange={handleChange}
                      placeholder="List required textbooks, online resources, etc."
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Learning Objective</FormLabel>
                    <Textarea 
                      name="objective"
                      value={courseData.objective}
                      onChange={handleChange}
                      placeholder="What students will learn from this course"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Assigned To</FormLabel>
                    <Flex align="center">
                      <Select
                        name="instructorId"
                        value={courseData.instructorId}
                        onChange={handleChange}
                        placeholder="Select instructor"
                        icon={<FaUserTie />}
                      >
                        {approvedInstructors.length > 0 ? (
                          approvedInstructors.map(instructor => (
                            <option key={instructor.id} value={instructor.id}>
                              {instructor.name} ({instructor.level})
                            </option>
                          ))
                        ) : (
                          <option disabled>No approved instructors available</option>
                        )}
                      </Select>
                    </Flex>
                    {approvedInstructors.length === 0 && (
                      <Text fontSize="sm" color="red.500" mt={1}>
                        No approved instructors found. Approve instructors from the Instructors page.
                      </Text>
                    )}
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter bg="gray.50">
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  bg="#640101"
                  color="white"
                  _hover={{ bg: 'red.700' }}
                >
                  {isEditing ? 'Update Course' : 'Create Course'}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          
          {/* Display message if no courses */}
          {filteredCourses.length === 0 && (
            <Box textAlign="center" py={10}>
              <Heading size="md" color="gray.500" mb={4}>No courses found</Heading>
              <Text>Try adjusting your search or create a new course</Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateCourse;
