import React, { useState, useContext } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Flex, 
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Tag,
  TagLabel,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import { FaCheckCircle, FaSearch, FaTrash, FaSync } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import { TutorContext } from '../contexts/TutorContext';

const AdminTutorsPage = () => {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { approvedTutors, isLoading, fetchApprovedTutors } = useContext(TutorContext);
  const toast = useToast();

  const handleViewDetails = (tutor) => {
    setSelectedTutor(tutor);
    onOpen();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchApprovedTutors();
    } catch (error) {
      console.error('Error refreshing tutors:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (!window.confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5001/api/admin/instructors/${instructorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Instructor Deleted',
          description: 'The instructor has been successfully removed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Refresh the list
        fetchApprovedTutors();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete instructor');
      }
    } catch (error) {
      console.error('Error deleting instructor:', error);
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete instructor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filter instructors based on search term
  const filteredTutors = approvedTutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tutor.specialization && tutor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      
      <Box 
        ml="250px" 
        w="calc(100% - 250px)" 
        p={8}
        pt="98px"
        zIndex={10}
        position="relative"
      >
        <Container maxW="container.xl">
          <Heading 
            mb={6} 
            color="#4A0000"
            fontWeight="bold"
            letterSpacing="wide"
            position="relative"
          >
            View Tutors
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
                placeholder="Search by name, email, or specialization..."
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
              {filteredTutors.length} instructor{filteredTutors.length !== 1 ? 's' : ''} found
            </Text>
          </HStack>

          {isLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color="#640101" />
              <Text ml={4} color="#640101">Loading instructors...</Text>
            </Flex>
          ) : (
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
                  <Th color="#4A0000" fontWeight="bold">Status</Th>
                  <Th color="#4A0000" fontWeight="bold">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTutors.map((tutor, index) => (
                  <Tr 
                    _hover={{ 
                      bg: "gray.50", 
                      transform: "translateY(-2px)", 
                      boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                    }}
                    transition="all 0.3s ease"
                    key={tutor.id}
                  >
                    <Td fontWeight="medium">{index + 1}</Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{tutor.name}</Text>
                        <Tag 
                          size="sm" 
                          bg="rgba(40, 167, 69, 0.1)"
                          color="#155724"
                          borderWidth="1px"
                          borderColor="rgba(40, 167, 69, 0.2)"
                          fontWeight="semibold"
                        >
                          <FaCheckCircle style={{ marginRight: '4px' }} />
                          <TagLabel>Dashboarder Certified</TagLabel>
                        </Tag>
                      </VStack>
                    </Td>
                    <Td>{tutor.email}</Td>
                    <Td>
                      <Badge 
                        bg="rgba(40, 167, 69, 0.1)"
                        color="#155724"
                        borderWidth="1px"
                        borderColor="rgba(40, 167, 69, 0.2)"
                        fontWeight="semibold"
                        textTransform="capitalize"
                        px={3}
                        py={1}
                      >
                        Active
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          bg="transparent"
                          color="#4A0000"
                          borderWidth="1px"
                          borderColor="#640101"
                          _hover={{ 
                            bg: "#640101", 
                            color: "white" 
                          }}
                          transition="all 0.3s ease"
                          onClick={() => handleViewDetails(tutor)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          bg="transparent"
                          color="red.500"
                          borderWidth="1px"
                          borderColor="red.500"
                          _hover={{ 
                            bg: "red.500", 
                            color: "white" 
                          }}
                          transition="all 0.3s ease"
                          onClick={() => handleDeleteInstructor(tutor.id)}
                        >
                          <FaTrash />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {filteredTutors.length === 0 && (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={8}>
                      <Text color="gray.500" fontSize="lg">
                        {searchTerm ? 'No instructors match your search.' : 'No approved instructors found.'}
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}

          {/* Tutor Details Modal */}
          {selectedTutor && (
            <Modal 
              isOpen={isOpen} 
              onClose={onClose}
              size="2xl"
            >
              <ModalOverlay 
                bg="blackAlpha.300"
                backdropFilter="blur(10px)"
              />
              <ModalContent
                borderRadius="xl"
                boxShadow="0 15px 50px rgba(100, 1, 1, 0.1)"
                maxH="80vh"
                overflowY="auto"
              >
                <ModalHeader
                  bg="gray.50"
                  color="#4A0000"
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Instructor Details
                </ModalHeader>
                <ModalCloseButton 
                  color="#4A0000"
                  _hover={{ color: "#640101" }}
                />
                <ModalBody p={6}>
                  <VStack align="stretch" spacing={6}>
                    
                    {/* Basic Information */}
                    <Box>
                      <Heading size="md" color="#640101" mb={4}>Basic Information</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Name</Text>
                          <Text>{selectedTutor.name}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Email</Text>
                          <Text>{selectedTutor.email}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Phone</Text>
                          <Text>{selectedTutor.phone || 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Status</Text>
                          <HStack>
                            <Badge
                              colorScheme="green"
                              textTransform="capitalize"
                            >
                              {selectedTutor.status}
                            </Badge>
                            <Tag 
                              size="sm" 
                              bg="rgba(40, 167, 69, 0.1)"
                              color="#155724"
                              borderWidth="1px"
                              borderColor="rgba(40, 167, 69, 0.2)"
                              fontWeight="semibold"
                            >
                              <FaCheckCircle style={{ marginRight: '4px' }} />
                              <TagLabel>Dashboarder Certified</TagLabel>
                            </Tag>
                          </HStack>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    {/* Professional Information */}
                    <Box>
                      <Heading size="md" color="#640101" mb={4}>Professional Information</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Specialization</Text>
                          <Text>{selectedTutor.specialization || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Account Created</Text>
                          <Text>
                            {selectedTutor.created_at 
                              ? new Date(selectedTutor.created_at).toLocaleDateString()
                              : 'N/A'
                            }
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {selectedTutor.bio && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={2}>About / Bio</Text>
                          <Text>{selectedTutor.bio}</Text>
                        </Box>
                      </>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    bg="#640101"
                    color="white"
                    _hover={{ bg: "#4A0000" }}
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Container>
      </Box>
    </Flex>
  );
};

export default AdminTutorsPage;
