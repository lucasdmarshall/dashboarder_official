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
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tabs,
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
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  CardHeader,
  Tooltip
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
  FaCalculator,
  FaLock,
  FaEdit,
  FaInfoCircle,
  FaFilter
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

// Sample data for instructor courses
const instructorCoursesData = [
  { 
    id: 1, 
    name: 'Mathematics',
    grade: 'Grade 1',
    classes: ['Class 1A', 'Class 1B'],
    total: 100,
    editable: true,
    pending_approval: false
  },
  { 
    id: 2, 
    name: 'Science',
    grade: 'Grade 1',
    classes: ['Class 1A'],
    total: 100,
    editable: true,
    pending_approval: false
  },
  { 
    id: 8, 
    name: 'Science',
    grade: 'Grade 2',
    classes: ['Class 2A'],
    total: 100,
    editable: false,
    pending_approval: true
  }
];

// Sample grading scale
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

// Sample class data
const classesData = [
  { id: 1, name: 'Class 1A', grade: 'Grade 1' },
  { id: 2, name: 'Class 1B', grade: 'Grade 1' },
  { id: 3, name: 'Class 2A', grade: 'Grade 2' }
];

// Sample student data
const studentsData = [
  { 
    id: "ST001", 
    name: "John Doe", 
    class: "Class 1A",
    email: "john.doe@example.com", 
    parentEmail: "parent.doe@example.com", 
    grades: {
      1: 92, // Mathematics
      2: 88  // Science
    }
  },
  { 
    id: "ST002", 
    name: "Jane Smith", 
    class: "Class 1B",
    email: "jane.smith@example.com", 
    parentEmail: "parent.smith@example.com",
    grades: {
      1: 85 // Mathematics
    }
  },
  { 
    id: "ST003", 
    name: "Michael Johnson", 
    class: "Class 1A",
    email: "michael.j@example.com", 
    parentEmail: "parent.johnson@example.com",
    grades: {
      1: 78, // Mathematics
      2: 82  // Science
    }
  },
  { 
    id: "ST004", 
    name: "Emily Williams", 
    class: "Class 2A",
    email: "emily.w@example.com", 
    parentEmail: "parent.williams@example.com",
    grades: {
      8: 91  // Science
    }
  }
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

const InstructorReportCard = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [term, setTerm] = useState('First Term');
  const [institutionName, setInstitutionName] = useState('Lincoln Academy');
  
  // Selection state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Student grades state
  const [students, setStudents] = useState([]);
  const [editableGrades, setEditableGrades] = useState({});
  const [originalGrades, setOriginalGrades] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Modal state
  const [modalStudent, setModalStudent] = useState(null);
  const [modalGrade, setModalGrade] = useState("");
  const [modalComment, setModalComment] = useState("");
  
  // Filter students based on selected class and course
  useEffect(() => {
    if (selectedClass && selectedCourse) {
      const filteredStudents = studentsData.filter(student => 
        student.class === selectedClass.name && 
        student.grades.hasOwnProperty(selectedCourse.id)
      );
      
      setStudents(filteredStudents);
      
      // Initialize editable grades
      const grades = {};
      filteredStudents.forEach(student => {
        grades[student.id] = student.grades[selectedCourse.id];
      });
      
      setEditableGrades(grades);
      setOriginalGrades({...grades});
      setHasUnsavedChanges(false);
    } else {
      setStudents([]);
      setEditableGrades({});
      setOriginalGrades({});
      setHasUnsavedChanges(false);
    }
  }, [selectedClass, selectedCourse]);
  
  // Get available classes for selected course
  const getAvailableClasses = () => {
    if (!selectedCourse) return [];
    
    return classesData.filter(cls => 
      selectedCourse.classes.includes(cls.name)
    );
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedClass(null);
    setSelectedStudent(null);
  };
  
  // Handle class selection
  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSelectedStudent(null);
  };
  
  // Handle grade change
  const handleGradeChange = (studentId, value) => {
    // Ensure value is within valid range
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue < 0) numValue = 0;
    if (numValue > selectedCourse.total) numValue = selectedCourse.total;
    
    setEditableGrades(prev => ({
      ...prev,
      [studentId]: numValue
    }));
    
    setHasUnsavedChanges(true);
  };
  
  // Open student grade modal
  const openStudentGradeModal = (student) => {
    setModalStudent(student);
    setModalGrade(editableGrades[student.id].toString());
    setModalComment("");
    onOpen();
  };
  
  // Save grades
  const saveGrades = () => {
    // In a real app, this would be an API call
    toast({
      title: "Grades saved",
      description: "Student grades have been successfully updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    setOriginalGrades({...editableGrades});
    setHasUnsavedChanges(false);
  };
  
  // Save individual grade from modal
  const saveIndividualGrade = () => {
    if (modalStudent) {
      // Validate grade
      let numValue = parseFloat(modalGrade);
      if (isNaN(numValue)) numValue = 0;
      if (numValue < 0) numValue = 0;
      if (numValue > selectedCourse.total) numValue = selectedCourse.total;
      
      // Update grade
      setEditableGrades(prev => ({
        ...prev,
        [modalStudent.id]: numValue
      }));
      
      setHasUnsavedChanges(true);
      
      toast({
        title: "Grade updated",
        description: `Grade for ${modalStudent.name} has been updated to ${numValue}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    }
  };
  
  // Submit for approval
  const submitForApproval = () => {
    // In a real app, this would be an API call
    toast({
      title: "Submitted for approval",
      description: "Your grade changes have been submitted for approval",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    setOriginalGrades({...editableGrades});
    setHasUnsavedChanges(false);
  };
  
  // Calculate class average for current course
  const calculateClassAverage = () => {
    if (!students.length) return 'N/A';
    
    let total = 0;
    students.forEach(student => {
      total += editableGrades[student.id] || 0;
    });
    
    return (total / students.length).toFixed(1);
  };

  return (
    <>
      <InstructorSidebar />
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16}>
        <Container maxW="container.xl" px={6}>
          <VStack spacing={6} align="stretch">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
                <Icon as={FaFileAlt} mr={3} />
                Report Card
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
            
            <Text color="gray.600">View and update student grades for your courses. Only instructors can edit their own course grades.</Text>
            
            {hasUnsavedChanges && (
              <Alert status="warning">
                <AlertIcon />
                <AlertTitle>Unsaved changes!</AlertTitle>
                <AlertDescription>You have unsaved grade changes. Please save before leaving this page.</AlertDescription>
              </Alert>
            )}
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {/* Course Selection Column */}
              <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
                <Heading size="md" mb={4} color="#640101">
                  <Flex align="center">
                    <Icon as={FaBook} mr={2} />
                    My Courses
                  </Flex>
                </Heading>
                <VStack spacing={2} align="stretch">
                  {instructorCoursesData.map(course => (
                    <Button
                      key={course.id}
                      variant={selectedCourse?.id === course.id ? "solid" : "outline"}
                      colorScheme={selectedCourse?.id === course.id ? "red" : "gray"}
                      justifyContent="space-between"
                      onClick={() => handleCourseSelect(course)}
                      size="sm"
                      width="100%"
                      isDisabled={!course.editable && !course.pending_approval}
                      rightIcon={
                        course.pending_approval ? 
                          <Tooltip label="Pending approval"><Icon as={FaLock} color="orange.500" /></Tooltip> :
                          !course.editable ? 
                            <Tooltip label="Report cards finalized"><Icon as={FaLock} color="gray.500" /></Tooltip> : 
                            null
                      }
                    >
                      <HStack justify="space-between" width="100%">
                        <Text>{course.name}</Text>
                        <Badge colorScheme={course.pending_approval ? "orange" : "gray"}>
                          {course.grade}
                        </Badge>
                      </HStack>
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
                {selectedCourse ? (
                  <VStack spacing={2} align="stretch">
                    {getAvailableClasses().map(cls => (
                      <Button
                        key={cls.id}
                        variant={selectedClass?.id === cls.id ? "solid" : "outline"}
                        colorScheme={selectedClass?.id === cls.id ? "red" : "gray"}
                        justifyContent="flex-start"
                        onClick={() => handleClassSelect(cls)}
                        size="sm"
                        width="100%"
                      >
                        {cls.name}
                      </Button>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500">Please select a course first</Text>
                )}
              </Box>
              
              {/* Stats Column */}
              <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
                <Heading size="md" mb={4} color="#640101">
                  <Flex align="center">
                    <Icon as={FaCalculator} mr={2} />
                    Class Statistics
                  </Flex>
                </Heading>
                {selectedClass && selectedCourse ? (
                  <VStack spacing={3} align="stretch">
                    <Stat>
                      <StatLabel>Class Average</StatLabel>
                      <StatNumber>{calculateClassAverage()}</StatNumber>
                      <StatHelpText>
                        {getLetterGrade(parseFloat(calculateClassAverage()))}
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Total Students</StatLabel>
                      <StatNumber>{students.length}</StatNumber>
                    </Stat>
                    
                    <Divider />
                    
                    <Alert status="info" size="sm">
                      <AlertIcon />
                      <AlertDescription fontSize="sm">
                        Grades will be visible to students after institution approval
                      </AlertDescription>
                    </Alert>
                  </VStack>
                ) : (
                  <Text color="gray.500">Please select a course and class to view statistics</Text>
                )}
              </Box>
            </SimpleGrid>
            
            {/* Student Grades Table */}
            {selectedClass && selectedCourse && (
              <Card variant="outline" mt={6}>
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">
                      {selectedCourse.name} - {selectedClass.name} - Student Grades
                    </Heading>
                    
                    <HStack>
                      {hasUnsavedChanges && (
                        <Button 
                          leftIcon={<FaSave />}
                          colorScheme="green"
                          size="sm"
                          onClick={saveGrades}
                        >
                          Save Changes
                        </Button>
                      )}
                      
                      <Button 
                        leftIcon={<FaDownload />}
                        colorScheme="blue"
                        size="sm"
                        variant="outline"
                      >
                        Export
                      </Button>
                      
                      <Button 
                        leftIcon={<FaPrint />}
                        colorScheme="gray"
                        size="sm"
                        variant="outline"
                      >
                        Print
                      </Button>
                    </HStack>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Student ID</Th>
                          <Th>Name</Th>
                          <Th>Grade</Th>
                          <Th>Letter Grade</Th>
                          <Th>GPA Value</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {students.map(student => {
                          const currentGrade = editableGrades[student.id] || 0;
                          const letterGrade = getLetterGrade(currentGrade);
                          const gpaValue = getGpaValue(currentGrade);
                          const originalGrade = originalGrades[student.id] || 0;
                          const hasChanged = currentGrade !== originalGrade;
                          
                          return (
                            <Tr key={student.id} bg={hasChanged ? "yellow.50" : undefined}>
                              <Td>{student.id}</Td>
                              <Td fontWeight="medium">{student.name}</Td>
                              <Td>
                                <Input 
                                  value={currentGrade}
                                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                  size="sm"
                                  width="80px"
                                  textAlign="center"
                                  type="number"
                                  min={0}
                                  max={selectedCourse.total}
                                  isDisabled={!selectedCourse.editable}
                                />
                              </Td>
                              <Td>
                                <Badge colorScheme={
                                  letterGrade === 'A+' || letterGrade === 'A' || letterGrade === 'A-' ? "green" :
                                  letterGrade === 'B+' || letterGrade === 'B' || letterGrade === 'B-' ? "blue" :
                                  letterGrade === 'C+' || letterGrade === 'C' || letterGrade === 'C-' ? "yellow" :
                                  letterGrade === 'D+' || letterGrade === 'D' || letterGrade === 'D-' ? "orange" :
                                  "red"
                                }>
                                  {letterGrade}
                                </Badge>
                              </Td>
                              <Td>{gpaValue.toFixed(1)}</Td>
                              <Td>
                                <Button 
                                  leftIcon={<FaEdit />}
                                  size="xs"
                                  colorScheme="blue"
                                  variant="ghost"
                                  onClick={() => openStudentGradeModal(student)}
                                  isDisabled={!selectedCourse.editable}
                                >
                                  Edit
                                </Button>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                  
                  {hasUnsavedChanges && selectedCourse.editable && (
                    <Flex justify="flex-end" mt={4}>
                      <HStack>
                        <Button 
                          onClick={() => {
                            setEditableGrades({...originalGrades});
                            setHasUnsavedChanges(false);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Cancel Changes
                        </Button>
                        <Button 
                          leftIcon={<FaSave />}
                          colorScheme="green"
                          size="sm"
                          onClick={saveGrades}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          leftIcon={<FaEdit />}
                          colorScheme="blue"
                          size="sm"
                          onClick={submitForApproval}
                        >
                          Submit for Approval
                        </Button>
                      </HStack>
                    </Flex>
                  )}
                </CardBody>
              </Card>
            )}
            
            {/* Notes about Report Card System */}
            <Card variant="outline" mt={6} bg="gray.50">
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Heading size="sm" color="#640101">Report Card Guidelines for {institutionName}</Heading>
                  <Text fontSize="sm">
                    <Icon as={FaInfoCircle} mr={2} color="#640101" />
                    As an instructor, you can only update grades for subjects you teach. All grade changes must be submitted for approval by the institution.
                  </Text>
                  <Text fontSize="sm">
                    <Icon as={FaInfoCircle} mr={2} color="#640101" />
                    Grade submissions are due one week before the end of each term. Please ensure all grades are submitted on time.
                  </Text>
                  <Text fontSize="sm">
                    <Icon as={FaInfoCircle} mr={2} color="#640101" />
                    Contact the academic office if you notice any discrepancies in the student records or class assignments.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
      
      {/* Edit Grade Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Edit Student Grade
            {modalStudent && <Text fontSize="sm" fontWeight="normal" mt={1}>Student: {modalStudent.name}</Text>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Grade (out of {selectedCourse?.total || 100})</FormLabel>
                <Input 
                  value={modalGrade}
                  onChange={(e) => setModalGrade(e.target.value)}
                  type="number"
                  min={0}
                  max={selectedCourse?.total || 100}
                />
                <FormHelperText>
                  Letter Grade: {getLetterGrade(parseFloat(modalGrade) || 0)} | 
                  GPA: {getGpaValue(parseFloat(modalGrade) || 0).toFixed(1)}
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Comment (Optional)</FormLabel>
                <Input 
                  value={modalComment}
                  onChange={(e) => setModalComment(e.target.value)}
                  placeholder="Add a comment about this grade"
                />
                <FormHelperText>This comment will be visible to institution administrators</FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={saveIndividualGrade}>
              Save Grade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InstructorReportCard; 