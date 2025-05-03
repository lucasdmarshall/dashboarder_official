import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
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
  Text,
  useToast
} from '@chakra-ui/react';
import { 
  FaChalkboardTeacher, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTimes,
  FaUserPlus,
  FaCheck
} from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Will use for navigation in the future
import FormBuilder from './FormBuilder'; // Assuming FormBuilder is in the same directory
import ViewForm from './ViewForm';

const instructorsData = [
  {
    no: 1,
    id: 'IST0001',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    level: 'Senior Instructor',
    country: 'USA'
  },
  {
    no: 2,
    id: 'IST0002',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    level: 'Junior Instructor',
    country: 'Canada'
  },
  {
    no: 3,
    id: 'IST0003',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    level: 'Assistant Instructor',
    country: 'UK'
  },
  {
    no: 4,
    id: 'IST0004',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    level: 'Senior Instructor',
    country: 'Australia'
  },
  {
    no: 5,
    id: 'IST0005',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    level: 'Junior Instructor',
    country: 'New Zealand'
  }
];

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState(instructorsData);
  const [searchQuery, setSearchQuery] = useState('');
  // const navigate = useNavigate(); // Will use for navigation in the future
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const toast = useToast();
  
  const handleView = (instructorId) => {
    toast({
      title: 'Viewing instructor',
      description: `Viewing details for instructor ${instructorId}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleApprove = (instructorId) => {
    // Find the instructor to approve
    const instructorToApprove = instructors.find(instructor => instructor.id === instructorId);
    
    if (instructorToApprove) {
      // Save approved instructor to localStorage
      const approvedInstructors = JSON.parse(localStorage.getItem('approvedInstructors') || '[]');
      approvedInstructors.push(instructorToApprove);
      localStorage.setItem('approvedInstructors', JSON.stringify(approvedInstructors));
      
      // Remove instructor from the current list
      const updatedInstructors = instructors.filter(instructor => instructor.id !== instructorId);
      setInstructors(updatedInstructors);
      
      toast({
        title: 'Instructor Approved',
        description: `${instructorToApprove.name} has been approved and moved to Manage Instructors`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (instructorId) => {
    toast({
      title: 'Deleting instructor',
      description: `Deleting instructor ${instructorId}`,
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  };
  
  const filteredInstructors = instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
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
              <FaChalkboardTeacher style={{ marginRight: '15px' }} />
              Instructor Applicants
            </Text>
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
                Create/Edit Form
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
                View Form
              </Button>
            </Flex>
          </Flex>
          
          <Box mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search by Instructor ID or Name"
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
            boxShadow="0 4px 6px rgba(0,0,0,0.1)"
            border="1px solid #640101"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: '0 6px 16px rgba(100, 1, 1, 0.15)'
            }}
            overflow="hidden"
          >
            <Table variant="simple" size="md">
              <Thead>
                <Tr bg="#640101" color="white" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                  {['No', 'ID', 'Name', 'Email', 'Level', 'Country', 'Actions'].map((header) => (
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
                {filteredInstructors.map((instructor, index) => (
                    <Tr 
                      key={instructor.id}
                      bg={index % 2 === 0 ? bgColor : 'rgba(100, 1, 1, 0.03)'}
                      _hover={{ 
                        bg: 'rgba(100, 1, 1, 0.08)', 
                        boxShadow: '0 4px 12px rgba(100, 1, 1, 0.1)',
                        transform: 'translateY(-2px)'
                      }}
                      transition="all 0.3s ease"
                      cursor="pointer"
                    >
                      <Td textAlign="center">{instructor.no}</Td>
                      <Td textAlign="center">{instructor.id}</Td>
                      <Td textAlign="center">{instructor.name}</Td>
                      <Td textAlign="center">{instructor.email}</Td>
                      <Td textAlign="center">{instructor.level}</Td>
                      <Td textAlign="center">{instructor.country}</Td>
                      <Td textAlign="center">
                        <Flex justifyContent="center" gap={2}>
                          <Button
                            size="sm"
                            bg="#640101"
                            color="white"
                            _hover={{ bg: 'black' }}
                            onClick={() => handleView(instructor.id)}
                          >
                            <Icon as={FaEye} />
                          </Button>
                          <Button
                            size="sm"
                            bg="#640101"
                            color="white"
                            _hover={{ bg: 'black' }}
                            onClick={() => handleApprove(instructor.id)}
                          >
                            <Icon as={FaCheck} />
                          </Button>
                          <Button
                            size="sm"
                            bg="#640101"
                            color="white"
                            _hover={{ bg: 'black' }}
                            onClick={() => handleDelete(instructor.id)}
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
        </VStack>
      </Container>
      <FormBuilder isOpen={isFormBuilderOpen} onClose={() => setIsFormBuilderOpen(false)} setFormFields={setFormFields} />
      <ViewForm formFields={formFields} isOpen={isViewFormOpen} onClose={() => setIsViewFormOpen(false)} />
    </Box>
  );
};

export default InstructorsPage;
