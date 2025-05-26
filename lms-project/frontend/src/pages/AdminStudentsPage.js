import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Flex,
  Text,
  Icon,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  HStack
} from '@chakra-ui/react';
import { 
  FaTrash,
  FaEye,
  FaSearch,
  FaSync
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5001/api/admin/students', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStudents(data.students || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch students data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchStudents();
    } catch (error) {
      console.error('Error refreshing students:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5001/api/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: 'Student Deleted',
        description: `${studentName} has been deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh the students list
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // View student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.institution && student.institution.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Flex
        bg="linear-gradient(135deg, #F7FAFC 0%, #F1F5F9 100%)"
        minHeight="100vh"
        position="relative"
        justify="center"
        align="center"
      >
        <AdminSidebar />
        <Container maxW="container.xl" ml="250px">
          <VStack spacing={4}>
            <Spinner size="xl" color="#640101" />
            <Text>Loading students...</Text>
          </VStack>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex
      bg="linear-gradient(135deg, #F7FAFC 0%, #F1F5F9 100%)"
      minHeight="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        width="200px"
        height="200px"
        bg="rgba(100, 1, 1, 0.05)"
        transform="rotate(45deg)"
        borderRadius="50px"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="-50px"
        left="-50px"
        width="200px"
        height="200px"
        bg="rgba(100, 1, 1, 0.05)"
        transform="rotate(45deg)"
        borderRadius="50px"
        zIndex={1}
      />

      <AdminSidebar />
      
      <Container 
        maxW="container.xl" 
        ml="250px" 
        pt="98px"
        pb={8} 
        px={6}
        zIndex={10}
        position="relative"
      >
        <Heading 
          mb={6} 
          color="#4A0000"
          fontWeight="bold"
          letterSpacing="wide"
          position="relative"
        >
          Student Management
          <Box
            position="absolute"
            bottom="-10px"
            left="0"
            height="3px"
            width="100px"
            bg="#640101"
            borderRadius="full"
          />
        </Heading>

        {/* Search Bar with Refresh Button */}
        <HStack mb={6} spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement>
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by name, email, or institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor="gray.200"
              _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
            />
          </InputGroup>
          <Button
            leftIcon={<FaSync />}
            onClick={handleRefresh}
            isLoading={isRefreshing}
            loadingText="Refreshing"
            variant="outline"
            borderColor="#640101"
            color="#640101"
            _hover={{ 
              bg: "#640101", 
              color: "white" 
            }}
            size="md"
          >
            Refresh
          </Button>
          <Text color="gray.600" fontSize="sm">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
          </Text>
        </HStack>
        
        <Table 
          variant="soft-rounded" 
          bg="white" 
          boxShadow="0 10px 30px rgba(100, 1, 1, 0.08)"
          borderRadius="xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          <Thead 
            bg="gray.50"
            borderBottom="2px solid #640101"
          >
            <Tr>
              <Th color="#4A0000" fontWeight="bold">No.</Th>
              <Th color="#4A0000" fontWeight="bold">Name</Th>
              <Th color="#4A0000" fontWeight="bold">Email</Th>
              <Th color="#4A0000" fontWeight="bold">Institution</Th>
              <Th color="#4A0000" fontWeight="bold">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <Tr 
                  key={student.id}
                  _hover={{ 
                    bg: "gray.50", 
                    transform: "translateY(-2px)", 
                    boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                  }}
                  transition="all 0.3s ease"
                >
                  <Td fontWeight="medium">{index + 1}</Td>
                  <Td>{student.name}</Td>
                  <Td>{student.email}</Td>
                  <Td>
                    {student.institution ? (
                      <Badge 
                        bg="rgba(100, 1, 1, 0.1)"
                        color="#640101"
                        borderWidth="1px"
                        borderColor="rgba(100, 1, 1, 0.2)"
                        fontWeight="semibold"
                      >
                        {student.institution}
                      </Badge>
                    ) : (
                      <Badge 
                        bg="gray.100"
                        color="gray.600"
                        borderWidth="1px"
                        borderColor="gray.200"
                        fontWeight="semibold"
                      >
                        NULL
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <Flex 
                      alignItems="center" 
                      justifyContent="flex-start"
                      gap={2}
                    >
                      <Tooltip label="View Details" placement="top">
                        <Box>
                          <Icon 
                            as={FaEye}
                            color="#4A0000"
                            boxSize={4}
                            cursor="pointer"
                            _hover={{ 
                              color: "#640101",
                              transform: "scale(1.2)"
                            }}
                            transition="all 0.3s ease"
                            onClick={() => handleViewStudent(student)}
                          />
                        </Box>
                      </Tooltip>
                      
                      <Tooltip label="Delete Student" placement="top">
                        <Box>
                          <Icon 
                            as={FaTrash}
                            color="red.500"
                            boxSize={4}
                            cursor="pointer"
                            _hover={{ 
                              color: "red.600",
                              transform: "scale(1.2)"
                            }}
                            transition="all 0.3s ease"
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                          />
                        </Box>
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" py={8}>
                  <VStack spacing={2}>
                    <Text color="gray.500" fontSize="lg">
                      {searchTerm ? 'No students match your search.' : 'No students found'}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Students will appear here once they register'}
                    </Text>
                  </VStack>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {error && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Student Details Modal */}
        {selectedStudent && (
          <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            size="xl"
          >
            <ModalOverlay 
              bg="blackAlpha.300"
              backdropFilter="blur(10px)"
            />
            <ModalContent
              borderRadius="xl"
              boxShadow="0 15px 50px rgba(100, 1, 1, 0.1)"
            >
              <ModalHeader
                bg="gray.50"
                color="#4A0000"
                borderBottom="1px solid"
                borderColor="gray.100"
                fontWeight="bold"
                textAlign="center"
              >
                Student Details
              </ModalHeader>
              <ModalCloseButton 
                color="#4A0000"
                _hover={{ color: "#640101" }}
              />
              <ModalBody py={6}>
                <VStack 
                  align="start" 
                  spacing={4}
                >
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Name</Text>
                    <Text>{selectedStudent.name}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Email</Text>
                    <Text>{selectedStudent.email}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Institution</Text>
                    <Text>{selectedStudent.institution || 'Not enrolled in any institution'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Status</Text>
                    <Badge 
                      colorScheme={selectedStudent.is_active ? "green" : "red"}
                    >
                      {selectedStudent.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Box>
                  {selectedStudent.bio && (
                    <Box>
                      <Text fontWeight="bold" color="#4A0000" mb={1}>Bio</Text>
                      <Text>{selectedStudent.bio}</Text>
                    </Box>
                  )}
                  {selectedStudent.phone && (
                    <Box>
                      <Text fontWeight="bold" color="#4A0000" mb={1}>Phone</Text>
                      <Text>{selectedStudent.phone}</Text>
                    </Box>
                  )}
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Registration Date</Text>
                    <Text>{selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleDateString() : 'Unknown'}</Text>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Flex>
  );
};

export default AdminStudentsPage;
