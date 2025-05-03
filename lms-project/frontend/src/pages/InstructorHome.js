import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { 
  FaBook,
  FaUsers,
  FaStar,
  FaGraduationCap,
  FaClock,
  FaChevronRight
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';
import useSidebarState from '../hooks/useSidebarState';

const StatCard = ({ icon, label, value, trend, color }) => (
  <Box
    bg="white"
    p={6}
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    transition="all 0.2s"
  >
    <VStack align="start" spacing={4}>
      <Icon as={icon} boxSize={6} color={color} />
      <Box>
        <Text fontSize="sm" color="gray.500" fontWeight="medium">{label}</Text>
        <Heading size="lg" mt={1} color="gray.800">{value}</Heading>
      </Box>
    </VStack>
  </Box>
);

const CourseCard = ({ name, students, status, startDate }) => (
  <Box
    bg="white"
    p={5}
    borderRadius="lg"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    transition="all 0.2s"
    width="100%"
  >
    <VStack align="start" spacing={4}>
      <HStack justify="space-between" width="100%">
        <Badge colorScheme={status === 'DRAFT' ? 'blue' : 'green'}>
          {status}
        </Badge>
        <Text fontSize="sm" color="gray.500">
          Starts {startDate}
        </Text>
      </HStack>
      
      <Box>
        <Heading size="md" color="gray.800">{name}</Heading>
        <HStack spacing={4} mt={2}>
          <HStack spacing={1}>
            <Icon as={FaUsers} color="gray.400" />
            <Text fontSize="sm" color="gray.500">{students} Students</Text>
          </HStack>
        </HStack>
      </Box>

      <Button
        rightIcon={<FaChevronRight />}
        colorScheme="red"
        variant="outline"
        size="sm"
        width="100%"
        bg="white"
        color="#640101"
        borderColor="#640101"
        _hover={{
          bg: "#640101",
          color: "white"
        }}
      >
        Manage Course
      </Button>
    </VStack>
  </Box>
);

const InstructorHome = () => {
  const isSidebarCollapsed = useSidebarState();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const stats = [
    { icon: FaBook, label: 'Total Courses', value: '1', color: '#640101' },
    { icon: FaUsers, label: 'Total Students', value: '0', color: '#640101' },
    { icon: FaStar, label: 'Average Rating', value: '4.7', color: '#640101' }
  ];

  const courses = [
    {
      name: 'IGCSE ESL 9-1',
      students: 0,
      status: 'DRAFT',
      startDate: '3/6/2025'
    }
  ];

  return (
    <Flex width="100%" height="100%">
      <InstructorSidebar />
      <Box 
        ml={isSidebarCollapsed ? "60px" : "250px"} 
        width={isSidebarCollapsed ? "calc(100% - 60px)" : "calc(100% - 250px)"} 
        mt="85px" 
        pb={8} 
        px={{ base: 4, md: 6 }}
        position="relative"
        bg={bgColor}
        transition="all 0.3s ease"
        flex="1"
        overflowX="hidden"
      >
        <Container 
          maxW={isSidebarCollapsed ? "container.xl" : "container.lg"} 
          p={0} 
          mx="auto" 
          transition="all 0.3s ease"
          width="100%"
        >
          <VStack spacing={8} align="stretch">
            {/* Header Section */}
            <Box>
              <HStack spacing={4} mb={2}>
                <Icon as={FaGraduationCap} boxSize={8} color="#640101" />
                <Box>
                  <Heading size="lg" color="#640101">Welcome Back!</Heading>
                  <Text color="gray.600" mt={1}>
                    Here's an overview of your teaching activities
                  </Text>
                </Box>
              </HStack>
              <Divider mt={4} borderColor="gray.200" />
            </Box>

            {/* Stats Section */}
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={6}
            >
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </SimpleGrid>

            {/* Main Content Grid */}
            <SimpleGrid 
              columns={{ base: 1, xl: 2 }} 
              spacing={8}
            >
              {/* Courses Section */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading size="md" color="#640101">Your Courses</Heading>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="#640101"
                    rightIcon={<FaChevronRight />}
                  >
                    View All
                  </Button>
                </HStack>
                <VStack spacing={4} align="stretch">
                  {courses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                  ))}
                </VStack>
              </Box>

              {/* Upcoming Activities Section */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading size="md" color="#640101">Upcoming Activities</Heading>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="#640101"
                    rightIcon={<FaChevronRight />}
                  >
                    View Calendar
                  </Button>
                </HStack>
                <Box
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  minH="200px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VStack spacing={2}>
                    <Icon as={FaClock} boxSize={6} color="gray.300" />
                    <Text color="gray.500">No upcoming activities</Text>
                  </VStack>
                </Box>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default InstructorHome;
