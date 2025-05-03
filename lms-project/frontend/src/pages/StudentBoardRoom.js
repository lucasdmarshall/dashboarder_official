import React, { useState, useEffect } from 'react';
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
  Icon,
  HStack,
  Center,
  useColorModeValue,
  Stack,
  Divider
} from '@chakra-ui/react';
import { 
  FaChalkboard, 
  FaBook, 
  FaPlusCircle,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaCalendar,
  FaClock
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';
import InstructorSidebar from '../components/InstructorSidebar';
import { useNavigate } from 'react-router-dom';

const StudentBoardRoom = ({ isInstructorView = false }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  // Color modes
  const bgColor = 'white';
  const cardBgColor = 'white';
  const textColor = 'black';
  const accentColor = '#640101';

  // Retrieve courses on component mount
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    const instructorName = localStorage.getItem('instructorName') || 'Unknown Instructor';
    const instructorCode = localStorage.getItem('instructorCode') || 'N/A';
    
    // If in instructor view, set all courses
    // If in student view, you might want to simulate enrollment or add a separate student courses storage
    if (isInstructorView) {
      setEnrolledCourses(storedCourses);
    } else {
      // For students, you might want to implement a more sophisticated enrollment mechanism
      // For now, we'll just show all courses as enrolled
      setEnrolledCourses(storedCourses.map(course => ({
        ...course,
        status: 'In Progress', // Default status for students
        instructor: instructorName, // Use the stored instructor name
        instructorId: instructorCode, // Use the stored instructor code
        startDate: course.startDate || new Date().toLocaleDateString(),
        endDate: course.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 90 days from now
        classTime: course.classTime || 'Flexible Schedule'
      })));
    }
  }, [isInstructorView]);

  const handleCreateCourse = () => {
    navigate('/instructor-create-course');
  };

  const getStatusBadgeProps = (status) => {
    switch(status) {
      case 'In Progress':
        return { 
          bg: '#640101', 
          color: 'white' 
        };
      case 'Completed':
        return { 
          bg: 'white', 
          color: 'black', 
          border: '1px solid #640101'
        };
      default:
        return { 
          bg: 'white', 
          color: 'black', 
          border: '1px solid #640101'
        };
    }
  };

  const EmptyStateContent = () => (
    <VStack 
      spacing={6} 
      align="center" 
      bg="rgba(100, 1, 1, 0.05)" 
      p={10} 
      borderRadius="xl" 
      boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
      w="full"
      border="2px solid #640101"
    >
      {isInstructorView ? (
        <>
          <Icon 
            as={FaPlusCircle} 
            w={16} 
            h={16} 
            color="#640101" 
          />
          <Stack spacing={3} textAlign="center">
            <Heading size="md" color="black">
              No Courses Created Yet
            </Heading>
            <Text color="black" maxW="300px">
              Start building your learning experience by creating your first course
            </Text>
          </Stack>
          <Button 
            leftIcon={<FaPlusCircle />} 
            bg="#640101"
            color="white"
            size="lg"
            _hover={{
              bg: 'black',
              transform: 'scale(1.05)'
            }}
            onClick={handleCreateCourse}
          >
            Create New Course
          </Button>
        </>
      ) : (
        <>
          <Icon 
            as={FaGraduationCap} 
            w={16} 
            h={16} 
            color="#640101" 
          />
          <Stack spacing={3} textAlign="center">
            <Heading size="md" color="black">
              No Courses Enrolled
            </Heading>
            <Text color="black" maxW="300px">
              Explore and enroll in courses to start your learning journey
            </Text>
          </Stack>
          <Button 
            leftIcon={<FaBook />} 
            bg="#640101"
            color="white"
            size="lg"
            _hover={{
              bg: 'black',
              transform: 'scale(1.05)'
            }}
            onClick={() => navigate('/student-courses')}
          >
            Browse Courses
          </Button>
        </>
      )}
    </VStack>
  );

  return (
    <Flex>
      {isInstructorView ? <InstructorSidebar /> : <StudentSidebar />}
      
      <Box 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="85px" pb={8} px={6} position="relative" 
        bg={bgColor}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch" width="full">
            <Flex alignItems="center" justifyContent="space-between">
              <Heading 
                as="h1" 
                size="xl" 
                color="#640101" 
                display="flex" 
                alignItems="center"
                borderBottom="2px solid #640101"
                pb={2}
              >
                <Icon as={FaChalkboard} mr={4} color="#640101" />
                {isInstructorView ? 'Instructor Board Room' : 'My Learning Space'}
              </Heading>
              {isInstructorView && enrolledCourses.length === 0 && (
                <Button 
                  leftIcon={<FaPlusCircle />} 
                  variant="outline"
                  color="#640101"
                  borderColor="#640101"
                  _hover={{ 
                    bg: 'rgba(100, 1, 1, 0.1)',
                    transform: 'scale(1.05)'
                  }}
                  onClick={handleCreateCourse}
                >
                  Create Course
                </Button>
              )}
            </Flex>

            <Divider borderColor="#640101" />

            {enrolledCourses.length === 0 ? (
              <EmptyStateContent />
            ) : (
              <Grid 
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
                gap={6} 
                width="full" 
                justifyContent={isInstructorView ? "start" : "center"}
              >
                {enrolledCourses.map((course, index) => (
                  <GridItem 
                    key={course.id} 
                    display="flex" 
                    justifyContent={isInstructorView ? "start" : "center"}
                  >
                    <Box 
                      borderWidth="2px" 
                      borderColor="#640101" 
                      boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
                      _hover={{ 
                        transform: 'scale(1.02)', 
                        transition: 'transform 0.2s ease-in-out',
                        bg: 'rgba(100, 1, 1, 0.05)'
                      }}
                      bg={index % 2 === 0 ? 'white' : 'rgba(100, 1, 1, 0.03)'}
                      borderRadius="xl"
                      p={6}
                      width="100%"
                      maxWidth="400px"
                    >
                      <VStack align="stretch" spacing={4}>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Heading size="md" color="#640101" textAlign="left">
                            {course.title}
                          </Heading>
                          <Badge 
                            {...getStatusBadgeProps(course.status)}
                            variant="solid"
                            alignSelf="start"
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {course.status}
                          </Badge>
                        </Flex>

                        <VStack align="stretch" spacing={3}>
                          <Flex alignItems="center">
                            <Icon as={FaChalkboardTeacher} mr={3} color="#640101" />
                            <VStack align="start" spacing={0} width="full">
                              <Text fontWeight="medium">
                                {course.instructor || 'Unknown Instructor'}
                              </Text>
                              {course.instructorId && (
                                <Badge 
                                  bg="#640101" 
                                  color="white"
                                  variant="solid"
                                  alignSelf="start"
                                  borderRadius="full"
                                  px={2}
                                  py={1}
                                >
                                  {course.instructorId}
                                </Badge>
                              )}
                              <Badge 
                                bg="#640101" 
                                color="white"
                                variant="solid"
                                alignSelf="start"
                                mt={1}
                                borderRadius="full"
                                px={2}
                                py={1}
                              >
                                Certified Dashboarder
                              </Badge>
                            </VStack>
                          </Flex>

                          <Flex alignItems="center">
                            <Icon as={FaCalendar} mr={3} color="#640101" />
                            <Text textAlign="left">
                              {course.startDate || 'Start Date TBD'} - {course.endDate || 'End Date TBD'}
                            </Text>
                          </Flex>

                          <Flex alignItems="center">
                            <Icon as={FaClock} mr={3} color="#640101" />
                            <Text textAlign="left">
                              {course.classTime || 'Schedule Not Set'}
                            </Text>
                          </Flex>
                        </VStack>

                        <Button 
                          leftIcon={<FaBook />} 
                          bg="#640101"
                          color="white"
                          variant="solid"
                          width="full"
                          _hover={{
                            bg: 'black',
                            transform: 'scale(1.05)'
                          }}
                          onClick={() => navigate(isInstructorView ? `/instructor-video-conference/${course.id}` : `/student-video-conference/${course.id}`)}
                        >
                          {isInstructorView ? 'Manage Class' : 'Join Class'}
                        </Button>
                      </VStack>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            )}
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentBoardRoom;
