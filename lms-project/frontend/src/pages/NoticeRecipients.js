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
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Icon,
  Checkbox,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  Badge,
  Divider,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Collapse,
  List,
  ListItem,
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaFolder, 
  FaBook, 
  FaUserGraduate, 
  FaCheckCircle,
  FaBullhorn,
  FaUsers,
  FaSearch,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Sample data structure - this would normally come from API/context
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
        courses: [
          { 
            id: 1, 
            name: 'Mathematics', 
            description: 'Basic mathematics concepts', 
            instructor: 'Dr. Johnson', 
            status: 'active', 
            selected: false,
            students: [
              { id: "ST001", name: "John Doe", email: "john.doe@example.com", selected: false },
              { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", selected: false },
              { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", selected: false }
            ]
          },
          { 
            id: 2, 
            name: 'Science', 
            description: 'Introduction to natural sciences', 
            instructor: 'Prof. Smith', 
            status: 'active', 
            selected: false,
            students: [
              { id: "ST001", name: "John Doe", email: "john.doe@example.com", selected: false },
              { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", selected: false }
            ]
          }
        ]
      },
      { 
        id: 2, 
        name: 'Class 1B', 
        selected: false,
        courses: [
          { 
            id: 4, 
            name: 'Mathematics', 
            description: 'Basic mathematics concepts', 
            instructor: 'Dr. Peterson', 
            status: 'active', 
            selected: false,
            students: [
              { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", selected: false },
              { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", selected: false }
            ]
          }
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
        courses: [
          { 
            id: 7, 
            name: 'Mathematics', 
            description: 'Intermediate mathematics', 
            instructor: 'Dr. Peterson', 
            status: 'active', 
            selected: false,
            students: [
              { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", selected: false },
              { id: "ST007", name: "James Miller", email: "james.m@example.com", selected: false }
            ]
          }
        ]
      }
    ]
  }
];

const NoticeRecipients = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [grades, setGrades] = useState(gradesData);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('grades');
  const [selectedCount, setSelectedCount] = useState({
    grades: 0,
    classes: 0,
    courses: 0,
    students: 0,
    total: 0
  });
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Find all students across all grades, classes, and courses
  const getAllStudents = () => {
    const allStudents = [];
    grades.forEach(grade => {
      grade.classes.forEach(classItem => {
        classItem.courses.forEach(course => {
          course.students.forEach(student => {
            allStudents.push({
              ...student,
              gradeName: grade.name,
              className: classItem.name,
              courseName: course.name,
              gradeId: grade.id,
              classId: classItem.id,
              courseId: course.id
            });
          });
        });
      });
    });
    return allStudents;
  };

  // Search students function
  const searchStudents = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    const allStudents = getAllStudents();
    const results = allStudents.filter(student => 
      student.name.toLowerCase().includes(term.toLowerCase()) ||
      student.id.toLowerCase().includes(term.toLowerCase()) ||
      student.email.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(results);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchStudents(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Toggle student selection from search results
  const toggleStudentSelectionFromSearch = (student) => {
    const updatedGrades = [...grades];
    
    updatedGrades.forEach(grade => {
      if (grade.id === student.gradeId) {
        grade.classes.forEach(classItem => {
          if (classItem.id === student.classId) {
            classItem.courses.forEach(course => {
              if (course.id === student.courseId) {
                course.students.forEach(s => {
                  if (s.id === student.id) {
                    s.selected = !s.selected;
                  }
                });
              }
            });
          }
        });
      }
    });
    
    setGrades(updatedGrades);
  };

  // Calculate selected items whenever grades data changes
  useEffect(() => {
    const counts = {
      grades: 0,
      classes: 0,
      courses: 0,
      students: 0,
      total: 0
    };

    grades.forEach(grade => {
      if (grade.selected) counts.grades++;

      grade.classes.forEach(classItem => {
        if (classItem.selected) counts.classes++;

        classItem.courses.forEach(course => {
          if (course.selected) counts.courses++;

          course.students.forEach(student => {
            if (student.selected) {
              counts.students++;
              counts.total++;
            }
          });
        });
      });
    });

    setSelectedCount(counts);
  }, [grades]);

  // Handle navigation back
  const handleBackClick = () => {
    if (currentLevel === 'students') {
      setCurrentLevel('courses');
      setSelectedCourse(null);
    } else if (currentLevel === 'courses') {
      setCurrentLevel('classes');
      setSelectedClass(null);
    } else if (currentLevel === 'classes') {
      setCurrentLevel('grades');
      setSelectedGrade(null);
    }
  };

  // Handle item click for navigation
  const handleItemClick = (item, level) => {
    if (level === 'grade') {
      setSelectedGrade(item);
      setCurrentLevel('classes');
    } else if (level === 'class') {
      setSelectedClass(item);
      setCurrentLevel('courses');
    } else if (level === 'course') {
      setSelectedCourse(item);
      setCurrentLevel('students');
    }
  };

  // Toggle selection for a single item
  const toggleSelection = (itemId, level) => {
    let updatedGrades = [...grades];

    if (level === 'grade') {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === itemId) {
          const newSelected = !grade.selected;
          
          // Update classes and courses when grade selection changes
          const updatedClasses = grade.classes.map(classItem => ({
            ...classItem,
            selected: newSelected,
            courses: classItem.courses.map(course => ({
              ...course,
              selected: newSelected,
              students: course.students.map(student => ({
                ...student,
                selected: newSelected
              }))
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
    } else if (level === 'class') {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === selectedGrade.id) {
          const updatedClasses = grade.classes.map(classItem => {
            if (classItem.id === itemId) {
              const newSelected = !classItem.selected;
              
              // Update courses when class selection changes
              const updatedCourses = classItem.courses.map(course => ({
                ...course,
                selected: newSelected,
                students: course.students.map(student => ({
                  ...student,
                  selected: newSelected
                }))
              }));
              
              return {
                ...classItem,
                selected: newSelected,
                courses: updatedCourses
              };
            }
            return classItem;
          });
          
          return {
            ...grade,
            classes: updatedClasses
          };
        }
        return grade;
      });
    } else if (level === 'course') {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: classItem.courses.map(course => {
                    if (course.id === itemId) {
                      const newSelected = !course.selected;
                      
                      // Update students when course selection changes
                      return {
                        ...course,
                        selected: newSelected,
                        students: course.students.map(student => ({
                          ...student,
                          selected: newSelected
                        }))
                      };
                    }
                    return course;
                  })
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
    } else if (level === 'student') {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: classItem.courses.map(course => {
                    if (course.id === selectedCourse.id) {
                      return {
                        ...course,
                        students: course.students.map(student => {
                          if (student.id === itemId) {
                            return {
                              ...student,
                              selected: !student.selected
                            };
                          }
                          return student;
                        })
                      };
                    }
                    return course;
                  })
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
    }

    setGrades(updatedGrades);
  };

  // Select all items at current level
  const selectAllAtCurrentLevel = () => {
    let updatedGrades = [...grades];

    if (currentLevel === 'grades') {
      updatedGrades = updatedGrades.map(grade => ({
        ...grade,
        selected: true,
        classes: grade.classes.map(classItem => ({
          ...classItem,
          selected: true,
          courses: classItem.courses.map(course => ({
            ...course,
            selected: true,
            students: course.students.map(student => ({
              ...student,
              selected: true
            }))
          }))
        }))
      }));
    } else if (currentLevel === 'classes' && selectedGrade) {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => ({
              ...classItem,
              selected: true,
              courses: classItem.courses.map(course => ({
                ...course,
                selected: true,
                students: course.students.map(student => ({
                  ...student,
                  selected: true
                }))
              }))
            }))
          };
        }
        return grade;
      });
    } else if (currentLevel === 'courses' && selectedGrade && selectedClass) {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: classItem.courses.map(course => ({
                    ...course,
                    selected: true,
                    students: course.students.map(student => ({
                      ...student,
                      selected: true
                    }))
                  }))
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
    } else if (currentLevel === 'students' && selectedGrade && selectedClass && selectedCourse) {
      updatedGrades = updatedGrades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: classItem.courses.map(course => {
                    if (course.id === selectedCourse.id) {
                      return {
                        ...course,
                        students: course.students.map(student => ({
                          ...student,
                          selected: true
                        }))
                      };
                    }
                    return course;
                  })
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
    }

    setGrades(updatedGrades);
  };

  // Handle continue button click
  const handleContinue = () => {
    if (selectedCount.total === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient for the notice",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here we would normally save the selection to context/state
    // and navigate to the template selection page
    toast({
      title: "Recipients selected",
      description: `You have selected ${selectedCount.total} recipients`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Navigate to notice template selection
    navigate('/noticeboard/templates');
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
              <Icon as={FaBullhorn} mr={3} />
              Noticeboard
            </Heading>
          </Flex>

          {/* Search Bar */}
          <Box position="relative" mb={4}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search for students by name, ID, or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearching(true)}
                bg="white"
                borderColor="#640101"
                _hover={{ borderColor: "red.600" }}
                _focus={{ borderColor: "red.600", boxShadow: "0 0 0 1px #640101" }}
              />
              {searchTerm && (
                <InputRightElement>
                  <IconButton
                    aria-label="Clear search"
                    icon={<FaTimes />}
                    size="sm"
                    variant="ghost"
                    onClick={clearSearch}
                  />
                </InputRightElement>
              )}
            </InputGroup>
            
            {/* Search Results */}
            <Collapse in={isSearching && searchResults.length > 0} animateOpacity>
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
                  {searchResults.map(student => (
                    <ListItem 
                      key={`${student.courseId}-${student.id}`}
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
                          <Text fontSize="sm" color="gray.600">{student.email}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {student.gradeName} → {student.className} → {student.courseName}
                          </Text>
                        </Box>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </Box>

          {/* Breadcrumb Navigation */}
          <Breadcrumb separator=">" mb={2}>
            <BreadcrumbItem isCurrentPage={currentLevel === 'grades'}>
              <BreadcrumbLink 
                onClick={() => setCurrentLevel('grades')}
                fontWeight={currentLevel === 'grades' ? 'bold' : 'normal'}
                color={currentLevel === 'grades' ? '#640101' : 'gray.500'}
              >
                Grades
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {selectedGrade && (
              <BreadcrumbItem isCurrentPage={currentLevel === 'classes'}>
                <BreadcrumbLink 
                  onClick={() => setCurrentLevel('classes')}
                  fontWeight={currentLevel === 'classes' ? 'bold' : 'normal'}
                  color={currentLevel === 'classes' ? '#640101' : 'gray.500'}
                >
                  {selectedGrade.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            
            {selectedClass && (
              <BreadcrumbItem isCurrentPage={currentLevel === 'courses'}>
                <BreadcrumbLink 
                  onClick={() => setCurrentLevel('courses')}
                  fontWeight={currentLevel === 'courses' ? 'bold' : 'normal'}
                  color={currentLevel === 'courses' ? '#640101' : 'gray.500'}
                >
                  {selectedClass.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            
            {selectedCourse && (
              <BreadcrumbItem isCurrentPage={currentLevel === 'students'}>
                <BreadcrumbLink
                  fontWeight="bold"
                  color="#640101"
                >
                  {selectedCourse.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>

          {/* Main Content Area */}
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              {currentLevel !== 'grades' && (
                <Button 
                  leftIcon={<FaArrowLeft />} 
                  variant="outline" 
                  colorScheme="red" 
                  onClick={handleBackClick}
                >
                  Back
                </Button>
              )}
              <Box>
                <Button
                  colorScheme="green"
                  leftIcon={<FaCheckCircle />}
                  onClick={selectAllAtCurrentLevel}
                  ml={currentLevel !== 'grades' ? 2 : 0}
                >
                  Select All {
                    currentLevel === 'grades' ? 'Grades' :
                    currentLevel === 'classes' ? 'Classes' :
                    currentLevel === 'courses' ? 'Courses' : 'Students'
                  }
                </Button>
              </Box>
            </Flex>

            {/* Selection Summary */}
            <Box p={4} bg="blue.50" borderRadius="md" mb={4}>
              <Heading size="sm" mb={2}>Selection Summary</Heading>
              <Flex wrap="wrap" gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Grades:</Text>
                  <Badge colorScheme="blue" fontSize="0.8em">{selectedCount.grades} selected</Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Classes:</Text>
                  <Badge colorScheme="green" fontSize="0.8em">{selectedCount.classes} selected</Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Courses:</Text>
                  <Badge colorScheme="purple" fontSize="0.8em">{selectedCount.courses} selected</Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Students:</Text>
                  <Badge colorScheme="orange" fontSize="0.8em">{selectedCount.students} selected</Badge>
                </Box>
                <Box ml="auto">
                  <Text fontSize="sm" fontWeight="bold">Total Recipients:</Text>
                  <Badge colorScheme="red" fontSize="0.8em">{selectedCount.total} selected</Badge>
                </Box>
              </Flex>
            </Box>

            {/* Item Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={8}>
              {/* Grades Level */}
              {currentLevel === 'grades' && grades.map(grade => (
                <Card 
                  key={grade.id}
                  cursor="pointer"
                  bg={grade.selected ? "green.50" : "white"}
                  borderWidth="1px"
                  borderColor={grade.selected ? "green.400" : "gray.200"}
                  borderRadius="lg"
                  overflow="hidden"
                  transition="all 0.2s"
                  _hover={{ 
                    transform: 'translateY(-5px)', 
                    shadow: 'md',
                    borderColor: grade.selected ? "green.500" : "#640101"
                  }}
                >
                  <CardHeader pb={2}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <HStack spacing={2}>
                        <Checkbox 
                          colorScheme="green"
                          isChecked={grade.selected}
                          onChange={() => toggleSelection(grade.id, 'grade')}
                          size="lg"
                        />
                      </HStack>
                      <IconButton
                        icon={<FaArrowRight />}
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleItemClick(grade, 'grade')}
                        aria-label="View classes"
                      />
                    </Flex>
                  </CardHeader>
                  <CardBody pt={0} textAlign="center" onClick={() => handleItemClick(grade, 'grade')}>
                    <Box position="relative">
                      <Icon as={FaFolder} fontSize="4xl" color="#640101" mb={3} />
                      {grade.selected && (
                        <Icon 
                          as={FaCheckCircle} 
                          color="green.500" 
                          fontSize="xl" 
                          position="absolute" 
                          top="0" 
                          right="0"
                          bg="white"
                          borderRadius="full"
                        />
                      )}
                    </Box>
                    <Text fontWeight="medium">{grade.name}</Text>
                    <Text fontSize="sm" color="gray.500">{grade.classes.length} classes</Text>
                  </CardBody>
                </Card>
              ))}

              {/* Classes Level */}
              {currentLevel === 'classes' && selectedGrade && 
                selectedGrade.classes.map(classItem => (
                  <Card 
                    key={classItem.id}
                    cursor="pointer"
                    bg={classItem.selected ? "green.50" : "white"}
                    borderWidth="1px"
                    borderColor={classItem.selected ? "green.400" : "gray.200"}
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.2s"
                    _hover={{ 
                      transform: 'translateY(-5px)', 
                      shadow: 'md',
                      borderColor: classItem.selected ? "green.500" : "#640101" 
                    }}
                  >
                    <CardHeader pb={2}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <HStack spacing={2}>
                          <Checkbox 
                            colorScheme="green"
                            isChecked={classItem.selected}
                            onChange={() => toggleSelection(classItem.id, 'class')}
                            size="lg"
                          />
                        </HStack>
                        <IconButton
                          icon={<FaArrowRight />}
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleItemClick(classItem, 'class')}
                          aria-label="View courses"
                        />
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0} textAlign="center" onClick={() => handleItemClick(classItem, 'class')}>
                      <Box position="relative">
                        <Icon as={FaFolder} fontSize="4xl" color="#640101" mb={3} />
                        {classItem.selected && (
                          <Icon 
                            as={FaCheckCircle} 
                            color="green.500" 
                            fontSize="xl" 
                            position="absolute" 
                            top="0" 
                            right="0"
                            bg="white"
                            borderRadius="full"
                          />
                        )}
                      </Box>
                      <Text fontWeight="medium">{classItem.name}</Text>
                      <Text fontSize="sm" color="gray.500">{classItem.courses.length} courses</Text>
                    </CardBody>
                  </Card>
                ))
              }

              {/* Courses Level */}
              {currentLevel === 'courses' && selectedGrade && selectedClass && 
                selectedClass.courses.map(course => (
                  <Card 
                    key={course.id}
                    cursor="pointer"
                    bg={course.selected ? "green.50" : "white"}
                    borderWidth="1px"
                    borderColor={course.selected ? "green.400" : "gray.200"}
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.2s"
                    _hover={{ 
                      transform: 'translateY(-5px)', 
                      shadow: 'md',
                      borderColor: course.selected ? "green.500" : "#640101" 
                    }}
                  >
                    <CardHeader pb={2}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <HStack spacing={2}>
                          <Checkbox 
                            colorScheme="green"
                            isChecked={course.selected}
                            onChange={() => toggleSelection(course.id, 'course')}
                            size="lg"
                          />
                        </HStack>
                        <IconButton
                          icon={<FaArrowRight />}
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleItemClick(course, 'course')}
                          aria-label="View students"
                        />
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0} textAlign="center" onClick={() => handleItemClick(course, 'course')}>
                      <Box position="relative">
                        <Icon as={FaBook} fontSize="4xl" color="#640101" mb={3} />
                        {course.selected && (
                          <Icon 
                            as={FaCheckCircle} 
                            color="green.500" 
                            fontSize="xl" 
                            position="absolute" 
                            top="0" 
                            right="0"
                            bg="white"
                            borderRadius="full"
                          />
                        )}
                      </Box>
                      <Text fontWeight="medium">{course.name}</Text>
                      <Text fontSize="sm" color="gray.500">{course.instructor}</Text>
                      <Badge mt={2} colorScheme={course.status === 'active' ? 'green' : 'yellow'}>
                        {course.status}
                      </Badge>
                      <Flex justify="center" align="center" mt={2}>
                        <Icon as={FaUserGraduate} color="gray.400" mr={1} />
                        <Text fontSize="sm" color="gray.500">{course.students.length} students</Text>
                      </Flex>
                    </CardBody>
                  </Card>
                ))
              }

              {/* Students Level */}
              {currentLevel === 'students' && selectedGrade && selectedClass && selectedCourse && 
                selectedCourse.students.map(student => (
                  <Card 
                    key={student.id}
                    cursor="pointer"
                    bg={student.selected ? "green.50" : "white"}
                    borderWidth="1px"
                    borderColor={student.selected ? "green.400" : "gray.200"}
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.2s"
                    onClick={() => toggleSelection(student.id, 'student')}
                    _hover={{ 
                      transform: 'translateY(-5px)', 
                      shadow: 'md',
                      borderColor: student.selected ? "green.500" : "#640101" 
                    }}
                  >
                    <CardHeader>
                      <HStack spacing={2}>
                        <Checkbox 
                          colorScheme="green"
                          isChecked={student.selected}
                          onChange={() => toggleSelection(student.id, 'student')}
                          size="lg"
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0} textAlign="center">
                      <Box position="relative">
                        <Icon as={FaUserGraduate} fontSize="4xl" color="#640101" mb={3} />
                        {student.selected && (
                          <Icon 
                            as={FaCheckCircle} 
                            color="green.500" 
                            fontSize="xl" 
                            position="absolute" 
                            top="0" 
                            right="0"
                            bg="white"
                            borderRadius="full"
                          />
                        )}
                      </Box>
                      <Text fontWeight="medium">{student.name}</Text>
                      <Text fontSize="sm" color="gray.500">{student.id}</Text>
                      <Text fontSize="sm" color="gray.500" mt={1} noOfLines={1}>{student.email}</Text>
                    </CardBody>
                  </Card>
                ))
              }
            </SimpleGrid>

            {/* Continue Button */}
            <Box position="fixed" bottom="0" right="0" left="250px" bg="white" p={4} borderTopWidth="1px" borderColor="gray.200" zIndex={10}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">
                  Selected: {selectedCount.total} recipients
                </Text>
                <Button
                  colorScheme="red"
                  bg="#640101"
                  size="lg"
                  rightIcon={<FaArrowRight />}
                  onClick={handleContinue}
                  isDisabled={selectedCount.total === 0}
                >
                  Continue to Choose Template
                </Button>
              </Flex>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default NoticeRecipients; 