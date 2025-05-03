import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Textarea,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Divider
} from '@chakra-ui/react';
import { FaPlus, FaChalkboard, FaUsers, FaBook, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/authContext';

// Mock data for courses
const mockCourses = [
  { id: 1, title: 'Introduction to Computer Science', code: 'CS101', instructor: 'Dr. Jane Smith' },
  { id: 2, title: 'Data Structures and Algorithms', code: 'CS201', instructor: 'Prof. Robert Johnson' },
  { id: 3, title: 'Database Management Systems', code: 'CS301', instructor: 'Dr. Emily Davis' },
  { id: 4, title: 'Web Development', code: 'CS401', instructor: 'Prof. Michael Brown' },
  { id: 5, title: 'Machine Learning', code: 'CS501', instructor: 'Dr. Sarah Wilson' }
];

// Mock data for students
const mockStudents = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', year: '2nd Year' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', year: '1st Year' },
  { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', year: '3rd Year' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', year: '2nd Year' },
  { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com', year: '4th Year' },
  { id: 6, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', year: '1st Year' },
  { id: 7, name: 'David Lee', email: 'david.lee@example.com', year: '3rd Year' },
  { id: 8, name: 'Lisa Taylor', email: 'lisa.taylor@example.com', year: '2nd Year' }
];

const CreateClass = () => {
  const toast = useToast();
  // const { user } = useAuth(); // Commented out to avoid lint warnings
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = '#640101';
  const headerColor = 'white';

  // State for class data
  const [classData, setClassData] = useState({
    name: '',
    description: '',
    selectedCourses: [],
    selectedStudents: []
  });

  // State for modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // State for courses and students
  const [courses] = useState(mockCourses);
  const [students] = useState(mockStudents);
  
  // State for temporary selections in modals
  const [tempSelectedCourses, setTempSelectedCourses] = useState([]);
  const [tempSelectedStudents, setTempSelectedStudents] = useState([]);

  // Initialize temp selections when modals open
  useEffect(() => {
    if (isCourseModalOpen) {
      setTempSelectedCourses([...classData.selectedCourses]);
    }
  }, [isCourseModalOpen, classData.selectedCourses]);

  useEffect(() => {
    if (isStudentModalOpen) {
      setTempSelectedStudents([...classData.selectedStudents]);
    }
  }, [isStudentModalOpen, classData.selectedStudents]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value
    });
  };

  // Handle course selection in modal
  const handleCourseSelect = (courseId) => {
    if (tempSelectedCourses.includes(courseId)) {
      setTempSelectedCourses(tempSelectedCourses.filter(id => id !== courseId));
    } else {
      setTempSelectedCourses([...tempSelectedCourses, courseId]);
    }
  };

  // Handle student selection in modal
  const handleStudentSelect = (studentId) => {
    if (tempSelectedStudents.includes(studentId)) {
      setTempSelectedStudents(tempSelectedStudents.filter(id => id !== studentId));
    } else {
      setTempSelectedStudents([...tempSelectedStudents, studentId]);
    }
  };

  // Confirm course selections
  const confirmCourseSelections = () => {
    setClassData({
      ...classData,
      selectedCourses: tempSelectedCourses
    });
    setIsCourseModalOpen(false);
    toast({
      title: "Courses selected",
      description: `${tempSelectedCourses.length} courses selected for the class.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Confirm student selections
  const confirmStudentSelections = () => {
    setClassData({
      ...classData,
      selectedStudents: tempSelectedStudents
    });
    setIsStudentModalOpen(false);
    toast({
      title: "Students added",
      description: `${tempSelectedStudents.length} students added to the class.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!classData.name.trim()) {
      toast({
        title: "Error",
        description: "Class name is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create class object
    const newClass = {
      id: Date.now(),
      name: classData.name,
      description: classData.description,
      courses: classData.selectedCourses.map(id => courses.find(course => course.id === id)),
      students: classData.selectedStudents.map(id => students.find(student => student.id === id)),
      createdAt: new Date().toISOString()
    };

    // Get existing classes from localStorage or initialize empty array
    const existingClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    
    // Add the new class to the array
    const updatedClasses = [...existingClasses, newClass];
    
    // Save back to localStorage
    localStorage.setItem('classes', JSON.stringify(updatedClasses));

    // In a real app, you would send this to an API
    console.log("New Class Created:", newClass);

    // Show success message
    toast({
      title: "Class created",
      description: `${newClass.name} has been created successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form
    setClassData({
      name: '',
      description: '',
      selectedCourses: [],
      selectedStudents: []
    });
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Box 
        bg={headerBgColor} 
        color={headerColor} 
        p={4} 
        borderRadius="md" 
        mb={6}
        backgroundImage="linear-gradient(135deg, #640101 0%, #8a0303 100%)"
      >
        <Flex align="center">
          <FaChalkboard size="24px" />
          <Heading size="lg" ml={3}>Create New Class</Heading>
        </Flex>
      </Box>

      <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Class Name */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Class Name</FormLabel>
              <Input 
                name="name"
                value={classData.name}
                onChange={handleChange}
                placeholder="Enter class name"
                size="lg"
              />
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Textarea
                name="description"
                value={classData.description}
                onChange={handleChange}
                placeholder="Enter class description"
                size="lg"
                rows={4}
              />
            </FormControl>

            {/* Selected Courses Display */}
            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <FormLabel fontWeight="bold" mb={0}>Courses</FormLabel>
                <Button 
                  leftIcon={<FaBook />} 
                  colorScheme="red" 
                  variant="outline"
                  onClick={() => setIsCourseModalOpen(true)}
                  size="sm"
                >
                  Select Courses
                </Button>
              </Flex>
              
              {classData.selectedCourses.length > 0 ? (
                <Box borderWidth="1px" borderRadius="md" p={3}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {classData.selectedCourses.map(courseId => {
                      const course = courses.find(c => c.id === courseId);
                      return (
                        <Flex 
                          key={course.id} 
                          p={2} 
                          borderWidth="1px" 
                          borderRadius="md"
                          justify="space-between"
                          align="center"
                          bg="gray.50"
                        >
                          <Box>
                            <Text fontWeight="bold">{course.title}</Text>
                            <Badge colorScheme="red">{course.code}</Badge>
                          </Box>
                          <IconButton
                            icon={<FaTimes />}
                            size="sm"
                            aria-label="Remove course"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => {
                              setClassData({
                                ...classData,
                                selectedCourses: classData.selectedCourses.filter(id => id !== course.id)
                              });
                            }}
                          />
                        </Flex>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ) : (
                <Box p={4} borderWidth="1px" borderRadius="md" borderStyle="dashed" textAlign="center">
                  <Text color="gray.500">No courses selected. Click "Select Courses" to add courses.</Text>
                </Box>
              )}
            </Box>

            {/* Selected Students Display */}
            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <FormLabel fontWeight="bold" mb={0}>Students</FormLabel>
                <Button 
                  leftIcon={<FaUsers />} 
                  colorScheme="red" 
                  variant="outline"
                  onClick={() => setIsStudentModalOpen(true)}
                  size="sm"
                >
                  Add Students
                </Button>
              </Flex>
              
              {classData.selectedStudents.length > 0 ? (
                <Box borderWidth="1px" borderRadius="md" p={3}>
                  <Table size="sm" variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Year</Th>
                        <Th width="50px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {classData.selectedStudents.map(studentId => {
                        const student = students.find(s => s.id === studentId);
                        return (
                          <Tr key={student.id}>
                            <Td fontWeight="medium">{student.name}</Td>
                            <Td>{student.email}</Td>
                            <Td>{student.year}</Td>
                            <Td>
                              <IconButton
                                icon={<FaTimes />}
                                size="xs"
                                aria-label="Remove student"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => {
                                  setClassData({
                                    ...classData,
                                    selectedStudents: classData.selectedStudents.filter(id => id !== student.id)
                                  });
                                }}
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Box p={4} borderWidth="1px" borderRadius="md" borderStyle="dashed" textAlign="center">
                  <Text color="gray.500">No students added. Click "Add Students" to add students.</Text>
                </Box>
              )}
            </Box>

            {/* Submit Button */}
            <Flex justify="flex-end" mt={4}>
              <Button 
                leftIcon={<FaPlus />} 
                colorScheme="red" 
                size="lg" 
                type="submit"
                bgColor="#640101"
                _hover={{ bg: '#8a0303' }}
              >
                Create Class
              </Button>
            </Flex>
          </VStack>
        </form>
      </Box>

      {/* Course Selection Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">Select Courses</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={4}>
            <VStack align="stretch" spacing={4}>
              <Text>Select the courses to include in this class:</Text>
              <Divider />
              {courses.map(course => (
                <Flex 
                  key={course.id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  justify="space-between"
                  align="center"
                  bg={tempSelectedCourses.includes(course.id) ? "red.50" : "white"}
                  borderColor={tempSelectedCourses.includes(course.id) ? "red.200" : "gray.200"}
                  transition="all 0.2s"
                  _hover={{ borderColor: "red.300", bg: "red.50" }}
                >
                  <Box>
                    <Text fontWeight="bold">{course.title}</Text>
                    <Flex align="center" mt={1}>
                      <Badge colorScheme="red" mr={2}>{course.code}</Badge>
                      <Text fontSize="sm" color="gray.600">Instructor: {course.instructor}</Text>
                    </Flex>
                  </Box>
                  <Checkbox 
                    colorScheme="red" 
                    isChecked={tempSelectedCourses.includes(course.id)}
                    onChange={() => handleCourseSelect(course.id)}
                    size="lg"
                  />
                </Flex>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              leftIcon={<FaCheck />}
              onClick={confirmCourseSelections}
              bgColor="#640101"
              _hover={{ bg: '#8a0303' }}
            >
              Confirm Selection ({tempSelectedCourses.length})
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Student Selection Modal */}
      <Modal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">Add Students</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={4}>
            <VStack align="stretch" spacing={4}>
              <Text>Select the students to add to this class:</Text>
              <Divider />
              <Table size="sm" variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Year</Th>
                    <Th width="80px">Select</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map(student => (
                    <Tr 
                      key={student.id}
                      bg={tempSelectedStudents.includes(student.id) ? "red.50" : "white"}
                      transition="all 0.2s"
                      _hover={{ bg: "red.50" }}
                    >
                      <Td fontWeight="medium">{student.name}</Td>
                      <Td>{student.email}</Td>
                      <Td>{student.year}</Td>
                      <Td>
                        <Checkbox 
                          colorScheme="red" 
                          isChecked={tempSelectedStudents.includes(student.id)}
                          onChange={() => handleStudentSelect(student.id)}
                          size="lg"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsStudentModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              leftIcon={<FaCheck />}
              onClick={confirmStudentSelections}
              bgColor="#640101"
              _hover={{ bg: '#8a0303' }}
            >
              Add Selected Students ({tempSelectedStudents.length})
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateClass;