import React, { useState, useEffect } from 'react';
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
  useToast,
  Badge
} from '@chakra-ui/react';
import { 
  FaChalkboardTeacher, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTimes
} from 'react-icons/fa';


const ManageInstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();
  
  // Load approved instructors from localStorage on component mount
  useEffect(() => {
    const approvedInstructors = JSON.parse(localStorage.getItem('approvedInstructors') || '[]');
    
    // Add sequence numbers to the instructors
    const instructorsWithNumbers = approvedInstructors.map((instructor, index) => ({
      ...instructor,
      no: index + 1
    }));
    
    setInstructors(instructorsWithNumbers);
  }, []);

  const handleView = (instructorId) => {
    toast({
      title: 'Viewing instructor',
      description: `Viewing details for instructor ${instructorId}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEdit = (instructorId) => {
    toast({
      title: 'Editing instructor',
      description: `Editing details for instructor ${instructorId}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDelete = (instructorId) => {
    // Find the instructor to delete
    const instructorToDelete = instructors.find(instructor => instructor.id === instructorId);
    
    if (instructorToDelete) {
      // Remove instructor from the current list
      const updatedInstructors = instructors.filter(instructor => instructor.id !== instructorId);
      setInstructors(updatedInstructors);
      
      // Update localStorage
      localStorage.setItem('approvedInstructors', JSON.stringify(updatedInstructors));
      
      toast({
        title: 'Instructor Removed',
        description: `${instructorToDelete.name} has been removed from approved instructors`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const filteredInstructors = instructors.filter(instructor => 
    instructor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bgColor = useColorModeValue('white', 'gray.800');

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
                <FaChalkboardTeacher style={{ marginRight: '15px' }} />
                Manage Instructors
                <Badge ml={4} colorScheme="green" fontSize="0.8em" p={1}>
                  Approved
                </Badge>
              </Text>
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
            
            {instructors.length === 0 ? (
              <Box 
                p={8} 
                textAlign="center" 
                borderRadius="xl" 
                bg="gray.50" 
                border="1px dashed #640101"
              >
                <Text fontSize="lg" color="gray.600">
                  No approved instructors found. Approve instructors from the Instructors page.
                </Text>
              </Box>
            ) : (
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
                              onClick={() => handleEdit(instructor.id)}
                            >
                              <Icon as={FaEdit} />
                            </Button>
                            <Button
                              size="sm"
                              bg="red.500"
                              color="white"
                              _hover={{ bg: 'red.600' }}
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
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ManageInstructorsPage;
