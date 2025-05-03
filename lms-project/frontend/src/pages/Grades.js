import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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
  Badge,
  Checkbox,
  CheckboxGroup,
  Stack,
  Select,
  Divider,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FaFolder, 
  FaSearch, 
  FaGraduationCap,
  FaPlus,
  FaBookOpen,
  FaChalkboard,
  FaUserGraduate,
  FaEdit,
  FaTrash,
  FaSave,
  FaFilter
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Available courses that can be added to classes
const availableCourses = [
  { id: 'c001', name: 'IGCSE English Language', status: 'active' },
  { id: 'c002', name: 'IGCSE English Literature', status: 'active' },
  { id: 'c003', name: 'IGCSE Mathematics', status: 'active' },
  { id: 'c004', name: 'IGCSE Additional Mathematics', status: 'planned' },
  { id: 'c005', name: 'IGCSE Combined Science', status: 'active' },
  { id: 'c006', name: 'IGCSE Biology', status: 'active' },
  { id: 'c007', name: 'IGCSE Chemistry', status: 'active' },
  { id: 'c008', name: 'IGCSE Physics', status: 'active' },
  { id: 'c009', name: 'IGCSE Business Studies', status: 'planned' },
  { id: 'c010', name: 'IGCSE Computer Science', status: 'planned' },
  { id: 'c011', name: 'IB Mathematics HL', status: 'planned' },
  { id: 'c012', name: 'IB Physics HL', status: 'planned' }
];

// Available students that can be added to classes
const availableStudents = [
  { id: 's001', name: 'Alice Johnson', email: 'alice@example.com', grade: 'A-' },
  { id: 's002', name: 'Bob Smith', email: 'bob@example.com', grade: 'B+' },
  { id: 's003', name: 'Charlie Brown', email: 'charlie@example.com', grade: 'A' },
  { id: 's004', name: 'David Wilson', email: 'david@example.com', grade: 'B' },
  { id: 's005', name: 'Emma Davis', email: 'emma@example.com', grade: 'A' },
  { id: 's006', name: 'Frank Miller', email: 'frank@example.com', grade: 'C+' },
  { id: 's007', name: 'Grace Taylor', email: 'grace@example.com', grade: 'B+' },
  { id: 's008', name: 'Henry Adams', email: 'henry@example.com', grade: 'A-' },
  { id: 's009', name: 'Isla Robinson', email: 'isla@example.com', grade: 'B' },
  { id: 's010', name: 'Jack Evans', email: 'jack@example.com', grade: 'A' },
  { id: 's011', name: 'Kate White', email: 'kate@example.com', grade: 'B' },
  { id: 's012', name: 'Leo Thompson', email: 'leo@example.com', grade: 'B+' },
  { id: 's013', name: 'Mia Clark', email: 'mia@example.com', grade: 'A-' },
  { id: 's014', name: 'Noah Martin', email: 'noah@example.com', grade: 'B+' },
  { id: 's015', name: 'Olivia Harris', email: 'olivia@example.com', grade: 'A' },
  { id: 's016', name: 'Peter Brown', email: 'peter@example.com', grade: 'B' },
  { id: 's017', name: 'Quinn Lewis', email: 'quinn@example.com', grade: 'A-' },
  { id: 's018', name: 'Ryan Mitchell', email: 'ryan@example.com', grade: 'B+' }
];

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
    name: 'World History',
    instructor: 'Prof. James Wilson',
    students: 45,
    gradingPeriods: ['Assignment 1', 'Midterm', 'Assignment 2', 'Final'],
    color: '#9F7AEA', // purple.400
    courses: [
      { id: 301, name: 'Ancient Civilizations', status: 'active' },
      { id: 302, name: 'Medieval History', status: 'active' },
      { id: 303, name: 'Modern Era', status: 'planned' }
    ],
    studentsList: [
      { id: 3001, name: 'Grace Taylor', email: 'grace@example.com', grade: 'B+' },
      { id: 3002, name: 'Henry Adams', email: 'henry@example.com', grade: 'A-' },
      { id: 3003, name: 'Isla Robinson', email: 'isla@example.com', grade: 'B' }
    ]
  },
  {
    id: 4,
    name: 'English Literature',
    instructor: 'Dr. Sarah Johnson',
    students: 36,
    gradingPeriods: ['Essay 1', 'Midterm', 'Essay 2', 'Final'],
    color: '#ED8936', // orange.400
    courses: [
      { id: 401, name: 'Shakespeare', status: 'active' },
      { id: 402, name: 'American Literature', status: 'active' },
      { id: 403, name: 'Poetry Analysis', status: 'active' }
    ],
    studentsList: [
      { id: 4001, name: 'Jack Evans', email: 'jack@example.com', grade: 'A' },
      { id: 4002, name: 'Kate White', email: 'kate@example.com', grade: 'B' },
      { id: 4003, name: 'Leo Thompson', email: 'leo@example.com', grade: 'B+' }
    ]
  },
  {
    id: 5,
    name: 'Computer Science Fundamentals',
    instructor: 'Prof. Robert Lee',
    students: 29,
    gradingPeriods: ['Project 1', 'Midterm', 'Project 2', 'Final'],
    color: '#E53E3E', // red.400
    courses: [
      { id: 501, name: 'Programming Basics', status: 'active' },
      { id: 502, name: 'Data Structures', status: 'active' },
      { id: 503, name: 'Algorithms', status: 'planned' }
    ],
    studentsList: [
      { id: 5001, name: 'Mia Clark', email: 'mia@example.com', grade: 'A-' },
      { id: 5002, name: 'Noah Martin', email: 'noah@example.com', grade: 'B+' },
      { id: 5003, name: 'Olivia Harris', email: 'olivia@example.com', grade: 'A' }
    ]
  },
  {
    id: 6,
    name: 'Chemistry Basics',
    instructor: 'Dr. Emily Chen',
    students: 24,
    gradingPeriods: ['Lab 1', 'Midterm', 'Lab 2', 'Final'],
    color: '#38B2AC', // teal.400
    courses: [
      { id: 601, name: 'Periodic Table', status: 'active' },
      { id: 602, name: 'Chemical Reactions', status: 'active' },
      { id: 603, name: 'Organic Chemistry', status: 'planned' }
    ],
    studentsList: [
      { id: 6001, name: 'Peter Brown', email: 'peter@example.com', grade: 'B' },
      { id: 6002, name: 'Quinn Lewis', email: 'quinn@example.com', grade: 'A-' },
      { id: 6003, name: 'Ryan Mitchell', email: 'ryan@example.com', grade: 'B+' }
    ]
  }
];

