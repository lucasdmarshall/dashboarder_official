import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Grid,
  GridItem,
  Button,
  Badge,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaCertificate, 
  FaDownload, 
  FaEye, 
  FaAward 
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

const certificatesData = [
  {
    id: 1,
    course: 'Introduction to Machine Learning',
    date: '2024-01-15',
    instructor: 'Elena Rodriguez',
    status: 'Earned',
    imageUrl: '/path/to/certificate1.jpg'
  },
  {
    id: 2,
    course: 'Advanced Web Development',
    date: '2023-11-20',
    instructor: 'John Smith',
    status: 'Earned',
    imageUrl: '/path/to/certificate2.jpg'
  },
  {
    id: 3,
    course: 'Data Science Fundamentals',
    date: '2023-09-10',
    instructor: 'Sarah Chen',
    status: 'In Progress',
    imageUrl: null
  }
];

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState(certificatesData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    onOpen();
  };

  const getCertificateStatusDetails = (status) => {
    switch(status) {
      case 'Earned': return { 
        bg: 'rgba(100, 1, 1, 0.1)', 
        color: '#640101' 
      };
      case 'In Progress': return { 
        bg: 'rgba(0, 0, 0, 0.1)', 
        color: 'black' 
      };
      default: return { 
        bg: 'rgba(0, 0, 0, 0.1)', 
        color: 'black' 
      };
    }
  };

  return (
    <Flex>
      <StudentSidebar />
      
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg="white">
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading 
              as="h1" 
              size="xl" 
              color="#640101" 
              borderBottom="2px solid #640101" 
              pb={2}
            >
              <Flex alignItems="center">
                <FaCertificate style={{ marginRight: '15px' }} />
                My Certificates
              </Flex>
            </Heading>
            
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {certificates.map((certificate, index) => {
                const statusDetails = getCertificateStatusDetails(certificate.status);
                return (
                  <GridItem key={certificate.id}>
                    <Box 
                      bg={index % 2 === 0 ? 'white' : 'rgba(100, 1, 1, 0.05)'}
                      border="2px solid #640101" 
                      borderRadius="xl" 
                      p={6}
                      boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
                      _hover={{ 
                        transform: 'scale(1.03)', 
                        transition: 'transform 0.2s ease-in-out',
                        bg: 'rgba(100, 1, 1, 0.05)'
                      }}
                    >
                      <VStack spacing={4} align="stretch">
                        <Flex justifyContent="space-between" alignItems="center">
                          <Heading size="md" color="#640101">
                            {certificate.course}
                          </Heading>
                          <Badge 
                            bg={statusDetails.bg}
                            color={statusDetails.color}
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {certificate.status}
                          </Badge>
                        </Flex>
                        
                        <VStack spacing={2} align="stretch">
                          <Flex alignItems="center">
                            <FaAward style={{ marginRight: '10px', color: '#640101' }} />
                            <Text color="black">
                              Instructor: {certificate.instructor}
                            </Text>
                          </Flex>
                          <Flex alignItems="center">
                            <FaCertificate style={{ marginRight: '10px', color: '#640101' }} />
                            <Text color="black">
                              Issued: {certificate.date}
                            </Text>
                          </Flex>
                        </VStack>
                        
                        <Flex justifyContent="space-between">
                          <Button 
                            leftIcon={<FaEye />} 
                            variant="outline"
                            color="#640101"
                            borderColor="#640101"
                            _hover={{ 
                              bg: 'rgba(100, 1, 1, 0.1)',
                              transform: 'scale(1.05)'
                            }}
                            onClick={() => handleViewCertificate(certificate)}
                            isDisabled={!certificate.imageUrl}
                          >
                            View
                          </Button>
                          <Button 
                            leftIcon={<FaDownload />} 
                            bg="#640101"
                            color="white"
                            _hover={{ 
                              bg: 'black',
                              transform: 'scale(1.05)'
                            }}
                            isDisabled={certificate.status !== 'Earned'}
                          >
                            Download
                          </Button>
                        </Flex>
                      </VStack>
                    </Box>
                  </GridItem>
                );
              })}
            </Grid>

            {/* Certificate View Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent 
                borderRadius="xl"
                boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
                border="2px solid #640101"
              >
                <ModalHeader 
                  color="#640101" 
                  borderBottom="1px solid #640101"
                >
                  Certificate Details
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {selectedCertificate && (
                    <VStack spacing={4}>
                      <Heading size="md" color="#640101">
                        {selectedCertificate.course}
                      </Heading>
                      {selectedCertificate.imageUrl ? (
                        <Image 
                          src={selectedCertificate.imageUrl} 
                          alt="Certificate" 
                          boxShadow="lg"
                          maxHeight="500px"
                          border="2px solid #640101"
                        />
                      ) : (
                        <Text color="#640101">
                          Certificate image not available
                        </Text>
                      )}
                      <Flex width="full" justifyContent="space-between" mt={4}>
                        <Text color="black">
                          <strong style={{ color: '#640101' }}>Instructor:</strong> {selectedCertificate.instructor}
                        </Text>
                        <Text color="black">
                          <strong style={{ color: '#640101' }}>Issued:</strong> {selectedCertificate.date}
                        </Text>
                      </Flex>
                    </VStack>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button 
                    bg="#640101"
                    color="white"
                    mr={3} 
                    onClick={onClose}
                    _hover={{ 
                      bg: 'black',
                      transform: 'scale(1.05)'
                    }}
                  >
                    Close
                  </Button>
                  <Button 
                    leftIcon={<FaDownload />} 
                    variant="outline"
                    color="#640101"
                    borderColor="#640101"
                    _hover={{ 
                      bg: 'rgba(100, 1, 1, 0.1)',
                      transform: 'scale(1.05)'
                    }}
                    isDisabled={!selectedCertificate?.imageUrl}
                  >
                    Download Certificate
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentCertificates;
