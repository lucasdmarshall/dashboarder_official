import React, { useState } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const StudentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample student data
  const students = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', enrollmentDate: '2023-09-01', status: 'Active', courses: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', enrollmentDate: '2023-08-15', status: 'Active', courses: 5 },
    { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', enrollmentDate: '2023-07-22', status: 'Inactive', courses: 0 },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', enrollmentDate: '2023-09-10', status: 'Active', courses: 2 },
    { id: 5, name: 'Michael Wilson', email: 'michael.w@example.com', enrollmentDate: '2023-08-05', status: 'Active', courses: 4 },
    { id: 6, name: 'Sarah Brown', email: 'sarah.b@example.com', enrollmentDate: '2023-06-30', status: 'Inactive', courses: 1 },
  ];

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge color
  const getStatusColor = (status) => {
    return status === 'Active' ? 'green' : 'red';
  };

  const tableBackground = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>Student Management</Text>
      
      {/* Search and Add Student */}
      <Flex justifyContent="space-between" mb={5}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search students by name or email" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button colorScheme="blue">Add New Student</Button>
      </Flex>
      
      {/* Students Table */}
      <Box overflowX="auto" boxShadow="md" borderRadius="md" bg={tableBackground}>
        <Table variant="simple">
          <Thead bg={headerBg}>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Enrollment Date</Th>
              <Th>Status</Th>
              <Th>Courses</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.map(student => (
              <Tr key={student.id}>
                <Td>{student.id}</Td>
                <Td>{student.name}</Td>
                <Td>{student.email}</Td>
                <Td>{student.enrollmentDate}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                </Td>
                <Td>{student.courses}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue">View</Button>
                    <Button size="sm" colorScheme="green">Edit</Button>
                    <Button size="sm" colorScheme="red">Delete</Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default StudentPage;