const Grades = () => {
  const [classes, setClasses] = useState(() => {
    const savedClasses = localStorage.getItem('gradeClasses');
    // If saved data exists, parse and ensure all classes have necessary properties
    if (savedClasses) {
      try {
        const parsedClasses = JSON.parse(savedClasses);
        // Ensure each class has the required properties
        return parsedClasses.map(cls => ({
          ...cls,
          courses: cls.courses || [],
          studentsList: cls.studentsList || [],
          gradingPeriods: cls.gradingPeriods || []
        }));
      } catch (e) {
        console.error("Error parsing saved classes:", e);
        return sampleClasses;
      }
    }
    return sampleClasses;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCourses, setEditableCourses] = useState([]);
  const [editableStudents, setEditableStudents] = useState([]);
  
  // New state variables for course and student selection
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isAddingCourses, setIsAddingCourses] = useState(false);
  const [isAddingStudents, setIsAddingStudents] = useState(false);
  const [selectedCoursesToAdd, setSelectedCoursesToAdd] = useState([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState([]);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gradeClasses', JSON.stringify(classes));
  }, [classes]);
  
  // Filter classes based on search query
  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);
  
  // Filter available courses based on search term
  const filteredAvailableCourses = useMemo(() => {
    return availableCourses.filter(course => 
      course.name.toLowerCase().includes(courseSearchTerm.toLowerCase())
    );
  }, [courseSearchTerm]);
  
  // Filter available students based on search term
  const filteredAvailableStudents = useMemo(() => {
    return availableStudents.filter(student => 
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  }, [studentSearchTerm]);
  
  // Get courses that are not already in the class
  const availableCoursesForClass = useMemo(() => {
    if (!selectedClass) return [];
    const currentCourseIds = editableCourses.map(c => c.id);
    return filteredAvailableCourses.filter(course => !currentCourseIds.includes(course.id));
  }, [selectedClass, editableCourses, filteredAvailableCourses]);
  
  // Get students that are not already in the class
  const availableStudentsForClass = useMemo(() => {
    if (!selectedClass) return [];
    const currentStudentIds = editableStudents.map(s => s.id);
    return filteredAvailableStudents.filter(student => !currentStudentIds.includes(student.id));
  }, [selectedClass, editableStudents, filteredAvailableStudents]);
  
  // Handle folder click to open class details modal
  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setEditableCourses(classItem.courses ? [...classItem.courses] : []);
    setEditableStudents(classItem.studentsList ? [...classItem.studentsList] : []);
    setIsEditing(false);
    setIsAddingCourses(false);
    setIsAddingStudents(false);
    setSelectedCoursesToAdd([]);
    setSelectedStudentsToAdd([]);
    setCourseSearchTerm('');
    setStudentSearchTerm('');
    onOpen();
  };
  
  // Save edited class data
  const handleSaveClass = () => {
    const updatedClasses = classes.map(c => 
      c.id === selectedClass.id ? {
        ...c,
        courses: editableCourses || [],
        studentsList: editableStudents || [],
        students: editableStudents?.length || 0
      } : c
    );
    
    setClasses(updatedClasses);
    setIsEditing(false);
    setIsAddingCourses(false);
    setIsAddingStudents(false);
    
    toast({
      title: "Class updated",
      description: "Changes to the class have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Toggle course selection for adding to class
  const toggleCourseSelection = (courseId) => {
    setSelectedCoursesToAdd(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  
  // Toggle student selection for adding to class
  const toggleStudentSelection = (studentId) => {
    setSelectedStudentsToAdd(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  // Add selected courses to the class
  const handleAddSelectedCourses = () => {
    if (selectedCoursesToAdd.length === 0) {
      toast({
        title: "No courses selected",
        description: "Please select at least one course to add.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const coursesToAdd = availableCourses
      .filter(course => selectedCoursesToAdd.includes(course.id))
      .map(course => ({ ...course }));
    
    setEditableCourses([...editableCourses, ...coursesToAdd]);
    setSelectedCoursesToAdd([]);
    setIsAddingCourses(false);
    
    toast({
      title: "Courses added",
      description: `${coursesToAdd.length} course(s) added to the class.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Add selected students to the class
  const handleAddSelectedStudents = () => {
    if (selectedStudentsToAdd.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to add.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const studentsToAdd = availableStudents
      .filter(student => selectedStudentsToAdd.includes(student.id))
      .map(student => ({ ...student }));
    
    setEditableStudents([...editableStudents, ...studentsToAdd]);
    setSelectedStudentsToAdd([]);
    setIsAddingStudents(false);
    
    toast({
      title: "Students added",
      description: `${studentsToAdd.length} student(s) added to the class.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Remove a course from the class
  const handleRemoveCourse = (courseId) => {
    setEditableCourses(editableCourses.filter(course => course.id !== courseId));
    
    toast({
      title: "Course removed",
      description: "Remember to save changes to apply this update.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Remove a student from the class
  const handleRemoveStudent = (studentId) => {
    setEditableStudents(editableStudents.filter(student => student.id !== studentId));
    
    toast({
      title: "Student removed",
      description: "Remember to save changes to apply this update.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle updating a course
  const handleUpdateCourse = (courseId, field, value) => {
    setEditableCourses(editableCourses.map(course => {
      if (course.id === courseId) {
        return { ...course, [field]: value };
      }
      return course;
    }));
  };
  
  // Handle updating a student
  const handleUpdateStudent = (studentId, field, value) => {
    setEditableStudents(editableStudents.map(student => {
      if (student.id === studentId) {
        return { ...student, [field]: value };
      }
      return student;
    }));
  };
  
  // Handle modal close with confirmation for unsaved changes
  const handleCloseModal = () => {
    if (isEditing) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        setIsEditing(false);
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  // Navigate to other pages
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box pl="270px" pt="100px" pr="30px" pb="50px">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl" color="#640101" fontWeight="bold">
          <Flex alignItems="center">
            <Icon as={FaGraduationCap} mr={3} />
            Manage Classes
          </Flex>
        </Heading>
        
        <Flex gap={3}>
          <Button
            leftIcon={<FaBookOpen />}
            colorScheme="gray"
            variant="outline"
            onClick={() => handleNavigate('/create-course')}
          >
            Create Course
          </Button>
          <Button
            leftIcon={<FaChalkboard />}
            colorScheme="gray"
            variant="outline"
            onClick={() => handleNavigate('/create-class')}
          >
            Create Class
          </Button>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="red"
            variant="solid"
            bg="#640101"
            color="white"
            _hover={{ bg: "#450101" }}
            size="md"
            onClick={() => {
              // Temporary notification until create-class page is fully implemented
              toast({
                title: "Feature coming soon",
                description: "The ability to add classes will be available soon.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
              // handleNavigate('/create-class');
            }}
          >
            Add Class
          </Button>
        </Flex>
      </Flex>
      
      <Text fontSize="md" color="gray.600" mb={5}>
        Select a class to view and manage student grades
      </Text>
      
      <Flex mb={8}>
        <InputGroup maxW="500px">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search classes or instructors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            borderColor="gray.300"
            size="md"
          />
        </InputGroup>
        
        <Box ml={4}>
          <Button variant="outline" borderColor="gray.300">
            Sort By: Name
          </Button>
        </Box>
      </Flex>
      
      {classes.length === 0 ? (
        <Box 
          p={10} 
          textAlign="center" 
          borderWidth="1px" 
          borderRadius="lg"
          borderStyle="dashed"
        >
          <Icon as={FaFolder} boxSize={10} color="gray.400" mb={4} />
          <Heading size="md" mb={2}>No Classes Yet</Heading>
          <Text color="gray.500" mb={6}>
            Get started by creating your first class
          </Text>
          <Button 
            leftIcon={<FaPlus />} 
            colorScheme="red" 
            bgColor="#640101"
            onClick={() => {
              // Logic to create a new class
              toast({
                title: "Feature coming soon",
                description: "The ability to create classes will be available soon.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            Create Class
          </Button>
        </Box>
      ) : (
        <>
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
                  <Flex alignItems="center">
                    <Icon as={FaFolder} boxSize={5} mr={2} />
                    <Text fontWeight="bold" fontSize="lg">{classItem.name}</Text>
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
                      Grading Periods: {classItem.gradingPeriods?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Courses: {classItem.courses?.length || 0}
                    </Text>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          
          {filteredClasses.length === 0 && (
            <Box 
              p={10} 
              textAlign="center" 
              borderWidth="1px" 
              borderRadius="lg"
              borderStyle="dashed"
            >
              <Icon as={FaSearch} boxSize={10} color="gray.400" mb={4} />
              <Heading size="md" mb={2}>No Classes Found</Heading>
              <Text color="gray.500" mb={6}>
                Try adjusting your search query
              </Text>
              <Button 
                colorScheme="gray" 
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </Box>
          )}
        </>
      )}
      
      {/* Class Details Modal */}
      {selectedClass && (
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg={selectedClass.color} color="white">
              <Flex alignItems="center">
                <Icon as={FaFolder} mr={2} />
                {selectedClass.name}
              </Flex>
            </ModalHeader>
            <ModalCloseButton color="white" />
            
            <ModalBody p={6}>
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontWeight="bold" fontSize="lg">
                  Instructor: {selectedClass.instructor || 'N/A'}
                </Text>
                <Button
                  leftIcon={isEditing ? <FaSave /> : <FaEdit />}
                  colorScheme={isEditing ? "green" : "blue"}
                  size="sm"
                  onClick={isEditing ? handleSaveClass : () => setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Class"}
                </Button>
              </Flex>
              
              <Tabs colorScheme="red" variant="enclosed" mt={4}>
                <TabList>
                  <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
                    <Icon as={FaBookOpen} mr={2} />
                    Courses
                  </Tab>
                  <Tab _selected={{ color: "#640101", borderColor: "#640101", borderBottomColor: "white" }}>
                    <Icon as={FaUserGraduate} mr={2} />
                    Students
                  </Tab>
                </TabList>
                
                <TabPanels>
                  {/* Courses Tab */}
                  <TabPanel p={4}>
                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                      <Text fontWeight="bold">Courses in this Class</Text>
                      {isEditing && (
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme="green"
                          size="sm"
                          onClick={() => setIsAddingCourses(true)}
                        >
                          Add Course
                        </Button>
                      )}
                    </Flex>
                    
                    {isAddingCourses && (
                      <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                        <Flex justifyContent="space-between" alignItems="center" mb={3}>
                          <Heading size="sm" color="#640101">Select Courses to Add</Heading>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                              setIsAddingCourses(false);
                              setSelectedCoursesToAdd([]);
                              setCourseSearchTerm('');
                            }}
                          >
                            Cancel
                          </Button>
                        </Flex>
                        
                        <InputGroup mb={4}>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FaSearch} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search available courses..."
                            value={courseSearchTerm}
                            onChange={(e) => setCourseSearchTerm(e.target.value)}
                            bg="white"
                          />
                        </InputGroup>
                        
                        {availableCoursesForClass.length === 0 ? (
                          <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            {courseSearchTerm ? "No courses match your search." : "All available courses have already been added to this class."}
                          </Alert>
                        ) : (
                          <>
                            <Box maxH="200px" overflowY="auto" mb={4} borderWidth="1px" borderRadius="md" bg="white">
                              <CheckboxGroup>
                                <Stack spacing={0}>
                                  {availableCoursesForClass.map(course => (
                                    <Box 
                                      key={course.id} 
                                      p={2} 
                                      borderBottomWidth="1px"
                                      bg={selectedCoursesToAdd.includes(course.id) ? "blue.50" : "white"}
                                    >
                                      <Checkbox
                                        isChecked={selectedCoursesToAdd.includes(course.id)}
                                        onChange={() => toggleCourseSelection(course.id)}
                                        spacing={3}
                                        width="100%"
                                      >
                                        <Flex justifyContent="space-between" width="100%">
                                          <Text fontWeight="medium">{course.name}</Text>
                                          <Badge colorScheme={course.status === 'active' ? 'green' : 'blue'}>
                                            {course.status}
                                          </Badge>
                                        </Flex>
                                      </Checkbox>
                                    </Box>
                                  ))}
                                </Stack>
                              </CheckboxGroup>
                            </Box>
                            
                            <Flex justifyContent="space-between">
                              <Text fontSize="sm">{selectedCoursesToAdd.length} course(s) selected</Text>
                              <Button
                                colorScheme="green"
                                size="sm"
                                onClick={handleAddSelectedCourses}
                                isDisabled={selectedCoursesToAdd.length === 0}
                              >
                                Add Selected Courses
                              </Button>
                            </Flex>
                          </>
                        )}
                      </Box>
                    )}
                    
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Status</Th>
                          {isEditing && <Th width="100px">Actions</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {editableCourses.map(course => (
                          <Tr key={course.id}>
                            <Td>
                              {isEditing ? (
                                <Input
                                  value={course.name}
                                  size="sm"
                                  onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                                />
                              ) : (
                                course.name
                              )}
                            </Td>
                            <Td>
                              {isEditing ? (
                                <select
                                  value={course.status}
                                  onChange={(e) => handleUpdateCourse(course.id, 'status', e.target.value)}
                                  style={{ padding: '5px', borderRadius: '4px', borderColor: '#E2E8F0' }}
                                >
                                  <option value="active">Active</option>
                                  <option value="planned">Planned</option>
                                  <option value="completed">Completed</option>
                                </select>
                              ) : (
                                <Badge
                                  colorScheme={
                                    course.status === 'active' ? 'green' : 
                                    course.status === 'planned' ? 'blue' : 'gray'
                                  }
                                >
                                  {course.status}
                                </Badge>
                              )}
                            </Td>
                            {isEditing && (
                              <Td>
                                <Button
                                  colorScheme="red"
                                  size="xs"
                                  onClick={() => handleRemoveCourse(course.id)}
                                >
                                  <Icon as={FaTrash} />
                                </Button>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  
                  {/* Students Tab */}
                  <TabPanel p={4}>
                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                      <Text fontWeight="bold">Students in this Class</Text>
                      {isEditing && (
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme="green"
                          size="sm"
                          onClick={() => setIsAddingStudents(true)}
                        >
                          Add Student
                        </Button>
                      )}
                    </Flex>
                    
                    {isAddingStudents && (
                      <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                        <Flex justifyContent="space-between" alignItems="center" mb={3}>
                          <Heading size="sm" color="#640101">Select Students to Add</Heading>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                              setIsAddingStudents(false);
                              setSelectedStudentsToAdd([]);
                              setStudentSearchTerm('');
                            }}
                          >
                            Cancel
                          </Button>
                        </Flex>
                        
                        <InputGroup mb={4}>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FaSearch} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search available students..."
                            value={studentSearchTerm}
                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                            bg="white"
                          />
                        </InputGroup>
                        
                        {availableStudentsForClass.length === 0 ? (
                          <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            {studentSearchTerm ? "No students match your search." : "All available students have already been added to this class."}
                          </Alert>
                        ) : (
                          <>
                            <Box maxH="200px" overflowY="auto" mb={4} borderWidth="1px" borderRadius="md" bg="white">
                              <CheckboxGroup>
                                <Stack spacing={0}>
                                  {availableStudentsForClass.map(student => (
                                    <Box 
                                      key={student.id} 
                                      p={2} 
                                      borderBottomWidth="1px"
                                      bg={selectedStudentsToAdd.includes(student.id) ? "blue.50" : "white"}
                                    >
                                      <Checkbox
                                        isChecked={selectedStudentsToAdd.includes(student.id)}
                                        onChange={() => toggleStudentSelection(student.id)}
                                        spacing={3}
                                        width="100%"
                                      >
                                        <Flex justifyContent="space-between" width="100%" alignItems="center">
                                          <VStack spacing={0} align="start">
                                            <Text fontWeight="medium">{student.name}</Text>
                                            <Text fontSize="xs" color="gray.600">{student.email}</Text>
                                          </VStack>
                                          <Badge>Grade: {student.grade}</Badge>
                                        </Flex>
                                      </Checkbox>
                                    </Box>
                                  ))}
                                </Stack>
                              </CheckboxGroup>
                            </Box>
                            
                            <Flex justifyContent="space-between">
                              <Text fontSize="sm">{selectedStudentsToAdd.length} student(s) selected</Text>
                              <Button
                                colorScheme="green"
                                size="sm"
                                onClick={handleAddSelectedStudents}
                                isDisabled={selectedStudentsToAdd.length === 0}
                              >
                                Add Selected Students
                              </Button>
                            </Flex>
                          </>
                        )}
                      </Box>
                    )}
                    
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Email</Th>
                          <Th>Grade</Th>
                          {isEditing && <Th width="100px">Actions</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {editableStudents.map(student => (
                          <Tr key={student.id}>
                            <Td>
                              {isEditing ? (
                                <Input
                                  value={student.name}
                                  size="sm"
                                  onChange={(e) => handleUpdateStudent(student.id, 'name', e.target.value)}
                                />
                              ) : (
                                student.name
                              )}
                            </Td>
                            <Td>
                              {isEditing ? (
                                <Input
                                  value={student.email}
                                  size="sm"
                                  onChange={(e) => handleUpdateStudent(student.id, 'email', e.target.value)}
                                />
                              ) : (
                                student.email
                              )}
                            </Td>
                            <Td>
                              {isEditing ? (
                                <Input
                                  value={student.grade}
                                  size="sm"
                                  onChange={(e) => handleUpdateStudent(student.id, 'grade', e.target.value)}
                                />
                              ) : (
                                student.grade
                              )}
                            </Td>
                            {isEditing && (
                              <Td>
                                <Button
                                  colorScheme="red"
                                  size="xs"
                                  onClick={() => handleRemoveStudent(student.id)}
                                >
                                  <Icon as={FaTrash} />
                                </Button>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={handleCloseModal}>
                Close
              </Button>
              {isEditing && (
                <Button colorScheme="green" onClick={handleSaveClass}>
                  Save Changes
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Grades; 