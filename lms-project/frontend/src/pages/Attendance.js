import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Badge,
  useToast,
  Divider,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  Stack,
  Switch,
  FormControl,
  FormLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { 
  FaUserCheck, 
  FaCalendarAlt, 
  FaSearch, 
  FaGraduationCap,
  FaChalkboard,
  FaBook,
  FaUser,
  FaBell,
  FaSave,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';
import { format } from 'date-fns';

// Sample data structure for grades, classes, and courses
const gradesData = [
  { 
    id: 1, 
    name: 'Grade 1', 
    classes: [
      { 
        id: 1, 
        name: 'Class 1A', 
        courses: [
          { 
            id: 1, 
            name: 'Mathematics', 
            instructor: 'Dr. Johnson'
          },
          { 
            id: 2, 
            name: 'Science', 
            instructor: 'Prof. Smith'
          }
        ]
      },
      { 
        id: 2, 
        name: 'Class 1B', 
        courses: [
          { 
            id: 3, 
            name: 'Mathematics', 
            instructor: 'Dr. Peterson'
          }
        ]
      }
    ]
  },
  { 
    id: 2, 
    name: 'Grade 2', 
    classes: [
      { 
        id: 3, 
        name: 'Class 2A', 
        courses: [
          { 
            id: 4, 
            name: 'Mathematics', 
            instructor: 'Dr. Williams'
          },
          { 
            id: 5, 
            name: 'History', 
            instructor: 'Prof. Adams'
          }
        ]
      }
    ]
  }
];

// Sample student data
const studentsData = [
  { id: "ST001", name: "John Doe", email: "john.doe@example.com", parentEmail: "parent.doe@example.com", parentName: "Mr. & Mrs. Doe" },
  { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", parentEmail: "parent.smith@example.com", parentName: "Mr. & Mrs. Smith" },
  { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", parentEmail: "parent.johnson@example.com", parentName: "Mr. & Mrs. Johnson" },
  { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", parentEmail: "parent.williams@example.com", parentName: "Mr. & Mrs. Williams" },
  { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", parentEmail: "parent.brown@example.com", parentName: "Mr. & Mrs. Brown" },
  { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", parentEmail: "parent.davis@example.com", parentName: "Mr. & Mrs. Davis" },
  { id: "ST007", name: "James Miller", email: "james.m@example.com", parentEmail: "parent.miller@example.com", parentName: "Mr. & Mrs. Miller" },
  { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", parentEmail: "parent.wilson@example.com", parentName: "Mr. & Mrs. Wilson" }
];

// Generate class enrollment data (which students are in each course)
const classEnrollmentData = {
  1: ["ST001", "ST003", "ST006"], // Class 1A Mathematics
  2: ["ST001", "ST006"], // Class 1A Science
  3: ["ST002", "ST005"], // Class 1B Mathematics
  4: ["ST004", "ST007"], // Class 2A Mathematics
  5: ["ST004", "ST007", "ST008"] // Class 2A History
};

const Attendance = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Selection state
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Attendance state
  const [attendanceData, setAttendanceData] = useState({});
  const [studentsInCourse, setStudentsInCourse] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    autoNotify: true,
    includeCourseMaterial: true,
    includeUpcomingAssignments: true
  });
  
  // Load attendance data for the selected date
  useEffect(() => {
    if (selectedCourse) {
      // In a real app, you would fetch this from the server based on the date and course
      // For demo, we'll use empty attendance (all present by default)
      const courseStudents = (classEnrollmentData[selectedCourse.id] || [])
        .map(studentId => {
          const student = studentsData.find(s => s.id === studentId);
          return { 
            ...student, 
            isPresent: true,
            isLate: false,
            note: ''
          };
        });
      setStudentsInCourse(courseStudents);
      
      // Reset absent students list
      setAbsentStudents([]);
    }
  }, [selectedCourse, currentDate]);
  
  // Handle grade selection
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass(null);
    setSelectedCourse(null);
    setStudentsInCourse([]);
  };
  
  // Handle class selection
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSelectedCourse(null);
    setStudentsInCourse([]);
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };
  
  // Toggle attendance (present/absent)
  const toggleAttendance = (studentId) => {
    setStudentsInCourse(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === studentId) {
          // If changing from present to absent, add to absent list
          if (student.isPresent) {
            setAbsentStudents(prev => [...prev, student]);
          } else {
            // If changing from absent to present, remove from absent list
            setAbsentStudents(prev => prev.filter(s => s.id !== studentId));
          }
          
          return { 
            ...student, 
            isPresent: !student.isPresent,
            // Reset late status if marking as present
            isLate: !student.isPresent ? false : student.isLate
          };
        }
        return student;
      });
    });
  };
  
  // Toggle late status
  const toggleLateStatus = (studentId) => {
    setStudentsInCourse(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === studentId) {
          return { ...student, isLate: !student.isLate };
        }
        return student;
      });
    });
  };
  
  // Update student note
  const updateStudentNote = (studentId, note) => {
    setStudentsInCourse(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === studentId) {
          return { ...student, note };
        }
        return student;
      });
    });
  };
  
  // Save attendance data
  const handleSaveAttendance = () => {
    // In a real app, you would save this to the server
    toast({
      title: "Attendance saved",
      description: `Attendance for ${selectedCourse.name} on ${currentDate} has been saved.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // If auto-notify is enabled and there are absent students, open the notification modal
    if (notificationSettings.autoNotify && absentStudents.length > 0) {
      onOpen();
    }
  };
  
  // Send notifications to parents
  const sendNotifications = () => {
    // In a real app, this would send emails/notifications to parents
    toast({
      title: "Notifications sent",
      description: `Notifications sent to parents of ${absentStudents.length} absent student(s).`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };
  
  // Calculate attendance statistics
  const calculateStats = () => {
    if (!studentsInCourse.length) return { present: 0, absent: 0, late: 0 };
    
    const present = studentsInCourse.filter(s => s.isPresent).length;
    const absent = studentsInCourse.length - present;
    const late = studentsInCourse.filter(s => s.isLate).length;
    
    return {
      present,
      absent,
      late,
      presentPercentage: Math.round((present / studentsInCourse.length) * 100),
      absentPercentage: Math.round((absent / studentsInCourse.length) * 100),
      latePercentage: Math.round((late / studentsInCourse.length) * 100)
    };
  };
  
  const stats = calculateStats();

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16}>
      <Container maxW="container.xl" px={6}>
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
              <Icon as={FaUserCheck} mr={3} />
              Attendance Management
            </Heading>
            
            <Input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              width="auto"
              colorScheme="red"
            />
          </Flex>
          
          <Text color="gray.600">Track and manage student attendance with automatic parent notifications.</Text>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {/* Grade Selection Column */}
            <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
              <Heading size="md" mb={4} color="#640101">
                <Flex align="center">
                  <Icon as={FaGraduationCap} mr={2} />
                  Grades
                </Flex>
              </Heading>
              <VStack spacing={2} align="stretch">
                {gradesData.map(grade => (
                  <Button
                    key={grade.id}
                    variant={selectedGrade?.id === grade.id ? "solid" : "outline"}
                    colorScheme={selectedGrade?.id === grade.id ? "red" : "gray"}
                    justifyContent="flex-start"
                    onClick={() => handleGradeSelect(grade)}
                    size="sm"
                    width="100%"
                  >
                    {grade.name}
                  </Button>
                ))}
              </VStack>
            </Box>
            
            {/* Class Selection Column */}
            <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
              <Heading size="md" mb={4} color="#640101">
                <Flex align="center">
                  <Icon as={FaChalkboard} mr={2} />
                  Classes
                </Flex>
              </Heading>
              {selectedGrade ? (
                <VStack spacing={2} align="stretch">
                  {selectedGrade.classes.map(classItem => (
                    <Button
                      key={classItem.id}
                      variant={selectedClass?.id === classItem.id ? "solid" : "outline"}
                      colorScheme={selectedClass?.id === classItem.id ? "red" : "gray"}
                      justifyContent="flex-start"
                      onClick={() => handleClassSelect(classItem)}
                      size="sm"
                      width="100%"
                    >
                      {classItem.name}
                    </Button>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">Please select a grade first</Text>
              )}
            </Box>
            
            {/* Course Selection Column */}
            <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
              <Heading size="md" mb={4} color="#640101">
                <Flex align="center">
                  <Icon as={FaBook} mr={2} />
                  Courses
                </Flex>
              </Heading>
              {selectedClass ? (
                <VStack spacing={2} align="stretch">
                  {selectedClass.courses.map(course => (
                    <Button
                      key={course.id}
                      variant={selectedCourse?.id === course.id ? "solid" : "outline"}
                      colorScheme={selectedCourse?.id === course.id ? "red" : "gray"}
                      justifyContent="flex-start"
                      onClick={() => handleCourseSelect(course)}
                      size="sm"
                      width="100%"
                    >
                      {course.name}
                    </Button>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">Please select a class first</Text>
              )}
            </Box>
            
            {/* Attendance Stats Column */}
            <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content" bg="gray.50">
              <Heading size="md" mb={4} color="#640101">
                <Flex align="center">
                  <Icon as={FaCalendarAlt} mr={2} />
                  Attendance Stats
                </Flex>
              </Heading>
              {selectedCourse ? (
                <VStack spacing={3} align="stretch">
                  <Flex justify="space-between">
                    <Text>Present:</Text>
                    <Badge colorScheme="green" fontSize="sm">
                      {stats.present} ({stats.presentPercentage}%)
                    </Badge>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Absent:</Text>
                    <Badge colorScheme="red" fontSize="sm">
                      {stats.absent} ({stats.absentPercentage}%)
                    </Badge>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Late:</Text>
                    <Badge colorScheme="yellow" fontSize="sm">
                      {stats.late} ({stats.latePercentage}%)
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex justify="space-between">
                    <Text>Total:</Text>
                    <Badge colorScheme="blue" fontSize="sm">
                      {studentsInCourse.length} students
                    </Badge>
                  </Flex>
                </VStack>
              ) : (
                <Text color="gray.500">Select a course to view stats</Text>
              )}
            </Box>
          </SimpleGrid>
          
          {/* Attendance Grid */}
          {selectedCourse && (
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mt={6}>
              <Flex justifyContent="space-between" alignItems="center" bg="gray.50" p={4} borderBottomWidth="1px">
                <Heading size="md" color="#640101">
                  {selectedCourse.name} - {selectedClass.name} Attendance for {currentDate}
                </Heading>
                <HStack>
                  <Button
                    leftIcon={<FaSave />}
                    colorScheme="red"
                    bg="#640101"
                    onClick={handleSaveAttendance}
                    disabled={!studentsInCourse.length}
                  >
                    Save Attendance
                  </Button>
                </HStack>
              </Flex>
              
              {studentsInCourse.length > 0 ? (
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Student ID</Th>
                      <Th>Name</Th>
                      <Th textAlign="center">Present</Th>
                      <Th textAlign="center">Late</Th>
                      <Th>Notes</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {studentsInCourse.map(student => (
                      <Tr key={student.id} bg={!student.isPresent ? "red.50" : (student.isLate ? "yellow.50" : undefined)}>
                        <Td>{student.id}</Td>
                        <Td>{student.name}</Td>
                        <Td textAlign="center">
                          <Checkbox 
                            colorScheme="green" 
                            isChecked={student.isPresent}
                            onChange={() => toggleAttendance(student.id)}
                            size="lg"
                          />
                        </Td>
                        <Td textAlign="center">
                          <Checkbox 
                            colorScheme="yellow" 
                            isChecked={student.isLate}
                            onChange={() => toggleLateStatus(student.id)}
                            isDisabled={!student.isPresent}
                            size="lg"
                          />
                        </Td>
                        <Td>
                          <Input 
                            value={student.note || ''} 
                            onChange={(e) => updateStudentNote(student.id, e.target.value)}
                            placeholder="Add notes..."
                            size="sm"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Box p={8} textAlign="center">
                  <Text color="gray.500">No students enrolled in this course</Text>
                </Box>
              )}
            </Box>
          )}
          
          {/* Notification Settings */}
          <Box borderWidth="1px" borderRadius="lg" p={4} mt={4}>
            <Accordion allowToggle>
              <AccordionItem border="none">
                <h2>
                  <AccordionButton _expanded={{ bg: "gray.100" }}>
                    <Box flex="1" textAlign="left">
                      <Heading size="md" color="#640101">
                        <Flex align="center">
                          <Icon as={FaBell} mr={2} />
                          Notification Settings
                        </Flex>
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="auto-notify" mb="0">
                        Automatically notify parents of absent students
                      </FormLabel>
                      <Switch 
                        id="auto-notify" 
                        colorScheme="red" 
                        isChecked={notificationSettings.autoNotify}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          autoNotify: !prev.autoNotify
                        }))}
                      />
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="include-course-material" mb="0">
                        Include course material in notification
                      </FormLabel>
                      <Switch 
                        id="include-course-material" 
                        colorScheme="red" 
                        isChecked={notificationSettings.includeCourseMaterial}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          includeCourseMaterial: !prev.includeCourseMaterial
                        }))}
                      />
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="include-assignments" mb="0">
                        Include upcoming assignments in notification
                      </FormLabel>
                      <Switch 
                        id="include-assignments" 
                        colorScheme="red" 
                        isChecked={notificationSettings.includeUpcomingAssignments}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          includeUpcomingAssignments: !prev.includeUpcomingAssignments
                        }))}
                      />
                    </FormControl>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </VStack>
      </Container>
      
      {/* Notification Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">
            Send Absence Notifications
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            <Alert status="info" mb={4}>
              <AlertIcon />
              Notifications will be sent to parents of {absentStudents.length} absent student(s)
            </Alert>
            
            <Stack spacing={4}>
              {absentStudents.map(student => (
                <Box key={student.id} p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">{student.name} (ID: {student.id})</Text>
                  <Text>Parent: {student.parentName}</Text>
                  <Text>Email: {student.parentEmail}</Text>
                  {student.note && (
                    <Text mt={2}>Note: {student.note}</Text>
                  )}
                </Box>
              ))}
            </Stack>
            
            <Box mt={4} p={3} bg="gray.50" borderRadius="md">
              <Heading size="sm" mb={2}>Notification Template</Heading>
              <Text fontStyle="italic">
                Subject: Absence Notification of [Student Name]<br /><br />
                
                Dear [Parent's Name],<br /><br />
                
                We would like to inform that [Student Name] was absent for {selectedCourse?.name} on {currentDate} without prior notice. Kindly let us know if there are any concerns.<br /><br />
                
                {notificationSettings.includeCourseMaterial && 
                  "Today's course material has been attached to this email so your child can catch up on the missed content.\n\n"}
                  
                {notificationSettings.includeUpcomingAssignments && 
                  "Please note that there is an upcoming assignment due on [Assignment Date].\n\n"}
                
                Best Regards,<br />
                [School Institution Name]
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              bg="#640101"
              onClick={sendNotifications}
              leftIcon={<FaBell />}
            >
              Send Notifications
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Attendance; 