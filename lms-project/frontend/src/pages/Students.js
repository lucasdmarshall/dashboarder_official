import React, { useState } from 'react';
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
  useToast
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaEye, 
  FaTimes,
  FaUserPlus,
  FaCheck
} from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Will use for navigation in the future 
import FormBuilder from './FormBuilder'; // Assuming FormBuilder is in the same directory
import ViewForm from './ViewForm';

const studentsData = [
  {
    no: 1,
    id: 'STD6251',
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2023-09-01',
    program: 'Computer Science',
    level: 'Undergraduate',
    status: 'Active',
    gpa: '3.8',
    credits: 85
  },
  {
    no: 2,
    id: 'STD3778',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    joinDate: '2023-08-15',
    program: 'Business Administration',
    level: 'Graduate',
    status: 'Active',
    gpa: '3.9',
    credits: 42
  },
  {
    no: 3,
    id: 'STD4414',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    joinDate: '2023-09-10',
    program: 'Electrical Engineering',
    level: 'Undergraduate',
    status: 'On Leave',
    gpa: '3.5',
    credits: 65
  },
  {
    no: 4,
    id: 'STD0021',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    joinDate: '2023-07-20',
    program: 'Psychology',
    level: 'Graduate',
    status: 'Active',
    gpa: '4.0',
    credits: 36
  },
  {
    no: 5,
    id: 'STD9188',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    joinDate: '2023-08-05',
    program: 'Mathematics',
    level: 'Undergraduate',
    status: 'Probation',
    gpa: '2.7',
    credits: 72
  }
];

const StudentsPage = () => {
  // Load students from localStorage or use default data
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('studentApplicants');
    return savedStudents ? JSON.parse(savedStudents) : studentsData;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const toast = useToast();
  
  // Save students to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('studentApplicants', JSON.stringify(students));
  }, [students]);

  const handleView = (studentId) => {
    toast({
      title: 'Viewing student',
      description: `Viewing details for student ${studentId}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCheck = (studentId) => {
    // Find the student to be checked
    const studentToCheck = students.find(student => student.id === studentId);
    
    if (studentToCheck) {
      // Add graduation year (random between 2026-2035 for demo purposes)
      const graduationYear = Math.floor(Math.random() * 10) + 2026;
      const studentWithGradYear = { ...studentToCheck, graduationYear };
      
      // Get existing checked students from localStorage or initialize empty array
      const existingCheckedStudents = JSON.parse(localStorage.getItem('checkedStudents') || '[]');
      
      // Add the student to checked students
      const updatedCheckedStudents = [...existingCheckedStudents, studentWithGradYear];
      
      // Save to localStorage
      localStorage.setItem('checkedStudents', JSON.stringify(updatedCheckedStudents));
      
      // Remove student from current list
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      
      toast({
        title: 'Student Checked',
        description: `${studentToCheck.name} has been moved to Students List with graduation year ${graduationYear}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (studentId) => {
    toast({
      title: 'Deleting student',
      description: `Deleting student ${studentId}`,
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Student Applicants</Text>
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
                onClick={() => setIsFormBuilderOpen(true)}
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
            <Table variant="simple" size="md">
              <Thead>
                <Tr bg="#640101" color="white" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                  {['No', 'ID', 'Name', 'Email', 'Join Date', 'Action'].map((header) => (
                    <Th 
                      key={header} 
                      color="white" 
                      textTransform="uppercase"
                      letterSpacing="wider"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.map((student, index) => {
                  return (
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
                      <Td textAlign="center">{student.id}</Td>
                      <Td textAlign="center">{student.name}</Td>
                      <Td textAlign="center">{student.email}</Td>
                      <Td textAlign="center">{student.joinDate}</Td>
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
                            onClick={() => handleCheck(student.id)}
                          >
                            <Icon as={FaCheck} />
                          </Button>
                          <Button
                            size="sm"
                            bg="#640101"
                            color="white"
                            _hover={{ bg: 'black' }}
                            onClick={() => handleDelete(student.id)}
                          >
                            <Icon as={FaTimes} />
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Container>
      <FormBuilder isOpen={isFormBuilderOpen} onClose={() => setIsFormBuilderOpen(false)} setFormFields={setFormFields} />
      <ViewForm formFields={formFields} isOpen={isViewFormOpen} onClose={() => setIsViewFormOpen(false)} />
    </Box>
  );
};

export default StudentsPage;
