import React, { useState, useContext } from 'react';
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
  Select,
  useToast,
  Flex,
  Text,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { 
  FaEdit, 
  FaLock, 
  FaUnlock 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import { StudentContext } from '../contexts/StudentContext';

const AdminStudentsPage = () => {
  const { students, updateStudent, suspendStudent, activateStudent } = useContext(StudentContext);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    // Update student in the context
    updateStudent(selectedStudent.id, selectedStudent);

    // Close modal and show success toast
    setIsEditModalOpen(false);
    toast({
      title: "Student Updated",
      description: `${selectedStudent.name}'s information has been updated.`,
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };

  const handleStatusChange = (student) => {
    if (student.status === 'active') {
      suspendStudent(student.id);
    } else {
      activateStudent(student.id);
    }
  };

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
          mb={8} 
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
              <Th color="#4A0000" fontWeight="bold">Name</Th>
              <Th color="#4A0000" fontWeight="bold">Email</Th>
              <Th color="#4A0000" fontWeight="bold">Major</Th>
              <Th color="#4A0000" fontWeight="bold">Graduation Year</Th>
              <Th color="#4A0000" fontWeight="bold">Status</Th>
              <Th color="#4A0000" fontWeight="bold">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map(student => (
              <Tr 
                key={student.id}
                _hover={{ 
                  bg: "gray.50", 
                  transform: "translateY(-2px)", 
                  boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                }}
                transition="all 0.3s ease"
              >
                <Td>{student.name}</Td>
                <Td>{student.email}</Td>
                <Td>{student.major}</Td>
                <Td>{student.graduationYear}</Td>
                <Td>
                  <Badge 
                    bg={
                      student.status === 'active' ? 'rgba(100, 1, 1, 0.1)' : 
                      student.status === 'probation' ? 'rgba(100, 1, 1, 0.1)' : 
                      'rgba(100, 1, 1, 0.1)'
                    }
                    color="#640101"
                    borderWidth="1px"
                    borderColor="rgba(100, 1, 1, 0.2)"
                    fontWeight="semibold"
                    textTransform="capitalize"
                  >
                    {student.status}
                  </Badge>
                </Td>
                <Td>
                  <Flex 
                    alignItems="center" 
                    justifyContent="space-around"
                    gap={4}
                  >
                    <Tooltip label="Edit Student" placement="top">
                      <Icon 
                        as={FaEdit}
                        color="#4A0000"
                        boxSize={5}
                        cursor="pointer"
                        _hover={{ 
                          color: "#640101",
                          transform: "scale(1.2)"
                        }}
                        transition="all 0.3s ease"
                        onClick={() => handleEditStudent(student)}
                      />
                    </Tooltip>
                    
                    <Tooltip 
                      label={
                        student.status === 'active' ? 
                        'Suspend Student' : 
                        'Activate Student'
                      } 
                      placement="top"
                    >
                      <Icon 
                        as={student.status === 'active' ? FaLock : FaUnlock}
                        color="#640101"
                        boxSize={5}
                        cursor="pointer"
                        _hover={{ 
                          color: "#4A0000",
                          transform: "scale(1.2)"
                        }}
                        transition="all 0.3s ease"
                        onClick={() => handleStatusChange(student)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Edit Student Modal */}
        {selectedStudent && (
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)}
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
                Edit Student: {selectedStudent.name}
              </ModalHeader>
              <ModalCloseButton 
                color="#4A0000"
                _hover={{ color: "#640101" }}
              />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel color="#4A0000">Name</FormLabel>
                    <Input 
                      value={selectedStudent.name}
                      borderColor="rgba(100, 1, 1, 0.2)"
                      _hover={{ borderColor: "#640101" }}
                      focusBorderColor="#640101"
                      onChange={(e) => setSelectedStudent(prev => ({
                        ...prev, 
                        name: e.target.value
                      }))}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="#4A0000">Email</FormLabel>
                    <Input 
                      value={selectedStudent.email}
                      borderColor="rgba(100, 1, 1, 0.2)"
                      _hover={{ borderColor: "#640101" }}
                      focusBorderColor="#640101"
                      onChange={(e) => setSelectedStudent(prev => ({
                        ...prev, 
                        email: e.target.value
                      }))}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="#4A0000">Major</FormLabel>
                    <Select
                      value={selectedStudent.major}
                      borderColor="rgba(100, 1, 1, 0.2)"
                      _hover={{ borderColor: "#640101" }}
                      focusBorderColor="#640101"
                      onChange={(e) => setSelectedStudent(prev => ({
                        ...prev, 
                        major: e.target.value
                      }))}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Mathematics">Mathematics</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="#4A0000">Graduation Year</FormLabel>
                    <Input 
                      type="number"
                      value={selectedStudent.graduationYear}
                      borderColor="rgba(100, 1, 1, 0.2)"
                      _hover={{ borderColor: "#640101" }}
                      focusBorderColor="#640101"
                      onChange={(e) => setSelectedStudent(prev => ({
                        ...prev, 
                        graduationYear: e.target.value
                      }))}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="#4A0000">Status</FormLabel>
                    <Select
                      value={selectedStudent.status}
                      borderColor="rgba(100, 1, 1, 0.2)"
                      _hover={{ borderColor: "#640101" }}
                      focusBorderColor="#640101"
                      onChange={(e) => setSelectedStudent(prev => ({
                        ...prev, 
                        status: e.target.value
                      }))}
                    >
                      <option value="active">Active</option>
                      <option value="probation">Probation</option>
                      <option value="suspended">Suspended</option>
                    </Select>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="#640101"
                  color="white"
                  _hover={{ bg: "#4A0000" }}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Flex>
  );
};

export default AdminStudentsPage;
