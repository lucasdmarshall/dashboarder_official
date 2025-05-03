import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Button
} from '@chakra-ui/react';
import { 
  FaChartLine, 
  FaBook, 
  FaTrophy, 
  FaCheckCircle 
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

const progressData = {
  overallProgress: 72,
  courses: [
    {
      id: 1,
      name: 'Machine Learning',
      progress: 85,
      grade: 'A',
      completedAssignments: 4,
      totalAssignments: 5
    },
    {
      id: 2,
      name: 'Web Development',
      progress: 45,
      grade: 'B',
      completedAssignments: 2,
      totalAssignments: 6
    },
    {
      id: 3,
      name: 'Data Science',
      progress: 65,
      grade: 'B+',
      completedAssignments: 3,
      totalAssignments: 5
    }
  ],
  achievements: [
    {
      id: 1,
      name: 'First Machine Learning Project',
      date: '2024-01-15',
      icon: <FaTrophy color="#640101" />
    },
    {
      id: 2,
      name: 'Perfect Web Dev Quiz',
      date: '2024-02-01',
      icon: <FaCheckCircle color="#640101" />
    }
  ]
};

const StudentProgress = () => {
  const [progress, setProgress] = useState(progressData);

  return (
    <Flex>
      <StudentSidebar />
      
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg="white">
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              mb={4}
            >
              <Heading 
                as="h1" 
                size="xl" 
                color="#640101"
                display="flex"
                alignItems="center"
              >
                <FaChartLine style={{ marginRight: '15px' }} />
                Learning Progress
              </Heading>
              <Text color="black" fontWeight="medium">
                Last Updated: {new Date().toLocaleDateString()}
              </Text>
            </Flex>
            
            {/* Overall Progress Card */}
            <Box 
              bg="white" 
              border="2px solid #640101" 
              borderRadius="xl" 
              p={6} 
              boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <CircularProgress 
                    value={progress.overallProgress} 
                    color="#640101" 
                    size="120px"
                    thickness="8px"
                    trackColor="rgba(100, 1, 1, 0.1)"
                  >
                    <CircularProgressLabel 
                      fontWeight="bold" 
                      color="#640101"
                    >
                      {progress.overallProgress}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  
                  <VStack ml={6} align="start" spacing={2}>
                    <Heading size="md" color="#640101">
                      Overall Learning Progress
                    </Heading>
                    <Text color="black">
                      Steady improvement in your academic journey
                    </Text>
                  </VStack>
                </Flex>
                
                <Stat>
                  <StatGroup>
                    <VStack 
                      spacing={2} 
                      align="end" 
                      p={4} 
                      bg="rgba(100, 1, 1, 0.05)" 
                      borderRadius="md"
                    >
                      <Flex alignItems="center">
                        <StatArrow type="increase" color="#640101" />
                        <StatNumber color="#640101" ml={2} fontSize="md">
                          +12% Progress
                        </StatNumber>
                      </Flex>
                      <StatHelpText color="black">
                        Compared to last month
                      </StatHelpText>
                    </VStack>
                  </StatGroup>
                </Stat>
              </Flex>
            </Box>

            {/* Course and Achievements Grid */}
            <Grid templateColumns="2fr 1fr" gap={6}>
              {/* Course Progress Card */}
              <GridItem>
                <Box 
                  bg="white" 
                  border="2px solid #640101" 
                  borderRadius="xl" 
                  p={6}
                  boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading size="lg" color="#640101">
                      <Flex alignItems="center">
                        <FaBook style={{ marginRight: '10px' }} />
                        Course Progress
                      </Flex>
                    </Heading>
                    <Text color="black" fontSize="sm">
                      Total Courses: {progress.courses.length}
                    </Text>
                  </Flex>
                  
                  <VStack spacing={4} align="stretch">
                    {progress.courses.map((course, index) => (
                      <Flex 
                        key={course.id} 
                        bg={index % 2 === 0 ? 'white' : 'rgba(100, 1, 1, 0.05)'}
                        p={3}
                        borderRadius="md"
                        alignItems="center"
                        border="1px solid rgba(100, 1, 1, 0.2)"
                      >
                        <Box flex="1">
                          <Text color="black" fontWeight="bold">
                            {course.name}
                          </Text>
                        </Box>
                        <Box flex="1">
                          <Box 
                            bg="rgba(100, 1, 1, 0.1)" 
                            borderRadius="full" 
                            height="8px" 
                            position="relative"
                          >
                            <Box 
                              bg="#640101" 
                              width={`${course.progress}%`} 
                              height="100%" 
                              borderRadius="full"
                            />
                          </Box>
                        </Box>
                        <Box flex="1" textAlign="center">
                          <Badge 
                            bg={course.grade === 'A' ? 'rgba(100, 1, 1, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                            color="#640101"
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {course.grade}
                          </Badge>
                        </Box>
                        <Box flex="1" textAlign="right">
                          <Text color="black">
                            {course.completedAssignments}/{course.totalAssignments}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </GridItem>

              {/* Achievements Card */}
              <GridItem>
                <Box 
                  bg="white" 
                  border="2px solid #640101" 
                  borderRadius="xl" 
                  p={6}
                  boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading size="lg" color="#640101">
                      <Flex alignItems="center">
                        <FaTrophy style={{ marginRight: '10px' }} />
                        Achievements
                      </Flex>
                    </Heading>
                    <Text color="black" fontSize="sm">
                      Total: {progress.achievements.length}
                    </Text>
                  </Flex>
                  
                  <VStack spacing={4} align="stretch">
                    {progress.achievements.map(achievement => (
                      <Flex 
                        key={achievement.id} 
                        alignItems="center" 
                        bg="rgba(100, 1, 1, 0.05)" 
                        p={3} 
                        borderRadius="md"
                        border="1px solid rgba(100, 1, 1, 0.2)"
                      >
                        {React.cloneElement(achievement.icon, { 
                          color: '#640101', 
                          size: '24px' 
                        })}
                        <VStack ml={4} align="start" spacing={1} flex={1}>
                          <Text fontWeight="bold" color="black">
                            {achievement.name}
                          </Text>
                          <Text fontSize="sm" color="#640101">
                            {achievement.date}
                          </Text>
                        </VStack>
                        <Button 
                          size="xs" 
                          variant="outline" 
                          color="#640101"
                          borderColor="#640101"
                          _hover={{ 
                            bg: 'rgba(100, 1, 1, 0.1)',
                            transform: 'scale(1.05)'
                          }}
                        >
                          Details
                        </Button>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </GridItem>
            </Grid>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentProgress;
