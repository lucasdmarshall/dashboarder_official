  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Button, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Icon,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { 
  FaPlus, 
  FaBook, 
  FaCalendarAlt, 
  FaClipboardList,
  FaFileUpload,
  FaEye
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';
import ChatButton from '../components/ChatButton';
import { format, parseISO } from 'date-fns'; 

// Mock data generation function
const generateMockAssignments = () => {
  return [
    {
      id: 1,
      title: 'React Components Design',
      course: 'Web Development 101',
      dueDate: '2024-03-15',
      points: 100,
      description: 'Create a complex React component that demonstrates understanding of component lifecycle and state management.',
      status: 'active',
      submissions: 25,
      ungraded: 10
    },
    {
      id: 2,
      title: 'JavaScript Algorithms Challenge',
      course: 'Advanced JavaScript',
      dueDate: '2024-03-22',
      points: 150,
      description: 'Implement three different sorting algorithms from scratch without using built-in methods.',
      status: 'draft',
      submissions: 0,
      ungraded: 0
    }
  ];
};

const InstructorAssignments = () => {
  console.log('InstructorAssignments component rendered');
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Color mode values
  const cardBg = useColorModeValue('white', 'brand.primary');
  const cardBorder = useColorModeValue('brand.primary', 'brand.primary');

  // Courses dropdown
  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 1, name: 'Web Development 101' },
    { id: 2, name: 'Advanced JavaScript' }
  ];

  // Load assignments
  useEffect(() => {
    console.log('InstructorAssignments useEffect called');
    try {
      const mockAssignments = generateMockAssignments();
      console.log('Mock Assignments:', mockAssignments);
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
      toast({
        title: "Error Loading Assignments",
        description: "Unable to fetch assignments. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  }, []);

  // Filter assignments
  const filteredAssignments = assignments.filter(
    assignment => selectedCourse === 'all' || 
    assignment.course === courses.find(c => c.id === selectedCourse)?.name
  );

  // Create Assignment Modal
  const CreateAssignmentModal = () => {
    const [assignmentDetails, setAssignmentDetails] = useState({
      title: '',
      course: '',
      dueDate: '',
      points: '',
      description: ''
    });

    const handleSubmit = () => {
      // Validate and create assignment
      if (!assignmentDetails.title || !assignmentDetails.course) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }

      const newAssignment = {
        ...assignmentDetails,
        id: assignments.length + 1,
        status: 'draft',
        submissions: 0,
        ungraded: 0
      };

      setAssignments([...assignments, newAssignment]);
      onClose();
      toast({
        title: "Assignment Created",
        description: "Your assignment has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Assignment Title</FormLabel>
                <Input 
                  placeholder="Enter assignment title"
                  value={assignmentDetails.title}
                  onChange={(e) => setAssignmentDetails({
                    ...assignmentDetails, 
                    title: e.target.value
                  })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Course</FormLabel>
                <Select
                  placeholder="Select course"
                  value={assignmentDetails.course}
                  onChange={(e) => setAssignmentDetails({
                    ...assignmentDetails, 
                    course: e.target.value
                  })}
                >
                  {courses.filter(c => c.id !== 'all').map(course => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input 
                  type="date"
                  value={assignmentDetails.dueDate}
                  onChange={(e) => setAssignmentDetails({
                    ...assignmentDetails, 
                    dueDate: e.target.value
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Total Points</FormLabel>
                <Input 
                  type="number"
                  placeholder="Enter total points"
                  value={assignmentDetails.points}
                  onChange={(e) => setAssignmentDetails({
                    ...assignmentDetails, 
                    points: e.target.value
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="Describe the assignment requirements"
                  value={assignmentDetails.description}
                  onChange={(e) => setAssignmentDetails({
                    ...assignmentDetails, 
                    description: e.target.value
                  })}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Assignment
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="85px" pb={8} px={6}>
        {filteredAssignments.length === 0 ? (
          <VStack spacing={8} align="stretch">
            <Text>No assignments found. Create your first assignment!</Text>
            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="blue"
              onClick={onOpen}
            >
              Create Assignment
            </Button>
          </VStack>
        ) : (
          <VStack spacing={8} align="stretch">
            <Heading 
              size="lg" 
              color="brand.primary" 
              display="flex" 
              alignItems="center"
            >
              <Icon as={FaClipboardList} mr={3} color="brand.primary0" />
              Assignments
            </Heading>

            {/* Course Filter and Create Assignment */}
            <Flex justifyContent="space-between" alignItems="center">
              <Box width="250px">
                <Select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Button 
                leftIcon={<FaPlus />} 
                colorScheme="blue"
                onClick={onOpen}
              >
                Create Assignment
              </Button>
                  
          
          
      
      <ChatButton />
    </Flex>

            {/* Assignments Grid */}
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {filteredAssignments.map(assignment => (
                <Card 
                  key={assignment.id} 
                  bg={cardBg} 
                  borderWidth="1px" 
                  borderColor={cardBorder}
                  boxShadow="md"
                >
                  <CardHeader>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading size="md">{assignment.title}</Heading>
                      <Badge 
                        colorScheme={
                          assignment.status === 'active' ? 'green' : 
                          assignment.status === 'draft' ? 'yellow' : 
                          'gray'
                        }
                      >
                        {assignment.status}
                      </Badge>
                          
          
          
    </Flex>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Flex alignItems="center">
                        <Icon as={FaBook} mr={2} color="brand.primary0" />
                        <Text>{assignment.course}</Text>
                            
          
          
    </Flex>
                      <Flex alignItems="center">
                        <Icon as={FaCalendarAlt} mr={2} color="brand.primary0" />
                        <Text>
                          Due: {format(parseISO(assignment.dueDate), 'MMM dd, yyyy')}
                        </Text>
                            
          
          
    </Flex>
                      <Text noOfLines={2} color="brand.primary">
                        {assignment.description}
                      </Text>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <Flex width="full" justifyContent="space-between">
                      <Flex alignItems="center">
                        <Icon as={FaFileUpload} mr={2} color="brand.primary0" />
                        <Text>{assignment.submissions} Submissions</Text>
                            
          
          
    </Flex>
                      <Button 
                        size="sm" 
                        leftIcon={<FaEye />} 
                        colorScheme="blue" 
                        variant="outline"
                      >
                        View Details
                      </Button>
                          
          
          
    </Flex>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        )}

        {/* Create Assignment Modal */}
        <CreateAssignmentModal />
      </Container>
          
          
          
    </Flex>
  );
};

export default InstructorAssignments;
