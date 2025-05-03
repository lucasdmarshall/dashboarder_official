import React, { useState } from 'react';
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
  Divider
} from '@chakra-ui/react';
import { FaCalendarAlt, FaVideo, FaClock, FaMapMarkerAlt, FaChalkboardTeacher, FaUserGraduate, FaBook } from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

// Sample data for upcoming sessions
const scheduleData = [
  {
    id: 1,
    course: 'Machine Learning',
    instructor: 'Elena Rodriguez',
    date: '2024-03-15',
    time: '14:00 - 15:30',
    type: 'Online',
    status: 'Upcoming'
  },
  {
    id: 2,
    course: 'Web Development',
    instructor: 'John Smith',
    date: '2024-03-16',
    time: '10:00 - 11:30',
    type: 'In-Person',
    status: 'Confirmed'
  },
  {
    id: 3,
    course: 'Data Science',
    instructor: 'Sarah Chen',
    date: '2024-03-17',
    time: '16:00 - 17:30',
    type: 'Online',
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

// Student's personalized timetable
const timetableData = {
  'Monday': {
    1: {
      course: 'Advanced Algorithms',
      instructor: 'Dr. Michael Davis',
      room: 'Room 205',
      type: 'Lecture',
      color: 'blue'
    },
    3: {
      course: 'Web Development',
      instructor: 'John Smith',
      room: 'Lab 101',
      type: 'Lab',
      color: 'green'
    },
    5: {
      course: 'Research Methods',
      instructor: 'Prof. Adam Jones',
      room: 'Room 304',
      type: 'Seminar',
      color: 'purple'
    }
  },
  'Tuesday': {
    2: {
      course: 'Data Science',
      instructor: 'Sarah Chen',
      room: 'Room 202',
      type: 'Lecture',
      color: 'orange'
    },
    4: {
      course: 'Machine Learning',
      instructor: 'Elena Rodriguez',
      room: 'Lab 105',
      type: 'Practical',
      color: 'red'
    }
  },
  'Wednesday': {
    1: {
      course: 'Web Development',
      instructor: 'John Smith',
      room: 'Room 201',
      type: 'Lecture',
      color: 'green'
    },
    3: {
      course: 'Cloud Computing',
      instructor: 'Dr. Amelia Patel',
      room: 'Lab 103',
      type: 'Lab',
      color: 'teal'
    }
  },
  'Thursday': {
    2: {
      course: 'Machine Learning',
      instructor: 'Elena Rodriguez',
      room: 'Room 204',
      type: 'Lecture',
      color: 'red'
    },
    4: {
      course: 'Advanced Algorithms',
      instructor: 'Dr. Michael Davis',
      room: 'Room 205',
      type: 'Tutorial',
      color: 'blue'
    }
  },
  'Friday': {
    1: {
      course: 'Data Science',
      instructor: 'Sarah Chen',
      room: 'Lab 102',
      type: 'Lab',
      color: 'orange'
    },
    3: {
      course: 'Research Methods',
      instructor: 'Prof. Adam Jones',
      room: 'Room 304',
      type: 'Discussion',
      color: 'purple'
    },
    5: {
      course: 'Cloud Computing',
      instructor: 'Dr. Amelia Patel',
      room: 'Room 203',
      type: 'Lecture',
      color: 'teal'
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

const StudentSchedule = () => {
  const [schedule, setSchedule] = useState(scheduleData);
  const accentColor = useColorModeValue('#640101', 'red.200');
  const headerBgColor = useColorModeValue(`${accentColor}10`, 'gray.700');
  const borderColor = useColorModeValue(`${accentColor}20`, 'gray.600');

  return (
    <Flex>
      <StudentSidebar />
      
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
            {/* Upcoming Sessions Section */}
            <Flex 
              alignItems="center" 
              justifyContent="space-between" 
              bg="#640101" 
              color="white" 
              p={4} 
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading as="h1" size="xl">My Schedule</Heading>
              <Flex alignItems="center">
                <FaCalendarAlt size="24px" style={{ marginRight: '10px' }} />
                <Text fontSize="lg">Upcoming Sessions</Text>
              </Flex>
            </Flex>
            
            <TableContainer 
              bg="white" 
              borderRadius="lg" 
              boxShadow="xl"
              overflow="hidden"
            >
              <Table variant="unstyled">
                <Thead bg="#640101" color="white">
                  <Tr>
                    {['Course', 'Instructor', 'Date', 'Time', 'Type', 'Status'].map((header) => (
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
                      <Td color="gray.600">{session.instructor}</Td>
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
                    <Heading as="h2" size="lg">My Weekly Timetable</Heading>
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
                                    label={`${classData.course} - ${classData.type} with ${classData.instructor}`} 
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
                                          <Icon as={FaChalkboardTeacher} mr={1} />
                                          <Text noOfLines={1}>{classData.instructor}</Text>
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
    </Flex>
  );
};

export default StudentSchedule;
