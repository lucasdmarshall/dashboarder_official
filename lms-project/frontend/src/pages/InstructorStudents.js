  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Container,
  useColorModeValue,
  useToast,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Avatar,
  Badge,
  Flex
} from '@chakra-ui/react';

import {
  FaUsers, 
  FaSearch, 
  FaEnvelope, 
  FaGraduationCap,
  FaIdBadge,
  FaBook 
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';
// import ChatButton from '../components/ChatButton';

// Mock student data - in a real app, this would come from backend
const generateMockStudents = () => {
  // Simulating an instructor's courses and their students
  return [
    {
      id: 101,
      studentId: 'STD00001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://bit.ly/dan-abramov',
      enrollmentDate: '2024-01-15',
      progress: 45,
      course: {
        id: 1,
        title: 'Introduction to Web Development'
      }
    },
    {
      id: 102,
      studentId: 'STD00002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://bit.ly/code-beast',
      enrollmentDate: '2024-01-20',
      progress: 30,
      course: {
        id: 1,
        title: 'Introduction to Web Development'
      }
    },
    {
      id: 103,
      studentId: 'STD00003',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      avatar: 'https://bit.ly/ryan-florence',
      enrollmentDate: '2024-02-01',
      progress: 60,
      course: {
        id: 2,
        title: 'Advanced React Techniques'
      }
    }
  ];
};

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const navigate = useNavigate();
  const toast = useToast();

  // Background colors
  const tableHeaderBg = useColorModeValue('brand.primary', 'brand.primary');
  const tableRowHoverBg = useColorModeValue('brand.primary', 'brand.primary');

  // Load students data
  useEffect(() => {
    try {
      // In a real app, this would be an API call to get students from instructor's courses
      const mockStudents = generateMockStudents();
      setStudents(mockStudents);
    } catch (error) {
      toast({
        title: "Error Loading Students",
        description: "Unable to fetch student data. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  }, []); // Removed 'toast' from dependency array as it's not changing

  // Get unique courses for filter dropdown
  const courses = [
    { id: 'all', title: 'All Courses' },
    ...Array.from(new Set(students.map(s => s.course.id)))
      .map(courseId => students.find(s => s.course.id === courseId).course)
  ];

  // Filtered students based on search and course selection
  const filteredStudents = students.filter(student => 
    (selectedCourse === 'all' || student.course.id === selectedCourse) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="-25px" width="calc(100% - 250px)" py={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Heading 
            size="xl" 
            color="brand.primary" 
            mb={6}
            textAlign="left"
          >
            My Students
          </Heading>
          <Heading 
            size="lg" 
            color="brand.primary" 
            display="flex" 
            alignItems="center"
          >
            <Box as={FaUsers} mr={3} color="brand.primary0" />
            My Students
          </Heading>

          {/* Search and Filter */}
          <InputGroup flex={3} mr={4}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="brand.primary" />
            </InputLeftElement>
            <Input 
              placeholder="Search students by name or ID" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Box flex={1}>
            <Select 
              icon={<FaBook />}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </Select>
          </Box>

          {/* Students Table */}
          <Box 
            bg="white" 
            borderRadius="xl" 
            boxShadow="md" 
            p={6} 
            overflow="auto"
          >
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead bg={tableHeaderBg}>
                  <Tr>
                    <Th>Student</Th>
                    <Th>
                      <Flex align="center">
                        <Box as={FaIdBadge} mr={2} />
                        Student ID
                      </Flex>
                    </Th>
                    <Th>
                      <Flex align="center">
                        <Box as={FaBook} mr={2} />
                        Course
                      </Flex>
                    </Th>
                    <Th>Enrollment Date</Th>
                    <Th>Progress</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents.map((student) => (
                    <Tr 
                      key={student.id}
                      _hover={{ 
                        bg: tableRowHoverBg,
                        cursor: 'pointer' 
                      }}
                    >
                      <Td>
                        <Flex align="center">
                          <Avatar 
                            src={student.avatar} 
                            name={student.name} 
                            size="sm" 
                            mr={3} 
                          />
                          <Text fontWeight="bold">{student.name}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          colorScheme="purple"
                          onClick={() => navigate(`/student-profile/${student.studentId}`)}
                        >
                          {student.studentId}
                        </Button>
                      </Td>
                      <Td>
                        <Badge colorScheme="green" variant="subtle">
                          {student.course.title}
                        </Badge>
                      </Td>
                      <Td>{student.enrollmentDate}</Td>
                      <Td>
                        <Badge 
                          colorScheme={
                            student.progress < 30 ? 'red' : 
                            student.progress < 60 ? 'yellow' : 
                            'green'
                          }
                        >
                          {student.progress}%
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default InstructorStudents;
