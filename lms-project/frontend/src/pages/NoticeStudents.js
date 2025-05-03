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
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Select,
  Badge,
  useToast,
  Divider,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Collapse,
  List,
  ListItem,
  IconButton,
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaSearch, 
  FaBookOpen,
  FaUserGraduate,
  FaEdit,
  FaTrash,
  FaFilter,
  FaPlus,
  FaCheck,
  FaCheckCircle,
  FaBullhorn,
  FaTimes,
  FaFolder,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

// Sample data for classes
const sampleClasses = [
  {
    id: 1,
    name: 'Mathematics 101',
    instructor: 'Dr. John Smith',
    students: 32,
    gradingPeriods: ['Midterm', 'Final'],
    color: '#4299E1', // blue.400
    courses: [
      { id: 101, name: 'Algebra Fundamentals', status: 'active' },
      { id: 102, name: 'Geometry Basics', status: 'active' },
      { id: 103, name: 'Introduction to Calculus', status: 'planned' }
    ],
    studentsList: [
      { id: 1001, name: 'Alice Johnson', email: 'alice@example.com', grade: 'A-' },
      { id: 1002, name: 'Bob Smith', email: 'bob@example.com', grade: 'B+' },
      { id: 1003, name: 'Charlie Brown', email: 'charlie@example.com', grade: 'A' }
    ]
  },
  {
    id: 2,
    name: 'Introduction to Physics',
    instructor: 'Dr. Maria Rodriguez',
    students: 28,
    gradingPeriods: ['Quiz 1', 'Midterm', 'Quiz 2', 'Final'],
    color: '#48BB78', // green.400
    courses: [
      { id: 201, name: 'Mechanics', status: 'active' },
      { id: 202, name: 'Thermodynamics', status: 'active' },
      { id: 203, name: 'Electromagnetism', status: 'active' }
    ],
    studentsList: [
      { id: 2001, name: 'David Wilson', email: 'david@example.com', grade: 'B' },
      { id: 2002, name: 'Emma Davis', email: 'emma@example.com', grade: 'A' },
      { id: 2003, name: 'Frank Miller', email: 'frank@example.com', grade: 'C+' }
    ]
  },
  {
    id: 3,
    name: 'History 101',
    instructor: 'Prof. William Johnson',
    students: 25,
    gradingPeriods: ['Midterm', 'Essay', 'Final'],
    color: '#ED8936', // orange.400
    courses: [
      { id: 301, name: 'Ancient Civilizations', status: 'active' },
      { id: 302, name: 'Medieval History', status: 'active' },
      { id: 303, name: 'Modern History', status: 'active' }
    ],
    studentsList: [
      { id: 3001, name: 'Grace Lee', email: 'grace@example.com', grade: 'B+' },
      { id: 3002, name: 'Henry Wang', email: 'henry@example.com', grade: 'A-' },
      { id: 3003, name: 'Isabella Martinez', email: 'isabella@example.com', grade: 'B' }
    ]
  }
];

