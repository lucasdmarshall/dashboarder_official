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
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Divider,
  Text,
  useToast,
  Tooltip,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Spinner,
  SimpleGrid,
  Button
} from '@chakra-ui/react';
import { 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaSearch,
  FaSync
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import { TutorContext } from '../contexts/TutorContext';

const AdminTutorRegistrationsPage = () => {
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { registrations, approveRegistration, rejectRegistration, isLoading, fetchRegistrations } = useContext(TutorContext);

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
  };

  const handleApprove = (id) => {
    approveRegistration(id);
  };

  const handleReject = (id) => {
    rejectRegistration(id);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchRegistrations();
    } catch (error) {
      console.error('Error refreshing registrations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter registrations based on search term
  const filteredRegistrations = registrations.filter(reg =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.specialization.toLowerCase().includes(searchTerm.toLowerCase())
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
          Tutor Registrations
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
            {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''} found
          </Text>
        </HStack>
        
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="#640101" />
            <Text ml={4} color="#640101">Loading registrations...</Text>
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
                <Th color="#4A0000" fontWeight="bold">Education</Th>
                <Th color="#4A0000" fontWeight="bold">Status</Th>
                <Th color="#4A0000" fontWeight="bold">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRegistrations.map((reg, index) => (
                <Tr 
                  key={reg.id}
                  _hover={{ 
                    bg: "gray.50", 
                    transform: "translateY(-2px)", 
                    boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                  }}
                  transition="all 0.3s ease"
                >
                  <Td fontWeight="medium">{index + 1}</Td>
                  <Td fontWeight="medium">{reg.name}</Td>
                  <Td>{reg.email}</Td>
                  <Td>{reg.education}</Td>
                  <Td>
                    <Badge 
                      bg={
                        reg.status === 'pending' ? 'rgba(255, 193, 7, 0.1)' : 
                        reg.status === 'approved' ? 'rgba(40, 167, 69, 0.1)' : 
                        reg.status === 'rejected' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(100, 1, 1, 0.1)'
                      }
                      color={
                        reg.status === 'pending' ? '#856404' : 
                        reg.status === 'approved' ? '#155724' : 
                        reg.status === 'rejected' ? '#721c24' : '#640101'
                      }
                      borderWidth="1px"
                      borderColor={
                        reg.status === 'pending' ? 'rgba(255, 193, 7, 0.2)' : 
                        reg.status === 'approved' ? 'rgba(40, 167, 69, 0.2)' : 
                        reg.status === 'rejected' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(100, 1, 1, 0.2)'
                      }
                      fontWeight="semibold"
                      textTransform="capitalize"
                      px={3}
                      py={1}
                    >
                      {reg.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="space-around">
                      <Tooltip label="View Details" placement="top">
                        <Box 
                          as="button"
                          role="button"
                          tabIndex={0}
                          cursor="pointer"
                          _hover={{ 
                            transform: "scale(1.2)"
                          }}
                          transition="all 0.3s ease"
                          onClick={() => handleViewDetails(reg)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleViewDetails(reg);
                            }
                          }}
                        >
                          <Icon 
                            as={FaEye}
                            color="#4A0000"
                            boxSize={5}
                            _hover={{ 
                              color: "#640101"
                            }}
                            transition="all 0.3s ease"
                          />
                        </Box>
                      </Tooltip>
                      
                      {reg.status === 'pending' && (
                        <>
                          <Tooltip label="Approve" placement="top">
                            <Box 
                              as="button"
                              role="button"
                              tabIndex={0}
                              cursor="pointer"
                              _hover={{ 
                                transform: "scale(1.2)"
                              }}
                              transition="all 0.3s ease"
                              onClick={() => handleApprove(reg.id)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleApprove(reg.id);
                                }
                              }}
                            >
                              <Icon 
                                as={FaCheck}
                                color="green.500"
                                boxSize={5}
                                _hover={{ 
                                  color: "green.600"
                                }}
                                transition="all 0.3s ease"
                              />
                            </Box>
                          </Tooltip>
                          
                          <Tooltip label="Reject" placement="top">
                            <Box 
                              as="button"
                              role="button"
                              tabIndex={0}
                              cursor="pointer"
                              _hover={{ 
                                transform: "scale(1.2)"
                              }}
                              transition="all 0.3s ease"
                              onClick={() => handleReject(reg.id)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleReject(reg.id);
                                }
                              }}
                            >
                              <Icon 
                                as={FaTimes}
                                color="red.500"
                                boxSize={5}
                                _hover={{ 
                                  color: "red.600"
                                }}
                                transition="all 0.3s ease"
                              />
                            </Box>
                          </Tooltip>
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
              {filteredRegistrations.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text color="gray.500" fontSize="lg">
                      {searchTerm ? 'No registrations match your search.' : 'No instructor registrations found.'}
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}

        {/* Registration Details Modal */}
        {selectedRegistration && (
          <Modal 
            isOpen={!!selectedRegistration} 
            onClose={() => setSelectedRegistration(null)}
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
                Instructor Registration Details
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
                        <Text>{selectedRegistration.name}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Email</Text>
                        <Text>{selectedRegistration.email}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Phone</Text>
                        <Text>{selectedRegistration.phone || 'Not provided'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Status</Text>
                        <Badge
                          colorScheme={
                            selectedRegistration.status === 'pending' ? 'orange' :
                            selectedRegistration.status === 'approved' ? 'green' : 'red'
                          }
                          textTransform="capitalize"
                        >
                          {selectedRegistration.status}
                        </Badge>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* Professional Background */}
                  <Box>
                    <Heading size="md" color="#640101" mb={4}>Professional Background</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Specialization</Text>
                        <Text>{selectedRegistration.specialization}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Education</Text>
                        <Text>{selectedRegistration.education}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Experience</Text>
                        <Text>{selectedRegistration.experience}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  {selectedRegistration.bio && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={2}>About / Bio</Text>
                        <Text>{selectedRegistration.bio}</Text>
                      </Box>
                    </>
                  )}

                  {selectedRegistration.certifications && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={2}>Certifications & Qualifications</Text>
                        <Text whiteSpace="pre-wrap">{selectedRegistration.certifications}</Text>
                      </Box>
                    </>
                  )}

                  <Divider />

                  {/* Application Timeline */}
                  <Box>
                    <Heading size="md" color="#640101" mb={4}>Application Timeline</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Submitted At</Text>
                        <Text>
                          {selectedRegistration.submitted_at 
                            ? new Date(selectedRegistration.submitted_at).toLocaleString()
                            : 'N/A'
                          }
                        </Text>
                      </Box>
                      {selectedRegistration.reviewed_at && (
                        <Box>
                          <Text fontWeight="bold" color="#4A0000" mb={1}>Reviewed At</Text>
                          <Text>{new Date(selectedRegistration.reviewed_at).toLocaleString()}</Text>
                        </Box>
                      )}
                    </SimpleGrid>
                    
                    {selectedRegistration.review_notes && (
                      <Box mt={4}>
                        <Text fontWeight="bold" color="#4A0000" mb={1}>Review Notes</Text>
                        <Text>{selectedRegistration.review_notes}</Text>
                      </Box>
                    )}
                  </Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Flex>
  );
};

export default AdminTutorRegistrationsPage;
