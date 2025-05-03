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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,

} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTimes,
  FaUserGraduate,

  FaSortAmountDown,
  FaSortAmountUp,
  FaListUl,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

// Sample student data - this will be used as fallback if localStorage is empty
const sampleStudentsData = [
  {
    id: 'STD6251',
    name: 'John Doe',
    email: 'john.doe@example.com',
    program: 'Computer Science',
    level: 'Undergraduate',
    enrollmentDate: '2023-09-01',
    status: 'Active',
    gpa: '3.8',
    credits: 85,
    graduationYear: 2026
  },
  {
    id: 'STD3778',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    program: 'Business Administration',
    level: 'Graduate',
    enrollmentDate: '2023-08-15',
    status: 'Active',
    gpa: '3.9',
    credits: 42,
    graduationYear: 2025
  },
  {
    id: 'STD4414',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    program: 'Electrical Engineering',
    level: 'Undergraduate',
    enrollmentDate: '2023-09-10',
    status: 'On Leave',
    gpa: '3.5',
    credits: 65,
    graduationYear: 2027
  },
  {
    id: 'STD0021',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    program: 'Psychology',
    level: 'Graduate',
    enrollmentDate: '2023-07-20',
    status: 'Active',
    gpa: '4.0',
    credits: 36,
    graduationYear: 2025
  },
  {
    id: 'STD9188',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    program: 'Mathematics',
    level: 'Undergraduate',
    enrollmentDate: '2023-08-05',
    status: 'Probation',
    gpa: '2.7',
    credits: 72,
    graduationYear: 2026
  },
  {
    id: 'STD5522',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
    program: 'Biology',
    level: 'Undergraduate',
    enrollmentDate: '2023-09-05',
    status: 'Active',
    gpa: '3.6',
    credits: 90,
    graduationYear: 2025
  },
  {
    id: 'STD7733',
    name: 'David Brown',
    email: 'david.brown@example.com',
    program: 'History',
    level: 'Graduate',
    enrollmentDate: '2023-08-20',
    status: 'Active',
    gpa: '3.7',
    credits: 28,
    graduationYear: 2026
  },
  {
    id: 'STD1122',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    program: 'Chemistry',
    level: 'Undergraduate',
    enrollmentDate: '2023-09-15',
    status: 'Active',
    gpa: '3.4',
    credits: 45,
    graduationYear: 2027
  }
];

