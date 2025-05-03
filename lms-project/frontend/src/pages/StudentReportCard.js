import React, { useState } from 'react';
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
  Select,
  useToast,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { 
  FaFileAlt, 
  FaGraduationCap,
  FaBook,
  FaPrint,
  FaDownload,
  FaChartLine,
  FaChartBar
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

// Sample student data with course grades
const studentData = {
  id: "ST001", 
  name: "Leon Johnson", 
  studentId: "2025STU1081",
  major: "Computer Science",
  advisor: "Dr. Sarah Williams",
  email: "leon.johnson@example.com", 
  currentTerm: "Spring 2025",
  academicYear: "2024-2025",
  cumulativeGPA: 3.78,
  totalCredits: 42,
  previousTerms: ["Fall 2024", "Summer 2024", "Spring 2024", "Fall 2023"]
};

// Sample courses data with grades for different terms
const coursesByTerm = {
  "Spring 2025": [
    { 
      id: 1, 
      code: "CS401",
      name: "Advanced Machine Learning", 
      instructor: "Dr. Elena Rodriguez",
      credits: 4,
      currentScore: 92,
      midtermScore: 88,
      finalScore: 95,
      assignmentScore: 94,
      attendanceScore: 100,
      letterGrade: "A",
      gradePoints: 4.0,
      status: "In Progress"
    },
    { 
      id: 2, 
      code: "CS456",
      name: "Web Application Security", 
      instructor: "Prof. Robert Chen",
      credits: 3,
      currentScore: 89,
      midtermScore: 85,
      finalScore: 91,
      assignmentScore: 88,
      attendanceScore: 98,
      letterGrade: "B+",
      gradePoints: 3.3,
      status: "In Progress"
    },
    { 
      id: 3, 
      code: "MATH302",
      name: "Applied Statistics", 
      instructor: "Dr. James Wilson",
      credits: 4,
      currentScore: 87,
      midtermScore: 82,
      finalScore: 90,
      assignmentScore: 85,
      attendanceScore: 95,
      letterGrade: "B+",
      gradePoints: 3.3,
      status: "In Progress"
    },
    { 
      id: 4, 
      code: "ENG215",
      name: "Technical Communication", 
      instructor: "Prof. Emily Thomas",
      credits: 3,
      currentScore: 94,
      midtermScore: 92,
      finalScore: 96,
      assignmentScore: 91,
      attendanceScore: 100,
      letterGrade: "A",
      gradePoints: 4.0,
      status: "In Progress"
    }
  ],
  "Fall 2024": [
    { 
      id: 5, 
      code: "CS350",
      name: "Database Systems", 
      instructor: "Dr. Michael Davis",
      credits: 4,
      currentScore: 96,
      midtermScore: 95,
      finalScore: 98,
      assignmentScore: 94,
      attendanceScore: 100,
      letterGrade: "A",
      gradePoints: 4.0,
      status: "Completed"
    },
    { 
      id: 6, 
      code: "CS375",
      name: "Computer Networks", 
      instructor: "Prof. David Kumar",
      credits: 4,
      currentScore: 92,
      midtermScore: 90,
      finalScore: 94,
      assignmentScore: 89,
      attendanceScore: 98,
      letterGrade: "A-",
      gradePoints: 3.7,
      status: "Completed"
    },
    { 
      id: 7, 
      code: "MATH301",
      name: "Discrete Mathematics", 
      instructor: "Dr. Lisa Martinez",
      credits: 3,
      currentScore: 89,
      midtermScore: 86,
      finalScore: 91,
      assignmentScore: 90,
      attendanceScore: 95,
      letterGrade: "B+",
      gradePoints: 3.3,
      status: "Completed"
    }
  ],
  "Summer 2024": [
    { 
      id: 8, 
      code: "CS310",
      name: "Algorithms and Data Structures", 
      instructor: "Dr. Johnson Smith",
      credits: 4,
      currentScore: 94,
      midtermScore: 91,
      finalScore: 96,
      assignmentScore: 95,
      attendanceScore: 98,
      letterGrade: "A",
      gradePoints: 4.0,
      status: "Completed"
    },
    { 
      id: 9, 
      code: "PHYS201",
      name: "Physics for Computer Scientists", 
      instructor: "Prof. Amelia Patel",
      credits: 3,
      currentScore: 88,
      midtermScore: 85,
      finalScore: 90,
      assignmentScore: 86,
      attendanceScore: 92,
      letterGrade: "B+",
      gradePoints: 3.3,
      status: "Completed"
    }
  ]
};

// GPA Scale - same as in the institution report card
const gpaScale = [
  { grade: 'A+', minScore: 97, maxScore: 100, gpa: 4.0 },
  { grade: 'A', minScore: 93, maxScore: 96.99, gpa: 4.0 },
  { grade: 'A-', minScore: 90, maxScore: 92.99, gpa: 3.7 },
  { grade: 'B+', minScore: 87, maxScore: 89.99, gpa: 3.3 },
  { grade: 'B', minScore: 83, maxScore: 86.99, gpa: 3.0 },
  { grade: 'B-', minScore: 80, maxScore: 82.99, gpa: 2.7 },
  { grade: 'C+', minScore: 77, maxScore: 79.99, gpa: 2.3 },
  { grade: 'C', minScore: 73, maxScore: 76.99, gpa: 2.0 },
  { grade: 'C-', minScore: 70, maxScore: 72.99, gpa: 1.7 },
  { grade: 'D+', minScore: 67, maxScore: 69.99, gpa: 1.3 },
  { grade: 'D', minScore: 63, maxScore: 66.99, gpa: 1.0 },
  { grade: 'D-', minScore: 60, maxScore: 62.99, gpa: 0.7 },
  { grade: 'F', minScore: 0, maxScore: 59.99, gpa: 0.0 }
];

// Helper function to get letter grade color
const getGradeColor = (letterGrade) => {
  if (letterGrade.startsWith('A')) return 'green.500';
  if (letterGrade.startsWith('B')) return 'teal.500';
  if (letterGrade.startsWith('C')) return 'orange.500';
  if (letterGrade.startsWith('D')) return 'red.400';
  if (letterGrade === 'F') return 'red.600';
  return 'gray.500';
};

// Helper function to calculate term GPA
const calculateTermGPA = (courses) => {
  if (!courses || courses.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  courses.forEach(course => {
    totalPoints += course.gradePoints * course.credits;
    totalCredits += course.credits;
  });
  
  return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
};

// Helper function to calculate term credits
const calculateTermCredits = (courses) => {
  if (!courses || courses.length === 0) return 0;
  return courses.reduce((acc, course) => acc + course.credits, 0);
};

const StudentReportCard = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(studentData.currentTerm);
  const [courses, setCourses] = useState(coursesByTerm[studentData.currentTerm]);
  
  const accentColor = useColorModeValue('#640101', 'red.200');
  const headerBgColor = useColorModeValue(`${accentColor}10`, 'gray.700');
  const borderColor = useColorModeValue(`${accentColor}20`, 'gray.600');
  
  const handleTermChange = (e) => {
    const term = e.target.value;
    setSelectedTerm(term);
    setCourses(coursesByTerm[term] || []);
  };
  
  const handlePrintReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.print();
      toast({
        title: "Print request initiated",
        description: "The report card is being prepared for printing.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };
  
  const handleDownloadReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Download started",
        description: "Your report card PDF is being downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };
  
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
        bg="gray.50"
      >
        <Container maxW="container.xl" className="report-card-container">
          <VStack spacing={8} align="stretch">
            <Flex alignItems="center" justifyContent="space-between">
              <Heading as="h1" size="xl" color={accentColor}>My Report Card</Heading>
              <HStack>
                <Select
                  value={selectedTerm}
                  onChange={handleTermChange}
                  width="200px"
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: accentColor }}
                >
                  <option value={studentData.currentTerm}>{studentData.currentTerm}</option>
                  {studentData.previousTerms.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </Select>
                <Button
                  leftIcon={<FaPrint />}
                  onClick={handlePrintReport}
                  colorScheme="red"
                  bg={accentColor}
                  _hover={{ bg: "#8B0000" }}
                  isLoading={isLoading}
                  loadingText="Preparing..."
                >
                  Print
                </Button>
                <Button
                  leftIcon={<FaDownload />}
                  onClick={handleDownloadReport}
                  colorScheme="red"
                  bg={accentColor}
                  _hover={{ bg: "#8B0000" }}
                  isLoading={isLoading}
                  loadingText="Preparing..."
                >
                  Download
                </Button>
              </HStack>
            </Flex>
            
            {/* Student Information Card */}
            <Card borderRadius="lg" boxShadow="md" bg="white">
              <CardHeader 
                bg={headerBgColor} 
                borderBottom={`1px solid ${borderColor}`}
                borderTopRadius="lg"
                p={4}
              >
                <Flex alignItems="center">
                  <Icon as={FaGraduationCap} boxSize={6} color={accentColor} />
                  <Heading size="md" ml={4} color={accentColor}>
                    Student Information
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Name</Text>
                    <Text fontSize="md">{studentData.name}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Student ID</Text>
                    <Text fontSize="md">{studentData.studentId}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Major</Text>
                    <Text fontSize="md">{studentData.major}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Advisor</Text>
                    <Text fontSize="md">{studentData.advisor}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Email</Text>
                    <Text fontSize="md">{studentData.email}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Academic Year</Text>
                    <Text fontSize="md">{studentData.academicYear}</Text>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
            
            {/* Grades Summary Card */}
            <Card borderRadius="lg" boxShadow="md" bg="white">
              <CardHeader 
                bg={headerBgColor} 
                borderBottom={`1px solid ${borderColor}`}
                borderTopRadius="lg"
                p={4}
              >
                <Flex alignItems="center">
                  <Icon as={FaChartLine} boxSize={6} color={accentColor} />
                  <Heading size="md" ml={4} color={accentColor}>
                    Academic Summary
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                  <Stat>
                    <StatLabel color="gray.500">Term GPA</StatLabel>
                    <StatNumber fontSize="2xl" color={accentColor}>{calculateTermGPA(courses)}</StatNumber>
                    <StatHelpText>{selectedTerm}</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Cumulative GPA</StatLabel>
                    <StatNumber fontSize="2xl" color={accentColor}>{studentData.cumulativeGPA.toFixed(2)}</StatNumber>
                    <StatHelpText>Overall</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Term Credits</StatLabel>
                    <StatNumber fontSize="2xl" color={accentColor}>{calculateTermCredits(courses)}</StatNumber>
                    <StatHelpText>{selectedTerm}</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Total Credits</StatLabel>
                    <StatNumber fontSize="2xl" color={accentColor}>{studentData.totalCredits}</StatNumber>
                    <StatHelpText>Cumulative</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>
            
            {/* Course Grades Card */}
            <Card borderRadius="lg" boxShadow="md" bg="white">
              <CardHeader 
                bg={headerBgColor} 
                borderBottom={`1px solid ${borderColor}`}
                borderTopRadius="lg"
                p={4}
              >
                <Flex alignItems="center">
                  <Icon as={FaBook} boxSize={6} color={accentColor} />
                  <Heading size="md" ml={4} color={accentColor}>
                    Course Grades - {selectedTerm}
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg={`${accentColor}05`}>
                      <Tr>
                        <Th>Course Code</Th>
                        <Th>Course Name</Th>
                        <Th>Instructor</Th>
                        <Th>Credits</Th>
                        <Th isNumeric>Midterm</Th>
                        <Th isNumeric>Final</Th>
                        <Th isNumeric>Assignments</Th>
                        <Th isNumeric>Overall</Th>
                        <Th>Letter Grade</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {courses.map(course => (
                        <Tr key={course.id}>
                          <Td fontWeight="bold">{course.code}</Td>
                          <Td>{course.name}</Td>
                          <Td>{course.instructor}</Td>
                          <Td>{course.credits}</Td>
                          <Td isNumeric>{course.midtermScore}%</Td>
                          <Td isNumeric>{course.finalScore}%</Td>
                          <Td isNumeric>{course.assignmentScore}%</Td>
                          <Td isNumeric fontWeight="bold">{course.currentScore}%</Td>
                          <Td>
                            <Badge 
                              colorScheme={
                                course.letterGrade.startsWith('A') ? 'green' :
                                course.letterGrade.startsWith('B') ? 'teal' :
                                course.letterGrade.startsWith('C') ? 'orange' :
                                course.letterGrade.startsWith('D') ? 'red' : 'gray'
                              }
                              fontSize="sm"
                              fontWeight="bold"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {course.letterGrade}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={course.status === 'Completed' ? 'green' : 'blue'}
                              variant="subtle"
                              px={2}
                              py={1}
                            >
                              {course.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
            
            {/* GPA Scale Reference */}
            <Card borderRadius="lg" boxShadow="md" bg="white">
              <CardHeader 
                bg={headerBgColor} 
                borderBottom={`1px solid ${borderColor}`}
                borderTopRadius="lg"
                p={4}
              >
                <Flex alignItems="center">
                  <Icon as={FaChartBar} boxSize={6} color={accentColor} />
                  <Heading size="md" ml={4} color={accentColor}>
                    Grading Scale Reference
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody p={4}>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
                  {gpaScale.map((item, index) => (
                    <Box 
                      key={index} 
                      p={3} 
                      bg="white" 
                      borderWidth="1px" 
                      borderRadius="md"
                      borderColor={borderColor}
                      textAlign="center"
                    >
                      <Text fontWeight="bold" color={getGradeColor(item.grade)} fontSize="lg">{item.grade}</Text>
                      <Divider my={2} />
                      <Text fontSize="sm">{item.minScore} - {item.maxScore}</Text>
                      <Text fontSize="sm" fontWeight="bold" mt={1}>GPA: {item.gpa.toFixed(1)}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentReportCard;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */ 