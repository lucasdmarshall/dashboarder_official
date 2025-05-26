import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Flex, 
  Container,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Badge,
  useColorModeValue,
  useToast,
  Select,
  HStack,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Spinner,
  Center,
  Heading
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTimes,
  FaUserGraduate,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSync
} from 'react-icons/fa';

const API_URL = 'http://localhost:5001/api';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('student_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const toast = useToast();

  // Get auth headers for API requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Get institution ID
  const getInstitutionId = () => {
    return localStorage.getItem('institutionId');
  };

  // Fetch enrolled students from API
  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  const fetchEnrolledStudents = async () => {
    const institutionId = getInstitutionId();
    
    if (!institutionId) {
      toast({
        title: 'Error',
        description: 'Institution ID not found. Please log in again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/institutions/${institutionId}/enrolled-students`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const enrolledStudents = await response.json();
      setStudents(enrolledStudents);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load enrolled students. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique grades for filter dropdown
  const grades = [...new Set(students.map(student => student.grade).filter(grade => grade && grade !== 'N/A'))];
  
  // Get unique statuses for filter dropdown
  const statuses = [...new Set(students.map(student => student.status))];

  const handleView = (studentId) => {
    toast({
      title: 'Viewing student',
      description: `Viewing details for student ${studentId}`,
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  const handleEdit = (studentId) => {
    toast({
      title: 'Editing student',
      description: `Editing details for student ${studentId}`,
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  const handleDelete = async (studentId) => {
    const institutionId = getInstitutionId();
    
    if (!institutionId) {
      toast({
        title: 'Error',
        description: 'Institution ID not found',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete student ${studentId}?`)) {
      try {
        const response = await fetch(`${API_URL}/institutions/${institutionId}/enrolled-students/${studentId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state
        setStudents(students.filter(student => student.student_id !== studentId));
        
        toast({
          title: 'Student deleted',
          description: `Student ${studentId} has been deleted successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      } catch (error) {
        console.error('Error deleting student:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete student. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setGradeFilter('');
    setStatusFilter('');
    setSortField('student_name');
    setSortDirection('asc');
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = !searchQuery || 
        student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade = !gradeFilter || student.grade === gradeFilter;
      const matchesStatus = !statusFilter || student.status === statusFilter;
      
      return matchesSearch && matchesGrade && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'green';
      case 'graduated': return 'blue';
      case 'suspended': return 'red';
      case 'on leave': return 'yellow';
      default: return 'gray';
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="#640101" thickness="4px" speed="0.65s" />
            <Text fontSize="lg">Loading enrolled students...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
        <Container maxW="1200px" py={6}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack spacing={3}>
                  <Icon as={FaUserGraduate} boxSize={8} color="#640101" />
                  <Heading as="h1" size="xl" color="#640101" fontWeight="bold">
                    Students List
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="lg">
                  Manage enrolled students and their information
                </Text>
              </VStack>
              
              <HStack spacing={3}>
                <Button
                  leftIcon={<FaSync />}
                  onClick={fetchEnrolledStudents}
                  bg="#640101"
                  color="white"
                  _hover={{ bg: 'black' }}
                  isLoading={loading}
                  loadingText="Refreshing..."
                >
                  Refresh Data
                </Button>
              </HStack>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <Stat
                px={4}
                py={3}
                bg={bgColor}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)'
                }}
              >
                <StatLabel fontWeight="medium" isTruncated>Total Students</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="#640101">
                  {students.length}
                </StatNumber>
              </Stat>
              <Stat
                px={4}
                py={3}
                bg={bgColor}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)'
                }}
              >
                <StatLabel fontWeight="medium" isTruncated>Active Students</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="green.500">
                  {students.filter(s => s.status.toLowerCase() === 'active').length}
                </StatNumber>
              </Stat>
              <Stat
                px={4}
                py={3}
                bg={bgColor}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)'
                }}
              >
                <StatLabel fontWeight="medium" isTruncated>With Grades</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="blue.500">
                  {students.filter(s => s.grade && s.grade !== 'N/A').length}
                </StatNumber>
              </Stat>
              <Stat
                px={4}
                py={3}
                bg={bgColor}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)'
                }}
              >
                <StatLabel fontWeight="medium" isTruncated>Recently Enrolled</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
                  {students.filter(s => {
                    const enrolledDate = new Date(s.enrolled_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return enrolledDate > weekAgo;
                  }).length}
                </StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Main Content Area */}
            <Box 
              bg={bgColor}
              borderRadius="xl"
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
            >
              {/* Search and Filter Controls */}
              <Flex 
                justify="space-between" 
                align="center" 
                p={6}
                borderBottom="1px solid"
                borderColor="gray.200"
                bg="gray.50"
              >
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search by ID, Name or Email" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderColor="#640101"
                    _hover={{ borderColor: '#640101' }}
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    bg="white"
                  />
                </InputGroup>
                
                <HStack spacing={2} flex="1" justifyContent="flex-end">
                  <Select 
                    placeholder="Grade" 
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    borderColor="#640101"
                    _hover={{ borderColor: '#640101' }}
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    bg="white"
                    maxW="150px"
                  >
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </Select>
                  
                  <Select 
                    placeholder="Status" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    borderColor="#640101"
                    _hover={{ borderColor: '#640101' }}
                    _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    bg="white"
                    maxW="150px"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Select>
                  
                  <Tooltip label="Reset filters">
                    <Button 
                      onClick={resetFilters}
                      bg="#640101"
                      color="white"
                      _hover={{ bg: 'black' }}
                    >
                      <Icon as={FaTimes} />
                    </Button>
                  </Tooltip>
                </HStack>
              </Flex>
              
              {/* Students Table */}
              <Table variant="simple" size="md">
                <Thead>
                  <Tr bg="#640101" color="white" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                    {[
                      { label: 'No.', field: null },
                      { label: 'ID', field: 'student_id' },
                      { label: 'Name', field: 'student_name' },
                      { label: 'Email', field: 'student_email' },
                      { label: 'Grade', field: 'grade' },
                      { label: 'Actions', field: null }
                    ].map((header) => (
                      <Th 
                        key={header.label} 
                        color="white" 
                        textTransform="uppercase"
                        letterSpacing="wider"
                        fontWeight="bold"
                        textAlign="center"
                        cursor={header.field ? 'pointer' : 'default'}
                        onClick={() => header.field && toggleSort(header.field)}
                      >
                        <Flex justifyContent="center" alignItems="center">
                          {header.label}
                          {header.field && sortField === header.field && (
                            <Icon 
                              as={sortDirection === 'asc' ? FaSortAmountUp : FaSortAmountDown} 
                              ml={1} 
                              fontSize="xs" 
                            />
                          )}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={8}>
                        <VStack spacing={4}>
                          <Icon as={FaUserGraduate} boxSize={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.500">
                            {searchQuery || gradeFilter || statusFilter 
                              ? 'No students found matching your criteria' 
                              : 'No enrolled students yet'
                            }
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <Tr 
                        key={student.student_id}
                        bg={index % 2 === 0 ? bgColor : 'rgba(100, 1, 1, 0.03)'}
                        _hover={{ 
                          bg: 'rgba(100, 1, 1, 0.08)', 
                          boxShadow: '0 4px 12px rgba(100, 1, 1, 0.1)',
                          transform: 'translateY(-2px)'
                        }}
                        transition="all 0.3s ease"
                        cursor="pointer"
                      >
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center" fontWeight="semibold" color="#640101">{student.student_id}</Td>
                        <Td textAlign="center">{student.student_name}</Td>
                        <Td textAlign="center" color="blue.600">{student.student_email}</Td>
                        <Td textAlign="center">
                          <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
                            {student.grade}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          <Flex justifyContent="center" gap={2}>
                            <Button
                              size="sm"
                              bg="#640101"
                              color="white"
                              _hover={{ bg: 'black' }}
                              onClick={() => handleView(student.student_id)}
                            >
                              <Icon as={FaEye} />
                            </Button>
                            <Button
                              size="sm"
                              bg="#640101"
                              color="white"
                              _hover={{ bg: 'black' }}
                              onClick={() => handleEdit(student.student_id)}
                            >
                              <Icon as={FaEdit} />
                            </Button>
                            <Button
                              size="sm"
                              bg="red.500"
                              color="white"
                              _hover={{ bg: 'red.600' }}
                              onClick={() => handleDelete(student.student_id)}
                            >
                              <Icon as={FaTimes} />
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentsList; 