import React from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Grid, 
  GridItem, 
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaBookOpen, 
  FaClipboardCheck, 
  FaCertificate, 
  FaChalkboardTeacher,
  FaHome,
  FaBook,
  FaTasks,
  FaUserGraduate
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';

const StudentHome = () => {
  const navigate = useNavigate();
  const sidebarBg = useColorModeValue('gray.100', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  const sidebarItems = [
    {
      icon: FaHome,
      title: "Dashboard",
      action: () => navigate('/student-home')
    },
    {
      icon: FaBook,
      title: "My Courses",
      action: () => navigate('/student-courses')
    },
    {
      icon: FaTasks,
      title: "Assignments",
      action: () => navigate('/student-assignments')
    },
    {
      icon: FaUserGraduate,
      title: "Progress",
      action: () => navigate('/student-progress')
    }
  ];

  const quickActions = [
    {
      icon: FaBookOpen,
      title: "My Courses",
      description: "Continue learning",
      color: "#640101",
      action: () => navigate('/student-courses')
    },
    {
      icon: FaClipboardCheck,
      title: "Assignments",
      description: "Check pending work",
      color: "#640101",
      action: () => navigate('/student-assignments')
    },
    {
      icon: FaCertificate,
      title: "Certificates",
      description: "View earned certificates",
      color: "#640101",
      action: () => navigate('/student-certificates')
    }
  ];

  const activeCourses = [
    {
      title: "Web Development Fundamentals",
      instructor: "John Doe",
      progress: 65,
      color: "#640101"
    },
    {
      title: "Data Science Basics",
      instructor: "Jane Smith",
      progress: 45,
      color: "#640101"
    }
  ];

  return (
    <Flex>
      <StudentSidebar />

      {/* Main Content */}
      <Box 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="85px" 
        pb={8} 
        px={6}
        position="relative"
        bg="gray.50"
      >
        <Container maxW="container.xl" mt="20px">
          <Heading mb={8} color="#640101">Welcome, Student!</Heading>

          {/* Quick Actions */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                bg="white" 
                boxShadow="lg" 
                borderWidth="1px"
                borderColor="#640101"
                transition="transform 0.2s"
                _hover={{ 
                  transform: 'scale(1.05)', 
                  boxShadow: 'xl',
                  borderColor: 'darkred'
                }}
                onClick={action.action}
                cursor="pointer"
              >
                <CardBody>
                  <Flex alignItems="center">
                    <Box as={action.icon} color={action.color} boxSize={8} mr={4} />
                    <VStack align="start">
                      <Heading size="sm" color="#640101">{action.title}</Heading>
                      <Text fontSize="sm" color="gray.600">{action.description}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Grid>

          {/* Active Courses */}
          <Heading size="lg" mb={6} color="#640101">Active Courses</Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {activeCourses.map((course, index) => (
              <Card 
                key={index} 
                bg="white" 
                boxShadow="lg"
                borderWidth="1px"
                borderColor="#640101"
              >
                <CardHeader>
                  <Heading size="md" color="#640101">{course.title}</Heading>
                  <Text color="gray.600">Instructor: {course.instructor}</Text>
                </CardHeader>
                <CardBody>
                  <Progress 
                    value={course.progress} 
                    colorScheme="red" 
                    size="sm" 
                    mb={2}
                    borderRadius="full"
                  />
                  <Text color="gray.700">{course.progress}% Complete</Text>
                </CardBody>
                <CardFooter>
                  <Button 
                    variant="solid" 
                    bg="#640101"
                    color="white"
                    _hover={{ 
                      bg: 'darkred',
                      transform: 'scale(1.05)'
                    }}
                    onClick={() => navigate(`/course/${course.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    View Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentHome;