// Sample grades data
const gradesData = [
  { 
    id: 1, 
    name: 'Grade 1', 
    selected: false,
    classes: [
      { 
        id: 1, 
        name: 'Class 1A', 
        selected: false,
        students: [
          { id: "ST001", name: "John Doe", email: "john.doe@example.com", selected: false },
          { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", selected: false },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", selected: false }
        ]
      },
      { 
        id: 2, 
        name: 'Class 1B', 
        selected: false,
        students: [
          { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", selected: false },
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", selected: false }
        ]
      }
    ]
  },
  { 
    id: 2, 
    name: 'Grade 2', 
    selected: false,
    classes: [
      { 
        id: 3, 
        name: 'Class 2A', 
        selected: false,
        students: [
          { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", selected: false },
          { id: "ST007", name: "James Miller", email: "james.m@example.com", selected: false }
        ]
      }
    ]
  }
];

const NoticeStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [classes, setClasses] = useState(sampleClasses);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for student selection
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [expandedGrade, setExpandedGrade] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);
  const [grades, setGrades] = useState(gradesData);
  
  // Selected template from previous page
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Student search functionality
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentSearchResults, setStudentSearchResults] = useState([]);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);
  
  // Effect to get template from location state
  useEffect(() => {
    if (location.state && location.state.template) {
      setSelectedTemplate(location.state.template);
    }
  }, [location]);

  // Filter classes by search term
  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find all students across all grades and classes
  const getAllStudents = () => {
    const allStudents = [];
    grades.forEach(grade => {
      grade.classes.forEach(classItem => {
        classItem.students.forEach(student => {
          allStudents.push({
            ...student,
            gradeName: grade.name,
            className: classItem.name,
            gradeId: grade.id,
            classId: classItem.id
          });
        });
      });
    });
    return allStudents;
  };

  // Search students function
  const searchStudents = (term) => {
    if (!term.trim()) {
      setStudentSearchResults([]);
      return;
    }
    
    const allStudents = getAllStudents();
    const results = allStudents.filter(student => 
      student.name.toLowerCase().includes(term.toLowerCase()) ||
      student.id.toLowerCase().includes(term.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(term.toLowerCase()))
    );
    
    setStudentSearchResults(results);
  };

  // Handle student search input change
  const handleStudentSearchChange = (e) => {
    const value = e.target.value;
    setStudentSearchTerm(value);
    searchStudents(value);
  };

  // Clear student search
  const clearStudentSearch = () => {
    setStudentSearchTerm('');
    setStudentSearchResults([]);
    setIsSearchingStudents(false);
  };

  // Toggle student selection from search results
  const toggleStudentSelectionFromSearch = (student) => {
    const updatedGrades = [...grades];
    
    updatedGrades.forEach(grade => {
      if (grade.id === student.gradeId) {
        grade.classes.forEach(classItem => {
          if (classItem.id === student.classId) {
            classItem.students.forEach(s => {
              if (s.id === student.id) {
                s.selected = !s.selected;
              }
            });
          }
        });
      }
    });
    
    setGrades(updatedGrades);
  };

  // Handle class selection
  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setIsEditing(false);
  };

  // Go back to template selection
  const handleBackToTemplates = () => {
    navigate('/noticeboard/templates');
  };

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Toggle grade expansion
  const toggleGradeExpansion = (gradeId) => {
    if (expandedGrade === gradeId) {
      setExpandedGrade(null);
      setExpandedClass(null);
    } else {
      setExpandedGrade(gradeId);
      setExpandedClass(null);
    }
  };

  // Toggle class expansion
  const toggleClassExpansion = (classId) => {
    if (expandedClass === classId) {
      setExpandedClass(null);
    } else {
      setExpandedClass(classId);
    }
  };

  // Toggle grade selection
  const toggleGradeSelection = (gradeId) => {
    const updatedGrades = grades.map(grade => {
      if (grade.id === gradeId) {
        const newSelected = !grade.selected;
        
        // Update all classes and students in this grade
        const updatedClasses = grade.classes.map(classItem => ({
          ...classItem,
          selected: newSelected,
          students: classItem.students.map(student => ({
            ...student,
            selected: newSelected
          }))
        }));
        
        return {
          ...grade,
          selected: newSelected,
          classes: updatedClasses
        };
      }
      return grade;
    });
    
    setGrades(updatedGrades);
    
    // Update selectedGrades array
    if (selectedGrades.includes(gradeId)) {
      setSelectedGrades(selectedGrades.filter(id => id !== gradeId));
    } else {
      setSelectedGrades([...selectedGrades, gradeId]);
    }
  };

  // Toggle class selection
  const toggleClassSelection = (gradeId, classId) => {
    const updatedGrades = grades.map(grade => {
      if (grade.id === gradeId) {
        const updatedClasses = grade.classes.map(classItem => {
          if (classItem.id === classId) {
            const newSelected = !classItem.selected;
            
            // Update all students in this class
            const updatedStudents = classItem.students.map(student => ({
              ...student,
              selected: newSelected
            }));
            
            return {
              ...classItem,
              selected: newSelected,
              students: updatedStudents
            };
          }
          return classItem;
        });
        
        // Check if all classes are selected to update grade selection
        const allClassesSelected = updatedClasses.every(c => c.selected);
        const noClassesSelected = updatedClasses.every(c => !c.selected);
        
        return {
          ...grade,
          selected: allClassesSelected,
          classes: updatedClasses
        };
      }
      return grade;
    });
    
    setGrades(updatedGrades);
  };

  // Toggle student selection in grades tab
  const toggleStudentSelectionInGrades = (gradeId, classId, studentId) => {
    const updatedGrades = grades.map(grade => {
      if (grade.id === gradeId) {
        const updatedClasses = grade.classes.map(classItem => {
          if (classItem.id === classId) {
            const updatedStudents = classItem.students.map(student => {
              if (student.id === studentId) {
                return {
                  ...student,
                  selected: !student.selected
                };
              }
              return student;
            });
            
            // Check if all students are selected to update class selection
            const allStudentsSelected = updatedStudents.every(s => s.selected);
            const noStudentsSelected = updatedStudents.every(s => !s.selected);
            
            return {
              ...classItem,
              selected: allStudentsSelected,
              students: updatedStudents
            };
          }
          return classItem;
        });
        
        // Check if all classes are selected to update grade selection
        const allClassesSelected = updatedClasses.every(c => c.selected);
        
        return {
          ...grade,
          selected: allClassesSelected,
          classes: updatedClasses
        };
      }
      return grade;
    });
    
    setGrades(updatedGrades);
  };

  // Get count of selected students
  const getSelectedStudentsCount = () => {
    let count = 0;
    grades.forEach(grade => {
      grade.classes.forEach(classItem => {
        classItem.students.forEach(student => {
          if (student.selected) count++;
        });
      });
    });
    return count;
  };

  // Continue to compose notice
  const handleContinue = () => {
    const selectedStudentsCount = getSelectedStudentsCount();
    
    if (selectedStudentsCount === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one student to receive the notice",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!selectedTemplate) {
      toast({
        title: "No template selected",
        description: "Please go back and select a template first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Collect all selected students
    const recipients = [];
    grades.forEach(grade => {
      grade.classes.forEach(classItem => {
        classItem.students.forEach(student => {
          if (student.selected) {
            recipients.push(student);
          }
        });
      });
    });
    
    // Navigate to compose form with template and recipients
    navigate('/noticeboard/compose', { 
      state: { 
        template: selectedTemplate,
        recipients: recipients,
        recipientCount: selectedStudentsCount,
        selectedGrades: grades.filter(g => g.selected).map(g => g.name),
        selectedClasses: grades.flatMap(g => g.classes.filter(c => c.selected).map(c => c.name))
      } 
    });
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack spacing={3}>
              <Button
                leftIcon={<FaArrowLeft />}
                onClick={handleBackToTemplates}
                variant="outline"
                colorScheme="red"
              >
                Back to Templates
              </Button>
              <Heading as="h1" size="xl" color="#640101">
                Select Recipients
              </Heading>
            </HStack>
            <Button
              colorScheme="red"
              bg="#640101"
              size="lg"
              rightIcon={<FaArrowRight />}
              onClick={handleContinue}
              isDisabled={getSelectedStudentsCount() === 0}
            >
              Continue ({getSelectedStudentsCount()} selected)
            </Button>
          </Flex>

          <Box position="relative" mb={4}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search for students by name, ID, or email..."
                value={studentSearchTerm}
                onChange={handleStudentSearchChange}
                onFocus={() => setIsSearchingStudents(true)}
                bg="white"
                borderColor="#640101"
                _hover={{ borderColor: "red.600" }}
                _focus={{ borderColor: "red.600", boxShadow: "0 0 0 1px #640101" }}
              />
              {studentSearchTerm && (
                <InputRightElement>
                  <IconButton
                    aria-label="Clear search"
                    icon={<FaTimes />}
                    size="sm"
                    variant="ghost"
                    onClick={clearStudentSearch}
                  />
                </InputRightElement>
              )}
            </InputGroup>
            
            <Collapse in={isSearchingStudents && studentSearchResults.length > 0} animateOpacity>
              <Box 
                position="absolute" 
                top="100%" 
                left={0} 
                right={0} 
                bg="white" 
                shadow="lg" 
                borderRadius="md" 
                zIndex={10}
                maxH="300px"
                overflow="auto"
                mt={2}
                border="1px solid"
                borderColor="gray.200"
              >
                <List spacing={0}>
                  {studentSearchResults.map(student => (
                    <ListItem 
                      key={`${student.gradeId}-${student.classId}-${student.id}`}
                      p={3} 
                      borderBottom="1px solid" 
                      borderColor="gray.200"
                      bg={student.selected ? "green.50" : "white"}
                      _hover={{ bg: student.selected ? "green.100" : "gray.50" }}
                      cursor="pointer"
                      onClick={() => toggleStudentSelectionFromSearch(student)}
                    >
                      <Flex align="center">
                        <Checkbox 
                          colorScheme="green" 
                          isChecked={student.selected}
                          onChange={() => toggleStudentSelectionFromSearch(student)}
                          mr={3}
                        />
                        <Box flex="1">
                          <Flex align="center">
                            <Text fontWeight="bold">{student.name}</Text>
                            <Badge ml={2} colorScheme={student.selected ? "green" : "gray"}>
                              {student.id}
                            </Badge>
                            {student.selected && (
                              <Icon as={FaCheckCircle} color="green.500" ml={2} boxSize={4} />
                            )}
                          </Flex>
                          {student.email && (
                            <Text fontSize="sm" color="gray.600">{student.email}</Text>
                          )}
                          <Text fontSize="xs" color="gray.500">
                            {student.gradeName} → {student.className}
                          </Text>
                        </Box>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </Box>

          {selectedTemplate && (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text>
                Template: <strong>{selectedTemplate.title}</strong> - Select students to send this notice to
              </Text>
            </Alert>
          )}

          <Tabs isFitted variant="enclosed" colorScheme="red" index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList mb="1em">
              <Tab _selected={{ color: "white", bg: "#640101" }} fontWeight="medium">
                <Icon as={FaUserGraduate} mr={2} />
                Student List
              </Tab>
              <Tab _selected={{ color: "white", bg: "#640101" }} fontWeight="medium">
                <Icon as={FaBookOpen} mr={2} />
                Grades & Classes
              </Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel p={0}>
                {!selectedClass ? (
                  <>
                    <Flex mb={4}>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search classes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredClasses.map(classItem => (
                        <Box
                          key={classItem.id}
                          borderWidth="1px"
                          borderRadius="lg"
                          overflow="hidden"
                          boxShadow="md"
                          transition="all 0.3s"
                          _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                          onClick={() => handleClassClick(classItem)}
                          cursor="pointer"
                        >
                          <Box bg={classItem.color} p={4} color="white">
                            <Flex alignItems="center" justifyContent="space-between">
                              <Flex alignItems="center">
                                <Icon as={FaBookOpen} boxSize={5} mr={2} />
                                <Text fontWeight="bold" fontSize="lg">{classItem.name}</Text>
                              </Flex>
                              {selectedStudents.some(id => classItem.studentsList.map(s => s.id).includes(id)) && (
                                <Icon as={FaCheckCircle} color="white" boxSize={5} />
                              )}
                            </Flex>
                          </Box>
                          <Box p={4}>
                            <VStack align="stretch" spacing={1} mt={3}>
                              <Text fontSize="sm" color="gray.600">
                                Instructor: {classItem.instructor}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Students: {classItem.students}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Courses: {classItem.courses?.length || 0}
                              </Text>
                              {selectedStudents.some(id => classItem.studentsList.map(s => s.id).includes(id)) && (
                                <Badge colorScheme="green" p={2} mt={2} display="flex" alignItems="center" justifyContent="center">
                                  <Icon as={FaCheckCircle} color="white" mr={2} boxSize={4} /> Students Selected
                                </Badge>
                              )}
                            </VStack>
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </>
                ) : (
                  <>
                    <Flex justifyContent="space-between" alignItems="center" mb={6}>
                      <Button
                        leftIcon={<FaArrowLeft />}
                        variant="outline"
                        onClick={() => setSelectedClass(null)}
                      >
                        Back to Classes
                      </Button>
                      <Heading size="md" color="#640101">{selectedClass.name}</Heading>
                      <Box />
                    </Flex>

                    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb={6}>
                      <Table variant="simple">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th width="50px">Select</Th>
                            <Th>Student ID</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Grade</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {selectedClass.studentsList.map(student => (
                            <Tr key={student.id} _hover={{ bg: "gray.50" }}>
                              <Td>
                                <HStack spacing={2}>
                                  <Checkbox 
                                    colorScheme="green" 
                                    isChecked={selectedStudents.includes(student.id)}
                                    onChange={() => toggleStudentSelection(student.id)}
                                  />
                                </HStack>
                              </Td>
                              <Td>{student.id}</Td>
                              <Td>{student.name}</Td>
                              <Td>{student.email}</Td>
                              <Td>{student.grade}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>

                    <Flex justifyContent="space-between" mt={4}>
                      <Text>
                        Selected: {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''}
                      </Text>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => {
                          const allIds = selectedClass.studentsList.map(s => s.id);
                          if (selectedStudents.length === allIds.length) {
                            setSelectedStudents([]);
                          } else {
                            setSelectedStudents(allIds);
                          }
                        }}
                      >
                        {selectedStudents.length === selectedClass.studentsList.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </Flex>
                  </>
                )}
              </TabPanel>

              <TabPanel p={0}>
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th width="50px">Select</Th>
                        <Th>Name</Th>
                        <Th>Students</Th>
                        <Th width="100px">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {grades.map(grade => (
                        <React.Fragment key={grade.id}>
                          <Tr 
                            bg={expandedGrade === grade.id ? "gray.50" : undefined}
                            _hover={{ bg: "gray.50" }}
                          >
                            <Td>
                              <HStack spacing={2}>
                                <Checkbox 
                                  colorScheme="green" 
                                  isChecked={grade.selected}
                                  onChange={() => toggleGradeSelection(grade.id)}
                                />
                              </HStack>
                            </Td>
                            <Td fontWeight="bold">
                              <Flex align="center">
                                <Box position="relative" display="inline-block" mr={2}>
                                  <Icon as={FaFolder} color="#640101" boxSize={5} />
                                  {grade.selected && (
                                    <Icon 
                                      as={FaCheckCircle} 
                                      color="green.500" 
                                      boxSize={3} 
                                      position="absolute" 
                                      top="-1px" 
                                      right="-1px"
                                      bg="white"
                                      borderRadius="full"
                                    />
                                  )}
                                </Box>
                                {grade.name}
                                {grade.selected && (
                                  <Badge ml={2} colorScheme="green" display="flex" alignItems="center">
                                    <Icon as={FaCheckCircle} color="white" mr={1} boxSize={3} /> Selected
                                  </Badge>
                                )}
                              </Flex>
                            </Td>
                            <Td>
                              {grade.classes.reduce((total, c) => total + c.students.length, 0)} students in {grade.classes.length} classes
                            </Td>
                            <Td>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleGradeExpansion(grade.id)}
                              >
                                {expandedGrade === grade.id ? 'Hide' : 'Show'} Classes
                              </Button>
                            </Td>
                          </Tr>
                          
                          {expandedGrade === grade.id && grade.classes.map(classItem => (
                            <React.Fragment key={classItem.id}>
                              <Tr bg="gray.100" _hover={{ bg: "gray.200" }}>
                                <Td>
                                  <HStack spacing={2} ml={2}>
                                    <Checkbox 
                                      colorScheme="green" 
                                      isChecked={classItem.selected}
                                      onChange={() => toggleClassSelection(grade.id, classItem.id)}
                                    />
                                  </HStack>
                                </Td>
                                <Td pl={8}>
                                  <Flex align="center">
                                    <Box position="relative" display="inline-block" mr={2}>
                                      <Icon as={FaFolder} color="#640101" boxSize={5} />
                                      {classItem.selected && (
                                        <Icon 
                                          as={FaCheckCircle} 
                                          color="green.500" 
                                          boxSize={3} 
                                          position="absolute" 
                                          top="-1px" 
                                          right="-1px"
                                          bg="white"
                                          borderRadius="full"
                                        />
                                      )}
                                    </Box>
                                    {classItem.name}
                                    {classItem.selected && (
                                      <Badge ml={2} colorScheme="green" display="flex" alignItems="center">
                                        <Icon as={FaCheckCircle} color="white" mr={1} boxSize={3} /> Selected
                                      </Badge>
                                    )}
                                  </Flex>
                                </Td>
                                <Td>{classItem.students.length} students</Td>
                                <Td>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleClassExpansion(classItem.id)}
                                  >
                                    {expandedClass === classItem.id ? 'Hide' : 'Show'} Students
                                  </Button>
                                </Td>
                              </Tr>
                              
                              {expandedClass === classItem.id && classItem.students.map(student => (
                                <Tr key={student.id} bg="gray.50" _hover={{ bg: "gray.100" }}>
                                  <Td>
                                    <HStack spacing={2} ml={4}>
                                      <Checkbox 
                                        colorScheme="green" 
                                        isChecked={student.selected}
                                        onChange={() => toggleStudentSelectionInGrades(grade.id, classItem.id, student.id)}
                                      />
                                    </HStack>
                                  </Td>
                                  <Td pl={12}>
                                    <Flex align="center">
                                      <Box position="relative" display="inline-block" mr={2}>
                                        <Icon as={FaUserGraduate} color="#640101" boxSize={5} />
                                        {student.selected && (
                                          <Icon 
                                            as={FaCheckCircle} 
                                            color="green.500" 
                                            boxSize={3} 
                                            position="absolute" 
                                            top="-1px" 
                                            right="-1px"
                                            bg="white"
                                            borderRadius="full"
                                          />
                                        )}
                                      </Box>
                                      {student.name}
                                      {student.selected && (
                                        <Badge ml={2} colorScheme="green" display="flex" alignItems="center">
                                          <Icon as={FaCheckCircle} color="white" mr={1} boxSize={3} /> Selected
                                        </Badge>
                                      )}
                                    </Flex>
                                  </Td>
                                  <Td colSpan={2}>{student.email}</Td>
                                </Tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default NoticeStudents; 