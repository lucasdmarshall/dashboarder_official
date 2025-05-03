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
  Divider
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import { TutorContext } from '../contexts/TutorContext';

const AdminTutorsPage = () => {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { approvedTutors } = useContext(TutorContext);

  const handleViewDetails = (tutor) => {
    setSelectedTutor(tutor);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'yellow';
      case 'approved': return 'red';
      case 'rejected': return 'red';
      default: return 'gray';
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
            mb={8} 
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
                <Th color="#4A0000" fontWeight="bold">Date of Birth</Th>
                <Th color="#4A0000" fontWeight="bold">Status</Th>
                <Th color="#4A0000" fontWeight="bold">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {approvedTutors.map((tutor) => (
                <Tr 
                  _hover={{ 
                    bg: "gray.50", 
                    transform: "translateY(-2px)", 
                    boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                  }}
                  transition="all 0.3s ease"
                  key={tutor.id}
                >
                  <Td>
                    {tutor.name}
                    {tutor.isDashboarderCertified && (
                      <Tag 
                        size="sm" 
                        bg="rgba(100, 1, 1, 0.1)"
                        color="#640101"
                        borderWidth="1px"
                        borderColor="rgba(100, 1, 1, 0.2)"
                        ml={2}
                        fontWeight="semibold"
                      >
                        <FaCheckCircle />
                        <TagLabel>Dashboarder Certified</TagLabel>
                      </Tag>
                    )}
                  </Td>
                  <Td>{tutor.email}</Td>
                  <Td>{tutor.dateOfBirth}</Td>
                  <Td>
                    <Badge 
                      bg={`${getStatusColor(tutor.status)}.50`}
                      color={`${getStatusColor(tutor.status)}.600`}
                      borderWidth="1px"
                      borderColor={`${getStatusColor(tutor.status)}.200`}
                      fontWeight="semibold"
                      textTransform="capitalize"
                    >
                      {tutor.status}
                    </Badge>
                  </Td>
                  <Td>
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
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Tutor Details Modal */}
          {selectedTutor && (
            <Modal 
              isOpen={isOpen} 
              onClose={onClose}
              size="lg"
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
                  <Flex alignItems="center" justifyContent="center">
                    {selectedTutor.name}
                    {selectedTutor && selectedTutor.isDashboarderCertified && (
                      <Tag 
                        size="sm" 
                        bg="rgba(100, 1, 1, 0.1)"
                        color="#640101"
                        borderWidth="1px"
                        borderColor="rgba(100, 1, 1, 0.2)"
                        ml={2}
                        fontWeight="semibold"
                      >
                        <FaCheckCircle />
                        <TagLabel>Dashboarder Certified</TagLabel>
                      </Tag>
                    )}
                  </Flex>
                </ModalHeader>
                <ModalCloseButton 
                  color="#4A0000"
                  _hover={{ color: "#640101" }}
                />
                <ModalBody>
                  <VStack 
                    align="start" 
                    spacing={4}
                    divider={<Divider borderColor="gray.200" />}
                  >
                    <Box>
                      <Text fontWeight="bold" color="#4A0000" mb={1}>Name</Text>
                      <Text>{selectedTutor.name}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#4A0000" mb={1}>Email</Text>
                      <Text>{selectedTutor.email}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#4A0000" mb={1}>Date of Birth</Text>
                      <Text>{selectedTutor.dateOfBirth}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#4A0000" mb={1}>Specialization</Text>
                      <Text>{selectedTutor.specialization}</Text>
                    </Box>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    bg="#640101"
                    color="white"
                    _hover={{ bg: "#4A0000" }}
                    mr={3}
                    borderRadius="md"
                    isDisabled={selectedTutor.status === 'approved'}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outline"
                    borderColor="#640101"
                    color="#4A0000"
                    _hover={{ 
                      bg: "#640101", 
                      color: "white" 
                    }}
                    borderRadius="md"
                    isDisabled={selectedTutor.status === 'rejected'}
                  >
                    Reject
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
