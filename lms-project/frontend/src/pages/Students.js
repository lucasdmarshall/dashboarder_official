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
  useColorModeValue,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  Heading,
  HStack
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaEye, 
  FaTimes,
  FaUserPlus,
  FaCheck,
  FaSync
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FormBuilder from '../components/FormBuilder';
import ViewForm from './ViewForm';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5001/api';

// We're using the Axios instance without withCredentials to be compatible with existing login flow
// The token will be passed in the Authorization header

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  
  // Get auth token for API requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  // Get institution ID
  const getInstitutionId = () => {
    if (currentUser && currentUser.id) {
      return currentUser.id;
    }
    return localStorage.getItem('institutionId');
  };
  
  // Load current user information and then students
  useEffect(() => {
    // Get current authenticated user
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: getAuthHeaders()
        });
        setCurrentUser(response.data);
        return response.data;
      } catch (err) {
        console.error('Error getting authenticated user:', err);
        setError('Authentication error. Using stored institution ID if available.');
        // Don't set isLoading to false yet, try to fetch with localStorage
        return null;
      }
    };
    
    const initializeData = async () => {
      await getCurrentUser();
      fetchStudents();
    };
    
    initializeData();
  }, []);
  
  // Function to fetch student applications for the authenticated institution
  const fetchStudents = async () => {
    const institutionId = getInstitutionId();
    
    if (!institutionId) {
      setError('No institution ID found. Please log in again.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch student applications for this institution
      const response = await axios.get(`${API_URL}/institutions/${institutionId}/applications`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Transform application data to student format for display
        const studentsFromApplications = response.data.map((application, index) => {
          // Parse the submitted data JSON
          let submittedData = {};
          try {
            submittedData = typeof application.submitted_data === 'string' 
              ? JSON.parse(application.submitted_data) 
              : application.submitted_data;
          } catch (e) {
            console.error('Error parsing submitted data:', e);
          }
          
          // Extract name from various possible field combinations
          const extractName = () => {
            // Try application.student_name first
            if (application.student_name && application.student_name !== 'undefined') {
              return application.student_name;
            }
            
            // Try different common name field combinations
            const firstName = submittedData.firstName || submittedData.first_name || submittedData['First Name'] || submittedData.fname;
            const lastName = submittedData.lastName || submittedData.last_name || submittedData['Last Name'] || submittedData.lname;
            const fullName = submittedData.fullName || submittedData.full_name || submittedData['Full Name'] || submittedData.name;
            
            // If we have a full name field, use it
            if (fullName && fullName !== 'undefined') {
              return fullName;
            }
            
            // If we have first and/or last name, combine them
            if (firstName && firstName !== 'undefined' && lastName && lastName !== 'undefined') {
              return `${firstName} ${lastName}`;
            } else if (firstName && firstName !== 'undefined') {
              return firstName;
            } else if (lastName && lastName !== 'undefined') {
              return lastName;
            }
            
            // Try to find any field that might contain a name
            const possibleNameFields = Object.keys(submittedData).filter(key => 
              key.toLowerCase().includes('name') && 
              submittedData[key] && 
              submittedData[key] !== 'undefined' &&
              typeof submittedData[key] === 'string'
            );
            
            if (possibleNameFields.length > 0) {
              return submittedData[possibleNameFields[0]];
            }
            
            // Last resort: try to use email prefix
            const email = application.student_email || submittedData.email;
            if (email && email.includes('@')) {
              return email.split('@')[0];
            }
            
            return 'Unknown Student';
          };

          // Extract email from various possible fields
          const extractEmail = () => {
            return application.student_email || 
                   submittedData.email || 
                   submittedData.emailAddress || 
                   submittedData.email_address || 
                   submittedData['Email Address'] ||
                   'No email provided';
          };

          return {
            id: application.id,
            no: index + 1,
            student_id: application.id, // Use application ID as student ID
            name: extractName(),
            email: extractEmail(),
            status: application.status === 'pending' ? 'Pending Review' : 
                   application.status === 'accepted' ? 'Accepted' : 
                   application.status === 'rejected' ? 'Rejected' : 'Pending Review',
            applied_at: application.submitted_at,
            form_data: submittedData, // Store the full form data for viewing
            application_id: application.id
          };
        });
        
        setStudents(studentsFromApplications);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching student applications:', err);
      setError('Failed to load student applications. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load student applications',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStudents();
  };

  const handleView = async (applicationId) => {
    try {
      // Find the application in our current data
      const application = students.find(student => student.application_id === applicationId);
      
      if (application) {
        setSelectedStudent(application);
        
        toast({
          title: 'Viewing Application',
          description: `Viewing application details for ${application.name}`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Application not found',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error viewing application:', error);
      toast({
        title: 'Error',
        description: 'Failed to load application details',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleCheck = async (applicationId) => {
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
    
    try {
      // Find the application to be accepted
      const applicationToAccept = students.find(student => student.application_id === applicationId);
      
      if (applicationToAccept) {
        // Update application status in the database
        await axios.put(`${API_URL}/institutions/${institutionId}/applications/${applicationId}/status`, {
          status: 'accepted'
        }, {
          headers: getAuthHeaders()
        });
        
        // Update application in the current list
        const updatedStudents = students.map(student => 
          student.application_id === applicationId 
            ? { ...student, status: 'Accepted' } 
            : student
        );
        setStudents(updatedStudents);
        
        toast({
          title: 'Application Accepted',
          description: `${applicationToAccept.name}'s application has been accepted`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept application',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (applicationId) => {
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
    
    try {
      // Find the application to be rejected
      const applicationToReject = students.find(student => student.application_id === applicationId);
      
      if (applicationToReject) {
        // Send reject request (this will delete the application from database)
        await axios.put(`${API_URL}/institutions/${institutionId}/applications/${applicationId}/status`, {
          status: 'rejected'
        }, {
          headers: getAuthHeaders()
        });
        
        // Remove application from the current list since it's deleted from database
        const updatedStudents = students.filter(student => 
          student.application_id !== applicationId
        );
        setStudents(updatedStudents);
        
        toast({
          title: 'Application Rejected',
          description: `${applicationToReject.name}'s application has been rejected and removed`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject application',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  // Open form builder for creating/editing forms
  const handleOpenFormBuilder = () => {
    setSelectedForm(null); // Reset selected form for create mode
    setIsFormBuilderOpen(true);
  };
  
  // Handle form save
  const handleFormSave = (formId) => {
    toast({
      title: 'Success',
      description: 'Form saved successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    // You could fetch forms here if you need to display them
  };
  
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.student_id && student.student_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Student Management</Text>
            <Flex gap={2}>
              <Button 
                bg="#640101"
                color="white"
                leftIcon={<FaUserPlus />}
                _hover={{ 
                  bg: 'black',
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
                onClick={handleOpenFormBuilder}
              >
                Create/edit form
              </Button>
              <Button 
                bg="#640101"
                color="white"
                leftIcon={<FaEye />}
                _hover={{ 
                  bg: 'black',
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
                onClick={() => setIsViewFormOpen(true)}
              >
                View form
              </Button>
              <Button
                bg="#640101"
                color="white"
                leftIcon={<FaSync />}
                _hover={{ 
                  bg: 'black',
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
                onClick={handleRefresh}
              >
                Refresh Data
              </Button>
            </Flex>
          </Flex>
          
          <Box mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search by Student ID or Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderColor="#640101"
                _hover={{ borderColor: '#640101' }}
                _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
              />
            </InputGroup>
          </Box>
          
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
            {isLoading ? (
              <Flex justify="center" align="center" height="200px">
                <Spinner 
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="#640101"
                  size="xl"
                />
              </Flex>
            ) : (
              <Table variant="simple" colorScheme="gray" size="md" borderRadius="md" overflow="hidden" boxShadow="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="#640101" fontWeight="bold" textAlign="center">No.</Th>
                    <Th color="#640101" fontWeight="bold" textAlign="center">Student ID</Th>
                    <Th color="#640101" fontWeight="bold" textAlign="center">Name</Th>
                    <Th color="#640101" fontWeight="bold" textAlign="center">Email</Th>
                    <Th color="#640101" fontWeight="bold" textAlign="center">Status</Th>
                    <Th color="#640101" fontWeight="bold" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents.length > 0 ? (
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
                        <Td textAlign="center">{student.no}</Td>
                        <Td textAlign="center">{student.student_id || student.id}</Td>
                        <Td textAlign="center">{student.name}</Td>
                        <Td textAlign="center">{student.email}</Td>
                        <Td textAlign="center">{student.status || 'Active'}</Td>
                        <Td textAlign="center">
                          <Flex justifyContent="center" gap={2}>
                            <Button
                              size="sm"
                              bg="#640101"
                              color="white"
                              _hover={{ bg: 'black' }}
                              onClick={() => handleView(student.application_id)}
                              title="View Application Details"
                            >
                              <Icon as={FaEye} />
                            </Button>
                            <Button
                              size="sm"
                              bg="green.500"
                              color="white"
                              _hover={{ bg: 'green.600' }}
                              onClick={() => handleCheck(student.application_id)}
                              title="Accept Application"
                              isDisabled={student.status === 'Accepted'}
                            >
                              <Icon as={FaCheck} />
                            </Button>
                            <Button
                              size="sm"
                              bg="red.500"
                              color="white"
                              _hover={{ bg: 'red.600' }}
                              onClick={() => handleDelete(student.application_id)}
                              title="Reject and Delete Application"
                              isDisabled={student.status === 'Rejected'}
                            >
                              <Icon as={FaTimes} />
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={4}>
                        No data yet
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
        </VStack>
      </Container>
      
      {/* Form Builder Modal */}
      <FormBuilder 
        institutionId={getInstitutionId()}
        formId={selectedForm?.id}
        isOpen={isFormBuilderOpen}
        onClose={() => setIsFormBuilderOpen(false)}
        onSave={handleFormSave}
      />
      <ViewForm 
        institutionId={getInstitutionId()} 
        isOpen={isViewFormOpen} 
        onClose={() => setIsViewFormOpen(false)} 
      />
      
      {/* Student Application Details Modal */}
      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="700">
                Application Details
              </Text>
              {selectedStudent && (
                <Text fontSize="sm" opacity={0.9}>
                  {selectedStudent.name} - {selectedStudent.status}
                </Text>
              )}
            </VStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            {selectedStudent && (
              <VStack spacing={4} align="stretch">
                {/* Basic Application Info */}
                <Card>
                  <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                      <VStack align="start">
                        <Text fontWeight="600" color="gray.600">Application ID</Text>
                        <Text>{selectedStudent.application_id}</Text>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="600" color="gray.600">Status</Text>
                        <Badge 
                          colorScheme={
                            selectedStudent.status === 'Accepted' ? 'green' :
                            selectedStudent.status === 'Rejected' ? 'red' : 'yellow'
                          }
                        >
                          {selectedStudent.status}
                        </Badge>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="600" color="gray.600">Email</Text>
                        <Text>{selectedStudent.email}</Text>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="600" color="gray.600">Applied On</Text>
                        <Text>
                          {selectedStudent.applied_at ? 
                            new Date(selectedStudent.applied_at).toLocaleDateString() : 'N/A'}
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Submitted Form Data */}
                <Card>
                  <CardHeader>
                    <Heading size="sm">Submitted Form Data</Heading>
                  </CardHeader>
                  <CardBody>
                    {selectedStudent.form_data && Object.keys(selectedStudent.form_data).length > 0 ? (
                      <VStack spacing={3} align="stretch">
                        {Object.entries(selectedStudent.form_data).map(([key, value]) => (
                          <Box key={key} p={3} bg="gray.50" borderRadius="md">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="600" color="gray.600" fontSize="sm">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Text>
                              <Text>{Array.isArray(value) ? value.join(', ') : String(value)}</Text>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No form data available
                      </Text>
                    )}
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedStudent && selectedStudent.status === 'Pending Review' && (
              <HStack spacing={3}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    handleDelete(selectedStudent.application_id);
                    setSelectedStudent(null);
                  }}
                >
                  Reject & Delete
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    handleCheck(selectedStudent.application_id);
                    setSelectedStudent(null);
                  }}
                >
                  Accept
                </Button>
              </HStack>
            )}
            <Button variant="ghost" onClick={() => setSelectedStudent(null)} ml={selectedStudent?.status === 'Pending Review' ? 0 : 'auto'}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentsPage;
