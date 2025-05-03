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
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  Flex,
  Text,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { 
  FaCheckCircle, 
  FaEye, 
  FaEdit, 
  FaLock, 
  FaUnlock 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import { TutorContext } from '../contexts/TutorContext';

const AdminManageTutorsPage = () => {
  const [tutors, setTutors] = useState([
    {
      id: 1,
      name: 'Emily Johnson',
      email: 'emily@example.com',
      specialization: 'Mathematics',
      status: 'active',
      courses: 3,
      level: 'Level 1',
      isDashboarderCertified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      specialization: 'Computer Science',
      status: 'suspended',
      courses: 2,
      level: 'Level 3',
      isDashboarderCertified: false
    }
  ]);

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  const handleViewDetails = (tutor) => {
    setSelectedTutor(tutor);
  };

  const handleEditTutor = (tutor) => {
    setSelectedTutor(tutor);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setTutors(prev => 
      prev.map(tutor => 
        tutor.id === id ? { ...tutor, status: newStatus } : tutor
      )
    );
  };

  const handleSaveChanges = () => {
    // Update the tutor in the tutors array
    setTutors(prev => 
      prev.map(tutor => 
        tutor.id === selectedTutor.id ? selectedTutor : tutor
      )
    );

    // Close the modal
    setIsEditModalOpen(false);

    // Show a success toast
    toast({
      title: "Tutor Updated",
      description: `${selectedTutor.name}'s information has been updated.`,
      status: "success",
      duration: 3000,
      isClosable: true
    });
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
          Manage Tutors
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
              <Th color="#4A0000" fontWeight="bold">Specialization</Th>
              <Th color="#4A0000" fontWeight="bold">Active Courses</Th>
              <Th color="#4A0000" fontWeight="bold">Level</Th>
              <Th color="#4A0000" fontWeight="bold">Status</Th>
              <Th color="#4A0000" fontWeight="bold">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tutors.map(tutor => (
              <Tr 
                key={tutor.id}
                _hover={{ 
                  bg: "gray.50", 
                  transform: "translateY(-2px)", 
                  boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                }}
                transition="all 0.3s ease"
              >
                <Td>
                  <Flex alignItems="center">
                    <Text>{tutor.name}</Text>
                    {tutor.isDashboarderCertified && (
                      <Tag 
                        ml={2} 
                        bg="rgba(100, 1, 1, 0.1)"
                        color="#640101"
                        size="sm"
                        borderWidth="1px"
                        borderColor="rgba(100, 1, 1, 0.2)"
                      >
                        <FaCheckCircle style={{ marginRight: '4px', color: '#640101' }} />
                        Dashboarder Certified
                      </Tag>
                    )}
                  </Flex>
                </Td>
                <Td>{tutor.email}</Td>
                <Td>{tutor.specialization}</Td>
                <Td>{tutor.courses}</Td>
                <Td>
                  <Badge 
                    bg={
                      tutor.level === 'Level 1' ? 'rgba(100, 1, 1, 0.1)' : 
                      tutor.level === 'Level 2' ? 'rgba(100, 1, 1, 0.1)' : 
                      tutor.level === 'Level 3' ? 'rgba(100, 1, 1, 0.1)' : 
                      tutor.level === 'Level 4' ? 'rgba(100, 1, 1, 0.1)' : 
                      'rgba(100, 1, 1, 0.1)'
                    }
                    color="#640101"
                    borderWidth="1px"
                    borderColor="rgba(100, 1, 1, 0.2)"
                    fontWeight="semibold"
                  >
                    {tutor.level}
                  </Badge>
                </Td>
                <Td>
                  <Badge 
                    bg={
                      tutor.status === 'active' ? 'rgba(100, 1, 1, 0.1)' : 
                      tutor.status === 'suspended' ? 'rgba(100, 1, 1, 0.1)' : 
                      'rgba(100, 1, 1, 0.1)'
                    }
                    color="#640101"
                    borderWidth="1px"
                    borderColor="rgba(100, 1, 1, 0.2)"
                    fontWeight="semibold"
                    textTransform="capitalize"
                  >
                    {tutor.status}
                  </Badge>
                </Td>
                <Td>
                  <Flex 
                    alignItems="center" 
                    justifyContent="space-around"
                    gap={4}
                  >
                    <Tooltip label="View Details" placement="top">
                      <Icon 
                        as={FaEye}
                        color="#4A0000"
                        boxSize={5}
                        cursor="pointer"
                        _hover={{ 
                          color: "#640101",
                          transform: "scale(1.2)"
                        }}
                        transition="all 0.3s ease"
                        onClick={() => handleViewDetails(tutor)}
                      />
                    </Tooltip>
                    
                    <Tooltip label="Edit Tutor" placement="top">
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
                        onClick={() => handleEditTutor(tutor)}
                      />
                    </Tooltip>
                    
                    {tutor.status === 'active' ? (
                      <Tooltip label="Suspend Tutor" placement="top">
                        <Icon 
                          as={FaLock}
                          color="#640101"
                          boxSize={5}
                          cursor="pointer"
                          _hover={{ 
                            color: "#4A0000",
                            transform: "scale(1.2)"
                          }}
                          transition="all 0.3s ease"
                          onClick={() => handleStatusChange(tutor.id, 'suspended')}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip label="Activate Tutor" placement="top">
                        <Icon 
                          as={FaUnlock}
                          color="#640101"
                          boxSize={5}
                          cursor="pointer"
                          _hover={{ 
                            color: "#4A0000",
                            transform: "scale(1.2)"
                          }}
                          transition="all 0.3s ease"
                          onClick={() => handleStatusChange(tutor.id, 'active')}
                        />
                      </Tooltip>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Tutor Details Modal */}
        {selectedTutor && (
          <Modal 
            isOpen={!!selectedTutor} 
            onClose={() => setSelectedTutor(null)}
            size="md"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Flex alignItems="center">
                  {selectedTutor.name}
                  {selectedTutor.isDashboarderCertified && (
                    <Tag 
                      ml={2} 
                      bg="rgba(100, 1, 1, 0.1)"
                      color="#640101"
                      size="sm"
                      borderWidth="1px"
                      borderColor="rgba(100, 1, 1, 0.2)"
                    >
                      <FaCheckCircle style={{ marginRight: '4px', color: '#640101' }} />
                      Dashboarder Certified
                    </Tag>
                  )}
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="start" spacing={3}>
                  <Box><strong>Email:</strong> {selectedTutor.email}</Box>
                  <Box><strong>Specialization:</strong> {selectedTutor.specialization}</Box>
                  <Box><strong>Active Courses:</strong> {selectedTutor.courses}</Box>
                  <Box><strong>Status:</strong> {selectedTutor.status}</Box>
                  <Box><strong>Level:</strong> {selectedTutor.level}</Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        {/* Edit Tutor Modal */}
        {isEditModalOpen && (
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Tutor</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input 
                      value={selectedTutor.name} 
                      onChange={(e) => setSelectedTutor(prev => ({
                        ...prev, 
                        name: e.target.value
                      }))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      value={selectedTutor.email} 
                      onChange={(e) => setSelectedTutor(prev => ({
                        ...prev, 
                        email: e.target.value
                      }))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Specialization</FormLabel>
                    <Input 
                      value={selectedTutor.specialization} 
                      onChange={(e) => setSelectedTutor(prev => ({
                        ...prev, 
                        specialization: e.target.value
                      }))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={selectedTutor.status}
                      onChange={(e) => setSelectedTutor(prev => ({
                        ...prev, 
                        status: e.target.value
                      }))}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Level</FormLabel>
                    <Select 
                      value={selectedTutor.level}
                      onChange={(e) => setSelectedTutor(prev => ({
                        ...prev, 
                        level: e.target.value
                      }))}
                    >
                      <option value="Level 1">Level 1</option>
                      <option value="Level 2">Level 2</option>
                      <option value="Level 3">Level 3</option>
                      <option value="Level 4">Level 4</option>
                      <option value="Level 5">Level 5</option>
                    </Select>
                  </FormControl>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Flex>
  );
};

export default AdminManageTutorsPage;
