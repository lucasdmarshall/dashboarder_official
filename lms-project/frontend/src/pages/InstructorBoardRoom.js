import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Grid,
  GridItem,
  Button,
  Icon,
  Avatar,
  useColorModeValue,
  Divider,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  StackDivider,
  Tooltip,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
  Tag,
  TagLabel,
  TagRightIcon
} from '@chakra-ui/react';
import { 
  FaChalkboard, 
  FaBook, 
  FaPlusCircle,
  FaChalkboardTeacher,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaCalendar,
  FaBookOpen,
  FaGraduationCap,
  FaTrophy,
  FaClipboardCheck,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaRocket,
  FaProjectDiagram,
  FaChartPie,
  FaCloudUploadAlt
} from 'react-icons/fa';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import InstructorSidebar from '../components/InstructorSidebar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

// Color Palette
const COLOR_PALETTE = {
  primary: '#640101',
  secondary: '#4A0000',
  accent: '#8B0000',
  background: '#F7FAFC',
  text: '#2D3748'
};

// Utility Components
const StatCard = ({ icon, title, value, color, trend }) => (
  <Card 
    bg="white" 
    borderWidth="2px"
    borderColor="#640101"
    boxShadow="md" 
    borderRadius="xl" 
    p={4} 
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
  >
    <Flex alignItems="center">
      <Icon 
        as={icon} 
        w={8} 
        h={8} 
        color="#640101" 
        mr={4} 
      />
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="#640101">{title}</Text>
        <Heading size="md" color="#2D3748">
          {value}
        </Heading>
        {trend && (
          <HStack>
            <Icon 
              as={trend.icon} 
              color="#640101" 
              w={4} 
              h={4} 
            />
            <Text fontSize="xs" color="#640101">
              {trend.text}
            </Text>
          </HStack>
        )}
      </VStack>
    </Flex>
  </Card>
);

