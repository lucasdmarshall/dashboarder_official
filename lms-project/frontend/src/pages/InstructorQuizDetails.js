import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, 
  Container, 
  Heading, 
  VStack, 
  HStack,
  Text, 
  Flex,
  Button,
  IconButton,
  useColorModeValue,
  Divider,
  Badge,
  Grid,
  GridItem,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
  TagLabel,
  Stat,
  StatLabel,
  StatNumber,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaQuestionCircle,
  FaClock,
  FaCheckCircle,
  FaBook,
  FaListOl
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

const QuestionTypeIcon = {
  'multiple-choice': FaListOl,
  'true-false': FaCheckCircle,
  'short-answer': FaBook
};

const InstructorQuizDetails = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'brand.primary');
  const cardBg = useColorModeValue('brand.primary', 'brand.primary');
  const textColor = useColorModeValue('brand.primary', 'brand.primary');

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`/api/quizzes/${quizId}`);
        
        if (!response.data) {
          throw new Error('Quiz not found');
        }

        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz details:', err);
        setError(err.message);
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Unable to fetch quiz details",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    };

    fetchQuizDetails();
  }, [quizId, toast]);

  const handleEditQuiz = () => {
    navigate(`/instructor-edit-quiz/${quizId}`);
  };

  const handleDeleteQuiz = () => {
    toast({
      title: "Delete Quiz",
      description: "Are you sure you want to delete this quiz?",
      status: "warning",
      duration: null,
      isClosable: true,
      position: "top",
      render: () => (
        <Box color="white" p={3} bg="brand.primary0" borderRadius="md">
          <Flex alignItems="center" justifyContent="space-between">
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Delete Quiz</Text>
              <Text fontSize="sm">This action cannot be undone.</Text>
            </VStack>
            <HStack>
              <Button 
                colorScheme="whiteAlpha" 
                onClick={() => toast.closeAll()}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={async () => {
                  try {
                    // Replace with your actual delete API endpoint
                    await axios.delete(`/api/quizzes/${quizId}`);
                    
                    toast.closeAll();
                    toast({
                      title: "Quiz Deleted",
                      status: "success",
                      duration: 2000,
                    });
                    
                    navigate(-1);
                  } catch (err) {
                    toast({
                      title: "Delete Failed",
                      description: "Unable to delete quiz",
                      status: "error",
                      duration: 3000,
                    });
                  }
                }}
              >
                Delete
              </Button>
            </HStack>
          </Flex>
        </Box>
      )
    });
  };

  if (loading) {
    return (
      <Flex>
        <InstructorSidebar />
        <Container 
          maxW="container.xl" 
          py={10} 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
        >
          <Spinner size="xl" />
        </Container>
      </Flex>
    );
  }

  if (error || !quiz) {
    return (
      <Flex>
        <InstructorSidebar />
        <Container 
          maxW="container.xl" 
          py={10} 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
        >
          <VStack>
            <Text>Unable to load quiz details</Text>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </VStack>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex>
      <InstructorSidebar />
      <Container 
        maxW="container.xl" 
        py={10} 
        bg={bgColor} 
        ml={{ base: 0, md: '250px' }}  
        width={{ base: '100%', md: 'calc(100% - 250px)' }}
        px={{ base: 4, md: 10 }}  
      >
        <VStack spacing={8} align="stretch" maxW="800px" mx="auto">
          {/* Header */}
          <Flex 
            justifyContent="space-between" 
            alignItems="center" 
            bg={cardBg} 
            p={6} 
            borderRadius="xl"
          >
            <VStack align="start" spacing={2}>
              <Heading size="lg">{quiz.title}</Heading>
              <Text color={textColor}>{quiz.description}</Text>
              <HStack>
                <Tag colorScheme="blue">
                  <TagLabel>{quiz.course?.name || 'Unnamed Course'}</TagLabel>
                </Tag>
                <Tag colorScheme="green">
                  <TagLabel>{quiz.instructor?.name || 'Unknown Instructor'}</TagLabel>
                </Tag>
              </HStack>
            </VStack>
            <HStack>
              <Tooltip label="Edit Quiz">
                <IconButton 
                  icon={<FaEdit />} 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={handleEditQuiz}
                />
              </Tooltip>
              <Tooltip label="Delete Quiz">
                <IconButton 
                  icon={<FaTrash />} 
                  colorScheme="red" 
                  variant="outline"
                  onClick={handleDeleteQuiz}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Quiz Details and Questions */}
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab>Quiz Overview</Tab>
              <Tab>Questions</Tab>
            </TabList>
            <TabPanels>
              {/* Quiz Overview */}
              <TabPanel>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  <GridItem>
                    <Stat 
                      bg={cardBg} 
                      p={4} 
                      borderRadius="lg"
                    >
                      <StatLabel>Duration</StatLabel>
                      <StatNumber>
                        <Flex alignItems="center">
                          <FaClock mr={2} />
                          {quiz.duration} mins
                        </Flex>
                      </StatNumber>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat 
                      bg={cardBg} 
                      p={4} 
                      borderRadius="lg"
                    >
                      <StatLabel>Total Score</StatLabel>
                      <StatNumber>
                        <Flex alignItems="center">
                          <FaQuestionCircle mr={2} />
                          {quiz.totalScore}
                        </Flex>
                      </StatNumber>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat 
                      bg={cardBg} 
                      p={4} 
                      borderRadius="lg"
                    >
                      <StatLabel>Passing Score</StatLabel>
                      <StatNumber>
                        <Flex alignItems="center">
                          <FaCheckCircle mr={2} />
                          {quiz.passingScore}%
                        </Flex>
                      </StatNumber>
                    </Stat>
                  </GridItem>
                </Grid>
              </TabPanel>

              {/* Questions */}
              <TabPanel>
                <Accordion allowToggle>
                  {quiz.questions?.map((question, index) => {
                    const QuestionIcon = QuestionTypeIcon[question.type];
                    return (
                      <AccordionItem key={question.id} borderRadius="lg" mb={3}>
                        <AccordionButton 
                          _expanded={{ bg: cardBg, borderRadius: 'lg' }}
                        >
                          <Flex flex="1" textAlign="left" alignItems="center">
                            <QuestionIcon style={{ marginRight: '10px' }} />
                            <Text fontWeight="bold" mr={3}>
                              Q{index + 1}.
                            </Text>
                            <Text noOfLines={1}>{question.text}</Text>
                          </Flex>
                          <HStack>
                            <Badge colorScheme="purple">{question.type}</Badge>
                            <Badge colorScheme="green">{question.points} pts</Badge>
                            <AccordionIcon />
                          </HStack>
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          {question.type === 'multiple-choice' && (
                            <VStack align="stretch">
                              {question.options?.map(option => (
                                <Flex 
                                  key={option.id} 
                                  bg={option.isCorrect ? 'brand.primary' : 'brand.primary'}
                                  p={2} 
                                  borderRadius="md"
                                  alignItems="center"
                                >
                                  <Text mr={3}>{option.id}.</Text>
                                  <Text flex={1}>{option.text}</Text>
                                  {option.isCorrect && (
                                    <FaCheckCircle color="green" />
                                  )}
                                </Flex>
                              ))}
                            </VStack>
                          )}
                          {question.type === 'true-false' && (
                            <VStack align="stretch">
                              {question.options?.map(option => (
                                <Flex 
                                  key={option.id} 
                                  bg={option.isCorrect ? 'brand.primary' : 'brand.primary'}
                                  p={2} 
                                  borderRadius="md"
                                  alignItems="center"
                                >
                                  <Text mr={3}>{option.id}.</Text>
                                  <Text flex={1}>{option.text}</Text>
                                  {option.isCorrect && (
                                    <FaCheckCircle color="green" />
                                  )}
                                </Flex>
                              ))}
                            </VStack>
                          )}
                          {question.type === 'short-answer' && (
                            <Text fontStyle="italic" color={textColor}>
                              Short answer questions require manual grading
                            </Text>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Navigation */}
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back to Course
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorQuizDetails;
