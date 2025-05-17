import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Icon,
  HStack,
  useColorModeValue,
  Tooltip,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { 
  FaCalendarAlt, 
  FaVideo, 
  FaClock, 
  FaMapMarkerAlt, 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaBook,
  FaFilePdf,
  FaEdit
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

// Sample data for upcoming instructor sessions
const scheduleData = [
  {
    id: 1,
    course: 'Web Development',
    students: 12,
    date: '2024-03-15',
    time: '14:00 - 15:30',
    type: 'Online',
    room: 'Virtual Room 1',
    status: 'Upcoming'
  },
  {
    id: 2,
    course: 'Web Development',
    students: 12,
    date: '2024-03-17',
    time: '10:00 - 11:30',
    type: 'In-Person',
    room: 'Room 204',
    status: 'Confirmed'
  },
  {
    id: 3,
    course: 'Advanced React',
    students: 8,
    date: '2024-03-18',
    time: '16:00 - 17:30',
    type: 'Online',
    room: 'Virtual Room 2',
    status: 'Upcoming'
  }
];

// Weekly timetable data
const timeSlots = [
  { id: 1, time: '08:00-09:30' },
  { id: 2, time: '09:45-11:15' },
  { id: 3, time: '11:30-13:00' },
  { id: 4, time: '14:00-15:30' },
  { id: 5, time: '15:45-17:15' }
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Institution name (would normally come from context or API)
const INSTITUTION_NAME = "Springfield Academy";

// Current instructor name (would normally come from auth context)
const CURRENT_INSTRUCTOR = 'John Smith';

// Instructor's personalized timetable - only shows their own courses
const timetableData = {
  'Monday': {
    3: {
      course: 'Web Development',
      students: 12,
      room: 'Lab 101',
      type: 'Lab',
      color: 'green'
    }
  },
  'Tuesday': {},
  'Wednesday': {
    1: {
      course: 'Web Development',
      students: 12,
      room: 'Room 201',
      type: 'Lecture',
      color: 'green'
    },
    5: {
      course: 'Advanced React',
      students: 8,
      room: 'Lab 103',
      type: 'Lab',
      color: 'blue'
    }
  },
  'Thursday': {},
  'Friday': {
    3: {
      course: 'Advanced React',
      students: 8,
      room: 'Room 304',
      type: 'Lecture',
      color: 'blue'
    }
  }
};

// Function to get class badge color
const getClassTypeColor = (type) => {
  const types = {
    'Lecture': 'blue',
    'Lab': 'green',
    'Tutorial': 'purple',
    'Seminar': 'orange',
    'Practical': 'red',
    'Discussion': 'teal'
  };
  return types[type] || 'gray';
};

const InstructorTimeTable = () => {
  const [schedule, setSchedule] = useState(scheduleData);
  const accentColor = useColorModeValue('#640101', 'red.200');
  const headerBgColor = useColorModeValue(`${accentColor}10`, 'gray.700');
  const borderColor = useColorModeValue(`${accentColor}20`, 'gray.600');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // State for update request modal
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [requestReason, setRequestReason] = useState("");

  // Extract unique courses from the timetable data
  const extractInstructorCourses = () => {
    const courses = new Set();
    
    Object.values(timetableData).forEach(dayData => {
      Object.values(dayData).forEach(slot => {
        if (slot && slot.course) {
          courses.add(slot.course);
        }
      });
    });
    
    return Array.from(courses);
  };

  const instructorCourses = extractInstructorCourses();

  // Create week options
  const weekOptions = [
    { id: 1, label: "Week 1" },
    { id: 2, label: "Week 2" },
    { id: 3, label: "Week 3" },
    { id: 4, label: "Week 4" }
  ];

  // Class type options
  const classTypeOptions = [
    { id: "lecture", label: "Lecture" },
    { id: "lab", label: "Lab" }
  ];

  // Function to download timetable as PDF
  const downloadTimetablePDF = () => {
    // In a real app, this would generate a PDF
    alert('Downloading your timetable as PDF');
  };
  
  // Function to handle request submission
  const handleSubmitRequest = () => {
    // In a real app, this would send the request to the backend
    if (!selectedTimeSlot || !requestReason.trim() || !selectedCourse || !selectedWeek || !selectedClassType) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: "Request submitted",
      description: `Your timetable update request for ${selectedCourse} (${selectedClassType}) has been sent to ${INSTITUTION_NAME}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // Reset form and close modal
    setSelectedTimeSlot("");
    setSelectedCourse("");
    setSelectedWeek("");
    setSelectedClassType("");
    setRequestReason("");
    onClose();
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
        bg="linear-gradient(135deg, #f5f7fa 0%, #f5f7fa 100%)"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Header Section */}
            <Flex 
              alignItems="center" 
              justifyContent="space-between" 
              bg="#640101" 
              color="white" 
              p={4} 
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading as="h1" size="xl">My Time Table</Heading>
              <Flex alignItems="center">
                <FaCalendarAlt size="24px" style={{ marginRight: '10px' }} />
                <Text fontSize="lg">Instructor Schedule</Text>
              </Flex>
            </Flex>
            
            {/* Action Buttons */}
            <Flex justifyContent="flex-end" gap={4}>
              <Button
                leftIcon={<FaEdit />}
                colorScheme="blue"
                onClick={onOpen}
                size="md"
              >
                Request to update time table
              </Button>
              <Button
                leftIcon={<FaFilePdf />}
                colorScheme="red"
                bg="#640101"
                onClick={downloadTimetablePDF}
                size="md"
              >
                Download Schedule PDF
              </Button>
            </Flex>
            
            {/* Upcoming Sessions Section */}
            <TableContainer 
              bg="white" 
              borderRadius="lg" 
              boxShadow="xl"
              overflow="hidden"
            >
              <Heading size="md" p={4} bg="#f1f1f1" color="#640101">
                Upcoming Teaching Sessions
              </Heading>
              <Table variant="unstyled">
                <Thead bg="#640101" color="white">
                  <Tr>
                    {['Course', 'Students', 'Date', 'Time', 'Type', 'Room', 'Status'].map((header) => (
                      <Th 
                        key={header} 
                        color="white" 
                        textTransform="uppercase" 
                        letterSpacing="wider"
                        fontWeight="bold"
                      >
                        {header}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {schedule.map((session, index) => (
                    <Tr 
                      key={session.id} 
                      bg={index % 2 === 0 ? 'gray.50' : 'white'}
                      _hover={{ 
                        bg: 'rgba(100, 1, 1, 0.05)', 
                        transform: 'translateX(10px)',
                        transition: 'all 0.3s ease' 
                      }}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      <Td>
                        <Flex alignItems="center">
                          <Box 
                            w="10px" 
                            h="10px" 
                            bg="#640101" 
                            borderRadius="full" 
                            mr={3} 
                          />
                          <Text fontWeight="semibold" color="gray.700">
                            {session.course}
                          </Text>
                        </Flex>
                      </Td>
                      <Td color="gray.600">{session.students}</Td>
                      <Td>
                        <Flex alignItems="center" color="gray.700">
                          <FaCalendarAlt 
                            style={{ 
                              marginRight: '8px', 
                              color: '#640101' 
                            }} 
                          />
                          {session.date}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex alignItems="center" color="gray.700">
                          <FaClock 
                            style={{ 
                              marginRight: '8px', 
                              color: '#640101' 
                            }} 
                          />
                          {session.time}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex alignItems="center" color="gray.700">
                          <FaVideo 
                            style={{ 
                              marginRight: '8px', 
                              color: '#640101' 
                            }} 
                          />
                          {session.type}
                        </Flex>
                      </Td>
                      <Td color="gray.600">
                        <Flex alignItems="center">
                          <FaMapMarkerAlt 
                            style={{ 
                              marginRight: '8px', 
                              color: '#640101' 
                            }} 
                          />
                          {session.room}
                        </Flex>
                      </Td>
                      <Td>
                        <Badge 
                          bg={
                            session.status === 'Confirmed' ? '#640101' : 
                            session.status === 'Upcoming' ? '#640101' : 
                            'gray.500'
                          }
                          color="white"
                          variant="solid"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {session.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Weekly Timetable Section */}
            <Card 
              borderRadius="lg" 
              boxShadow="xl" 
              bg="white" 
              overflow="hidden" 
              mt={8}
            >
              <CardHeader 
                bg="#640101" 
                color="white" 
                py={4} 
                px={6}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex alignItems="center">
                    <Icon as={FaCalendarAlt} boxSize={5} mr={3} />
                    <Heading as="h2" size="lg">My Weekly Teaching Schedule</Heading>
                  </Flex>
                  <Text>Spring Semester 2024</Text>
                </Flex>
              </CardHeader>
              
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="md">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th width="12%" color="gray.600">Time</Th>
                        {weekdays.map(day => (
                          <Th key={day} textAlign="center" color="gray.600">{day}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {timeSlots.map(slot => (
                        <Tr key={slot.id}>
                          <Td 
                            fontWeight="medium" 
                            color="#640101" 
                            bg="gray.50"
                          >
                            <Flex alignItems="center">
                              <Icon as={FaClock} mr={2} color="#640101" />
                              {slot.time}
                            </Flex>
                          </Td>
                          
                          {weekdays.map(day => {
                            const classData = timetableData[day] && timetableData[day][slot.id];
                            
                            return (
                              <Td key={`${day}-${slot.id}`} p={2}>
                                {classData ? (
                                  <Tooltip 
                                    hasArrow 
                                    label={`${classData.course} - ${classData.type} with ${classData.students} students`} 
                                    placement="top"
                                  >
                                    <Box 
                                      p={3} 
                                      borderRadius="md" 
                                      bg={`${classData.color}.50`}
                                      borderLeft="4px solid" 
                                      borderColor={`${classData.color}.500`}
                                      boxShadow="sm"
                                      _hover={{
                                        transform: 'scale(1.02)',
                                        boxShadow: 'md',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <Text fontWeight="bold" fontSize="sm" color={`${classData.color}.700`}>
                                        {classData.course}
                                      </Text>
                                      
                                      <Divider my={1} borderColor={`${classData.color}.200`} />
                                      
                                      <HStack fontSize="xs" color="gray.600" mt={1}>
                                        <Flex align="center">
                                          <Icon as={FaUserGraduate} mr={1} />
                                          <Text>{classData.students} students</Text>
                                        </Flex>
                                      </HStack>
                                      
                                      <HStack fontSize="xs" color="gray.600" mt={1}>
                                        <Flex align="center">
                                          <Icon as={FaMapMarkerAlt} mr={1} />
                                          <Text>{classData.room}</Text>
                                        </Flex>
                                        
                                        <Badge 
                                          size="sm" 
                                          colorScheme={getClassTypeColor(classData.type)} 
                                          ml="auto"
                                        >
                                          {classData.type}
                                        </Badge>
                                      </HStack>
                                    </Box>
                                  </Tooltip>
                                ) : (
                                  <Box 
                                    h="100%" 
                                    w="100%" 
                                    minH="80px" 
                                    borderRadius="md" 
                                    bg="gray.50" 
                                    border="1px dashed" 
                                    borderColor="gray.200"
                                  />
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
      
      {/* Update Request Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">Request Timetable Update</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <Text mb={4}>
              I want to make a request to <Text as="span" fontWeight="bold">{INSTITUTION_NAME}</Text>
            </Text>
            
            <FormControl mb={4}>
              <FormLabel>Course</FormLabel>
              <Select 
                placeholder="Select course to update" 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {instructorCourses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Week</FormLabel>
              <Select 
                placeholder="Select designated week" 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                {weekOptions.map(week => (
                  <option key={week.id} value={week.id}>
                    {week.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Class Type</FormLabel>
              <Select 
                placeholder="Select class type" 
                value={selectedClassType}
                onChange={(e) => setSelectedClassType(e.target.value)}
              >
                {classTypeOptions.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Time</FormLabel>
              <Select 
                placeholder="Select time slot" 
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.time}>
                    {slot.time}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Reason</FormLabel>
              <Textarea 
                placeholder="Please explain why you need a timetable update"
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                rows={4}
              />
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              colorScheme="red" 
              bg="#640101" 
              onClick={handleSubmitRequest}
              mr={3}
            >
              Request
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default InstructorTimeTable; 