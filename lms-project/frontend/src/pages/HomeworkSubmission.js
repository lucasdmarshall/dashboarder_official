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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Divider,
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
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
} from '@chakra-ui/react';
import { 
  FaTasks, 
  FaFileUpload,
  FaClock,
  FaBell,
  FaCalendarAlt,
  FaUserGraduate,
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaPlus,
  FaPaperclip,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

// Sample data for grades and classes (reusing existing data structure)
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
            instructor: 'Dr. Johnson',
            credits: 4
          },
          { 
            id: 2, 
            name: 'Science', 
            instructor: 'Prof. Smith',
            credits: 4
          },
          { 
            id: 3, 
            name: 'English',
            instructor: 'Ms. Williams',
            credits: 3
          }
        ]
      },
      { 
        id: 2, 
        name: 'Class 1B', 
        courses: [
          { 
            id: 4, 
            name: 'Mathematics', 
            instructor: 'Dr. Peterson',
            credits: 4
          },
          { 
            id: 5, 
            name: 'Science',
            instructor: 'Dr. Brown',
            credits: 4
          },
          { 
            id: 6, 
            name: 'History',
            instructor: 'Prof. Adams',
            credits: 3
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
            id: 7, 
            name: 'Mathematics', 
            instructor: 'Dr. Thomas',
            credits: 4
          },
          { 
            id: 8, 
            name: 'Science',
            instructor: 'Prof. Garcia',
            credits: 4
          },
          { 
            id: 9, 
            name: 'Geography',
            instructor: 'Ms. Martinez',
            credits: 3
          }
        ]
      }
    ]
  }
];

// Sample student data
const studentsData = [
  { 
    id: "ST001", 
    name: "John Doe", 
    email: "john.doe@example.com", 
    parentEmail: "parent.doe@example.com", 
    parentName: "Mr. & Mrs. Doe"
  },
  { 
    id: "ST002", 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    parentEmail: "parent.smith@example.com",
    parentName: "Mr. & Mrs. Smith"
  },
  { 
    id: "ST003", 
    name: "Michael Johnson", 
    email: "michael.j@example.com", 
    parentEmail: "parent.johnson@example.com",
    parentName: "Mr. & Mrs. Johnson"
  },
  { 
    id: "ST004", 
    name: "Emily Williams", 
    email: "emily.w@example.com", 
    parentEmail: "parent.williams@example.com",
    parentName: "Mr. & Mrs. Williams"
  }
];

// Generate class enrollment data (which students are in which class)
const classEnrollmentData = {
  1: ["ST001", "ST003"], // Class 1A
  2: ["ST002"],          // Class 1B
  3: ["ST004"]           // Class 2A
};

