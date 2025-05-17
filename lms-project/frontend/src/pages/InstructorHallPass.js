import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  HStack,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  PinInput,
  PinInputField,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
  useToast,
  Progress,
  Avatar,
  AvatarBadge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Spacer,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Icon
} from '@chakra-ui/react';
import {
  FaIdCard,
  FaCheck,
  FaTimes,
  FaHistory,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaInfoCircle,
  FaUser,
  FaBell
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

// Sample data for active hall pass requests
const initialHallPassRequests = [
  {
    id: '123456',
    studentId: 'ST001',
    studentName: 'John Doe',
    requestTime: new Date(2025, 2, 15, 10, 25),
    fromTime: new Date(2025, 2, 15, 10, 30),
    toTime: new Date(2025, 2, 15, 11, 0),
    reason: 'Restroom',
    destination: 'Restroom 2nd Floor',
    status: 'Pending',
    course: 'Mathematics',
    studentImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '234567',
    studentId: 'ST003',
    studentName: 'Michael Johnson',
    requestTime: new Date(2025, 2, 15, 10, 10),
    fromTime: new Date(2025, 2, 15, 10, 15),
    toTime: new Date(2025, 2, 15, 10, 45),
    reason: 'Not feeling well',
    destination: 'Nurse Office',
    status: 'Approved',
    course: 'Mathematics',
    studentImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '345678',
    studentId: 'ST006',
    studentName: 'Sarah Davis',
    requestTime: new Date(2025, 2, 15, 9, 50),
    fromTime: new Date(2025, 2, 15, 10, 0),
    toTime: new Date(2025, 2, 15, 10, 30),
    reason: 'Need to get a book',
    destination: 'Library',
    status: 'Completed',
    course: 'Science',
    studentImage: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '456789',
    studentId: 'ST002',
    studentName: 'Jane Smith',
    requestTime: new Date(2025, 2, 14, 13, 55),
    fromTime: new Date(2025, 2, 14, 14, 0),
    toTime: new Date(2025, 2, 14, 14, 30),
    reason: 'Meeting with principal',
    destination: 'Principal Office',
    status: 'Approved',
    course: 'Mathematics',
    studentImage: 'https://randomuser.me/api/portraits/women/1.jpg'
  }
];

// Sample student hall pass history data
const sampleStudentHistory = {
  'ST001': [
    {
      id: '111222',
      requestTime: new Date(2025, 2, 10, 9, 25),
      fromTime: new Date(2025, 2, 10, 9, 30),
      toTime: new Date(2025, 2, 10, 10, 0),
      reason: 'Need to get a book',
      destination: 'Library',
      status: 'Completed',
      course: 'Science',
      approvedBy: 'Ms. Williams'
    },
    {
      id: '333444',
      requestTime: new Date(2025, 2, 8, 13, 40),
      fromTime: new Date(2025, 2, 8, 13, 45),
      toTime: new Date(2025, 2, 8, 14, 15),
      reason: 'Physical education equipment',
      destination: 'Gym',
      status: 'Completed',
      course: 'Physical Education',
      approvedBy: 'Mr. Johnson'
    },
    {
      id: '555666',
      requestTime: new Date(2025, 2, 5, 11, 25),
      fromTime: new Date(2025, 2, 5, 11, 30),
      toTime: new Date(2025, 2, 5, 12, 0),
      reason: 'Restroom',
      destination: 'Restroom 1st Floor',
      status: 'Completed',
      course: 'Mathematics',
      approvedBy: 'Dr. Brown'
    }
  ],
  'ST003': [
    {
      id: '777888',
      requestTime: new Date(2025, 2, 12, 10, 10),
      fromTime: new Date(2025, 2, 12, 10, 15),
      toTime: new Date(2025, 2, 12, 10, 45),
      reason: 'Make up test',
      destination: 'Testing Center',
      status: 'Completed',
      course: 'History',
      approvedBy: 'Mr. Davis'
    },
    {
      id: '999000',
      requestTime: new Date(2025, 2, 7, 9, 25),
      fromTime: new Date(2025, 2, 7, 9, 30),
      toTime: new Date(2025, 2, 7, 10, 0),
      reason: 'Counseling appointment',
      destination: 'Counselor Office',
      status: 'Completed',
      course: 'English',
      approvedBy: 'Mrs. Thompson'
    }
  ]
};

const InstructorHallPass = () => {
  // State variables
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hallPassRequests, setHallPassRequests] = useState(initialHallPassRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState(0);
  const [pinValue, setPinValue] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  
  // Disclosures
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const toast = useToast();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time only
  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate remaining time for an active hall pass
  const calculateRemainingTime = (toTime) => {
    const now = new Date();
    const expiry = new Date(toTime);
    const diffMs = expiry - now;
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  };

  // Calculate progress percentage
  const calculateProgress = (fromTime, toTime) => {
    const start = new Date(fromTime);
    const end = new Date(toTime);
    const now = new Date();
    
    // Total duration in ms
    const totalDuration = end - start;
    // Elapsed time in ms
    const elapsed = now - start;
    
    // Calculate percentage elapsed
    const percentElapsed = (elapsed / totalDuration) * 100;
    
    return Math.min(Math.max(0, percentElapsed), 100);
  };

  // Filter hall passes based on search term and active tab
  const filteredHallPasses = hallPassRequests.filter(pass => {
    const matchesSearch = 
      pass.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.id.includes(searchTerm) ||
      pass.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilterTab === 0) {
      // All passes
      return matchesSearch;
    } else if (activeFilterTab === 1) {
      // Pending passes
      return matchesSearch && pass.status === 'Pending';
    } else if (activeFilterTab === 2) {
      // Approved/Active passes
      return matchesSearch && pass.status === 'Approved';
    } else {
      // Completed passes
      return matchesSearch && pass.status === 'Completed';
    }
  });

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveFilterTab(index);
  };

  // Handle approve request
  const handleApprove = (passId) => {
    setHallPassRequests(prev => 
      prev.map(pass => 
        pass.id === passId ? { ...pass, status: 'Approved' } : pass
      )
    );
    
    toast({
      title: 'Hall Pass Approved',
      description: `You've approved the hall pass request.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle deny request
  const handleDeny = (passId) => {
    setHallPassRequests(prev => 
      prev.map(pass => 
        pass.id === passId ? { ...pass, status: 'Denied' } : pass
      )
    );
    
    toast({
      title: 'Hall Pass Denied',
      description: `You've denied the hall pass request.`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  // View student history
  const handleViewHistory = (student) => {
    setSelectedStudent(student);
    setStudentHistory(sampleStudentHistory[student.studentId] || []);
    onHistoryOpen();
  };

  // Handle pin code checking
  const handlePinChange = (value) => {
    setPinValue(value);
  };

  // Check hall pass code
  const handleCheck = () => {
    // Find pass with matching code
    const foundPass = hallPassRequests.find(pass => pass.id === pinValue);
    
    if (foundPass) {
      setSelectedStudent(foundPass);
      setStudentHistory(sampleStudentHistory[foundPass.studentId] || []);
      onDrawerOpen();
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

  return (
    <Flex>
      <InstructorSidebar />
      
      <Box
        ml="250px"
        width="calc(100% - 250px)"
        mt="85px"
        pb={8}
        px={6}
        position="relative"
        bg="gray.50"
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            {/* Header with Clock */}
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              bg="#640101" 
              color="white" 
              p={4} 
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading as="h1" size="xl">Hall Pass Management</Heading>
              <HStack spacing={4}>
                <Box 
                  bg="rgba(255,255,255,0.2)" 
                  p={3} 
                  borderRadius="md" 
                  textAlign="center"
                >
                  <Text fontSize="sm">Current Time</Text>
                  <Text fontSize="2xl" fontFamily="mono">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Text>
                  <Text fontSize="xs">{currentTime.toLocaleDateString()}</Text>
                </Box>
              </HStack>
            </Flex>
            
            {/* Hall Pass Code Verification Section */}
            <Card
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              bg="white"
            >
              <CardHeader
                bg="#f8f8f8"
                borderBottom="1px solid"
                borderColor="gray.200"
                p={4}
              >
                <Flex alignItems="center">
                  <FaIdCard size={24} color="#640101" />
                  <Heading size="md" ml={4} color="#640101">
                    Verify Hall Pass
                  </Heading>
                </Flex>
              </CardHeader>
              
              <CardBody p={6}>
                <Flex direction={{ base: "column", md: "row" }} align="center">
                  <Box textAlign="center" mb={{ base: 4, md: 0 }}>
                    <Text mb={4}>Enter the 6-digit hall pass code:</Text>
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
                      leftIcon={<FaIdCard />}
                      colorScheme="red"
                      bg="#640101"
                      size="lg"
                      px={10}
                      onClick={handleCheck}
                      isDisabled={pinValue.length !== 6}
                    >
                      Verify Pass
                    </Button>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
            
            {/* Hall Pass Requests List Section */}
            <Card
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              bg="white"
            >
              <CardHeader
                bg="#f8f8f8"
                borderBottom="1px solid"
                borderColor="gray.200"
                p={4}
              >
                <Flex 
                  direction={{ base: "column", md: "row" }} 
                  align={{ base: "stretch", md: "center" }}
                  justify="space-between"
                >
                  <Heading size="md" color="#640101" mb={{ base: 4, md: 0 }}>
                    Hall Pass Requests
                  </Heading>
                  
                  <InputGroup maxW={{ md: "300px" }}>
                    <InputLeftElement pointerEvents="none">
                      <FaSearch color="#640101" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderColor="gray.300"
                      _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                    />
                  </InputGroup>
                </Flex>
              </CardHeader>
              
              <Tabs colorScheme="red" onChange={handleTabChange}>
                <TabList px={4} pt={2}>
                  <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>All</Tab>
                  <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>Pending</Tab>
                  <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>Active</Tab>
                  <Tab _selected={{ color: "#640101", borderColor: "#640101" }}>Completed</Tab>
                </TabList>
                
                <TabPanels>
                  {[0, 1, 2, 3].map((tabIndex) => (
                    <TabPanel key={tabIndex} px={0} py={0}>
                      <Box overflowX="auto">
                        <Table variant="simple">
                          <Thead bg="gray.50">
                            <Tr>
                              <Th>Student</Th>
                              <Th>Time</Th>
                              <Th>Code</Th>
                              <Th>Destination</Th>
                              <Th>Reason</Th>
                              <Th>Status</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredHallPasses.length > 0 ? (
                              filteredHallPasses.map((pass) => (
                                <Tr key={pass.id}>
                                  <Td>
                                    <Flex align="center">
                                      <Avatar 
                                        size="sm" 
                                        src={pass.studentImage} 
                                        mr={2}
                                        name={pass.studentName}
                                      >
                                        {pass.status === 'Approved' && (
                                          <AvatarBadge boxSize="1em" bg="green.500" />
                                        )}
                                      </Avatar>
                                      <Box>
                                        <Text fontWeight="medium">{pass.studentName}</Text>
                                        <Text fontSize="xs" color="gray.500">{pass.studentId}</Text>
                                      </Box>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Text>{formatTime(pass.fromTime)} - {formatTime(pass.toTime)}</Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Request: {formatTime(pass.requestTime)}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme="red" p={1} borderRadius="md" fontFamily="mono" fontWeight="bold">
                                      {pass.id}
                                    </Badge>
                                  </Td>
                                  <Td>{pass.destination}</Td>
                                  <Td>{pass.reason}</Td>
                                  <Td>
                                    {pass.status === 'Pending' ? (
                                      <Badge colorScheme="yellow">Pending</Badge>
                                    ) : pass.status === 'Approved' ? (
                                      <Box>
                                        <Badge colorScheme="green" mb={1}>
                                          Active ({calculateRemainingTime(pass.toTime)} min left)
                                        </Badge>
                                        <Progress
                                          value={calculateProgress(pass.fromTime, pass.toTime)}
                                          size="xs"
                                          colorScheme="green"
                                          borderRadius="full"
                                        />
                                      </Box>
                                    ) : pass.status === 'Denied' ? (
                                      <Badge colorScheme="red">Denied</Badge>
                                    ) : (
                                      <Badge colorScheme="gray">Completed</Badge>
                                    )}
                                  </Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      {pass.status === 'Pending' && (
                                        <>
                                          <Tooltip label="Approve">
                                            <IconButton
                                              icon={<FaCheck />}
                                              size="sm"
                                              colorScheme="green"
                                              onClick={() => handleApprove(pass.id)}
                                              aria-label="Approve"
                                            />
                                          </Tooltip>
                                          <Tooltip label="Deny">
                                            <IconButton
                                              icon={<FaTimes />}
                                              size="sm"
                                              colorScheme="red"
                                              onClick={() => handleDeny(pass.id)}
                                              aria-label="Deny"
                                            />
                                          </Tooltip>
                                        </>
                                      )}
                                      <Tooltip label="View History">
                                        <IconButton
                                          icon={<FaHistory />}
                                          size="sm"
                                          colorScheme="blue"
                                          variant="outline"
                                          onClick={() => handleViewHistory(pass)}
                                          aria-label="View History"
                                        />
                                      </Tooltip>
                                    </HStack>
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
            </Card>
            
            {/* Notes Section */}
            <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
              <Heading size="sm" mb={3} color="#640101">Hall Pass Guidelines</Heading>
              <Text fontSize="sm" mb={2}>
                <Icon as={FaInfoCircle} mr={2} color="#640101" />
                Students can only have one active hall pass at a time.
              </Text>
              <Text fontSize="sm" mb={2}>
                <Icon as={FaInfoCircle} mr={2} color="#640101" />
                Hall passes are valid only for the time period specified.
              </Text>
              <Text fontSize="sm">
                <Icon as={FaInfoCircle} mr={2} color="#640101" />
                If a student violates hall pass policies, you can report it to the administration.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
      
      {/* Student Hall Pass History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={onHistoryClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white" borderTopRadius="md">
            Student Hall Pass History
          </ModalHeader>
          <ModalCloseButton color="white" />
          
          <ModalBody pb={6}>
            {selectedStudent && (
              <>
                <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Flex align="center" mb={4}>
                    <Avatar 
                      size="md" 
                      src={selectedStudent.studentImage} 
                      mr={4}
                      name={selectedStudent.studentName}
                    />
                    <Box>
                      <Heading size="md">{selectedStudent.studentName}</Heading>
                      <Text color="gray.600">{selectedStudent.studentId}</Text>
                    </Box>
                  </Flex>
                  
                  <Divider my={3} />
                  
                  <Text fontWeight="bold" mb={2}>Hall Pass History:</Text>
                  
                  {studentHistory.length > 0 ? (
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>Time</Th>
                          <Th>Destination</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {studentHistory.map((pass) => (
                          <Tr key={pass.id}>
                            <Td>{new Date(pass.fromTime).toLocaleDateString()}</Td>
                            <Td>{formatTime(pass.fromTime)} - {formatTime(pass.toTime)}</Td>
                            <Td>{pass.destination}</Td>
                            <Td>
                              <Badge 
                                colorScheme={
                                  pass.status === 'Completed' ? 'gray' : 
                                  pass.status === 'Approved' ? 'green' : 
                                  pass.status === 'Denied' ? 'red' : 'yellow'
                                }
                              >
                                {pass.status}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500">No hall pass history found.</Text>
                  )}
                </Box>
              </>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button onClick={onHistoryClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Hall Pass Verification Drawer */}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bg="#640101" color="white">Hall Pass Verification</DrawerHeader>
          
          <DrawerBody>
            {selectedStudent && (
              <VStack spacing={6} align="stretch" mt={4}>
                <Box p={6} borderWidth="1px" borderRadius="md" borderColor="#640101" position="relative">
                  <Badge 
                    position="absolute" 
                    top="-10px" 
                    right="10px" 
                    fontSize="0.8em" 
                    colorScheme={
                      selectedStudent.status === 'Pending' ? 'yellow' :
                      selectedStudent.status === 'Approved' ? 'green' :
                      selectedStudent.status === 'Denied' ? 'red' : 'gray'
                    }
                  >
                    {selectedStudent.status}
                  </Badge>
                  
                  <Flex direction="column" align="center" mb={6}>
                    <Avatar 
                      size="xl" 
                      src={selectedStudent.studentImage} 
                      name={selectedStudent.studentName} 
                      mb={3}
                    />
                    <Heading size="md" textAlign="center">{selectedStudent.studentName}</Heading>
                    <Text color="gray.600">{selectedStudent.studentId}</Text>
                  </Flex>
                  
                  <Divider my={3} />
                  
                  <Heading size="md" color="#640101" mb={3} textAlign="center">
                    Hall Pass Details
                  </Heading>
                  
                  <VStack align="start" spacing={3}>
                    <Flex width="100%">
                      <Box width="40%" fontWeight="bold">Pass Code:</Box>
                      <Box width="60%">
                        <Badge colorScheme="red" p={2} fontSize="lg">
                          {selectedStudent.id}
                        </Badge>
                      </Box>
                    </Flex>
                    
                    <Flex width="100%">
                      <Box width="40%" fontWeight="bold">Time:</Box>
                      <Box width="60%">
                        {formatTime(selectedStudent.fromTime)} - {formatTime(selectedStudent.toTime)}
                      </Box>
                    </Flex>
                    
                    <Flex width="100%">
                      <Box width="40%" fontWeight="bold">Destination:</Box>
                      <Box width="60%">{selectedStudent.destination}</Box>
                    </Flex>
                    
                    <Flex width="100%">
                      <Box width="40%" fontWeight="bold">Reason:</Box>
                      <Box width="60%">{selectedStudent.reason}</Box>
                    </Flex>
                    
                    <Flex width="100%">
                      <Box width="40%" fontWeight="bold">Class:</Box>
                      <Box width="60%">{selectedStudent.course}</Box>
                    </Flex>
                    
                    {selectedStudent.status === 'Approved' && (
                      <Box width="100%" mt={2}>
                        <Text fontWeight="bold" mb={1}>Time Remaining:</Text>
                        <Progress
                          value={calculateProgress(selectedStudent.fromTime, selectedStudent.toTime)}
                          size="md"
                          colorScheme="green"
                          borderRadius="full"
                          mb={1}
                        />
                        <Text textAlign="right" fontSize="sm">
                          {calculateRemainingTime(selectedStudent.toTime)} minutes left
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
                
                {/* Student History Summary */}
                <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Heading size="sm" mb={3}>Recent Hall Pass History</Heading>
                  
                  {studentHistory.length > 0 ? (
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>Destination</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {studentHistory.slice(0, 3).map((pass) => (
                          <Tr key={pass.id}>
                            <Td>{new Date(pass.fromTime).toLocaleDateString()}</Td>
                            <Td>{pass.destination}</Td>
                            <Td>
                              <Badge 
                                colorScheme={
                                  pass.status === 'Completed' ? 'gray' : 
                                  pass.status === 'Approved' ? 'green' : 
                                  pass.status === 'Denied' ? 'red' : 'yellow'
                                }
                              >
                                {pass.status}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500">No previous hall pass history.</Text>
                  )}
                  
                  <Button 
                    mt={3} 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<FaHistory />}
                    onClick={() => {
                      onDrawerClose();
                      onHistoryOpen();
                    }}
                  >
                    View Full History
                  </Button>
                </Box>
                
                {/* Action Buttons */}
                {selectedStudent.status === 'Pending' && (
                  <HStack mt={4} justify="center" spacing={6}>
                    <Button 
                      leftIcon={<FaTimes />} 
                      colorScheme="red" 
                      onClick={() => {
                        handleDeny(selectedStudent.id);
                        onDrawerClose();
                      }}
                    >
                      Deny Pass
                    </Button>
                    <Button 
                      leftIcon={<FaCheck />} 
                      colorScheme="green"
                      onClick={() => {
                        handleApprove(selectedStudent.id);
                        onDrawerClose();
                      }}
                    >
                      Approve Pass
                    </Button>
                  </HStack>
                )}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default InstructorHallPass; 