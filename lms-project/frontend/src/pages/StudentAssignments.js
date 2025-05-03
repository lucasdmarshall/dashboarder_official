import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Grid,
  GridItem,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
  Icon
} from '@chakra-ui/react';
import { 
  FaTasks, 
  FaFileUpload, 
  FaEye, 
  FaCheckCircle, 
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

const assignmentsData = [
  {
    id: 1,
    course: 'Machine Learning',
    title: 'Neural Network Implementation',
    dueDate: '2024-03-20',
    status: 'Submitted',
    grade: 'A',
    description: 'Implement a basic neural network from scratch using Python and NumPy.',
    submittedDate: '2024-03-15',
    feedback: 'Excellent work on implementing backpropagation!'
  },
  {
    id: 2,
    course: 'Web Development',
    title: 'Responsive Web App',
    dueDate: '2024-03-25',
    status: 'In Progress',
    grade: null,
    description: 'Create a responsive web application using React and Chakra UI.',
    submittedDate: null,
    feedback: null
  },
  {
    id: 3,
    course: 'Data Science',
    title: 'Data Visualization Project',
    dueDate: '2024-03-15',
    status: 'Overdue',
    grade: 'Incomplete',
    description: 'Create comprehensive data visualizations using Matplotlib and Seaborn.',
    submittedDate: null,
    feedback: 'Assignment not submitted. Please complete and resubmit.'
  }
];

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState(assignmentsData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    onOpen();
  };

  const getStatusDetails = (status) => {
    switch(status) {
      case 'Submitted': return { 
        color: '#640101', 
        icon: FaCheckCircle,
        bgColor: 'rgba(100, 1, 1, 0.1)'
      };
      case 'In Progress': return { 
        color: '#640101', 
        icon: FaClock,
        bgColor: 'rgba(100, 1, 1, 0.1)'
      };
      case 'Overdue': return { 
        color: '#640101', 
        icon: FaExclamationTriangle,
        bgColor: 'rgba(100, 1, 1, 0.1)'
      };
      default: return { 
        color: '#640101', 
        icon: FaTasks,
        bgColor: 'rgba(100, 1, 1, 0.1)'
      };
    }
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
        bg="white"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              mb={4}
            >
              <Heading 
                as="h1" 
                size="xl" 
                color="#640101"
                borderBottom="2px solid #640101"
                pb={2}
                display="flex"
                alignItems="center"
              >
                <FaTasks style={{ marginRight: '15px' }} />
                My Assignments
              </Heading>
              <Button 
                bg="#640101"
                color="white"
                leftIcon={<FaFileUpload />}
                _hover={{ 
                  bg: 'black',
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
              >
                Submit New Assignment
              </Button>
            </Flex>
            
            <Box 
              bg="white" 
              borderRadius="xl" 
              boxShadow="0 4px 6px rgba(0,0,0,0.1)"
              border="1px solid #640101"
              overflow="hidden"
            >
              <Table variant="simple" size="md">
                <Thead 
                  bg="#640101" 
                  color="white"
                >
                  <Tr>
                    {['Course', 'Assignment', 'Due Date', 'Status', 'Grade', 'Actions'].map((header) => (
                      <Th 
                        key={header} 
                        color="white" 
                        textTransform="uppercase"
                        letterSpacing="wider"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {header}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {assignments.map((assignment, index) => {
                    const statusDetails = getStatusDetails(assignment.status);
                    return (
                      <Tr 
                        key={assignment.id}
                        bg={index % 2 === 0 ? 'white' : 'rgba(100, 1, 1, 0.05)'}
                        _hover={{ 
                          bg: 'rgba(100, 1, 1, 0.1)', 
                          transition: 'background 0.2s ease',
                          transform: 'scale(1.01)'
                        }}
                        transition="all 0.2s ease"
                      >
                        <Td textAlign="center" color="black">
                          {assignment.course}
                        </Td>
                        <Td 
                          textAlign="center" 
                          color="black" 
                          fontWeight="semibold"
                        >
                          {assignment.title}
                        </Td>
                        <Td textAlign="center">
                          <Flex 
                            alignItems="center" 
                            justifyContent="center"
                            color="#640101"
                          >
                            <Icon 
                              as={statusDetails.icon} 
                              mr={2} 
                            />
                            {assignment.dueDate}
                          </Flex>
                        </Td>
                        <Td textAlign="center">
                          <Badge 
                            bg={statusDetails.bgColor}
                            color={statusDetails.color}
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {assignment.status}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          <Badge 
                            bg={assignment.grade === 'A' ? 'rgba(100, 1, 1, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                            color="#640101"
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {assignment.grade || 'N/A'}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          <Button 
                            size="sm"
                            bg="white"
                            color="#640101"
                            border="1px solid #640101"
                            leftIcon={<FaEye />}
                            _hover={{ 
                              bg: '#640101',
                              color: 'white',
                              transform: 'scale(1.05)'
                            }}
                            transition="all 0.2s ease"
                            onClick={() => handleViewAssignment(assignment)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>

            {/* Assignment Details Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent 
                borderRadius="xl"
                boxShadow="0 10px 15px rgba(0,0,0,0.1)"
                border="1px solid #640101"
              >
                <ModalHeader 
                  color="#640101" 
                  borderBottom="1px solid #640101"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  Assignment Details
                  <Badge 
                    bg="rgba(100, 1, 1, 0.1)"
                    color="#640101"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {selectedAssignment?.status}
                  </Badge>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {selectedAssignment && (
                    <VStack spacing={4} align="stretch">
                      <Heading 
                        size="md" 
                        color="#640101"
                        borderBottom="1px solid #640101"
                        pb={2}
                      >
                        {selectedAssignment.title}
                      </Heading>
                      
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <Text>
                            <strong style={{ color: '#640101' }}>Course:</strong> {selectedAssignment.course}
                          </Text>
                          <Text>
                            <strong style={{ color: '#640101' }}>Due Date:</strong> {selectedAssignment.dueDate}
                          </Text>
                          <Text>
                            <strong style={{ color: '#640101' }}>Submitted Date:</strong> {selectedAssignment.submittedDate || 'Not submitted'}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text>
                            <strong style={{ color: '#640101' }}>Grade:</strong>{' '}
                            <Badge 
                              bg={selectedAssignment.grade === 'A' ? 'rgba(100, 1, 1, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                              color="#640101"
                              borderRadius="full"
                              px={2}
                              py={1}
                            >
                              {selectedAssignment.grade || 'N/A'}
                            </Badge>
                          </Text>
                        </GridItem>
                      </Grid>

                      <Box 
                        bg="rgba(100, 1, 1, 0.05)" 
                        p={4} 
                        borderRadius="lg"
                        border="1px solid #640101"
                      >
                        <Text>
                          <strong style={{ color: '#640101' }}>Description:</strong>
                        </Text>
                        <Text color="black" mt={2}>
                          {selectedAssignment.description}
                        </Text>
                      </Box>

                      {selectedAssignment.feedback && (
                        <Box 
                          bg="rgba(100, 1, 1, 0.05)" 
                          p={4} 
                          borderRadius="lg"
                          border="1px solid #640101"
                        >
                          <Text>
                            <strong style={{ color: '#640101' }}>Instructor Feedback:</strong>
                          </Text>
                          <Text color="black" mt={2}>
                            {selectedAssignment.feedback}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button 
                    bg="#640101"
                    color="white"
                    mr={3}
                    _hover={{ 
                      bg: 'black',
                      transform: 'scale(1.05)'
                    }}
                    transition="all 0.2s ease"
                    leftIcon={<FaFileUpload />}
                  >
                    Resubmit
                  </Button>
                  <Button 
                    variant="outline"
                    color="#640101"
                    borderColor="#640101"
                    _hover={{ 
                      bg: 'rgba(100, 1, 1, 0.1)',
                      transform: 'scale(1.05)'
                    }}
                    transition="all 0.2s ease"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentAssignments;
