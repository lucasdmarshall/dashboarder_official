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
  useToast,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
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
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { 
  FaFileAlt, 
  FaGraduationCap,
  FaChalkboard,
  FaBook,
  FaUserGraduate,
  FaPrint,
  FaDownload,
  FaEnvelope,
  FaSave,
  FaCalculator
} from 'react-icons/fa';

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
            instructor: 'Dr. Johnson',
            credits: 4,
            maxGrade: 100
          },
          { 
            id: 2, 
            name: 'Science', 
            instructor: 'Prof. Smith',
            credits: 4,
            maxGrade: 100
          },
          { 
            id: 3, 
            name: 'English',
            instructor: 'Ms. Williams',
            credits: 3,
            maxGrade: 100
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
            credits: 4,
            maxGrade: 100
          },
          { 
            id: 5, 
            name: 'Science',
            instructor: 'Dr. Brown',
            credits: 4,
            maxGrade: 100
          },
          { 
            id: 6, 
            name: 'History',
            instructor: 'Prof. Adams',
            credits: 3,
            maxGrade: 100
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
            credits: 4,
            maxGrade: 100
          },
          { 
            id: 8, 
            name: 'Science',
            instructor: 'Prof. Garcia',
            credits: 4,
            maxGrade: 100
          },
          { 
            id: 9, 
            name: 'Geography',
            instructor: 'Ms. Martinez',
            credits: 3,
            maxGrade: 100
          }
        ]
      }
    ]
  }
];

// Sample student data with course grades
const studentsData = [
  { 
    id: "ST001", 
    name: "John Doe", 
    email: "john.doe@example.com", 
    parentEmail: "parent.doe@example.com", 
    grades: {
      1: 92, // Mathematics
      2: 88, // Science
      3: 95  // English
    }
  },
  { 
    id: "ST002", 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    parentEmail: "parent.smith@example.com",
    grades: {
      4: 85, // Mathematics
      5: 90, // Science
      6: 78  // History
    }
  },
  { 
    id: "ST003", 
    name: "Michael Johnson", 
    email: "michael.j@example.com", 
    parentEmail: "parent.johnson@example.com",
    grades: {
      1: 78, // Mathematics
      2: 82, // Science
      3: 88  // English
    }
  },
  { 
    id: "ST004", 
    name: "Emily Williams", 
    email: "emily.w@example.com", 
    parentEmail: "parent.williams@example.com",
    grades: {
      7: 91, // Mathematics
      8: 84, // Science
      9: 89  // Geography
    }
  }
];

// Generate class enrollment data (which students are in which class)
const classEnrollmentData = {
  1: ["ST001", "ST003"], // Class 1A
  2: ["ST002"],          // Class 1B
  3: ["ST004"]           // Class 2A
};

// GPA Scale
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

// Helper function to convert numeric grade to letter grade
const getLetterGrade = (score) => {
  const grade = gpaScale.find(g => score >= g.minScore && score <= g.maxScore);
  return grade ? grade.grade : 'N/A';
};

// Helper function to get GPA from score
const getGpaValue = (score) => {
  const grade = gpaScale.find(g => score >= g.minScore && score <= g.maxScore);
  return grade ? grade.gpa : 0;
};

