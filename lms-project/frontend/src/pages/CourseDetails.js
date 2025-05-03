import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Icon,
  Button,
  Divider,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  HStack
} from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaChalkboardTeacher, FaClock, FaFile, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

// Sample course data - in a real application, this would come from an API
const courseData = {
  1: {
    id: 1,
    title: 'Introduction to Machine Learning',
    instructor: 'Elena Rodriguez',
    progress: 65,
    category: 'Computer Science',
    difficulty: 'Advanced',
    duration: '12 weeks',
    description: 'This course introduces the fundamental concepts of machine learning, covering supervised and unsupervised learning, feature engineering, and model evaluation techniques.',
    assignments: [
      {
        id: 101,
        title: 'Data Preprocessing',
        dueDate: '2024-05-15',
        status: 'completed',
        grade: '92%',
        description: 'Clean and preprocess the provided dataset to prepare it for machine learning algorithms.',
        submissionType: 'file'
      },
      {
        id: 102,
        title: 'Linear Regression Implementation',
        dueDate: '2024-05-28',
        status: 'pending',
        grade: null,
        description: 'Implement a linear regression model from scratch and evaluate it on the test dataset.',
        submissionType: 'file'
      },
      {
        id: 103,
        title: 'Classification Models Comparison',
        dueDate: '2024-06-10',
        status: 'not_started',
        grade: null,
        description: 'Compare the performance of different classification algorithms on the given dataset.',
        submissionType: 'file'
      }
    ]
  },
  2: {
    id: 2,
    title: 'IGCSE English Language',
    instructor: 'Sarah Thompson',
    progress: 30,
    category: 'Language Arts',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    description: 'This course prepares students for the IGCSE English Language examination, focusing on reading comprehension, writing skills, and language analysis.',
    assignments: [
      {
        id: 201,
        title: 'Reading Comprehension Exercise',
        dueDate: '2024-05-10',
        status: 'completed',
        grade: '85%',
        description: 'Read the provided passage and answer the comprehension questions.',
        submissionType: 'text'
      },
      {
        id: 202,
        title: 'Descriptive Essay',
        dueDate: '2024-05-20',
        status: 'pending',
        grade: null,
        description: 'Write a descriptive essay on the topic "A Place That Means a Lot to Me".',
        submissionType: 'text'
      },
      {
        id: 203,
        title: 'Language Analysis',
        dueDate: '2024-06-05',
        status: 'not_started',
        grade: null,
        description: 'Analyze the use of language in the provided extract from a novel.',
        submissionType: 'text'
      }
    ]
  },
  3: {
    id: 3,
    title: 'IGCSE Mathematics',
    instructor: 'Michael Chen',
    progress: 45,
    category: 'Mathematics',
    difficulty: 'Intermediate',
    duration: '14 weeks',
    description: 'This course covers the IGCSE Mathematics curriculum, including algebra, geometry, statistics, and calculus.',
    assignments: [
      {
        id: 301,
        title: 'Algebra Problem Set',
        dueDate: '2024-05-12',
        status: 'completed',
        grade: '94%',
        description: 'Solve the given set of algebraic equations and problems.',
        submissionType: 'file'
      },
      {
        id: 302,
        title: 'Geometry Assignment',
        dueDate: '2024-05-25',
        status: 'pending',
        grade: null,
        description: 'Complete the problems on triangles, circles, and coordinate geometry.',
        submissionType: 'file'
      },
      {
        id: 303,
        title: 'Statistics Project',
        dueDate: '2024-06-08',
        status: 'not_started',
        grade: null,
        description: 'Collect data, analyze it using statistical methods, and present your findings.',
        submissionType: 'file'
      }
    ]
  }
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const accentColor = useColorModeValue('#640101', 'red.200');

  // In a real application, fetch course data from an API
  useEffect(() => {
    // Simulating an API call to get course details
    const fetchCourse = () => {
      // In a real app, this would be an API call
      const foundCourse = courseData[courseId];
      if (foundCourse) {
        setCourse(foundCourse);
      }
    };

    fetchCourse();
  }, [courseId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'not_started':
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return FaCheckCircle;
      case 'pending':
        return FaFile;
      case 'not_started':
      default:
        return FaTimesCircle;
    }
  };

  if (!course) {
    return (
      <Flex>
        <StudentSidebar />
        <Box 
          ml="250px" 
          width="calc(100% - 250px)" 
          mt="85px" 
          p={6}
        >
          <Text>Loading course details...</Text>
        </Box>
      </Flex>
    );
  }

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
          <VStack spacing={6} align="stretch">
            {/* Breadcrumb and Back Button */}
            <Flex justify="space-between" align="center">
              <Breadcrumb fontSize="sm" color="gray.600">
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/student-courses">My Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>{course.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student-courses')}
              >
                Back to Courses
              </Button>
            </Flex>
            
            {/* Course Header */}
            <Card 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              boxShadow="md"
              bg="white"
            >
              <CardHeader 
                bg={accentColor} 
                color="white" 
                p={4}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Heading size="lg">{course.title}</Heading>
                    <Text mt={1}>Instructor: {course.instructor}</Text>
                  </Box>
                  <Badge 
                    colorScheme={
                      course.difficulty === 'Advanced' ? 'red' : 
                      course.difficulty === 'Intermediate' ? 'yellow' : 'green'
                    }
                    fontSize="sm"
                    px={3}
                    py={1}
                  >
                    {course.difficulty}
                  </Badge>
                </Flex>
              </CardHeader>
              
              <CardBody p={6}>
                <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                  <GridItem>
                    <Heading size="md" mb={3}>Course Overview</Heading>
                    <Text mb={4}>{course.description}</Text>
                    
                    <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4} mt={4}>
                      <Box>
                        <HStack align="center" mb={2}>
                          <Icon as={FaBook} color={accentColor} />
                          <Text fontWeight="bold">Category:</Text>
                        </HStack>
                        <Text ml={6}>{course.category}</Text>
                      </Box>
                      
                      <Box>
                        <HStack align="center" mb={2}>
                          <Icon as={FaClock} color={accentColor} />
                          <Text fontWeight="bold">Duration:</Text>
                        </HStack>
                        <Text ml={6}>{course.duration}</Text>
                      </Box>
                    </Grid>
                  </GridItem>
                  
                  <GridItem>
                    <Box 
                      bg="gray.50" 
                      p={4} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <Heading size="md" mb={3}>Progress</Heading>
                      <Box 
                        bg="white" 
                        p={3} 
                        borderRadius="md" 
                        borderWidth="1px"
                        textAlign="center"
                      >
                        <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                          {course.progress}%
                        </Text>
                        <Text fontSize="sm" color="gray.600">Completed</Text>
                      </Box>
                      
                      <Flex justify="space-between" mt={4}>
                        <Box textAlign="center">
                          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                            {course.assignments.filter(a => a.status === 'completed').length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Completed</Text>
                        </Box>
                        
                        <Box textAlign="center">
                          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                            {course.assignments.filter(a => a.status === 'pending').length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Pending</Text>
                        </Box>
                        
                        <Box textAlign="center">
                          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                            {course.assignments.filter(a => a.status === 'not_started').length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Not Started</Text>
                        </Box>
                      </Flex>
                    </Box>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
            
            {/* Course Assignments */}
            <Card 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              boxShadow="md"
              bg="white"
            >
              <CardHeader 
                bg={`${accentColor}10`} 
                borderBottom={`1px solid ${accentColor}20`}
                p={4}
              >
                <Heading size="md" color={accentColor}>Course Assignments</Heading>
              </CardHeader>
              
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Assignment</Th>
                        <Th>Due Date</Th>
                        <Th>Status</Th>
                        <Th>Grade</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {course.assignments.map((assignment) => (
                        <Tr 
                          key={assignment.id}
                          _hover={{ bg: 'gray.50' }}
                          cursor="pointer"
                        >
                          <Td>
                            <HStack>
                              <Icon 
                                as={FaFileAlt} 
                                color={accentColor} 
                              />
                              <Text fontWeight="medium">{assignment.title}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Icon 
                                as={FaCalendarAlt} 
                                color={accentColor} 
                              />
                              <Text>{assignment.dueDate}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={getStatusColor(assignment.status)}
                              display="flex"
                              alignItems="center"
                              width="fit-content"
                            >
                              <Icon 
                                as={getStatusIcon(assignment.status)} 
                                mr={1} 
                                fontSize="xs" 
                              />
                              {assignment.status === 'completed' ? 'Completed' : 
                               assignment.status === 'pending' ? 'In Progress' : 'Not Started'}
                            </Badge>
                          </Td>
                          <Td>
                            {assignment.grade ? (
                              <Text fontWeight="bold" color={accentColor}>
                                {assignment.grade}
                              </Text>
                            ) : (
                              <Text color="gray.500">-</Text>
                            )}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => navigate(`/assignment/${assignment.id}`)}
                            >
                              {assignment.status === 'completed' ? 'View' : 'Open'}
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default CourseDetails; 