// Sample homework assignments data
const homeworkAssignmentsData = [
  {
    id: "HW001",
    title: "Mathematics Problem Set #1",
    description: "Complete problems 1-20 in Chapter 3",
    courseId: 1,
    dueDate: "2023-11-20T23:59:00",
    dateAssigned: "2023-11-10T09:00:00",
    maxPoints: 100,
    notifyParents: true,
    reminderDays: 2,
    attachments: ["Math_Chapter3_Problems.pdf"],
    submissions: [
      {
        studentId: "ST001",
        submissionDate: "2023-11-18T14:30:00",
        status: "Submitted",
        grade: 90,
        files: ["john_math_hw1.pdf"],
        feedback: "Excellent work! Just a small error in problem 15."
      },
      {
        studentId: "ST003",
        submissionDate: "2023-11-19T21:45:00",
        status: "Submitted",
        grade: 75,
        files: ["michael_math_hw1.pdf"],
        feedback: "Good effort, but several calculation errors. Please review your work more carefully."
      }
    ]
  },
  {
    id: "HW002",
    title: "Science Lab Report",
    description: "Write a lab report on the photosynthesis experiment",
    courseId: 2,
    dueDate: "2023-11-25T23:59:00",
    dateAssigned: "2023-11-12T10:30:00",
    maxPoints: 50,
    notifyParents: true,
    reminderDays: 3,
    attachments: ["Lab_Report_Template.docx", "Photosynthesis_Lab_Instructions.pdf"],
    submissions: [
      {
        studentId: "ST001",
        submissionDate: "2023-11-20T16:15:00",
        status: "Submitted",
        grade: null,
        files: ["john_science_lab_report.docx"],
        feedback: ""
      }
    ]
  },
  {
    id: "HW003",
    title: "English Essay",
    description: "Write a 500-word essay on the themes in 'To Kill a Mockingbird'",
    courseId: 3,
    dueDate: "2023-11-18T23:59:00",
    dateAssigned: "2023-11-08T11:00:00",
    maxPoints: 100,
    notifyParents: true,
    reminderDays: 2,
    attachments: ["Essay_Guidelines.pdf"],
    submissions: [
      {
        studentId: "ST001",
        submissionDate: "2023-11-17T18:20:00",
        status: "Submitted",
        grade: 95,
        files: ["john_english_essay.docx"],
        feedback: "Excellent analysis of the themes. Your writing is clear and persuasive."
      },
      {
        studentId: "ST003",
        status: "Missing",
        submissionDate: null,
        grade: 0,
        files: [],
        feedback: "Assignment not submitted."
      }
    ]
  },
  {
    id: "HW004",
    title: "Mathematics Problem Set #2",
    description: "Complete problems 1-15 in Chapter 4",
    courseId: 1,
    dueDate: "2023-11-30T23:59:00",
    dateAssigned: "2023-11-20T09:00:00",
    maxPoints: 100,
    notifyParents: true,
    reminderDays: 2,
    attachments: ["Math_Chapter4_Problems.pdf"],
    submissions: []
  }
];

