import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Icon,
  HStack,
  Divider,
  useToast,
  useColorModeValue,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  AvatarBadge,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaFile, 
  FaFileAlt, 
  FaFileUpload, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPaperclip, 
  FaImage, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaFileVideo, 
  FaFileAudio, 
  FaFileCode, 
  FaFileArchive, 
  FaEllipsisH,
  FaComments,
  FaUser,
  FaUserGraduate,
  FaUserTie,
  FaFileDownload,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

// Sample assignment data - in a real application, this would come from an API
const assignmentsData = {
  // Machine Learning course assignments
  101: {
    id: 101,
    courseId: 1,
    courseName: 'Introduction to Machine Learning',
    title: 'Data Preprocessing',
    dueDate: '2024-05-15',
    status: 'completed',
    grade: '92%',
    description: 'Clean and preprocess the provided dataset to prepare it for machine learning algorithms. The dataset contains missing values, outliers, and categorical variables that need to be properly handled. You should document your preprocessing steps and justify your decisions.',
    submissionType: 'file',
    submitted: true,
    submissionDate: '2024-05-10',
    files: [
      {
        id: 'f101',
        name: 'data_preprocessing.ipynb',
        size: '1.2 MB',
        type: 'code',
        url: '#',
        date: '2024-05-10'
      }
    ],
    comments: [
      {
        id: 'c101',
        user: 'Elena Rodriguez',
        role: 'instructor',
        text: 'Great work on handling missing values. The normalization technique you chose was appropriate for this dataset.',
        timestamp: '2024-05-12',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      {
        id: 'c102',
        user: 'You',
        role: 'student',
        text: 'Thank you! I noticed the dataset had skewed distributions so I used robust scaling methods.',
        timestamp: '2024-05-12',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    ],
    requirements: [
      'Clean missing data using appropriate techniques',
      'Handle outliers in the dataset',
      'Encode categorical variables',
      'Normalize or standardize numerical features',
      'Split the data into training and test sets',
      'Document all preprocessing steps and decisions'
    ]
  },
  102: {
    id: 102,
    courseId: 1,
    courseName: 'Introduction to Machine Learning',
    title: 'Linear Regression Implementation',
    dueDate: '2024-05-28',
    status: 'pending',
    grade: null,
    description: 'Implement a linear regression model from scratch and evaluate it on the test dataset. You should implement both the normal equation method and gradient descent optimization, and compare their performance and computational efficiency.',
    submissionType: 'file',
    submitted: false,
    submissionDate: null,
    files: [],
    comments: [],
    requirements: [
      'Implement linear regression using the normal equation method',
      'Implement linear regression using gradient descent optimization',
      'Evaluate the model on the test dataset',
      'Compare the performance and computational efficiency of both methods',
      'Visualize the results using appropriate plots',
      'Submit your code and a report of your findings'
    ]
  },
  // English Language course assignments
  201: {
    id: 201,
    courseId: 2,
    courseName: 'IGCSE English Language',
    title: 'Reading Comprehension Exercise',
    dueDate: '2024-05-10',
    status: 'completed',
    grade: '85%',
    description: 'Read the provided passage and answer the comprehension questions. Focus on identifying the main ideas, supporting details, and the author\'s purpose and tone.',
    submissionType: 'text',
    submitted: true,
    submissionDate: '2024-05-08',
    textSubmission: 'The passage explores the theme of technological advancement and its impact on modern society. The author presents a balanced view, highlighting both the benefits and drawbacks of our increasing reliance on technology.\n\nThe main argument centers around the idea that while technology has improved efficiency and connectivity, it has also created new challenges like digital addiction and privacy concerns. The author\'s tone is contemplative rather than judgmental, encouraging readers to reflect on their own relationship with technology.\n\nSupporting details include statistics on smartphone usage, examples of both positive technological innovations (medical advances) and negative consequences (data breaches). The author concludes by suggesting that we need to develop healthier boundaries with technology without rejecting its benefits entirely.',
    comments: [
      {
        id: 'c201',
        user: 'Sarah Thompson',
        role: 'instructor',
        text: 'Good analysis of the author\'s tone and purpose. Your identification of the main ideas is accurate, but you could have provided more specific examples from the text to support your points.',
        timestamp: '2024-05-09',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
      }
    ],
    requirements: [
      'Identify the main ideas and supporting details in the passage',
      'Analyze the author\'s purpose and tone',
      'Provide evidence from the text to support your answers',
      'Use proper grammar and spelling in your responses',
      'Submit your answers in a clear and organized format'
    ]
  },
  202: {
    id: 202,
    courseId: 2,
    courseName: 'IGCSE English Language',
    title: 'Descriptive Essay',
    dueDate: '2024-05-20',
    status: 'pending',
    grade: null,
    description: 'Write a descriptive essay on the topic "A Place That Means a Lot to Me". Your essay should use vivid imagery, sensory details, and figurative language to bring the place to life for the reader.',
    submissionType: 'text',
    submitted: false,
    submissionDate: null,
    textSubmission: '',
    comments: [],
    requirements: [
      'Write an essay of 500-700 words',
      'Use vivid imagery and sensory details (sight, sound, smell, taste, touch)',
      'Include figurative language (similes, metaphors, personification)',
      'Organize your essay with a clear introduction, body, and conclusion',
      'Proofread for grammar, spelling, and punctuation errors',
      'Submit your essay as a text document'
    ]
  }
};

// Helper function to get file icon based on file type
const getFileIcon = (type) => {
  switch (type) {
    case 'image':
      return FaImage;
    case 'pdf':
      return FaFilePdf;
    case 'word':
      return FaFileWord;
    case 'excel':
      return FaFileExcel;
    case 'powerpoint':
      return FaFilePowerpoint;
    case 'video':
      return FaFileVideo;
    case 'audio':
      return FaFileAudio;
    case 'code':
      return FaFileCode;
    case 'archive':
      return FaFileArchive;
    default:
      return FaFile;
  }
};

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const accentColor = useColorModeValue('#640101', 'red.200');
  
  const [assignment, setAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // In a real application, fetch assignment data from an API
  useEffect(() => {
    // Simulating an API call to get assignment details
    const fetchAssignment = () => {
      // In a real app, this would be an API call
      const foundAssignment = assignmentsData[assignmentId];
      if (foundAssignment) {
        setAssignment(foundAssignment);
        if (foundAssignment.textSubmission) {
          setSubmissionText(foundAssignment.textSubmission);
        }
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Process selected files
    const newFiles = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type.split('/')[0],
      file: file, // Keep reference to the actual file
      date: new Date().toISOString().split('T')[0]
    }));
    
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  
  const removeFile = (fileId) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== fileId));
  };
  
  const handleSubmit = () => {
    // In a real app, this would send the data to an API
    
    // Create updated assignment with new submission
    const updatedAssignment = {
      ...assignment,
      status: 'completed',
      submitted: true,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    
    if (assignment.submissionType === 'text') {
      updatedAssignment.textSubmission = submissionText;
    } else {
      // For file submissions, add the newly selected files
      updatedAssignment.files = [
        ...(assignment.files || []),
        ...selectedFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: '#', // In a real app, this would be the uploaded file URL
          date: file.date
        }))
      ];
    }
    
    // Update the assignment in local state
    setAssignment(updatedAssignment);
    setSelectedFiles([]);
    
    // Show success message
    toast({
      title: 'Assignment Submitted',
      description: 'Your work has been submitted successfully!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: `c-${Date.now()}`,
      user: 'You',
      role: 'student',
      text: newComment,
      timestamp: new Date().toISOString().split('T')[0],
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg' // Default avatar
    };
    
    setAssignment({
      ...assignment,
      comments: [...assignment.comments, comment]
    });
    
    setNewComment('');
    
    toast({
      title: 'Comment Added',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  if (!assignment) {
    return (
      <Flex>
        <StudentSidebar />
        <Box 
          ml="250px" 
          width="calc(100% - 250px)" 
          mt="85px" 
          p={6}
        >
          <Text>Loading assignment details...</Text>
        </Box>
      </Flex>
    );
  }

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
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            {/* Breadcrumb Navigation */}
            <Flex justify="space-between" align="center">
              <Breadcrumb fontSize="sm" color="gray.600">
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/student-courses">My Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to={`/course/${assignment.courseId}`}>{assignment.courseName}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>{assignment.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/course/${assignment.courseId}`)}
              >
                Back to Course
              </Button>
            </Flex>
            
            {/* Assignment Header */}
            <Card 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              boxShadow="md"
              bg="white"
            >
              <CardHeader 
                bg={accentColor} 
                color="white" 
                p={4}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Heading size="lg">{assignment.title}</Heading>
                    <Text mt={1}>{assignment.courseName}</Text>
                  </Box>
                  <Badge 
                    colorScheme={
                      assignment.status === 'completed' ? 'green' : 
                      assignment.status === 'pending' ? 'yellow' : 'gray'
                    }
                    fontSize="sm"
                    px={3}
                    py={1}
                  >
                    {assignment.status === 'completed' ? 'Completed' : 
                     assignment.status === 'pending' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </Flex>
              </CardHeader>
              
              <CardBody p={6}>
                <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={6}>
                  <GridItem>
                    <Box mb={6}>
                      <Heading size="md" mb={3}>Description</Heading>
                      <Text>{assignment.description}</Text>
                    </Box>
                    
                    <Box mb={6}>
                      <Heading size="md" mb={3}>Requirements</Heading>
                      <List spacing={2}>
                        {assignment.requirements.map((req, index) => (
                          <ListItem key={index} display="flex" alignItems="center">
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            <Text>{req}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </GridItem>
                  
                  <GridItem>
                    <Box 
                      bg="gray.50" 
                      p={4} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <Heading size="md" mb={3}>Assignment Details</Heading>
                      <VStack spacing={3} align="stretch">
                        <Flex justify="space-between">
                          <HStack>
                            <Icon as={FaCalendarAlt} color={accentColor} />
                            <Text fontWeight="semibold">Due Date:</Text>
                          </HStack>
                          <Text>{assignment.dueDate}</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <HStack>
                            <Icon as={FaFileAlt} color={accentColor} />
                            <Text fontWeight="semibold">Submission Type:</Text>
                          </HStack>
                          <Badge>
                            {assignment.submissionType === 'text' ? 'Text' : 'File Upload'}
                          </Badge>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <HStack>
                            <Icon as={
                              assignment.submitted ? FaCheckCircle : FaTimesCircle
                            } color={assignment.submitted ? 'green.500' : 'gray.500'} />
                            <Text fontWeight="semibold">Status:</Text>
                          </HStack>
                          <Text>
                            {assignment.submitted ? 'Submitted' : 'Not Submitted'}
                          </Text>
                        </Flex>
                        
                        {assignment.submitted && (
                          <Flex justify="space-between">
                            <HStack>
                              <Icon as={FaClock} color={accentColor} />
                              <Text fontWeight="semibold">Submitted On:</Text>
                            </HStack>
                            <Text>{assignment.submissionDate}</Text>
                          </Flex>
                        )}
                        
                        {assignment.grade && (
                          <Flex justify="space-between">
                            <HStack>
                              <Icon as={FaCheckCircle} color="green.500" />
                              <Text fontWeight="semibold">Grade:</Text>
                            </HStack>
                            <Text fontWeight="bold" color={accentColor}>
                              {assignment.grade}
                            </Text>
                          </Flex>
                        )}
                      </VStack>
                    </Box>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
            
            {/* Tabs for Submission and Comments */}
            <Tabs variant="enclosed" colorScheme="red">
              <TabList>
                <Tab 
                  _selected={{ 
                    color: accentColor, 
                    borderColor: 'inherit',
                    borderBottomColor: 'transparent',
                    fontWeight: 'semibold'
                  }}
                >
                  Submission
                </Tab>
                <Tab 
                  _selected={{ 
                    color: accentColor, 
                    borderColor: 'inherit',
                    borderBottomColor: 'transparent',
                    fontWeight: 'semibold'
                  }}
                >
                  Comments ({assignment.comments.length})
                </Tab>
              </TabList>
              
              <TabPanels>
                {/* Submission Panel */}
                <TabPanel p={0} pt={4}>
                  <Card
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg="white"
                  >
                    <CardHeader 
                      bg={`${accentColor}10`} 
                      borderBottom={`1px solid ${accentColor}20`}
                      p={4}
                    >
                      <Heading size="md" color={accentColor}>
                        {assignment.submitted ? 'Your Submission' : 'Submit Your Work'}
                      </Heading>
                    </CardHeader>
                    
                    <CardBody p={6}>
                      {assignment.submissionType === 'text' ? (
                        // Text submission form
                        <FormControl>
                          <FormLabel fontWeight="semibold">Your Answer</FormLabel>
                          <Textarea
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            placeholder="Type your answer here..."
                            minHeight="200px"
                            isDisabled={assignment.submitted && assignment.status === 'completed'}
                          />
                        </FormControl>
                      ) : (
                        // File submission form
                        <VStack spacing={4} align="stretch">
                          <FormLabel fontWeight="semibold">Upload Files</FormLabel>
                          
                          {/* Existing files */}
                          {assignment.files && assignment.files.length > 0 && (
                            <Box mb={4}>
                              <Text fontWeight="medium" mb={2}>Submitted Files:</Text>
                              <VStack spacing={2} align="stretch">
                                {assignment.files.map((file) => (
                                  <Flex 
                                    key={file.id}
                                    p={2}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <HStack>
                                      <Icon as={getFileIcon(file.type)} color={accentColor} boxSize={5} />
                                      <VStack spacing={0} align="start">
                                        <Text fontWeight="medium">{file.name}</Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {file.size} • Uploaded on {file.date}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                    <HStack>
                                      <Button 
                                        size="sm" 
                                        leftIcon={<FaFileDownload />} 
                                        variant="ghost"
                                        colorScheme="blue" 
                                      >
                                        Download
                                      </Button>
                                    </HStack>
                                  </Flex>
                                ))}
                              </VStack>
                            </Box>
                          )}
                          
                          {/* New files selection */}
                          {(!assignment.submitted || assignment.status !== 'completed') && (
                            <>
                              <Box 
                                border="2px dashed" 
                                borderColor="gray.300" 
                                borderRadius="md" 
                                p={6}
                                textAlign="center"
                                cursor="pointer"
                                _hover={{ bg: 'gray.50' }}
                                onClick={handleFileClick}
                              >
                                <Input 
                                  type="file" 
                                  multiple 
                                  ref={fileInputRef} 
                                  onChange={handleFileSelect} 
                                  display="none" 
                                />
                                <Icon as={FaFileUpload} boxSize={10} color="gray.400" mb={2} />
                                <Heading size="sm" mb={1}>Drop files here or click to upload</Heading>
                                <Text fontSize="sm" color="gray.500">
                                  Supports images, documents, videos, and other file types
                                </Text>
                              </Box>
                              
                              {/* Selected files list */}
                              {selectedFiles.length > 0 && (
                                <Box mt={4}>
                                  <Text fontWeight="medium" mb={2}>Selected Files:</Text>
                                  <VStack spacing={2} align="stretch">
                                    {selectedFiles.map((file) => (
                                      <Flex 
                                        key={file.id}
                                        p={2}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <HStack>
                                          <Icon as={getFileIcon(file.type)} color={accentColor} boxSize={5} />
                                          <VStack spacing={0} align="start">
                                            <Text fontWeight="medium">{file.name}</Text>
                                            <Text fontSize="xs" color="gray.500">
                                              {file.size} • Selected on {file.date}
                                            </Text>
                                          </VStack>
                                        </HStack>
                                        <Button 
                                          size="sm" 
                                          leftIcon={<FaTrash />} 
                                          variant="ghost"
                                          colorScheme="red" 
                                          onClick={() => removeFile(file.id)}
                                        >
                                          Remove
                                        </Button>
                                      </Flex>
                                    ))}
                                  </VStack>
                                </Box>
                              )}
                            </>
                          )}
                        </VStack>
                      )}
                      
                      {/* Submit button */}
                      {(!assignment.submitted || assignment.status !== 'completed') && (
                        <Button
                          mt={6}
                          colorScheme="red"
                          size="lg"
                          rightIcon={<FaFileUpload />}
                          onClick={handleSubmit}
                          isDisabled={
                            (assignment.submissionType === 'text' && !submissionText.trim()) ||
                            (assignment.submissionType === 'file' && selectedFiles.length === 0 && !assignment.files?.length)
                          }
                        >
                          {assignment.submitted ? 'Update Submission' : 'Submit Assignment'}
                        </Button>
                      )}
                    </CardBody>
                  </Card>
                </TabPanel>
                
                {/* Comments Panel */}
                <TabPanel p={0} pt={4}>
                  <Card
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg="white"
                  >
                    <CardHeader 
                      bg={`${accentColor}10`} 
                      borderBottom={`1px solid ${accentColor}20`}
                      p={4}
                    >
                      <Heading size="md" color={accentColor}>Discussion</Heading>
                    </CardHeader>
                    
                    <CardBody p={6}>
                      {/* Comments list */}
                      <VStack spacing={4} align="stretch" mb={6}>
                        {assignment.comments.length > 0 ? (
                          assignment.comments.map((comment) => (
                            <Box 
                              key={comment.id}
                              p={4}
                              borderWidth="1px"
                              borderRadius="md"
                              bg={comment.role === 'instructor' ? 'gray.50' : 'white'}
                            >
                              <Flex mb={2}>
                                <Avatar size="sm" src={comment.avatar} mr={2}>
                                  {comment.role === 'instructor' && (
                                    <AvatarBadge boxSize='1.25em' bg='green.500' />
                                  )}
                                </Avatar>
                                <Box>
                                  <Text fontWeight="bold">
                                    {comment.user}
                                    {comment.role === 'instructor' && (
                                      <Badge ml={2} colorScheme="green">Instructor</Badge>
                                    )}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">{comment.timestamp}</Text>
                                </Box>
                              </Flex>
                              <Text>{comment.text}</Text>
                            </Box>
                          ))
                        ) : (
                          <Box textAlign="center" py={6}>
                            <Icon as={FaComments} boxSize={10} color="gray.300" mb={3} />
                            <Text color="gray.500">No comments yet</Text>
                          </Box>
                        )}
                      </VStack>
                      
                      {/* Add comment form */}
                      <Divider mb={4} />
                      <Box>
                        <FormControl>
                          <FormLabel fontWeight="semibold">Add a Comment</FormLabel>
                          <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Type your comment here..."
                            mb={3}
                          />
                        </FormControl>
                        <Button
                          colorScheme="red"
                          onClick={addComment}
                          isDisabled={!newComment.trim()}
                        >
                          Post Comment
                        </Button>
                      </Box>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default AssignmentDetails; 