const StudentsList = () => {
  // const { currentUser } = useAuth();
  // Load students from localStorage (checked students from Students.js)
  const [students, setStudents] = useState(() => {
    const checkedStudents = localStorage.getItem('checkedStudents');
    return checkedStudents ? JSON.parse(checkedStudents) : sampleStudentsData;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'year'
  const [selectedYear, setSelectedYear] = useState(null);
  const toast = useToast();

  // Save students to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkedStudents', JSON.stringify(students));
  }, [students]);

  // Get unique programs for filter dropdown
  const programs = [...new Set(students.map(student => student.program))];
  
  // Get unique levels for filter dropdown
  const levels = [...new Set(students.map(student => student.level))];
  
  // Get unique statuses for filter dropdown
  const statuses = [...new Set(students.map(student => student.status))];

  const handleView = (studentId) => {
    toast({
      title: 'Viewing student',
      description: `Viewing details for student ${studentId}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEdit = (studentId) => {
    // Find the student to edit
    const studentToEdit = students.find(student => student.id === studentId);
    
    if (studentToEdit) {
      // Prompt user for new graduation year
      const newYear = window.prompt(
        `Edit graduation year for ${studentToEdit.name}`, 
        studentToEdit.graduationYear
      );
      
      // Validate input is a number between 2026-2035
      if (newYear && !isNaN(newYear) && newYear >= 2026 && newYear <= 2035) {
        // Update the student's graduation year
        const updatedStudents = students.map(student => 
          student.id === studentId 
            ? { ...student, graduationYear: parseInt(newYear) } 
            : student
        );
        
        setStudents(updatedStudents);
        
        toast({
          title: 'Student Updated',
          description: `${studentToEdit.name}'s graduation year updated to ${newYear}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else if (newYear) {
        // Show error if input is invalid
        toast({
          title: 'Invalid Year',
          description: 'Graduation year must be between 2026 and 2035',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleDelete = (studentId) => {
    // Find the student to delete
    const studentToDelete = students.find(student => student.id === studentId);
    
    if (studentToDelete && window.confirm(`Are you sure you want to remove ${studentToDelete.name} from the list?`)) {
      // Remove student from list
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      
      toast({
        title: 'Student Removed',
        description: `${studentToDelete.name} has been removed from the Students List`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'year' : 'list');
    setSelectedYear(null);
    
    toast({
      title: `Switched to ${viewMode === 'list' ? 'Year' : 'List'} View`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
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
    setProgramFilter('');
    setLevelFilter('');
    setStatusFilter('');
    setSortField('name');
    setSortDirection('asc');
    
    toast({
      title: 'Filters reset',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // Apply filters and sorting
  const filteredStudents = students
    .filter(student => 
      (student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (programFilter ? student.program === programFilter : true) &&
      (levelFilter ? student.level === levelFilter : true) &&
      (statusFilter ? student.status === statusFilter : true)
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const undergraduateStudents = students.filter(s => s.level === 'Undergraduate').length;
  const graduateStudents = students.filter(s => s.level === 'Graduate').length;

  const bgColor = useColorModeValue('white', 'gray.800');
  const statBg = useColorModeValue('white', 'gray.700');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'green';
      case 'On Leave': return 'yellow';
      case 'Probation': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text 
                fontSize="2xl" 
                fontWeight="bold"
                borderBottom="2px solid #640101"
                pb={2}
                display="flex"
                alignItems="center"
              >
                <FaUserGraduate style={{ marginRight: '15px' }} />
                Students List
              </Text>
              <Flex gap={2} alignItems="center">
                <Text mr={2} fontWeight="medium">View Mode:</Text>
                <Flex 
                  bg="#f0f0f0"
                  borderRadius="full"
                  p={1}
                  alignItems="center"
                  boxShadow="sm"
                >
                  <Button
                    size="sm"
                    leftIcon={<FaListUl />}
                    bg={viewMode === 'list' ? '#640101' : 'transparent'}
                    color={viewMode === 'list' ? 'white' : 'gray.700'}
                    borderRadius="full"
                    mr={1}
                    onClick={() => viewMode !== 'list' && toggleViewMode()}
                    _hover={{ 
                      bg: viewMode === 'list' ? '#640101' : 'gray.200'
                    }}
                  >
                    List View
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<FaGraduationCap />}
                    bg={viewMode === 'year' ? '#640101' : 'transparent'}
                    color={viewMode === 'year' ? 'white' : 'gray.700'}
                    borderRadius="full"
                    onClick={() => viewMode !== 'year' && toggleViewMode()}
                    _hover={{ 
                      bg: viewMode === 'year' ? '#640101' : 'gray.200'
                    }}
                  >
                    Year View
                  </Button>
                </Flex>
              </Flex>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
              <Stat
                px={4}
                py={3}
                bg={statBg}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <StatLabel fontWeight="medium" isTruncated>Total Students</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="#640101">
                  {totalStudents}
                </StatNumber>
              </Stat>
              <Stat
                px={4}
                py={3}
                bg={statBg}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <StatLabel fontWeight="medium" isTruncated>Active Students</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="green.500">
                  {activeStudents}
                </StatNumber>
              </Stat>
              <Stat
                px={4}
                py={3}
                bg={statBg}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <StatLabel fontWeight="medium" isTruncated>Undergraduate</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="blue.500">
                  {undergraduateStudents}
                </StatNumber>
              </Stat>
              <Stat
                px={4}
                py={3}
                bg={statBg}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <StatLabel fontWeight="medium" isTruncated>Graduate</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
                  {graduateStudents}
                </StatNumber>
              </Stat>
            </SimpleGrid>

            {viewMode === 'list' ? (
              <Tabs variant="enclosed" colorScheme="red" index={selectedTab} onChange={(index) => setSelectedTab(index)}>
                <TabList>
                  <Tab _selected={{ color: 'white', bg: '#640101' }}>All Students</Tab>
                  <Tab _selected={{ color: 'white', bg: '#640101' }}>Undergraduate</Tab>
                  <Tab _selected={{ color: 'white', bg: '#640101' }}>Graduate</Tab>
                </TabList>
                
                <TabPanels>
                <TabPanel px={0} pt={4}>
                  {/* Search and Filters */}
                  <Flex direction={{ base: 'column', md: 'row' }} mb={4} gap={4} alignItems="center">
                    <InputGroup flex="2">
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
                      />
                    </InputGroup>
                    
                    <HStack spacing={2} flex="3">
                      <Select 
                        placeholder="Program" 
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        borderColor="#640101"
                        _hover={{ borderColor: '#640101' }}
                        _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                      >
                        {programs.map(program => (
                          <option key={program} value={program}>{program}</option>
                        ))}
                      </Select>
                      
                      <Select 
                        placeholder="Level" 
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        borderColor="#640101"
                        _hover={{ borderColor: '#640101' }}
                        _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </Select>
                      
                      <Select 
                        placeholder="Status" 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        borderColor="#640101"
                        _hover={{ borderColor: '#640101' }}
                        _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
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
                  <Box 
                    bg={bgColor} 
                    borderRadius="xl" 
                    boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                    border="1px solid #640101"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _hover={{
                      boxShadow: '0 6px 16px rgba(100, 1, 1, 0.15)'
                    }}
                  >
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr bg="#640101" color="white" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                          {[
                            { label: 'ID', field: 'id' },
                            { label: 'Name', field: 'name' },
                            { label: 'Program', field: 'program' },
                            { label: 'Level', field: 'level' },
                            { label: 'GPA', field: 'gpa' },
                            { label: 'Status', field: 'status' },
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
                            <Td colSpan={7} textAlign="center" py={4}>
                              <Text fontSize="lg" color="gray.500">No students found matching your criteria</Text>
                            </Td>
                          </Tr>
                        ) : (
                          filteredStudents.map((student, index) => (
                            <Tr 
                              key={student.id}
                              bg={index % 2 === 0 ? bgColor : 'rgba(100, 1, 1, 0.03)'}
                              _hover={{ 
                                bg: 'rgba(100, 1, 1, 0.08)', 
                                boxShadow: '0 4px 12px rgba(100, 1, 1, 0.1)',
                                transform: 'translateY(-2px)'
                              }}
                              transition="all 0.3s ease"
                              cursor="pointer"
                            >
                              <Td textAlign="center">{student.id}</Td>
                              <Td textAlign="center">{student.name}</Td>
                              <Td textAlign="center">{student.program}</Td>
                              <Td textAlign="center">{student.level}</Td>
                              <Td textAlign="center">{student.gpa}</Td>
                              <Td textAlign="center">
                                <Badge colorScheme={getStatusColor(student.status)} px={2} py={1} borderRadius="full">
                                  {student.status}
                                </Badge>
                              </Td>
                              <Td textAlign="center">
                                <Flex justifyContent="center" gap={2}>
                                  <Button
                                    size="sm"
                                    bg="#640101"
                                    color="white"
                                    _hover={{ bg: 'black' }}
                                    onClick={() => handleView(student.id)}
                                  >
                                    <Icon as={FaEye} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    bg="#640101"
                                    color="white"
                                    _hover={{ bg: 'black' }}
                                    onClick={() => handleEdit(student.id)}
                                  >
                                    <Icon as={FaEdit} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    bg="red.500"
                                    color="white"
                                    _hover={{ bg: 'red.600' }}
                                    onClick={() => handleDelete(student.id)}
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
                </TabPanel>
                
                <TabPanel px={0} pt={4}>
                  {/* Same structure as All Students but filtered for Undergraduate */}
                  <Box 
                    bg={bgColor} 
                    borderRadius="xl" 
                    boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                    border="1px solid #640101"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _hover={{
                      boxShadow: '0 6px 16px rgba(100, 1, 1, 0.15)'
                    }}
                  >
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr bg="#640101" color="white" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                          {[
                            { label: 'ID', field: 'id' },
                            { label: 'Name', field: 'name' },
                            { label: 'Program', field: 'program' },
                            { label: 'GPA', field: 'gpa' },
                            { label: 'Status', field: 'status' },
                            { label: 'Actions', field: null }
                          ].map((header) => (
                            <Th 
                              key={header.label} 
                              color="white" 
                              textTransform="uppercase"
                              letterSpacing="wider"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              {header.label}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredStudents
                          .filter(student => student.level === 'Undergraduate')
                          .map((student, index) => (
                            <Tr 
                              key={student.id}
                              bg={index % 2 === 0 ? bgColor : 'rgba(100, 1, 1, 0.03)'}
                              _hover={{ 
                                bg: 'rgba(100, 1, 1, 0.08)', 
                                boxShadow: '0 4px 12px rgba(100, 1, 1, 0.1)',
                                transform: 'translateY(-2px)'
                              }}
                              transition="all 0.3s ease"
                              cursor="pointer"
                            >
                              <Td textAlign="center">{student.id}</Td>
                              <Td textAlign="center">{student.name}</Td>
                              <Td textAlign="center">{student.program}</Td>
                              <Td textAlign="center">{student.gpa}</Td>
                              <Td textAlign="center">
                                <Badge colorScheme={getStatusColor(student.status)} px={2} py={1} borderRadius="full">
                                  {student.status}
                                </Badge>
                              </Td>
                              <Td textAlign="center">
                                <Flex justifyContent="center" gap={2}>
                                  <Button
                                    size="sm"
                                    bg="#640101"
                                    color="white"
                                    _hover={{ bg: 'black' }}
                                    onClick={() => handleView(student.id)}
                                  >
                                    <Icon as={FaEye} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    bg="#640101"
                                    color="white"
                                    _hover={{ bg: 'black' }}
                                    onClick={() => handleEdit(student.id)}
                                  >
                                    <Icon as={FaEdit} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    bg="red.500"
                                    color="white"
                                    _hover={{ bg: 'red.600' }}
                                    onClick={() => handleDelete(student.id)}
                                  >
                                    <Icon as={FaTimes} />
                                  </Button>
                                </Flex>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
                
                <TabPanel px={0} pt={4}>
                  {/* Same structure as All Students but filtered for Graduate */}
                  <Box 
                    bg={bgColor} 
                    borderRadius="xl" 
                    boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                    border="1px solid #640101"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _hover={{
                      boxShadow: '0 6px 16px rgba(100, 1, 1, 0.15)'
                    }}
                  >
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr bg="#640101" color="white" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                          {[
                            { label: 'ID', field: 'id' },
                            { label: 'Name', field: 'name' },
                            { label: 'Program', field: 'program' },
                            { label: 'GPA', field: 'gpa' },
                            { label: 'Status', field: 'status' },
                            { label: 'Actions', field: null }
                          ].map((header) => (
                            <Th 
                              key={header.label} 
                              color="white" 
                              textTransform="uppercase"
                              letterSpacing="wider"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              {header.label}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredStudents
                          .filter(student => student.level === 'Graduate')
                          .map((student, index) => (
                            <Tr 
                              key={student.id}
                              bg={index % 2 === 0 ? bgColor : 'rgba(100, 1, 1, 0.03)'}
                              _hover={{ 
                                bg: 'rgba(100, 1, 1, 0.08)', 
                                boxShadow: '0 4px 12px rgba(100, 1, 1, 0.1)',
                                transform: 'translateY(-2px)'
                              }}
                              transition="all 0.3s ease"
                              cursor="pointer"
                            >
                              <Td textAlign="center">{student.id}</Td>
                              <Td textAlign="center">{student.name}</Td>
                              <Td textAlign="center">{student.program}</Td>
                              <Td textAlign="center">{student.gpa}</Td>
                              <Td textAlign="center">
                                <Badge colorScheme={getStatusColor(student.status)} px={2} py={1} borderRadius="full">
                                  {student.status}
                                </Badge>
                              </Td>
                              <Td textAlign="center">
                                <Flex justifyContent="center" gap={2}>
                                  <Button
                                    size="sm"
                                    bg="#640101"
                                    color="white"
                                    _hover={{ bg: 'black' }}
                                    onClick={() => handleView(student.id)}
                                  >
                                    <Icon as={FaEye} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    bg="#640101"
                                    color="white"
                                    _hover={{ bg: 'black' }}
                                    onClick={() => handleEdit(student.id)}
                                  >
                                    <Icon as={FaEdit} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    bg="red.500"
                                    color="white"
                                    _hover={{ bg: 'red.600' }}
                                    onClick={() => handleDelete(student.id)}
                                  >
                                    <Icon as={FaTimes} />
                                  </Button>
                                </Flex>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
            ) : (
              // Year View
              <Box mt={6}>
                {/* Group students by graduation year */}
                {(() => {
                  // Define all years from 2026 to 2035
                  const allYears = Array.from({length: 10}, (_, i) => 2026 + i);
                  
                  // Count students per year
                  const yearCounts = allYears.reduce((acc, year) => {
                    acc[year] = students.filter(s => s.graduationYear === year).length;
                    return acc;
                  }, {});
                  
                  return (
                    <Box>
                      <Text fontSize="xl" fontWeight="semibold" color="#640101" mb={4}>
                        Students by Graduation Year
                      </Text>
                      
                      <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} spacing={6}>
                        {allYears.map(year => (
                          <Box 
                            key={year}
                            bg={selectedYear === year ? 'rgba(100, 1, 1, 0.08)' : 'white'}
                            borderRadius="lg"
                            boxShadow="md"
                            border="1px solid"
                            borderColor={selectedYear === year ? '#640101' : 'gray.200'}
                            onClick={() => handleYearClick(year)}
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{ 
                              bg: 'rgba(100, 1, 1, 0.05)',
                              transform: 'translateY(-3px)',
                              boxShadow: 'lg'
                            }}
                            overflow="hidden"
                            height="180px"
                            position="relative"
                          >
                            <Box 
                              bg="#640101" 
                              color="white" 
                              py={2} 
                              textAlign="center"
                              borderBottom="1px solid"
                              borderColor="gray.200"
                            >
                              <Text fontSize="lg" fontWeight="bold">Class of {year}</Text>
                            </Box>
                            
                            <Flex 
                              direction="column" 
                              align="center" 
                              justify="center"
                              height="calc(100% - 44px)"
                              p={4}
                            >
                              <Icon 
                                as={FaGraduationCap} 
                                color="#640101" 
                                fontSize="4xl" 
                                mb={2}
                              />
                              <Text fontSize="2xl" fontWeight="bold" color="#640101">
                                {yearCounts[year] || 0}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {yearCounts[year] === 1 ? 'Student' : 'Students'}
                              </Text>
                            </Flex>
                            
                            {selectedYear === year && (
                              <Box 
                                position="absolute" 
                                bottom="0" 
                                right="0"
                                bg="#640101"
                                color="white"
                                p={1}
                                borderTopLeftRadius="md"
                              >
                                <Icon as={FaChevronDown} />
                              </Box>
                            )}
                          </Box>
                        ))}
                      </SimpleGrid>
                          
                      
                      {/* Show students for selected year */}
                      {selectedYear && (
                        <Box 
                          mt={6} 
                          p={4} 
                          bg="white" 
                          borderRadius="lg"
                          boxShadow="md"
                          border="1px solid #640101"
                        >
                          <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="xl" fontWeight="bold" color="#640101">
                              Class of {selectedYear} Students
                            </Text>
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="red"
                              leftIcon={<Icon as={FaChevronUp} />}
                              onClick={() => setSelectedYear(null)}
                            >
                              Close
                            </Button>
                          </Flex>
                          
                          {students.filter(student => student.graduationYear === selectedYear).length > 0 ? (
                            <Table variant="simple" size="md">
                              <Thead>
                                <Tr bg="#640101" color="white">
                                  <Th color="white" textAlign="center">ID</Th>
                                  <Th color="white" textAlign="center">Name</Th>
                                  <Th color="white" textAlign="center">Program</Th>
                                  <Th color="white" textAlign="center">Level</Th>
                                  <Th color="white" textAlign="center">GPA</Th>
                                  <Th color="white" textAlign="center">Status</Th>
                                  <Th color="white" textAlign="center">Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {students
                                  .filter(student => student.graduationYear === selectedYear)
                                  .map((student, index) => (
                                    <Tr 
                                      key={student.id}
                                      bg={index % 2 === 0 ? 'white' : 'rgba(100, 1, 1, 0.03)'}
                                      _hover={{ 
                                        bg: 'rgba(100, 1, 1, 0.08)', 
                                        boxShadow: '0 4px 12px rgba(100, 1, 1, 0.1)',
                                        transform: 'translateY(-2px)'
                                      }}
                                      transition="all 0.3s ease"
                                    >
                                      <Td textAlign="center">{student.id}</Td>
                                      <Td textAlign="center">{student.name}</Td>
                                      <Td textAlign="center">{student.program}</Td>
                                      <Td textAlign="center">{student.level}</Td>
                                      <Td textAlign="center">{student.gpa}</Td>
                                      <Td textAlign="center">
                                        <Badge colorScheme={getStatusColor(student.status)} px={2} py={1} borderRadius="full">
                                          {student.status}
                                        </Badge>
                                      </Td>
                                      <Td textAlign="center">
                                        <Flex justifyContent="center" gap={2}>
                                          <Button
                                            size="sm"
                                            bg="#640101"
                                            color="white"
                                            _hover={{ bg: 'black' }}
                                            onClick={() => handleView(student.id)}
                                          >
                                            <Icon as={FaEye} />
                                          </Button>
                                          <Button
                                            size="sm"
                                            bg="#640101"
                                            color="white"
                                            _hover={{ bg: 'black' }}
                                            onClick={() => handleEdit(student.id)}
                                          >
                                            <Icon as={FaEdit} />
                                          </Button>
                                          <Button
                                            size="sm"
                                            bg="red.500"
                                            color="white"
                                            _hover={{ bg: 'red.600' }}
                                            onClick={() => handleDelete(student.id)}
                                          >
                                            <Icon as={FaTimes} />
                                          </Button>
                                        </Flex>
                                      </Td>
                                    </Tr>
                                  ))}
                              </Tbody>
                            </Table>
                          ) : (
                            <Box textAlign="center" py={8}>
                              <Icon as={FaUserGraduate} fontSize="4xl" color="gray.400" mb={3} />
                              <Text fontSize="lg" color="gray.500">No students graduating in {selectedYear}</Text>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                })()} 
              </Box>
            )}          
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentsList;
