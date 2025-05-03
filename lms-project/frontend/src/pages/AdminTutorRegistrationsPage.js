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
  Icon
} from '@chakra-ui/react';
import { 
  FaEye, 
  FaCheck, 
  FaTimes 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import { TutorContext } from '../contexts/TutorContext';

const AdminTutorRegistrationsPage = () => {
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const { registrations, approveRegistration, rejectRegistration } = useContext(TutorContext);

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
  };

  const handleApprove = (id) => {
    approveRegistration(id);
  };

  const handleReject = (id) => {
    rejectRegistration(id);
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
            {registrations.map(reg => (
              <Tr 
                key={reg.id}
                _hover={{ 
                  bg: "gray.50", 
                  transform: "translateY(-2px)", 
                  boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                }}
                transition="all 0.3s ease"
              >
                <Td>{reg.name}</Td>
                <Td>{reg.email}</Td>
                <Td>{reg.dateOfBirth}</Td>
                <Td>
                  <Badge 
                    bg={
                      reg.status === 'pending' ? 'rgba(100, 1, 1, 0.1)' : 
                      reg.status === 'approved' ? 'rgba(100, 1, 1, 0.1)' : 'rgba(100, 1, 1, 0.1)'
                    }
                    color={
                      reg.status === 'pending' ? '#640101' : 
                      reg.status === 'approved' ? '#640101' : '#640101'
                    }
                    borderWidth="1px"
                    borderColor={
                      reg.status === 'pending' ? 'rgba(100, 1, 1, 0.2)' : 
                      reg.status === 'approved' ? 'rgba(100, 1, 1, 0.2)' : 'rgba(100, 1, 1, 0.2)'
                    }
                    fontWeight="semibold"
                    textTransform="capitalize"
                  >
                    {reg.status}
                  </Badge>
                </Td>
                <Td>
                  <Flex alignItems="center" justifyContent="space-around">
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
                        onClick={() => handleViewDetails(reg)}
                      />
                    </Tooltip>
                    
                    {reg.status === 'pending' && (
                      <>
                        <Tooltip label="Approve" placement="top">
                          <Icon 
                            as={FaCheck}
                            color="green.500"
                            boxSize={5}
                            cursor="pointer"
                            _hover={{ 
                              color: "green.600",
                              transform: "scale(1.2)"
                            }}
                            transition="all 0.3s ease"
                            onClick={() => handleApprove(reg.id)}
                          />
                        </Tooltip>
                        
                        <Tooltip label="Reject" placement="top">
                          <Icon 
                            as={FaTimes}
                            color="red.500"
                            boxSize={5}
                            cursor="pointer"
                            _hover={{ 
                              color: "red.600",
                              transform: "scale(1.2)"
                            }}
                            transition="all 0.3s ease"
                            onClick={() => handleReject(reg.id)}
                          />
                        </Tooltip>
                      </>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Registration Details Modal */}
        {selectedRegistration && (
          <Modal 
            isOpen={!!selectedRegistration} 
            onClose={() => setSelectedRegistration(null)}
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
                Tutor Registration Details
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
                    <Text>{selectedRegistration.name}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Email</Text>
                    <Text>{selectedRegistration.email}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Date of Birth</Text>
                    <Text>{selectedRegistration.dateOfBirth}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Status</Text>
                    <Text>{selectedRegistration.status}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="#4A0000" mb={1}>Documents</Text>
                    {selectedRegistration.documents.map((doc, index) => (
                      <Text key={index}>{doc}</Text>
                    ))}
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
