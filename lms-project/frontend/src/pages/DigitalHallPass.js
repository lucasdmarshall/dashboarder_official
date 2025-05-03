import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  PinInput,
  PinInputField,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Tooltip,
  Progress,
  VStack
} from '@chakra-ui/react';
import { FaSearch, FaHistory, FaEye, FaPrint, FaIdBadge } from 'react-icons/fa';
import InstitutionSidebar from '../components/InstitutionSidebar';

// Sample data
const sampleHallPasses = [
  {
    id: '123456',
    studentId: 'ST001',
    studentName: 'John Doe',
    issueTime: new Date(2024, 3, 5, 10, 30),
    expiryTime: new Date(2024, 3, 5, 11, 0),
    destination: 'Restroom',
    status: 'Completed',
  },
  {
    id: '234567',
    studentId: 'ST003',
    studentName: 'Michael Johnson',
    issueTime: new Date(2024, 3, 5, 11, 15),
    expiryTime: new Date(2024, 3, 5, 11, 45),
    destination: 'Nurse Office',
    status: 'Active',
  },
  {
    id: '345678',
    studentId: 'ST006',
    studentName: 'Sarah Davis',
    issueTime: new Date(2024, 3, 5, 9, 0),
    expiryTime: new Date(2024, 3, 5, 9, 30),
    destination: 'Library',
    status: 'Completed',
  },
  {
    id: '456789',
    studentId: 'ST002',
    studentName: 'Jane Smith',
    issueTime: new Date(2024, 3, 4, 14, 0),
    expiryTime: new Date(2024, 3, 4, 14, 30),
    destination: 'Principal Office',
    status: 'Completed',
  },
  {
    id: '567890',
    studentId: 'ST004',
    studentName: 'Emily Williams',
    issueTime: new Date(2024, 3, 4, 10, 45),
    expiryTime: new Date(2024, 3, 4, 11, 15),
    destination: 'Counselor',
    status: 'Completed',
  },
];

// Sample student hall pass history data
const sampleStudentHistory = {
  'ST001': [
    {
      id: '123456',
      issueTime: new Date(2024, 3, 5, 10, 30),
      expiryTime: new Date(2024, 3, 5, 11, 0),
      destination: 'Restroom',
      status: 'Completed',
    },
    {
      id: '111222',
      issueTime: new Date(2024, 3, 3, 9, 30),
      expiryTime: new Date(2024, 3, 3, 10, 0),
      destination: 'Library',
      status: 'Completed',
    },
    {
      id: '333444',
      issueTime: new Date(2024, 3, 1, 13, 45),
      expiryTime: new Date(2024, 3, 1, 14, 15),
      destination: 'Gym',
      status: 'Completed',
    },
  ],
  'ST003': [
    {
      id: '234567',
      issueTime: new Date(2024, 3, 5, 11, 15),
      expiryTime: new Date(2024, 3, 5, 11, 45),
      destination: 'Nurse Office',
      status: 'Active',
    },
    {
      id: '555666',
      issueTime: new Date(2024, 3, 2, 14, 0),
      expiryTime: new Date(2024, 3, 2, 14, 30),
      destination: 'Admin Office',
      status: 'Completed',
    },
  ],
  'ST006': [
    {
      id: '345678',
      issueTime: new Date(2024, 3, 5, 9, 0),
      expiryTime: new Date(2024, 3, 5, 9, 30),
      destination: 'Library',
      status: 'Completed',
    },
  ],
  'ST002': [
    {
      id: '456789',
      issueTime: new Date(2024, 3, 4, 14, 0),
      expiryTime: new Date(2024, 3, 4, 14, 30),
      destination: 'Principal Office',
      status: 'Completed',
    },
    {
      id: '777888',
      issueTime: new Date(2024, 3, 3, 11, 30),
      expiryTime: new Date(2024, 3, 3, 12, 0),
      destination: 'Restroom',
      status: 'Completed',
    },
  ],
  'ST004': [
    {
      id: '567890',
      issueTime: new Date(2024, 3, 4, 10, 45),
      expiryTime: new Date(2024, 3, 4, 11, 15),
      destination: 'Counselor',
      status: 'Completed',
    },
    {
      id: '999000',
      issueTime: new Date(2024, 3, 2, 9, 15),
      expiryTime: new Date(2024, 3, 2, 9, 45),
      destination: 'Library',
      status: 'Completed',
    },
  ],
};