const HomeworkSubmission = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State for managing the view
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [studentsInClass, setStudentsInClass] = useState([]);
  
  // New assignment state
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    notifyParents: true,
    reminderDays: 2,
    attachments: []
  });
  
  // Filter states
  const [showPastDue, setShowPastDue] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  
  // Load assignments when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const courseAssignments = homeworkAssignmentsData.filter(
        homework => homework.courseId === selectedCourse.id
      );
      setAssignments(courseAssignments);
    } else {
      setAssignments([]);
    }
  }, [selectedCourse]);
  
  // Load students when class is selected
  useEffect(() => {
    if (selectedClass) {
      const classStudentIds = classEnrollmentData[selectedClass.id] || [];
      const classStudents = studentsData.filter(student => 
        classStudentIds.includes(student.id)
      );
      setStudentsInClass(classStudents);
    } else {
      setStudentsInClass([]);
    }
  }, [selectedClass]);
  
  // Handle grade selection
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass(null);
    setSelectedCourse(null);
    setSelectedStudent(null);
    setAssignments([]);
  };
  
  // Handle class selection
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSelectedCourse(null);
    setSelectedStudent(null);
    setAssignments([]);
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedStudent(null);
  };
  
  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };
  
  // Create new assignment
  const handleCreateAssignment = () => {
    // In a real app, this would send data to the backend
    toast({
      title: "Assignment created",
      description: `"${newAssignment.title}" has been assigned to ${selectedClass?.name}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // Reset form
    setNewAssignment({
      title: '',
      description: '',
      dueDate: '',
      maxPoints: 100,
      notifyParents: true,
      reminderDays: 2,
      attachments: []
    });
    
    onClose();
  };
  
  // Get submission status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Submitted':
        return <Badge colorScheme="green">Submitted</Badge>;
      case 'Late':
        return <Badge colorScheme="orange">Late</Badge>;
      case 'Missing':
        return <Badge colorScheme="red">Missing</Badge>;
      default:
        return <Badge colorScheme="gray">Pending</Badge>;
    }
  };
  
  // Send parent notification
  const sendParentNotification = (assignment, student) => {
    // In a real app, this would trigger an email to the parent
    toast({
      title: "Notification sent",
      description: `Reminder sent to ${student.parentName} regarding ${assignment.title}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16}>
      <Container maxW="container.xl" px={6}>
        <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
          <Icon as={FaTasks} mr={3} />
          Homework Submission System
        </Heading>
        <Text color="gray.600" mt={2} mb={6}>
          Manage homework assignments and track submissions with automated parent notifications.
        </Text>
        
        <Tabs colorScheme="red" variant="enclosed" mt={6}>
          <TabList>
            <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
              Assign Homework
            </Tab>
            <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
              Track Submissions
            </Tab>
            <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
              Parent Notifications
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Assign Homework Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={4}>
                {/* Grade Selection */}
                <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
                  <Heading size="md" mb={4} color="#640101">
                    <Flex align="center">
                      <Icon as={FaUserGraduate} mr={2} />
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
                
                {/* Class Selection */}
                <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
                  <Heading size="md" mb={4} color="#640101">
                    <Flex align="center">
                      <Icon as={FaUserGraduate} mr={2} />
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
                
                {/* Course Selection */}
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
              </SimpleGrid>
              
              {selectedCourse && (
                <Box mt={8}>
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading size="md" color="#640101">
                      Current Assignments for {selectedCourse.name}
                    </Heading>
                    <Button 
                      leftIcon={<FaPlus />} 
                      colorScheme="red" 
                      bg="#640101"
                      onClick={onOpen}
                    >
                      Create New Assignment
                    </Button>
                  </Flex>
                  
                  {assignments.length > 0 ? (
                    <Table variant="simple" mt={4}>
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Title</Th>
                          <Th>Due Date</Th>
                          <Th>Max Points</Th>
                          <Th>Submissions</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {assignments.map(assignment => {
                          const dueDate = new Date(assignment.dueDate);
                          const submissionCount = assignment.submissions.length;
                          const isOverdue = dueDate < new Date();
                          
                          return (
                            <Tr key={assignment.id}>
                              <Td fontWeight="medium">{assignment.title}</Td>
                              <Td>{dueDate.toLocaleDateString()} ({dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</Td>
                              <Td>{assignment.maxPoints}</Td>
                              <Td>{submissionCount} / {studentsInClass.length}</Td>
                              <Td>
                                {isOverdue ? (
                                  <Badge colorScheme="red">Past Due</Badge>
                                ) : (
                                  <Badge colorScheme="green">Active</Badge>
                                )}
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <Button size="sm" leftIcon={<FaEdit />} colorScheme="blue" variant="ghost">
                                    Edit
                                  </Button>
                                  <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" variant="ghost">
                                    Delete
                                  </Button>
                                </HStack>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500">No assignments found for this course.</Text>
                  )}
                </Box>
              )}
            </TabPanel>
            
            {/* Track Submissions Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
                <Stat bg="blue.50" p={4} borderRadius="md">
                  <StatLabel>Total Assignments</StatLabel>
                  <StatNumber>{homeworkAssignmentsData.length}</StatNumber>
                </Stat>
                <Stat bg="green.50" p={4} borderRadius="md">
                  <StatLabel>Submitted</StatLabel>
                  <StatNumber>
                    {homeworkAssignmentsData.reduce((count, hw) => 
                      count + hw.submissions.filter(s => s.status === 'Submitted').length, 0
                    )}
                  </StatNumber>
                </Stat>
                <Stat bg="red.50" p={4} borderRadius="md">
                  <StatLabel>Missing</StatLabel>
                  <StatNumber>
                    {homeworkAssignmentsData.reduce((count, hw) => 
                      count + hw.submissions.filter(s => s.status === 'Missing').length, 0
                    )}
                  </StatNumber>
                </Stat>
                <Stat bg="yellow.50" p={4} borderRadius="md">
                  <StatLabel>Upcoming Due</StatLabel>
                  <StatNumber>
                    {homeworkAssignmentsData.filter(hw => new Date(hw.dueDate) > new Date()).length}
                  </StatNumber>
                </Stat>
              </SimpleGrid>
              
              <HStack mb={4} spacing={4}>
                <FormControl display="flex" alignItems="center" width="auto">
                  <FormLabel mb="0" mr={2}>Show Past Due</FormLabel>
                  <Switch colorScheme="red" isChecked={showPastDue} onChange={() => setShowPastDue(!showPastDue)} />
                </FormControl>
                <FormControl display="flex" alignItems="center" width="auto">
                  <FormLabel mb="0" mr={2}>Show Upcoming</FormLabel>
                  <Switch colorScheme="green" isChecked={showUpcoming} onChange={() => setShowUpcoming(!showUpcoming)} />
                </FormControl>
                <FormControl display="flex" alignItems="center" width="auto">
                  <FormLabel mb="0" mr={2}>Show Completed</FormLabel>
                  <Switch colorScheme="blue" isChecked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
                </FormControl>
              </HStack>
              
              <Box mt={4}>
                <Heading size="md" color="#640101" mb={4}>All Assignments</Heading>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Assignment</Th>
                      <Th>Course</Th>
                      <Th>Due Date</Th>
                      <Th>Submission Status</Th>
                      <Th>Parent Notification</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {homeworkAssignmentsData.map(assignment => {
                      const course = gradesData.flatMap(g => g.classes)
                        .flatMap(c => c.courses)
                        .find(c => c.id === assignment.courseId);
                        
                      const dueDate = new Date(assignment.dueDate);
                      const isOverdue = dueDate < new Date();
                      const submissionCount = assignment.submissions.length;
                      const studentCount = classEnrollmentData[
                        gradesData.flatMap(g => g.classes).find(c => 
                          c.courses.some(course => course.id === assignment.courseId)
                        )?.id
                      ]?.length || 0;
                      
                      return (
                        <Tr key={assignment.id}>
                          <Td fontWeight="medium">{assignment.title}</Td>
                          <Td>{course?.name || 'Unknown'}</Td>
                          <Td>
                            {dueDate.toLocaleDateString()}
                            {isOverdue && (
                              <Badge ml={2} colorScheme="red">Past Due</Badge>
                            )}
                          </Td>
                          <Td>{submissionCount} / {studentCount} submitted</Td>
                          <Td>
                            {assignment.notifyParents ? (
                              <Badge colorScheme="green">Enabled</Badge>
                            ) : (
                              <Badge colorScheme="gray">Disabled</Badge>
                            )}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              leftIcon={<FaEnvelope />}
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => {
                                // In a real app, this would send notifications to parents
                                // whose children haven't submitted
                                toast({
                                  title: "Reminder sent",
                                  description: "Reminders have been sent to parents of students who haven't submitted yet.",
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }}
                            >
                              Send Reminder
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            {/* Parent Notifications Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Heading size="md" color="#640101" mb={4}>Notification Settings</Heading>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0" mr={4}>
                            <Flex align="center">
                              <Icon as={FaBell} mr={2} />
                              Enable Automatic Notifications
                            </Flex>
                          </FormLabel>
                          <Switch colorScheme="red" defaultChecked />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>
                            <Flex align="center">
                              <Icon as={FaClock} mr={2} />
                              Days Before Due Date to Send First Reminder
                            </Flex>
                          </FormLabel>
                          <Select defaultValue="3">
                            <option value="1">1 day before</option>
                            <option value="2">2 days before</option>
                            <option value="3">3 days before</option>
                            <option value="5">5 days before</option>
                            <option value="7">7 days before</option>
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>
                            <Flex align="center">
                              <Icon as={FaExclamationTriangle} mr={2} />
                              Send Missing Assignment Notice
                            </Flex>
                          </FormLabel>
                          <Select defaultValue="1">
                            <option value="0">On due date</option>
                            <option value="1">1 day after due date</option>
                            <option value="2">2 days after due date</option>
                            <option value="3">3 days after due date</option>
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>
                            <Flex align="center">
                              <Icon as={FaEnvelope} mr={2} />
                              Email Template
                            </Flex>
                          </FormLabel>
                          <Textarea
                            defaultValue={`Dear [Parent Name],\n\nThis is a reminder that [Student Name]'s assignment "[Assignment Title]" is due on [Due Date].\n\nThank you,\nThe School Administration`}
                            rows={6}
                          />
                        </FormControl>
                        
                        <Button colorScheme="red" bg="#640101" alignSelf="flex-end">
                          Save Settings
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
                
                <Box>
                  <Heading size="md" color="#640101" mb={4}>Recent Notifications</Heading>
                  <VStack spacing={4} align="stretch">
                    <Card>
                      <CardBody>
                        <HStack justify="space-between">
                          <Box>
                            <Heading size="sm">Mathematics Problem Set #1</Heading>
                            <Text fontSize="sm">Sent to: Mr. & Mrs. Johnson</Text>
                            <Text fontSize="sm" color="gray.500">For: Michael Johnson</Text>
                          </Box>
                          <Badge colorScheme="red">Missing</Badge>
                        </HStack>
                        <Text fontSize="sm" mt={2}>
                          Sent on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody>
                        <HStack justify="space-between">
                          <Box>
                            <Heading size="sm">Science Lab Report</Heading>
                            <Text fontSize="sm">Sent to: Mr. & Mrs. Doe</Text>
                            <Text fontSize="sm" color="gray.500">For: John Doe</Text>
                          </Box>
                          <Badge colorScheme="green">Reminder</Badge>
                        </HStack>
                        <Text fontSize="sm" mt={2}>
                          Sent on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody>
                        <HStack justify="space-between">
                          <Box>
                            <Heading size="sm">English Essay</Heading>
                            <Text fontSize="sm">Sent to: Mr. & Mrs. Johnson</Text>
                            <Text fontSize="sm" color="gray.500">For: Michael Johnson</Text>
                          </Box>
                          <Badge colorScheme="orange">Upcoming</Badge>
                        </HStack>
                        <Text fontSize="sm" mt={2}>
                          Sent on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </Text>
                      </CardBody>
                    </Card>
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {/* Create New Assignment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="#640101">Create New Assignment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Assignment Title</FormLabel>
                  <Input 
                    placeholder="Enter assignment title" 
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    placeholder="Enter assignment description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Due Date & Time</FormLabel>
                  <Input 
                    type="datetime-local" 
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Maximum Points</FormLabel>
                  <Input 
                    type="number" 
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment({...newAssignment, maxPoints: parseInt(e.target.value)})}
                  />
                </FormControl>
                
                <HStack spacing={6}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0" mr={4}>Notify Parents</FormLabel>
                    <Switch 
                      colorScheme="red" 
                      isChecked={newAssignment.notifyParents}
                      onChange={() => setNewAssignment({...newAssignment, notifyParents: !newAssignment.notifyParents})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Reminder Days Before Due</FormLabel>
                    <Select 
                      value={newAssignment.reminderDays}
                      onChange={(e) => setNewAssignment({...newAssignment, reminderDays: parseInt(e.target.value)})}
                      isDisabled={!newAssignment.notifyParents}
                    >
                      <option value="1">1 day</option>
                      <option value="2">2 days</option>
                      <option value="3">3 days</option>
                      <option value="5">5 days</option>
                      <option value="7">7 days</option>
                    </Select>
                  </FormControl>
                </HStack>
                
                <FormControl>
                  <FormLabel>Attachments</FormLabel>
                  <Button leftIcon={<FaPaperclip />} colorScheme="blue" variant="outline">
                    Add Attachment
                  </Button>
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                bg="#640101"
                leftIcon={<FaPlus />}
                onClick={handleCreateAssignment}
                isDisabled={!newAssignment.title || !newAssignment.description || !newAssignment.dueDate}
              >
                Create Assignment
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default HomeworkSubmission; 