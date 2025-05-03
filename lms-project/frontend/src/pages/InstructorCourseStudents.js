  import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Flex,
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
  HStack
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

// Mock student data - in a real app, this would come from backend
const mockStudentData = {
  students: [
    {
      id: 101,
      studentId: 'ST-2024-001',
      name: 'John Doe',
      avatar: 'https://bit.ly/dan-abramov',
      enrollmentDate: '2024-01-15',
      progress: 45,
      course: {
        title: 'Course 1'
      }
    },
    {
      id: 102,
      studentId: 'ST-2024-002',
      name: 'Jane Smith',
      avatar: 'https://bit.ly/code-beast',
      enrollmentDate: '2024-01-20',
      progress: 30,
      course: {
        title: 'Course 1'
      }
    },
    {
      id: 103,
      studentId: 'ST-2024-003',
      name: 'Mike Johnson',
      avatar: 'https://bit.ly/ryan-florence',
      enrollmentDate: '2024-02-01',
      progress: 60,
      course: {
        title: 'Course 1'
      }
    },
    {
      id: 201,
      studentId: 'ST-2024-004',
      name: 'Emily Brown',
      avatar: 'https://bit.ly/prosper-baba',
      enrollmentDate: '2024-01-25',
      progress: 55,
      course: {
        title: 'Course 2'
      }
    }
  ],
  courses: [
    { id: 1, title: 'Course 1' },
    { id: 2, title: 'Course 2' }
  ]
};

const InstructorCourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState(mockStudentData.students);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const courses = [
    { id: 'all', title: 'All Courses' },
    ...mockStudentData.courses
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.course.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = selectedCourse === 'all' || 
                          student.course.title === courses.find(c => c.id === selectedCourse)?.title;
    
    return matchesSearch && matchesCourse;
  });

  return (
    <>
      <InstructorSidebar />
      <Container maxW="1200px" ml="250px" mt="85px" pb={8} px={6} bg="white">
        <VStack spacing={8} align="stretch">
          <Heading 
            size="lg" 
            color="#640101" 
            display="flex" 
            alignItems="center"
            borderBottom="2px solid #640101"
            pb={2}
          >
            <Box as={FaUsers} mr={3} color="#640101" />
            My Students
          </Heading>

          {/* Search and Filter */}
          <Flex>
            <InputGroup flex={3} mr={4}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="#640101" />
              </InputLeftElement>
              <Input 
                placeholder="Search students by name, ID, or course" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderColor="#640101"
                _hover={{ borderColor: 'black' }}
                focusBorderColor="#640101"
              />
            </InputGroup>
            
            <Box flex={1}>
              <Select 
                icon={<FaBook color="#640101" />}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                borderColor="#640101"
                _hover={{ borderColor: 'black' }}
                focusBorderColor="#640101"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>

          {/* Students Table */}
          <Box 
            bg="white" 
            borderRadius="xl" 
            border="2px solid #640101"
            boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)" 
            p={6} 
            overflow="auto"
          >
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead bg="rgba(100, 1, 1, 0.1)">
                  <Tr>
                    <Th color="#640101">Student</Th>
                    <Th color="#640101">
                      <Flex align="center">
                        <Box as={FaIdBadge} mr={2} color="#640101" />
                        Student ID
                      </Flex>
                    </Th>
                    <Th color="#640101">
                      <Flex align="center">
                        <Box as={FaBook} mr={2} color="#640101" />
                        Course
                      </Flex>
                    </Th>
                    <Th color="#640101">Enrollment Date</Th>
                    <Th color="#640101">Progress</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents.map((student) => (
                    <Tr 
                      key={student.id}
                      _hover={{ 
                        bg: 'rgba(100, 1, 1, 0.05)',
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
                            border="2px solid #640101"
                          />
                          <Text color="black">{student.name}</Text>
                        </Flex>
                      </Td>
                      <Td color="black">{student.studentId}</Td>
                      <Td>
                        <Badge 
                          bg="rgba(100, 1, 1, 0.1)" 
                          color="#640101"
                          borderRadius="full"
                          px={2}
                          py={1}
                        >
                          {student.course.title}
                        </Badge>
                      </Td>
                      <Td color="black">{student.enrollmentDate}</Td>
                      <Td>
                        <Box 
                          bg="rgba(100, 1, 1, 0.1)" 
                          color="#640101"
                          borderRadius="full"
                          px={2}
                          py={1}
                          textAlign="center"
                        >
                          {student.progress}%
                        </Box>
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

export default InstructorCourseStudents;
