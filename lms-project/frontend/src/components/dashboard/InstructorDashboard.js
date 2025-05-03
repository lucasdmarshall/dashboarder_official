import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Grid, 
  GridItem, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Avatar,
  useToast
} from '@chakra-ui/react';
import { 
  FaBook, 
  FaUsers, 
  FaChartBar, 
  FaClipboardList, 
  FaChalkboardTeacher,
  FaRegCalendarAlt 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InstructorSidebar from '../InstructorSidebar';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  // Load courses from localStorage on component mount
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    setCourses(storedCourses);
  }, []);

  // Calculate course statistics
  const courseStats = [
    {
      icon: FaBook,
      title: "Total Courses",
      number: courses.length,
      color: "brand.primary0"
    },
    {
      icon: FaUsers,
      title: "Total Students",
      number: courses.reduce((total, course) => total + (course.enrolledStudents || 0), 0),
      color: "brand.primary0"
    },
    {
      icon: FaChartBar,
      title: "Average Course Rating",
      number: "4.7",
      color: "brand.primary0"
    }
  ];

  // Upcoming activities (can be derived from courses or manually added)
  const upcomingActivities = courses.flatMap(course => 
    course.upcomingEvents || []
  ).slice(0, 3);

  const handleManageCourse = (courseId) => {
    navigate(`/instructor-edit-course/${courseId}`);
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="80px" p={8}>
        <VStack spacing={8} align="stretch">
          {/* Dashboard Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="brand.primary">
                Instructor Dashboard
              </Heading>
              <Text color="brand.primary">
                Welcome back! Here's an overview of your teaching activities.
              </Text>
            </VStack>
            <Avatar 
              name="Instructor Name" 
              size="xl" 
              bg="brand.primary0" 
              color="white" 
            />
          </HStack>

          {/* Statistics Grid */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {courseStats.map((stat, index) => (
              <GridItem key={index} bg="white" p={5} borderRadius="md" boxShadow="md">
                <Flex align="center" justify="space-between">
                  <Box as={stat.icon} color={stat.color} boxSize={10} />
                  <VStack align="end">
                    <Heading size="md" color={stat.color}>{stat.number}</Heading>
                    <Text fontSize="sm" color="brand.primary0">{stat.title}</Text>
                  </VStack>
                </Flex>
              </GridItem>
            ))}
          </Grid>

          {/* Courses and Activities */}
          <Grid templateColumns="2fr 1fr" gap={6}>
            {/* Courses Table */}
            <Box bg="white" p={5} borderRadius="md" boxShadow="md">
              <Heading size="md" mb={4} color="brand.primary">
                Your Courses
              </Heading>
              <TableContainer>
                {courses.length === 0 ? (
                  <Flex 
                    justify="center" 
                    align="center" 
                    direction="column" 
                    p={10}
                  >
                    <Text fontSize="xl" color="brand.primary0" mb={4}>
                      You haven't created any courses yet.
                    </Text>
                    <Button 
                      colorScheme="blue" 
                      onClick={() => navigate('/instructor-create-course')}
                    >
                      Create Your First Course
                    </Button>
                  </Flex>
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Course Name</Th>
                        <Th>Students</Th>
                        <Th>Status</Th>
                        <Th>Start Date</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {courses.map((course) => (
                        <Tr key={course.id}>
                          <Td>{course.title}</Td>
                          <Td>{course.enrolledStudents || 0}</Td>
                          <Td>
                            <Badge 
                              colorScheme={
                                course.status === "Active" ? "green" : 
                                course.status === "Upcoming" ? "blue" : 
                                "gray"
                              }
                            >
                              {course.status || "Draft"}
                            </Badge>
                          </Td>
                          <Td>{course.createdAt || 'Not specified'}</Td>
                          <Td>
                            <Button 
                              size="xs" 
                              colorScheme="blue"
                              onClick={() => handleManageCourse(course.id)}
                            >
                              Manage
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </TableContainer>
            </Box>

            {/* Upcoming Activities */}
            <Box bg="white" p={5} borderRadius="md" boxShadow="md">
              <Heading size="md" mb={4} color="brand.primary">
                Upcoming Activities
              </Heading>
              <VStack spacing={3} align="stretch">
                {upcomingActivities.length === 0 ? (
                  <Text color="brand.primary0" textAlign="center">
                    No upcoming activities
                  </Text>
                ) : (
                  upcomingActivities.map((activity) => (
                    <Flex 
                      key={activity.id} 
                      align="center" 
                      justify="space-between" 
                      bg="brand.primary" 
                      p={3} 
                      borderRadius="md"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{activity.title}</Text>
                        <Text fontSize="sm" color="brand.primary0">
                          {activity.date}
                        </Text>
                      </VStack>
                      <Badge colorScheme="blue">{activity.type}</Badge>
                    </Flex>
                  ))
                )}
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorDashboard;