const InstructorBoardRoom = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [instructorData, setInstructorData] = useState({
    name: '',
    code: '',
    courses: [],
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      completedCourses: 0,
      courseCategories: {}
    }
  });

  useEffect(() => {
    try {
      // Fetch profile information from localStorage
      const storedName = localStorage.getItem('instructorName') || 'Unknown Instructor';
      const storedCode = localStorage.getItem('instructorCode') || 'N/A';

      // Fetch courses from localStorage
      const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');

      // Calculate stats
      const stats = {
        totalCourses: storedCourses.length,
        totalStudents: storedCourses.reduce((total, course) => total + (course.enrolledStudents || 0), 0),
        completedCourses: storedCourses.filter(course => course.status === 'Completed').length,
        courseCategories: storedCourses.reduce((categories, course) => {
          categories[course.category] = (categories[course.category] || 0) + 1;
          return categories;
        }, {})
      };

      // Update state with fetched data
      setInstructorData({
        name: storedName,
        code: storedCode,
        courses: storedCourses,
        stats: stats
      });
    } catch (error) {
      console.error('Error loading instructor data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const courseData = [
    { name: 'Science', value: instructorData.stats.courseCategories.Science || 0 },
    { name: 'Humanities', value: instructorData.stats.courseCategories.Humanities || 0 },
    { name: 'Technology', value: instructorData.stats.courseCategories.Technology || 0 }
  ];

  const performanceData = instructorData.courses.map(course => ({
    name: course.name,
    students: course.enrolledStudents,
    completed: course.completedLectures
  }));

  // Empty state component for no courses
  const EmptyCourseState = () => (
    <Card 
      bg="white" 
      boxShadow="md" 
      borderRadius="xl"
    >
      <CardBody>
        <VStack spacing={6} textAlign="center">
          <Icon 
            as={FaBook} 
            boxSize={16} 
            color="#640101" 
          />
          <Heading size="md" color="#2D3748">
            No Courses Created Yet
          </Heading>
          <Text color="#640101">
            Start your teaching journey by creating your first course!
          </Text>
          <Button 
            leftIcon={<FaPlusCircle />} 
            colorScheme="red" 
            onClick={() => navigate('/instructor-create-course')}
          >
            Create First Course
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );

  // Loading state component
  const LoadingState = () => (
    <Flex 
      height="100vh" 
      width="full" 
      justifyContent="center" 
      alignItems="center"
    >
      <VStack spacing={4}>
        <Spinner 
          size="xl" 
          color="#640101" 
          thickness="4px" 
        />
        <Text color="#2D3748">
          Loading your dashboard...
        </Text>
      </VStack>
    </Flex>
  );

  // If still loading, show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Flex bg="#F7FAFC" minHeight="100vh">
      <InstructorSidebar />
      
      <Box 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="100px" pb={8} px={6} position="relative"
      >
        <Container maxW="container.xl" p={0}>
          <Grid templateColumns="3fr 1fr" gap={6}>
            {/* Main Content Area */}
            <VStack spacing={6} align="stretch">
              {/* Profile and Quick Actions */}
              <Card 
                bg="white" 
                boxShadow="md" 
                borderRadius="xl" 
                overflow="hidden"
              >
                <CardBody>
                  <Flex>
                    <Avatar 
                      size="2xl" 
                      name={instructorData.name} 
                      bg="#640101" 
                      color="white" 
                      mr={6}
                    />
                    <VStack align="start" spacing={4} flex={1}>
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color="#2D3748">
                          {instructorData.name}
                        </Heading>
                        <Badge 
                          colorScheme="red" 
                          variant="solid"
                        >
                          <Icon as={FaChalkboardTeacher} mr={2} />
                          Instructor Code: {instructorData.code}
                        </Badge>
                      </VStack>
                      
                      <HStack spacing={4} width="full">
                        <Button 
                          leftIcon={<FaPlusCircle />} 
                          colorScheme="red" 
                          variant="solid"
                          onClick={() => navigate('/instructor-create-course')}
                          flex={1}
                        >
                          Create Course
                        </Button>
                        <Button 
                          leftIcon={<FaRocket />} 
                          colorScheme="red" 
                          variant="outline"
                          flex={1}
                        >
                          Quick Start
                        </Button>
                      </HStack>
                    </VStack>
                  </Flex>
                </CardBody>
              </Card>

              {/* Quick Stats */}
              <SimpleGrid columns={3} spacing={4}>
                <StatCard 
                  icon={FaBook} 
                  title="Total Courses" 
                  value={instructorData.stats.totalCourses}
                  color="#640101"
                  trend={{
                    icon: FaChartLine,
                    color: "#640101",
                    text: '+10% from last month'
                  }}
                />
                <StatCard 
                  icon={FaUsers} 
                  title="Total Students" 
                  value={instructorData.stats.totalStudents}
                  color="#640101"
                  trend={{
                    icon: FaChartLine,
                    color: "#640101",
                    text: '+25% from last month'
                  }}
                />
                <StatCard 
                  icon={FaClipboardCheck} 
                  title="Completed Courses" 
                  value={instructorData.stats.completedCourses}
                  color="#640101"
                  trend={{
                    icon: FaChartLine,
                    color: "#640101",
                    text: '+5% from last month'
                  }}
                />
              </SimpleGrid>

              {/* Courses Section */}
              <Card 
                bg="white" 
                boxShadow="md" 
                borderRadius="xl"
              >
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md" color="#2D3748">
                      <Icon as={FaBookOpen} mr={3} />
                      Your Courses
                    </Heading>
                    <Button 
                      size="sm" 
                      colorScheme="red" 
                      variant="ghost"
                      onClick={() => navigate('/all-courses')}
                    >
                      View All
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  {instructorData.courses.length === 0 ? (
                    <EmptyCourseState />
                  ) : (
                    instructorData.courses.map(course => (
                      <Card 
                        key={course.id} 
                        mb={4} 
                        variant="outline" 
                        borderColor="#640101"
                      >
                        <CardBody>
                          <Flex>
                            <VStack align="start" flex={2} mr={6}>
                              <Heading size="md" color="#2D3748">
                                {course.title || 'Untitled Course'}
                              </Heading>
                              <HStack>
                                <Badge colorScheme="red">{course.status || 'Draft'}</Badge>
                                <Badge bg="#640101" color="white">{course.category || 'Uncategorized'}</Badge>
                              </HStack>
                              <Text color="#640101">
                                {course.description || 'No description provided'}
                              </Text>
                            </VStack>
                            
                            <VStack flex={1} align="stretch">
                              <Stat>
                                <StatLabel>Students</StatLabel>
                                <StatNumber color="#640101">
                                  {course.enrolledStudents || 0}
                                </StatNumber>
                              </Stat>
                              <Progress 
                                value={
                                  course.completedLectures && course.totalLectures ? 
                                  (course.completedLectures / course.totalLectures) * 100 : 
                                  0
                                } 
                                colorScheme="red" 
                                size="sm" 
                              />
                              <Text fontSize="sm" color="#640101" textAlign="center">
                                {course.completedLectures || 0}/{course.totalLectures || 0} Lectures
                              </Text>
                            </VStack>
                          </Flex>
                        </CardBody>
                        <CardFooter>
                          <Button 
                            width="full"
                            leftIcon={<FaRocket />} 
                            colorScheme="red" 
                            variant="solid"
                            onClick={() => {
                              // Open video conference in a new window
                              const videoConferenceUrl = `/instructor-video-conference/${course.id}`;
                              const videoWindow = window.open(
                                videoConferenceUrl, 
                                'VideoConference', 
                                'width=1200,height=800,resizable=yes,scrollbars=yes'
                              );
                              
                              // Optional: Focus the new window
                              if (videoWindow) {
                                videoWindow.focus();
                              }

                              // Show toast notification
                              toast({
                                title: "Video Conference",
                                description: `Starting class for ${course.title}`,
                                status: "success",
                                duration: 3000,
                                isClosable: true
                              });
                            }}
                          >
                            Start the Class
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </CardBody>
              </Card>
            </VStack>

            {/* Sidebar Analytics */}
            <VStack spacing={6} align="stretch">
              {/* Course Categories */}
              <Card 
                bg="white" 
                boxShadow="md" 
                borderRadius="xl"
              >
                <CardHeader>
                  <Heading size="md" color="#2D3748">
                    <Icon as={FaChartPie} mr={3} />
                    Course Categories
                  </Heading>
                </CardHeader>
                <CardBody height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              "#640101", 
                              "#8B0000", 
                              "#4A0000"
                            ][index % 3]} 
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              {/* Performance Overview */}
              <Card 
                bg="white" 
                boxShadow="md" 
                borderRadius="xl"
              >
                <CardHeader>
                  <Heading size="md" color="#2D3748">
                    <Icon as={FaProjectDiagram} mr={3} />
                    Performance
                  </Heading>
                </CardHeader>
                <CardBody height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={500} height={300} data={performanceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="students" fill="#640101" name="Students" />
                      <Bar dataKey="completed" fill="#8B0000" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </VStack>
          </Grid>
        </Container>
      </Box>
    </Flex>
  );
};

export default InstructorBoardRoom;