const ReportCard = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [term, setTerm] = useState('First Term');
  
  // Selection state
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Report card state
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [courseGrades, setCourseGrades] = useState({});
  const [gpa, setGpa] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Load students when class is selected
  useEffect(() => {
    if (selectedClass) {
      const classStudentIds = classEnrollmentData[selectedClass.id] || [];
      const classStudents = studentsData.filter(student => 
        classStudentIds.includes(student.id)
      );
      setStudentsInClass(classStudents);
      setSelectedStudent(null);
      setStudentCourses([]);
      setCourseGrades({});
      setGpa(0);
      setReportGenerated(false);
    }
  }, [selectedClass]);
  
  // Load courses and grades when student is selected
  useEffect(() => {
    if (selectedStudent && selectedClass) {
      const courses = selectedClass.courses;
      setStudentCourses(courses);
      
      // Load grades
      const grades = {};
      let totalGpa = 0;
      let totalCredits = 0;
      
      courses.forEach(course => {
        const score = selectedStudent.grades[course.id] || 0;
        grades[course.id] = score;
        totalGpa += getGpaValue(score) * course.credits;
        totalCredits += course.credits;
      });
      
      setCourseGrades(grades);
      setGpa(totalCredits > 0 ? (totalGpa / totalCredits).toFixed(2) : 0);
    }
  }, [selectedStudent, selectedClass]);
  
  // Handle grade selection
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass(null);
    setSelectedStudent(null);
    setStudentsInClass([]);
    setStudentCourses([]);
    setCourseGrades({});
    setGpa(0);
    setReportGenerated(false);
  };
  
  // Handle class selection
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSelectedStudent(null);
  };
  
  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setReportGenerated(false);
  };
  
  // Generate report card
  const handleGenerateReport = () => {
    if (!selectedStudent) {
      toast({
        title: "No student selected",
        description: "Please select a student to generate report card",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setReportGenerated(true);
    
    toast({
      title: "Report card generated",
      description: `Report card for ${selectedStudent.name} has been generated`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Calculate class average
  const calculateClassAverage = (courseId) => {
    let total = 0;
    let count = 0;
    
    studentsInClass.forEach(student => {
      if (student.grades[courseId]) {
        total += student.grades[courseId];
        count++;
      }
    });
    
    return count > 0 ? (total / count).toFixed(1) : 'N/A';
  };
  
  // Calculate overall class average GPA
  const calculateClassAverageGPA = () => {
    if (!selectedClass || studentsInClass.length === 0) return 0;
    
    let totalGpa = 0;
    let studentCount = 0;
    
    studentsInClass.forEach(student => {
      let studentTotalGpa = 0;
      let totalCredits = 0;
      
      selectedClass.courses.forEach(course => {
        const score = student.grades[course.id] || 0;
        if (score > 0) {
          studentTotalGpa += getGpaValue(score) * course.credits;
          totalCredits += course.credits;
        }
      });
      
      if (totalCredits > 0) {
        totalGpa += studentTotalGpa / totalCredits;
        studentCount++;
      }
    });
    
    return studentCount > 0 ? (totalGpa / studentCount).toFixed(2) : 0;
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16}>
      <Container maxW="container.xl" px={6}>
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
              <Icon as={FaFileAlt} mr={3} />
              Report Card System
            </Heading>
            
            <HStack>
              <FormControl width="auto">
                <Select 
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  width="auto"
                >
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2021-2022">2021-2022</option>
                </Select>
              </FormControl>
              
              <FormControl width="auto">
                <Select 
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  width="auto"
                >
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Final Term">Final Term</option>
                </Select>
              </FormControl>
            </HStack>
          </Flex>
          
          <Text color="gray.600">Generate comprehensive report cards with automatic GPA calculation for students.</Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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
            
            {/* Student Selection Column */}
            <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
              <Heading size="md" mb={4} color="#640101">
                <Flex align="center">
                  <Icon as={FaUserGraduate} mr={2} />
                  Students
                </Flex>
              </Heading>
              {selectedClass ? (
                <VStack spacing={2} align="stretch">
                  {studentsInClass.length > 0 ? (
                    studentsInClass.map(student => (
                      <Button
                        key={student.id}
                        variant={selectedStudent?.id === student.id ? "solid" : "outline"}
                        colorScheme={selectedStudent?.id === student.id ? "red" : "gray"}
                        justifyContent="flex-start"
                        onClick={() => handleStudentSelect(student)}
                        size="sm"
                        width="100%"
                      >
                        {student.name}
                      </Button>
                    ))
                  ) : (
                    <Text color="gray.500">No students in this class</Text>
                  )}
                </VStack>
              ) : (
                <Text color="gray.500">Please select a class first</Text>
              )}
            </Box>
          </SimpleGrid>
          
          {/* Generate Report Button */}
          {selectedStudent && (
            <Flex justify="flex-end">
              <Button
                colorScheme="red"
                bg="#640101"
                onClick={handleGenerateReport}
                leftIcon={<FaCalculator />}
                isDisabled={reportGenerated}
              >
                {reportGenerated ? "Report Generated" : "Generate Report Card"}
              </Button>
            </Flex>
          )}
          
          {/* Report Card Display */}
          {reportGenerated && selectedStudent && (
            <Box mt={6} borderWidth="1px" borderRadius="lg" p={6} bg="white">
              <VStack spacing={6} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="lg" color="#640101">
                    Student Report Card
                  </Heading>
                  <HStack>
                    <Button leftIcon={<FaPrint />} colorScheme="blue" variant="outline">
                      Print
                    </Button>
                    <Button leftIcon={<FaDownload />} colorScheme="blue" variant="outline">
                      Download PDF
                    </Button>
                    <Button leftIcon={<FaEnvelope />} colorScheme="blue" variant="outline">
                      Email to Parent
                    </Button>
                  </HStack>
                </Flex>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontWeight="bold">Student Name:</Text>
                    <Text>{selectedStudent.name}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Student ID:</Text>
                    <Text>{selectedStudent.id}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Grade & Class:</Text>
                    <Text>{selectedGrade?.name} - {selectedClass?.name}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Academic Year:</Text>
                    <Text>{academicYear}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Term:</Text>
                    <Text>{term}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Report Date:</Text>
                    <Text>{new Date().toLocaleDateString()}</Text>
                  </Box>
                </SimpleGrid>
                
                <Divider />
                
                <Heading size="md" color="#640101">Course Performance</Heading>
                
                <Table variant="simple" border="1px" borderColor="gray.200">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Course</Th>
                      <Th>Instructor</Th>
                      <Th isNumeric>Credits</Th>
                      <Th isNumeric>Score</Th>
                      <Th>Grade</Th>
                      <Th isNumeric>GPA</Th>
                      <Th isNumeric>Class Average</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {studentCourses.map(course => {
                      const score = courseGrades[course.id] || 0;
                      const letterGrade = getLetterGrade(score);
                      const gpaValue = getGpaValue(score);
                      const classAvg = calculateClassAverage(course.id);
                      
                      return (
                        <Tr key={course.id}>
                          <Td fontWeight="medium">{course.name}</Td>
                          <Td>{course.instructor}</Td>
                          <Td isNumeric>{course.credits}</Td>
                          <Td isNumeric>{score}</Td>
                          <Td>
                            <Badge 
                              colorScheme={
                                letterGrade.startsWith('A') ? 'green' : 
                                letterGrade.startsWith('B') ? 'blue' : 
                                letterGrade.startsWith('C') ? 'yellow' : 
                                letterGrade.startsWith('D') ? 'orange' : 'red'
                              }
                              fontSize="sm"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {letterGrade}
                            </Badge>
                          </Td>
                          <Td isNumeric>{gpaValue.toFixed(1)}</Td>
                          <Td isNumeric>{classAvg}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Stat bg="gray.50" p={4} borderRadius="md">
                    <StatLabel>Cumulative GPA</StatLabel>
                    <StatNumber color="#640101" fontSize="3xl">{gpa}</StatNumber>
                    <StatHelpText>
                      {parseFloat(gpa) >= 3.5 ? 'Honor Roll' : 
                       parseFloat(gpa) >= 3.0 ? 'Good Standing' : 
                       parseFloat(gpa) >= 2.0 ? 'Satisfactory' : 'Needs Improvement'}
                    </StatHelpText>
                  </Stat>
                  
                  <Stat bg="gray.50" p={4} borderRadius="md">
                    <StatLabel>Class Rank</StatLabel>
                    <StatNumber color="#640101" fontSize="3xl">
                      {studentsInClass.length > 0 
                        ? `${studentsInClass.filter(s => {
                            // Calculate student GPA
                            let studentTotalGpa = 0;
                            let totalCredits = 0;
                            selectedClass.courses.forEach(course => {
                              const score = s.grades[course.id] || 0;
                              if (score > 0) {
                                studentTotalGpa += getGpaValue(score) * course.credits;
                                totalCredits += course.credits;
                              }
                            });
                            const studentGpa = totalCredits > 0 ? studentTotalGpa / totalCredits : 0;
                            return studentGpa > parseFloat(gpa);
                          }).length + 1} of ${studentsInClass.length}`
                        : 'N/A'
                      }
                    </StatNumber>
                    <StatHelpText>Based on GPA</StatHelpText>
                  </Stat>
                  
                  <Stat bg="gray.50" p={4} borderRadius="md">
                    <StatLabel>Class Average GPA</StatLabel>
                    <StatNumber color="#640101" fontSize="3xl">{calculateClassAverageGPA()}</StatNumber>
                    <StatHelpText>
                      {parseFloat(gpa) > parseFloat(calculateClassAverageGPA()) 
                        ? 'Above Average' 
                        : parseFloat(gpa) < parseFloat(calculateClassAverageGPA())
                          ? 'Below Average'
                          : 'At Average'
                      }
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
                
                <Divider />
                
                <Tabs colorScheme="red" variant="enclosed">
                  <TabList>
                    <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
                      Teacher Comments
                    </Tab>
                    <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
                      Attendance Summary
                    </Tab>
                    <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
                      Performance Graph
                    </Tab>
                  </TabList>
                  
                  <TabPanels>
                    <TabPanel>
                      <Text fontStyle="italic">
                        {selectedStudent.name} has shown {parseFloat(gpa) >= 3.5 ? 'excellent' : parseFloat(gpa) >= 3.0 ? 'good' : parseFloat(gpa) >= 2.0 ? 'satisfactory' : 'some'} progress during this term. 
                        {parseFloat(gpa) >= 3.0 
                          ? ' The student demonstrates strong understanding of the course material and participates actively in class discussions.' 
                          : ' The student would benefit from additional practice and more active participation in class activities.'}
                      </Text>
                    </TabPanel>
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                        <Stat bg="green.50" p={4} borderRadius="md" textAlign="center">
                          <StatLabel>Present Days</StatLabel>
                          <StatNumber>52</StatNumber>
                          <StatHelpText>87%</StatHelpText>
                        </Stat>
                        <Stat bg="red.50" p={4} borderRadius="md" textAlign="center">
                          <StatLabel>Absent Days</StatLabel>
                          <StatNumber>3</StatNumber>
                          <StatHelpText>5%</StatHelpText>
                        </Stat>
                        <Stat bg="yellow.50" p={4} borderRadius="md" textAlign="center">
                          <StatLabel>Late Arrivals</StatLabel>
                          <StatNumber>5</StatNumber>
                          <StatHelpText>8%</StatHelpText>
                        </Stat>
                        <Stat bg="blue.50" p={4} borderRadius="md" textAlign="center">
                          <StatLabel>Total School Days</StatLabel>
                          <StatNumber>60</StatNumber>
                          <StatHelpText>100%</StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                      <Text>Performance graph would be displayed here.</Text>
                      <Text fontSize="sm" color="gray.500">The graph would show the student's performance over time across different subjects and compare it with class averages.</Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                
                <HStack justify="space-between" mt={4}>
                  <Box>
                    <Text fontWeight="bold">Principal's Signature</Text>
                    <Box width="150px" height="50px" borderBottom="1px solid black" mt={8} />
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Teacher's Signature</Text>
                    <Box width="150px" height="50px" borderBottom="1px solid black" mt={8} />
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Parent's Signature</Text>
                    <Box width="150px" height="50px" borderBottom="1px solid black" mt={8} />
                  </Box>
                </HStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ReportCard; 