const DigitalHallPass = () => {
  const [hallPasses, setHallPasses] = useState(sampleHallPasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [pinValue, setPinValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState([]);
  const [activeFilterTab, setActiveFilterTab] = useState(0);
  const toast = useToast();

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate remaining time in minutes
  const calculateRemainingTime = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry - now;
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  };

  // Calculate progress percentage (remaining time / total time)
  const calculateProgress = (issueTime, expiryTime) => {
    const issue = new Date(issueTime);
    const expiry = new Date(expiryTime);
    const now = new Date();
    
    // Total duration in ms
    const totalDuration = expiry - issue;
    // Elapsed time in ms
    const elapsed = now - issue;
    
    // Calculate percentage elapsed
    const percentElapsed = (elapsed / totalDuration) * 100;
    
    return Math.min(Math.max(0, percentElapsed), 100);
  };

  // Filter hall passes based on search term and active tab
  const filteredHallPasses = hallPasses.filter(pass => {
    const matchesSearch = 
      pass.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.id.includes(searchTerm) ||
      pass.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilterTab === 0) {
      // All passes
      return matchesSearch;
    } else if (activeFilterTab === 1) {
      // Active passes
      return matchesSearch && pass.status === 'Active';
    } else {
      // Completed passes
      return matchesSearch && pass.status === 'Completed';
    }
  });

  // Handle check button click
  const handleCheck = () => {
    // Check if pass code exists
    const foundPass = hallPasses.find(pass => pass.id === pinValue);
    
    if (foundPass) {
      setSelectedStudent(foundPass);
      setSelectedStudentHistory(sampleStudentHistory[foundPass.studentId] || []);
      setIsModalOpen(true);
      setPinValue('');
    } else {
      toast({
        title: 'Invalid Hall Pass Code',
        description: "No active hall pass found with this code.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle view student history
  const handleViewHistory = (student) => {
    setSelectedStudent(student);
    setSelectedStudentHistory(sampleStudentHistory[student.studentId] || []);
    setIsModalOpen(true);
  };

  // Pin input field handling
  const handlePinChange = (value) => {
    setPinValue(value);
  };

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveFilterTab(index);
  };

  return (
    <Box>
      <InstitutionSidebar />
      <Container 
        maxW="1190px" 
        mt="80px" 
        ml={{ base: "250px", md: "260px" }} 
        pr={{ base: 1, md: 3 }}
        pl={{ base: 1, md: 3 }}
        pb={10}
      >
        <Box mb={6}>
          <Heading as="h1" size="xl" mb={2} color="#640101">Digital Hall Pass</Heading>
          <Text color="gray.600">Manage and track student hall passes</Text>
        </Box>

        {/* Hall Pass Code Entry Section */}
        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="lg" 
          bg="white" 
          boxShadow="sm"
          mb={8}
        >
          <Flex direction={{ base: "column", md: "row" }} align="center">
            <Box textAlign="center" mb={{ base: 4, md: 0 }}>
              <Heading size="md" mb={3} color="#640101">Verify Hall Pass</Heading>
              <Text mb={4}>Enter the 6-digit hall pass code</Text>
              <HStack justify="center">
                <PinInput 
                  size="lg" 
                  value={pinValue}
                  onChange={handlePinChange} 
                  otp
                >
                  <PinInputField borderColor="gray.300" _focus={{ borderColor: "#640101" }} />
                  <PinInputField borderColor="gray.300" _focus={{ borderColor: "#640101" }} />
                  <PinInputField borderColor="gray.300" _focus={{ borderColor: "#640101" }} />
                  <PinInputField borderColor="gray.300" _focus={{ borderColor: "#640101" }} />
                  <PinInputField borderColor="gray.300" _focus={{ borderColor: "#640101" }} />
                  <PinInputField borderColor="gray.300" _focus={{ borderColor: "#640101" }} />
                </PinInput>
              </HStack>
            </Box>
            <Spacer />
            <Box ml={{ md: 10 }}>
              <Button 
                leftIcon={<FaIdBadge />}
                colorScheme="red" 
                bg="#640101"
                size="lg"
                px={10}
                onClick={handleCheck}
                isDisabled={pinValue.length !== 6}
              >
                Check Pass
              </Button>
            </Box>
          </Flex>
        </Box>

        {/* Hall Passes List Section */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
          overflow="hidden"
        >
          <Flex 
            p={4} 
            bg="gray.50" 
            borderBottomWidth="1px" 
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "center" }}
          >
            <Heading size="md" color="#640101" mb={{ base: 4, md: 0 }}>
              Hall Passes
            </Heading>
            <Spacer />
            <Flex gap={4}>
              <InputGroup maxW={{ md: "300px" }}>
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="#640101" />
                </InputLeftElement>
                <Input 
                  placeholder="Search by name, ID, or code..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderColor="gray.300"
                  _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                />
              </InputGroup>
            </Flex>
          </Flex>
          
          <Tabs colorScheme="red" onChange={handleTabChange}>
            <TabList px={4} pt={2}>
              <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>All Passes</Tab>
              <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>Active</Tab>
              <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>Completed</Tab>
            </TabList>
            
            <TabPanels>
              {[0, 1, 2].map((tabIndex) => (
                <TabPanel key={tabIndex} px={0} py={0}>
                  <Box overflowX="auto">
                    <Table variant="simple" size="md">
                      <Thead bg="#f5f5f5">
                        <Tr>
                          <Th>Code</Th>
                          <Th>Student</Th>
                          <Th>Destination</Th>
                          <Th>Issue Time</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredHallPasses.length > 0 ? (
                          filteredHallPasses.map((pass) => (
                            <Tr key={pass.id}>
                              <Td fontWeight="medium">{pass.id}</Td>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text>{pass.studentName}</Text>
                                  <Text fontSize="xs" color="gray.500">{pass.studentId}</Text>
                                </VStack>
                              </Td>
                              <Td>{pass.destination}</Td>
                              <Td>{formatDate(pass.issueTime)}</Td>
                              <Td>
                                {pass.status === 'Active' ? (
                                  <Box>
                                    <Badge colorScheme="green" mb={1}>
                                      Active ({calculateRemainingTime(pass.expiryTime)} min left)
                                    </Badge>
                                    <Progress 
                                      value={calculateProgress(pass.issueTime, pass.expiryTime)} 
                                      size="xs" 
                                      colorScheme="green" 
                                      borderRadius="full"
                                      max={100}
                                    />
                                  </Box>
                                ) : (
                                  <Badge colorScheme="gray">Completed</Badge>
                                )}
                              </Td>
                              <Td>
                                <Flex gap={2}>
                                  <Tooltip label="View History">
                                    <IconButton
                                      icon={<FaHistory />}
                                      size="sm"
                                      colorScheme="blue"
                                      variant="ghost"
                                      onClick={() => handleViewHistory(pass)}
                                    />
                                  </Tooltip>
                                  <Tooltip label="Print Pass">
                                    <IconButton
                                      icon={<FaPrint />}
                                      size="sm"
                                      colorScheme="teal"
                                      variant="ghost"
                                    />
                                  </Tooltip>
                                </Flex>
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={6} textAlign="center" py={4}>
                              No hall passes found.
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
      
      {/* Student Hall Pass Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white" borderTopRadius="md">
            <Flex align="center">
              <FaIdBadge size={20} style={{ marginRight: '10px' }} />
              Student Hall Pass
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" />
          
          <ModalBody pb={6}>
            {selectedStudent && (
              <>
                <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Heading size="md" mb={3} color="#640101">Student Information</Heading>
                  <Flex wrap="wrap">
                    <Box minW="50%" mb={2}>
                      <Text fontWeight="bold">Name:</Text>
                      <Text>{selectedStudent.studentName}</Text>
                    </Box>
                    <Box minW="50%" mb={2}>
                      <Text fontWeight="bold">ID:</Text>
                      <Text>{selectedStudent.studentId}</Text>
                    </Box>
                    <Box minW="50%" mb={2}>
                      <Text fontWeight="bold">Current Pass:</Text>
                      <Text>{selectedStudent.id}</Text>
                    </Box>
                    <Box minW="50%">
                      <Text fontWeight="bold">Status:</Text>
                      <Badge colorScheme={selectedStudent.status === 'Active' ? 'green' : 'gray'}>
                        {selectedStudent.status}
                      </Badge>
                    </Box>
                  </Flex>
                </Box>
                
                <Heading size="sm" mb={3} color="#640101">Hall Pass History</Heading>
                <Box maxH="300px" overflowY="auto" pr={2}>
                  <Table size="sm" variant="simple">
                    <Thead position="sticky" top={0} bg="white" zIndex={1}>
                      <Tr>
                        <Th>Date & Time</Th>
                        <Th>Code</Th>
                        <Th>Destination</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedStudentHistory.length > 0 ? (
                        selectedStudentHistory.map((pass) => (
                          <Tr key={pass.id}>
                            <Td>{formatDate(pass.issueTime)}</Td>
                            <Td fontWeight="medium">{pass.id}</Td>
                            <Td>{pass.destination}</Td>
                            <Td>
                              <Badge colorScheme={pass.status === 'Active' ? 'green' : 'gray'}>
                                {pass.status}
                              </Badge>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={4} textAlign="center">No history available</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button 
              colorScheme="red"
              bg="#640101"
              leftIcon={<FaPrint />}
            >
              Print Pass
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DigitalHallPass; 