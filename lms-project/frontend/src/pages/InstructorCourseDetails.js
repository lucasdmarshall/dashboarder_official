  import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, 
  Container, 
  Heading, 
  VStack, 
  HStack,
  Text, 
  Flex,
  Icon,
  Button,
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
  Input,
  Select,
  Textarea,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Grid,
  GridItem,
  Tooltip,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Radio,
  RadioGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton
} from '@chakra-ui/react';
import { 
  FaBook, 
  FaClipboardList, 
  FaFileUpload,
  FaFileAlt,
  FaPlus, 
  FaCalendar,
  FaCheckCircle,
  FaUsers,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaPencilAlt,
  FaInfoCircle,
  FaTrash,
  FaUpload,
  FaEye
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

// Color Palette
const COLOR_PALETTE = {
  primary: '#640101',    // Deep red
  secondary: 'black',    // Black
  accent: 'white',       // White
  background: 'white',   // White background
  text: 'black'          // Black text
};

// Color Palette for Modals
const MODAL_COLORS = {
  assignment: {
    header: '#640101',      // Deep red
    headerText: 'white',
    accent: 'blackAlpha.200',
    background: 'blackAlpha.50'
  },
  quiz: {
    header: '#640101',      // Deep red
    headerText: 'white',
    accent: 'blackAlpha.200',
    background: 'blackAlpha.50'
  }
};

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [studentReports, setStudentReports] = useState([
    {
      id: 'ST001',
      name: 'John Doe',
      rating: 4.5,
      assignments: [
        { 
          id: 'ASN1', 
          title: 'Midterm Project', 
          score: null, 
          submitted: true,
          submissionLink: '/path/to/submission1',
          submissionDate: '2024-02-10'
        },
        { 
          id: 'ASN2', 
          title: 'Final Presentation', 
          score: null, 
          submitted: false,
          submissionLink: null,
          submissionDate: null
        }
      ],
      quizzes: [
        { 
          id: 'QZ1', 
          title: 'Midterm Quiz', 
          score: null, 
          submitted: true,
          submissionLink: '/path/to/quiz1',
          submissionDate: '2024-02-15'
        },
        { 
          id: 'QZ2', 
          title: 'Final Exam', 
          score: null, 
          submitted: false,
          submissionLink: null,
          submissionDate: null
        }
      ]
    },
    {
      id: 'ST002',
      name: 'Jane Smith',
      rating: 4.8,
      assignments: [
        { 
          id: 'ASN1', 
          title: 'Midterm Project', 
          score: null, 
          submitted: true,
          submissionLink: '/path/to/submission2',
          submissionDate: '2024-02-11'
        },
        { 
          id: 'ASN2', 
          title: 'Final Presentation', 
          score: null, 
          submitted: false,
          submissionLink: null,
          submissionDate: null
        }
      ],
      quizzes: [
        { 
          id: 'QZ1', 
          title: 'Midterm Quiz', 
          score: null, 
          submitted: true,
          submissionLink: '/path/to/quiz2',
          submissionDate: '2024-02-16'
        },
        { 
          id: 'QZ2', 
          title: 'Final Exam', 
          score: null, 
          submitted: false,
          submissionLink: null,
          submissionDate: null
        }
      ]
    }
  ]);

  // Modal controls
  const assignmentModal = useDisclosure();
  const quizModal = useDisclosure();
  const materialModal = useDisclosure();
  const [editMarksModal, setEditMarksModal] = useState({
    isOpen: false,
    student: {
      id: '',
      name: '',
      rating: null,
      assignments: [],
      quizzes: []
    },
    selectedSubmission: null
  });

  // Assignment type state
  const [assignmentType, setAssignmentType] = useState('assignment');

  // State for quiz creation
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([
    { 
      id: Date.now(), 
      type: 'multiple-choice', 
      question: '', 
      options: ['', ''], 
      correctAnswer: null 
    }
  ]);

  // Quiz-related functions
  const addQuestion = () => {
    setQuizQuestions([
      ...quizQuestions, 
      { 
        id: Date.now(), 
        type: 'multiple-choice', 
        question: '', 
        options: ['', ''], 
        correctAnswer: null 
      }
    ]);
  };

  const removeQuestion = (questionId) => {
    setQuizQuestions(quizQuestions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId, updates) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const addOption = (questionId) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, ''] } 
        : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.filter((_, idx) => idx !== optionIndex) 
          } 
        : q
    ));
  };

  const handleCreateQuiz = () => {
    // Validate that all questions have content and the quiz has a title
    const isValid = quizTitle.trim() !== '' && 
      quizQuestions.every(q => 
        q.question.trim() !== '' && 
        (q.type !== 'multiple-choice' || q.options.some(opt => opt.trim() !== ''))
      );

    if (!isValid) {
      // Show an error toast or alert
      return;
    }

    const newQuiz = {
      id: Date.now(),
      type: 'quiz',
      title: quizTitle,
      questions: quizQuestions.map(q => ({
        ...q,
        // Trim whitespace from question and options
        question: q.question.trim(),
        options: q.type === 'multiple-choice' 
          ? q.options.map(opt => opt.trim()).filter(opt => opt !== '')
          : q.options
      })),
      createdAt: new Date().toLocaleDateString()
    };

    const updatedAssignments = [...assignments, newQuiz];
    setAssignments(updatedAssignments);
    localStorage.setItem(
      `course_${courseId}_assignments`, 
      JSON.stringify(updatedAssignments)
    );

    // Reset quiz state
    setQuizTitle('');
    setQuizQuestions([
      { 
        id: Date.now(), 
        type: 'multiple-choice', 
        question: '', 
        options: ['', ''], 
        correctAnswer: null 
      }
    ]);

    quizModal.onClose();
  };

  useEffect(() => {
    // Retrieve courses from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    
    // Find the specific course
    const foundCourse = storedCourses.find(c => c.id === parseInt(courseId));
    
    if (foundCourse) {
      setCourse({
        ...foundCourse,
        progress: 65,  // Mock progress, replace with actual calculation
        totalStudents: 42,  // Mock total students
        completedLectures: 8,
        totalLectures: 12
      });
      
      // Load assignments and materials
      const storedAssignments = JSON.parse(
        localStorage.getItem(`course_${courseId}_assignments`) || '[]'
      );
      const storedMaterials = JSON.parse(
        localStorage.getItem(`course_${courseId}_materials`) || '[]'
      );
      
      setAssignments(storedAssignments);
      setCourseMaterials(storedMaterials);
    } else {
      navigate('/instructor-courses');
    }
  }, [courseId, navigate]);

  const handleCreateAssignment = () => {
    const title = document.getElementById('assignmentTitle').value;
    const instructions = document.getElementById('assignmentInstructions').value;
    const fileInput = document.getElementById('assignmentAttachment');
    const attachedFile = fileInput.files[0];
    const dueDateInput = document.getElementById('assignmentDueDate');
    const dueDate = dueDateInput.value ? new Date(dueDateInput.value).toLocaleDateString() : null;

    const newAssignment = {
      id: Date.now(),
      type: 'assignment',
      title,
      instructions,
      attachment: attachedFile ? {
        name: attachedFile.name,
        type: attachedFile.type,
        size: attachedFile.size
      } : null,
      dueDate,
      createdAt: new Date().toLocaleDateString()
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    localStorage.setItem(
      `course_${courseId}_assignments`, 
      JSON.stringify(updatedAssignments)
    );

    assignmentModal.onClose();
  };

  // File type constants
  const FILE_TYPES = [
    { value: 'pdf', label: 'PDF', extensions: ['.pdf'] },
    { value: 'word', label: 'Word Document', extensions: ['.docx', '.doc', '.rtf'] },
    { value: 'text', label: 'Text Document', extensions: ['.txt', '.text'] },
    { value: 'video', label: 'Video', extensions: ['.mp4', '.avi', '.mov', '.mkv'] },
    { value: 'audio', label: 'Audio', extensions: ['.mp3', '.wav', '.aac', '.ogg'] }
  ];

  // State for material upload
  const [materialType, setMaterialType] = useState('pdf');
  const [materialFile, setMaterialFile] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type based on selected material type
      const selectedTypeObj = FILE_TYPES.find(type => type.value === materialType);
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      const isValidType = selectedTypeObj.extensions.includes(fileExtension);
      
      if (isValidType) {
        setMaterialFile(file);
      } else {
        // Show error or reset file selection
        alert(`Please select a ${selectedTypeObj.label.toLowerCase()} file. 
               Allowed extensions: ${selectedTypeObj.extensions.join(', ')}`);
        event.target.value = null;
      }
    }
  };

  const handleUploadMaterial = () => {
    const name = document.getElementById('materialName').value;
    const description = document.getElementById('materialDescription').value;
    const file = materialFile;

    if (!name || !file) {
      alert('Please provide a material name and select a file.');
      return;
    }

    const newMaterial = {
      id: Date.now(),
      name: name,
      type: materialType,
      description: description,
      file: file,
      uploadedAt: new Date().toLocaleDateString()
    };

    // Update course materials in localStorage
    const updatedMaterials = [...courseMaterials, newMaterial];
    localStorage.setItem(`course_${courseId}_materials`, JSON.stringify(updatedMaterials));
    
    // Update state
    setCourseMaterials(updatedMaterials);

    // Close modal and reset form
    materialModal.onClose();
    setMaterialFile(null);
    document.getElementById('materialName').value = '';
    document.getElementById('materialDescription').value = '';
  };

  const handleDeleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    localStorage.setItem(
      `course_${courseId}_assignments`, 
      JSON.stringify(updatedAssignments)
    );
  };

  const handleDeleteMaterial = (materialId) => {
    const updatedMaterials = courseMaterials.filter(m => m.id !== materialId);
    setCourseMaterials(updatedMaterials);
    localStorage.setItem(
      `course_${courseId}_materials`, 
      JSON.stringify(updatedMaterials)
    );
  };

  const openEditMarksModal = (student) => {
    setEditMarksModal({
      isOpen: true,
      student: student ? {...student} : {
        id: '',
        name: '',
        rating: null,
        assignments: [],
        quizzes: []
      },
      selectedSubmission: null
    });
  };

  const handleOpenSubmission = (submissionLink) => {
    // In a real implementation, this would open the submission 
    // For now, we'll just log the link
    window.open(submissionLink, '_blank');
  };

  // Function to calculate student rating automatically
  const calculateStudentRating = (student) => {
    // Collect all submitted assignments and quizzes with scores
    const submittedAssignments = student.assignments.filter(a => a.submitted && a.score !== null);
    const submittedQuizzes = student.quizzes.filter(q => q.submitted && q.score !== null);

    // Calculate total score
    const totalAssignmentScore = submittedAssignments.reduce((sum, assignment) => sum + assignment.score, 0);
    const totalQuizScore = submittedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);

    // Calculate total number of items
    const totalItems = submittedAssignments.length + submittedQuizzes.length;

    // Prevent division by zero
    if (totalItems === 0) return 0;

    // Calculate average score
    const averageScore = (totalAssignmentScore + totalQuizScore) / totalItems;

    // Convert to a 5-point rating scale
    // Assuming a max score of 100 for each item
    const rating = Math.min((averageScore / 20), 5).toFixed(1);

    return parseFloat(rating);
  };

  // Handle marking a submission and automatically update rating
  const handleMarkSubmission = (type, itemId, score) => {
    const updatedStudentReports = studentReports.map(student => {
      if (student.id === editMarksModal.student.id) {
        const updatedStudent = {...student};
        const items = type === 'assignment' ? updatedStudent.assignments : updatedStudent.quizzes;
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
          items[itemIndex].score = score;
        }

        // Automatically recalculate rating
        updatedStudent.rating = calculateStudentRating(updatedStudent);
        
        return updatedStudent;
      }
      return student;
    });

    setStudentReports(updatedStudentReports);
    localStorage.setItem(`course_${courseId}_studentReports`, JSON.stringify(updatedStudentReports));
  };

  // Function to handle navigating to assignment/quiz details
  const handleItemClick = (item, type) => {
    // Construct the navigation path based on type
    const basePath = type === 'assignment' 
      ? `/instructor-assignment-details` 
      : `/instructor-quiz-details`;
    
    // Navigate to the specific item's details page
    navigate(`${basePath}/${item.id}`);
  };

  if (!course) return <Box>Loading...</Box>;

  return (
    <Flex 
      bg={COLOR_PALETTE.background} 
      color={COLOR_PALETTE.text}
      minHeight="100vh"
    >
      <InstructorSidebar />
      
      <Box 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="85px" pb={8} px={6} position="relative"
      >
        <Container maxW="container.xl">
          {/* Course Header */}
          <Box 
            bg={COLOR_PALETTE.primary}
            color={COLOR_PALETTE.accent}
            p={6}
            borderRadius="xl"
            mb={6}
          >
            <VStack align="start" spacing={3}>
              <Heading size="lg">{course.title}</Heading>
              <Text>{course.description}</Text>
            </VStack>
          </Box>

          {/* Sections */}
          <Grid templateColumns="3fr 1fr" gap={6}>
            <GridItem>
              {/* Assignments Section */}
              <Box 
                bg={COLOR_PALETTE.accent}
                border="2px solid"
                borderColor={COLOR_PALETTE.primary}
                borderRadius="xl"
                p={6}
                mb={6}
              >
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading 
                    size="md" 
                    display="flex" 
                    alignItems="center"
                    color={COLOR_PALETTE.primary}
                  >
                    <Icon as={FaClipboardList} mr={3} />
                    Assignments
                  </Heading>
                  <HStack spacing={2}>
                    <Button 
                      leftIcon={<FaPlus />} 
                      bg={COLOR_PALETTE.primary}
                      color={COLOR_PALETTE.accent}
                      size="sm"
                      onClick={assignmentModal.onOpen}
                      _hover={{
                        bg: `${COLOR_PALETTE.primary}CC`
                      }}
                    >
                      Create Assignment
                    </Button>
                    <Button 
                      leftIcon={<FaPlus />} 
                      bg={COLOR_PALETTE.primary}
                      color={COLOR_PALETTE.accent}
                      size="sm"
                      onClick={quizModal.onOpen}
                      _hover={{
                        bg: `${COLOR_PALETTE.primary}CC`
                      }}
                    >
                      Create Quiz
                    </Button>
                  </HStack>
                </Flex>
                
                {assignments.length === 0 ? (
                  <Flex 
                    justify="center" 
                    align="center" 
                    direction="column"
                    p={10}
                    bg={COLOR_PALETTE.background}
                    borderRadius="xl"
                  >
                    <Icon 
                      as={FaClipboardList} 
                      boxSize={12} 
                      color={COLOR_PALETTE.primary}
                      mb={4}
                    />
                    <Text 
                      textAlign="center"
                      color={COLOR_PALETTE.text}
                    >
                      No assignments created yet
                    </Text>
                  </Flex>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {assignments.map((assignment) => (
                      <Box 
                        key={assignment.id} 
                        bg={MODAL_COLORS.assignment.background} 
                        borderRadius="lg" 
                        p={4} 
                        mb={3}
                        position="relative"
                        onClick={() => handleItemClick(assignment, assignment.type)}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          transform: 'scale(1.02)',
                          boxShadow: 'md',
                          bg: 'blackAlpha.100'
                        }}
                      >
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex={1}>
                            <Heading size="sm" color={COLOR_PALETTE.text}>
                              {assignment.title}
                            </Heading>
                            <Text fontSize="sm" color="brand.primary">
                              {assignment.instructions || 'No instructions provided'}
                            </Text>
                          </VStack>
                          
                          <VStack spacing={2} align="end">
                            {assignment.dueDate && (
                              <Tag colorScheme="green" size="sm">
                                <Icon as={FaCalendar} mr={2} />
                                <TagLabel>Due: {assignment.dueDate}</TagLabel>
                              </Tag>
                            )}
                            <Tag colorScheme="blue" size="sm">
                              <Icon as={FaCheckCircle} mr={2} />
                              <TagLabel>Created: {assignment.createdAt}</TagLabel>
                            </Tag>
                            
                            <Tooltip label="Delete Assignment">
                              <IconButton 
                                icon={<FaTrash />} 
                                colorScheme="red"
                                variant="ghost"
                                size="sm"
                                position="absolute"
                                top={2}
                                right={2}
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              />
                            </Tooltip>
                          </VStack>
                        </Flex>
                        
                        {assignment.attachment && (
                          <Flex 
                            mt={3} 
                            align="center" 
                            bg="brand.primary" 
                            p={2} 
                            borderRadius="md"
                          >
                            <Icon as={FaFileAlt} mr={2} />
                            <Text>{assignment.attachment.name}</Text>
                          </Flex>
                        )}
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>

              {/* Course Materials Section */}
              <Box 
                bg={COLOR_PALETTE.accent}
                border="2px solid"
                borderColor={COLOR_PALETTE.primary}
                borderRadius="xl"
                p={6}
              >
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading 
                    size="md" 
                    display="flex" 
                    alignItems="center"
                    color={COLOR_PALETTE.primary}
                  >
                    <Icon as={FaFileUpload} mr={3} />
                    Course Materials
                  </Heading>
                  <Button 
                    leftIcon={<FaPlus />} 
                    bg={COLOR_PALETTE.primary}
                    color={COLOR_PALETTE.accent}
                    size="sm"
                    onClick={materialModal.onOpen}
                    _hover={{
                      bg: `${COLOR_PALETTE.primary}CC`
                    }}
                  >
                    Upload Material
                  </Button>
                </Flex>
                
                {courseMaterials.length === 0 ? (
                  <Flex 
                    justify="center" 
                    align="center" 
                    direction="column"
                    p={10}
                    bg={COLOR_PALETTE.background}
                    borderRadius="xl"
                  >
                    <Icon 
                      as={FaFileAlt} 
                      boxSize={12} 
                      color={COLOR_PALETTE.primary}
                      mb={4}
                    />
                    <Text 
                      textAlign="center"
                      color={COLOR_PALETTE.text}
                    >
                      No course materials uploaded yet
                    </Text>
                  </Flex>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {courseMaterials.map((material) => (
                      <Box 
                        key={material.id} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        p={4} 
                        mb={3}
                        position="relative"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Flex align="center">
                          <Icon 
                            as={FaFileAlt} 
                            boxSize={6} 
                            color="brand.primary0" 
                            mr={3} 
                          />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{material.name}</Text>
                            <Text fontSize="sm" color="brand.primary0">
                              {material.fileName}
                            </Text>
                          </VStack>
                        </Flex>
                        
                        <VStack spacing={2} align="end">
                          <Tag colorScheme="blue" size="sm">
                            <Icon as={FaCheckCircle} mr={2} />
                            <TagLabel>Uploaded: {material.uploadedAt}</TagLabel>
                          </Tag>
                          
                          <Tooltip label="Delete Material">
                            <IconButton 
                              icon={<FaTrash />} 
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMaterial(material.id)}
                            />
                          </Tooltip>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </GridItem>

            {/* Sidebar Analytics */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                <Box 
                  bg={COLOR_PALETTE.primary}
                  color={COLOR_PALETTE.accent}
                  p={6}
                  borderRadius="xl"
                >
                  <Heading size="md" mb={4} color={COLOR_PALETTE.text}>
                    <Icon as={FaUsers} mr={3} />
                    Course Statistics
                  </Heading>
                  
                  <VStack spacing={4} align="stretch">
                    <Stat>
                      <StatLabel>Total Students</StatLabel>
                      <StatNumber color={COLOR_PALETTE.primary}>
                        {course.totalStudents}
                      </StatNumber>
                      <StatHelpText>
                        Enrolled in this course
                      </StatHelpText>
                    </Stat>
                    
                    <Divider />
                    
                    <Stat>
                      <StatLabel>Lectures</StatLabel>
                      <StatNumber color={COLOR_PALETTE.secondary}>
                        {course.completedLectures}/{course.totalLectures}
                      </StatNumber>
                      <StatHelpText>
                        Completed lectures
                      </StatHelpText>
                    </Stat>
                  </VStack>
                </Box>

                <Box 
                  bg={COLOR_PALETTE.primary}
                  color={COLOR_PALETTE.accent}
                  p={6}
                  borderRadius="xl"
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading size="md" display="flex" alignItems="center">
                      <Icon as={FaUsers} mr={3} />
                      Course Enrollment Reports
                    </Heading>
                  </Flex>

                  <TableContainer>
                    <Table variant="simple" colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th color={COLOR_PALETTE.accent}>Student ID</Th>
                          <Th color={COLOR_PALETTE.accent}>Name</Th>
                          <Th color={COLOR_PALETTE.accent}>Rating</Th>
                          <Th color={COLOR_PALETTE.accent} textAlign="center">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {studentReports.map((student) => (
                          <Tr key={student.id}>
                            <Td>{student.id}</Td>
                            <Td>{student.name}</Td>
                            <Td>{student.rating}</Td>
                            <Td textAlign="center">
                              <Button 
                                size="sm"
                                bg={COLOR_PALETTE.accent}
                                color={COLOR_PALETTE.primary}
                                onClick={() => openEditMarksModal(student)}
                                _hover={{
                                  bg: 'whiteAlpha.800'
                                }}
                              >
                                Edit Marks
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Container>

        {/* Assignment Modal */}
        <Modal 
          isOpen={assignmentModal.isOpen} 
          onClose={assignmentModal.onClose}
          size="xl"
          motionPreset="slideInBottom"
          scrollBehavior="inside"
        >
          <ModalOverlay 
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
          />
          <ModalContent 
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
          >
            <ModalHeader 
              bg={MODAL_COLORS.assignment.header}
              color={MODAL_COLORS.assignment.headerText}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={2}
            >
              <Flex align="center">
                <Icon as={FaPencilAlt} mr={3} />
                <Text>Create New Assignment</Text>
              </Flex>
              <ModalCloseButton 
                position="static" 
                color={MODAL_COLORS.assignment.headerText}
              />
            </ModalHeader>
            
            <ModalBody 
              pt={6} 
              pb={6} 
              bg={MODAL_COLORS.assignment.background}
            >
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Assignment Title</FormLabel>
                  <Input 
                    id="assignmentTitle"
                    placeholder="Enter assignment title" 
                    required
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Assignment Instructions</FormLabel>
                  <Textarea 
                    id="assignmentInstructions"
                    placeholder="Provide detailed instructions for the assignment"
                    minHeight="150px"
                    required
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <Flex align="center">
                    <Input 
                      id="assignmentDueDate"
                      type="date"
                      width="full"
                      placeholder="Select due date"
                    />
                    <Button 
                      ml={2} 
                      variant="ghost" 
                      colorScheme="red"
                      onClick={() => {
                        document.getElementById('assignmentDueDate').value = '';
                      }}
                    >
                      Clear
                    </Button>
                  </Flex>
                  <Text fontSize="xs" color="brand.primary0" mt={1}>
                    <Icon as={FaInfoCircle} mr={1} />
                    Leave blank if no specific due date is required
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Attach Assignment Materials (Optional)</FormLabel>
                  <Flex 
                    align="center" 
                    border="2px dashed" 
                    borderColor="brand.primary" 
                    p={4} 
                    borderRadius="md"
                    flexDirection="column"
                  >
                    <Input 
                      id="assignmentAttachment"
                      type="file"
                      multiple
                      position="absolute"
                      opacity="0"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      cursor="pointer"
                      zIndex="1"
                    />
                    <VStack spacing={3} textAlign="center">
                      <Icon 
                        as={FaFileUpload} 
                        boxSize={10} 
                        color="brand.primary0" 
                      />
                      <Text color="brand.primary0">
                        Drag and drop files here or click to upload
                      </Text>
                      <Text fontSize="sm" color="brand.primary">
                        Supported formats: PDF, DOCX, TXT (Max 50MB)
                      </Text>
                    </VStack>
                  </Flex>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter 
              bg={MODAL_COLORS.assignment.background}
              borderTop="1px"
              borderColor={MODAL_COLORS.assignment.accent}
            >
              <Button 
                colorScheme="blue"
                mr={3}
                onClick={handleCreateAssignment}
                leftIcon={<FaPlus />}
              >
                Create Assignment
              </Button>
              <Button 
                variant="ghost"
                onClick={assignmentModal.onClose}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Quiz Modal */}
        <Modal 
          isOpen={quizModal.isOpen} 
          onClose={quizModal.onClose}
          size="4xl"
          motionPreset="slideInBottom"
          scrollBehavior="inside"
        >
          <ModalOverlay 
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
          />
          <ModalContent 
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
          >
            <ModalHeader 
              bg={MODAL_COLORS.quiz.header}
              color={MODAL_COLORS.quiz.headerText}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={2}
            >
              <Flex align="center">
                <Icon as={FaQuestionCircle} mr={3} />
                <Text>Create New Quiz</Text>
              </Flex>
              <ModalCloseButton 
                position="static" 
                color={MODAL_COLORS.quiz.headerText}
              />
            </ModalHeader>
            
            <ModalBody 
              pt={6} 
              pb={6} 
              bg={MODAL_COLORS.quiz.background}
            >
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Quiz Title</FormLabel>
                  <Input 
                    placeholder="Enter quiz title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.quiz.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.quiz.header
                    }}
                  />
                </FormControl>

                <Divider my={4} borderColor={MODAL_COLORS.quiz.accent} />

                <VStack spacing={6} align="stretch">
                  {quizQuestions.map((question, questionIndex) => (
                    <Box 
                      key={question.id} 
                      bg={MODAL_COLORS.quiz.background} 
                      borderRadius="lg" 
                      p={4} 
                      mb={3}
                      position="relative"
                      onClick={() => handleItemClick(question, question.type)}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        transform: 'scale(1.02)',
                        boxShadow: 'md',
                        bg: 'blackAlpha.100'
                      }}
                    >
                      {/* Question Type Selector */}
                      <Flex mb={4} align="center">
                        <Select 
                          width="200px" 
                          mr={4}
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { 
                            type: e.target.value,
                            // Reset options and correct answer when changing type
                            options: e.target.value === 'multiple-choice' ? ['', ''] : [],
                            correctAnswer: null 
                          })}
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="true-false">True/False</option>
                        </Select>
                        
                        {quizQuestions.length > 1 && (
                          <Tooltip label="Remove Question">
                            <IconButton 
                              icon={<FaTrash />} 
                              variant="ghost" 
                              colorScheme="red"
                              onClick={() => removeQuestion(question.id)}
                              position="absolute"
                              right={4}
                              top={4}
                            />
                          </Tooltip>
                        )}
                      </Flex>

                      {/* Question Input */}
                      <FormControl mb={4}>
                        <Input 
                          placeholder={`Question ${questionIndex + 1}`}
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          isRequired
                        />
                      </FormControl>

                      {/* Question Type Specific Inputs */}
                      {question.type === 'multiple-choice' && (
                        <VStack spacing={2} align="stretch">
                          {question.options.map((option, optionIndex) => (
                            <Flex key={optionIndex} align="center">
                              <Radio 
                                mr={3}
                                isChecked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                              />
                              <Input 
                                flex={1}
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(question.id, { options: newOptions });
                                }}
                              />
                              {question.options.length > 2 && (
                                <Tooltip label="Remove Option">
                                  <IconButton 
                                    icon={<FaTrash />} 
                                    variant="ghost" 
                                    colorScheme="red"
                                    ml={2}
                                    size="sm"
                                    onClick={() => removeOption(question.id, optionIndex)}
                                  />
                                </Tooltip>
                              )}
                            </Flex>
                          ))}
                          <Button 
                            leftIcon={<FaPlus />} 
                            variant="outline" 
                            colorScheme="blue"
                            onClick={() => addOption(question.id)}
                          >
                            Add Option
                          </Button>
                        </VStack>
                      )}

                      {question.type === 'short-answer' && (
                        <Textarea 
                          placeholder="Short answer response" 
                          isReadOnly
                        />
                      )}

                      {question.type === 'true-false' && (
                        <HStack>
                          <Radio 
                            value="true" 
                            isChecked={question.correctAnswer === 'true'}
                            onChange={() => updateQuestion(question.id, { correctAnswer: 'true' })}
                          >
                            True
                          </Radio>
                          <Radio 
                            value="false" 
                            isChecked={question.correctAnswer === 'false'}
                            onChange={() => updateQuestion(question.id, { correctAnswer: 'false' })}
                          >
                            False
                          </Radio>
                        </HStack>
                      )}
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </ModalBody>

            <ModalFooter 
              bg={MODAL_COLORS.quiz.background}
              borderTop="1px"
              borderColor={MODAL_COLORS.quiz.accent}
            >
              <Button 
                colorScheme="green"
                mr={3}
                onClick={handleCreateQuiz}
                leftIcon={<FaCheckCircle />}
                isDisabled={
                  quizTitle.trim() === '' || 
                  quizQuestions.some(q => 
                    q.question.trim() === '' || 
                    (q.type === 'multiple-choice' && q.options.every(opt => opt.trim() === ''))
                  )
                }
              >
                Create Quiz
              </Button>
              <Button 
                variant="ghost"
                onClick={quizModal.onClose}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Material Upload Modal */}
        <Modal 
          isOpen={materialModal.isOpen} 
          onClose={materialModal.onClose}
          size="xl"
          motionPreset="slideInBottom"
          scrollBehavior="inside"
        >
          <ModalOverlay 
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
          />
          <ModalContent 
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
          >
            <ModalHeader 
              bg={MODAL_COLORS.assignment.header}
              color={MODAL_COLORS.assignment.headerText}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={2}
            >
              <Flex align="center">
                <Icon as={FaFileUpload} mr={3} />
                <Text>Upload Course Material</Text>
              </Flex>
              <ModalCloseButton 
                position="static" 
                color={MODAL_COLORS.assignment.headerText}
              />
            </ModalHeader>
            
            <ModalBody 
              pt={6} 
              pb={6} 
              bg={MODAL_COLORS.assignment.background}
            >
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Material Title</FormLabel>
                  <Input 
                    id="materialName"
                    placeholder="Enter material title"
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Material Type</FormLabel>
                  <Select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                  >
                    {FILE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Material Description (Optional)</FormLabel>
                  <Textarea 
                    id="materialDescription"
                    placeholder="Provide a brief description of the material"
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Upload File</FormLabel>
                  <Input 
                    type="file"
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                    onChange={handleFileSelect}
                    accept={
                      FILE_TYPES.find(type => type.value === materialType)?.extensions.join(',') || '*'
                    }
                  />
                  {materialFile && (
                    <Text mt={2} fontSize="sm" color="brand.primary">
                      Selected File: {materialFile.name}
                    </Text>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter 
              bg={MODAL_COLORS.assignment.background}
              borderTop="1px"
              borderColor={MODAL_COLORS.assignment.accent}
            >
              <Button 
                bg={COLOR_PALETTE.primary}
                color={COLOR_PALETTE.accent}
                mr={3}
                leftIcon={<FaUpload />}
                onClick={handleUploadMaterial}
                _hover={{
                  bg: `${COLOR_PALETTE.primary}CC`
                }}
              >
                Upload Material
              </Button>
              <Button 
                variant="ghost"
                onClick={materialModal.onClose}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Marks Modal */}
        <Modal 
          isOpen={editMarksModal.isOpen} 
          onClose={() => setEditMarksModal({ 
            isOpen: false, 
            student: {
              id: '',
              name: '',
              rating: null,
              assignments: [],
              quizzes: []
            },
            selectedSubmission: null
          })}
          size="xl"
          motionPreset="slideInBottom"
          scrollBehavior="inside"
        >
          <ModalOverlay 
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
          />
          <ModalContent 
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
          >
            <ModalHeader 
              bg={MODAL_COLORS.assignment.header}
              color={MODAL_COLORS.assignment.headerText}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={2}
            >
              <Flex align="center">
                <Icon as={FaPencilAlt} mr={3} />
                <Text>
                  {editMarksModal.student.name 
                    ? `Edit Marks for ${editMarksModal.student.name}` 
                    : 'Edit Student Marks'}
                </Text>
              </Flex>
              <ModalCloseButton 
                position="static" 
                color={MODAL_COLORS.assignment.headerText}
              />
            </ModalHeader>
            
            <ModalBody 
              pt={6} 
              pb={6} 
              bg={MODAL_COLORS.assignment.background}
            >
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Student Name</FormLabel>
                  <Input 
                    value={editMarksModal.student.name || ''}
                    isReadOnly
                    variant="filled"
                    bg="white"
                    borderColor={MODAL_COLORS.assignment.accent}
                    _hover={{ 
                      bg: "brand.primary",
                      borderColor: MODAL_COLORS.assignment.header
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <Flex align="center" bg="brand.primary" p={2} borderRadius="md">
                    <Text flex={1} fontWeight="bold">Calculated Rating</Text>
                    <Text 
                      fontWeight="bold" 
                      color={
                        editMarksModal.student.rating >= 4 ? 'brand.primary' : 
                        editMarksModal.student.rating >= 3 ? 'orange.600' : 
                        'brand.primary'
                      }
                    >
                      {editMarksModal.student.rating || 0}/5.0
                    </Text>
                  </Flex>
                </FormControl>

                <FormControl>
                  <FormLabel>Assignments</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {editMarksModal.student.assignments.map((assignment, index) => (
                      <Flex key={assignment.id} align="center" justifyContent="space-between">
                        {assignment.submitted ? (
                          <Tooltip 
                            label={`Submitted on ${assignment.submissionDate}`} 
                            aria-label="Submission date tooltip"
                          >
                            <Button 
                              variant="ghost" 
                              colorScheme="blue"
                              onClick={() => handleOpenSubmission(assignment.submissionLink)}
                              leftIcon={<FaEye />}
                            >
                              View Submission
                            </Button>
                          </Tooltip>
                        ) : (
                          <Text color="brand.primary0" flex={1}>Not Submitted</Text>
                        )}
                        
                        <Flex alignItems="center">
                          <Text mr={2}>{assignment.title}</Text>
                          <Input 
                            type="number"
                            value={assignment.score || ''}
                            onChange={(e) => handleMarkSubmission('assignment', assignment.id, parseInt(e.target.value))}
                            placeholder="Score"
                            width="100px"
                            textAlign="center"
                          />
                        </Flex>
                      </Flex>
                    ))}
                  </VStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Quizzes</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {editMarksModal.student.quizzes.map((quiz, index) => (
                      <Flex key={quiz.id} align="center" justifyContent="space-between">
                        {quiz.submitted ? (
                          <Tooltip 
                            label={`Submitted on ${quiz.submissionDate}`} 
                            aria-label="Submission date tooltip"
                          >
                            <Button 
                              variant="ghost" 
                              colorScheme="blue"
                              onClick={() => handleOpenSubmission(quiz.submissionLink)}
                              leftIcon={<FaEye />}
                            >
                              View Submission
                            </Button>
                          </Tooltip>
                        ) : (
                          <Text color="brand.primary0" flex={1}>Not Submitted</Text>
                        )}
                        
                        <Flex alignItems="center">
                          <Text mr={2}>{quiz.title}</Text>
                          <Input 
                            type="number"
                            value={quiz.score || ''}
                            onChange={(e) => handleMarkSubmission('quiz', quiz.id, parseInt(e.target.value))}
                            placeholder="Score"
                            width="100px"
                            textAlign="center"
                          />
                        </Flex>
                      </Flex>
                    ))}
                  </VStack>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter 
              bg={MODAL_COLORS.assignment.background}
              borderTop="1px"
              borderColor={MODAL_COLORS.assignment.accent}
            >
              <Button 
                colorScheme="blue"
                mr={3}
                onClick={() => setEditMarksModal({ 
                  isOpen: false, 
                  student: {
                    id: '',
                    name: '',
                    rating: null,
                    assignments: [],
                    quizzes: []
                  },
                  selectedSubmission: null
                })}
              >
                Update Marks
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setEditMarksModal({ 
                  isOpen: false, 
                  student: {
                    id: '',
                    name: '',
                    rating: null,
                    assignments: [],
                    quizzes: []
                  },
                  selectedSubmission: null
                })}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default InstructorCourseDetails;
