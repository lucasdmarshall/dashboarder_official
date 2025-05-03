import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Avatar, 
  Grid, 
  GridItem, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  useColorModeValue,
  Divider,
  Progress,
  Icon,
  HStack
} from '@chakra-ui/react';
import { 
  FaUser, 
  FaEnvelope, 
  FaBook, 
  FaCalendar, 
  FaChartLine,
  FaArrowLeft,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  // Theme-specific color values
  const primaryColor = '#640101';  // Dark Red
  const secondaryColor = '#000000';  // Black
  const accentColor = '#FFFFFF';  // White

  const cardBg = useColorModeValue(accentColor, primaryColor);
  const cardBorder = primaryColor;
  const textColor = useColorModeValue(secondaryColor, accentColor);
  const progressColor = primaryColor;

  // Mock student data fetch - replace with actual API call
  useEffect(() => {
    const mockStudentData = {
      studentId: studentId || 'STD-2024-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://bit.ly/dan-abramov',
      enrollmentDate: '2024-01-15',
      courses: [
        {
          id: 1,
          title: 'Introduction to Web Development',
          progress: 45,
          instructor: 'Jane Smith'
        },
        {
          id: 2,
          title: 'Advanced React Techniques',
          progress: 30,
          instructor: 'Mike Johnson'
        }
      ],
      performance: {
        averageGrade: 'B+',
        completedAssignments: 12,
        totalAssignments: 15
      },
      attendance: [
        {
          courseId: 1,
          courseName: 'Introduction to Web Development',
          totalSessions: 20,
          attendedSessions: 15,
          attendancePercentage: 75
        },
        {
          courseId: 2,
          courseName: 'Advanced React Techniques',
          totalSessions: 15,
          attendedSessions: 10,
          attendancePercentage: 66.7
        }
      ]
    };

    setStudent(mockStudentData);
  }, [studentId]);

  if (!student) {
    return <Text>Loading student profile...</Text>;
  }

  return (
    <Flex bg={useColorModeValue('gray.50', 'gray.900')}>
      <StudentSidebar />
      <Container 
        maxW="container.xl" 
        ml="250px" 
        mt="85px" 
        pb={8} 
        px={6}
        color={textColor}
      >
        <Button 
          leftIcon={<FaArrowLeft />} 
          mb={6} 
          onClick={() => navigate('/instructor-students')}
          variant="outline"
          borderColor={primaryColor}
          color={primaryColor}
          _hover={{ 
            bg: primaryColor, 
            color: accentColor 
          }}
        >
          Back to Students
        </Button>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {/* Profile Overview */}
          <GridItem colSpan={1}>
            <Card 
              bg={cardBg} 
              borderWidth="2px" 
              borderColor={cardBorder}
              boxShadow="xl"
              transition="all 0.3s ease"
              _hover={{
                transform: 'scale(1.02)',
                boxShadow: '2xl'
              }}
            >
              <CardHeader 
                bg={`${primaryColor}10`} 
                py={6} 
                textAlign="center"
              >
                <Flex 
                  alignItems="center" 
                  justifyContent="center" 
                  flexDirection="column"
                >
                  <Avatar 
                    size="2xl" 
                    src={student.avatar} 
                    mb={4} 
                    border="4px solid" 
                    borderColor={primaryColor}
                  />
                  <Heading 
                    size="lg" 
                    color={primaryColor}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {student.name}
                  </Heading>
                  <Text 
                    color={secondaryColor} 
                    opacity={0.7}
                    mt={2}
                  >
                    {student.studentId}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={4} px={6}>
                  <HStack spacing={3} w="full">
                    <Icon 
                      as={FaEnvelope} 
                      color={primaryColor} 
                      boxSize={5} 
                    />
                    <Text>{student.email}</Text>
                  </HStack>
                  <HStack spacing={3} w="full">
                    <Icon 
                      as={FaCalendar} 
                      color={primaryColor} 
                      boxSize={5} 
                    />
                    <Text>Enrolled: {student.enrollmentDate}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Courses and Performance */}
          <GridItem colSpan={2}>
            <Card 
              bg={cardBg} 
              borderWidth="2px" 
              borderColor={cardBorder}
              boxShadow="xl"
              mb={6}
            >
              <CardHeader 
                bg={`${primaryColor}10`} 
                py={4}
                borderBottom="1px solid"
                borderColor={primaryColor}
              >
                <Heading 
                  size="md" 
                  display="flex" 
                  alignItems="center"
                  color={primaryColor}
                >
                  <Icon 
                    as={FaBook} 
                    mr={3} 
                    color={primaryColor} 
                  /> 
                  Enrolled Courses
                </Heading>
              </CardHeader>
              <CardBody>
                {student.courses.map((course, index) => (
                  <Box 
                    key={course.id} 
                    mb={4}
                    p={4}
                    bg={`${primaryColor}05`}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={`${primaryColor}20`}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <VStack align="start" spacing={2}>
                        <Text 
                          fontWeight="bold" 
                          color={primaryColor}
                        >
                          {course.title}
                        </Text>
                        <Text color={secondaryColor} opacity={0.7}>
                          Instructor: {course.instructor}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={2}>
                        <Text 
                          fontWeight="semibold" 
                          color={primaryColor}
                        >
                          Progress
                        </Text>
                        <Progress 
                          value={course.progress} 
                          colorScheme="red"
                          size="sm"
                          w="200px"
                          borderRadius="full"
                        />
                        <Text 
                          fontSize="sm" 
                          color={secondaryColor}
                          opacity={0.7}
                        >
                          {course.progress}% Complete
                        </Text>
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </CardBody>
            </Card>

            {/* Attendance */}
            {student.attendance && student.attendance.length > 0 && (
              <Card 
                bg={cardBg} 
                borderWidth="2px" 
                borderColor={cardBorder}
                boxShadow="xl"
              >
                <CardHeader 
                  bg={`${primaryColor}10`} 
                  py={4}
                  borderBottom="1px solid"
                  borderColor={primaryColor}
                >
                  <Heading 
                    size="md" 
                    display="flex" 
                    alignItems="center"
                    color={primaryColor}
                  >
                    <Icon 
                      as={FaClipboardList} 
                      mr={3} 
                      color={primaryColor} 
                    /> 
                    Attendance
                  </Heading>
                </CardHeader>
                <CardBody>
                  {student.attendance.map((record) => (
                    <Flex 
                      key={record.courseId}
                      justifyContent="space-between"
                      alignItems="center"
                      mb={4}
                      p={3}
                      bg={`${primaryColor}05`}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={`${primaryColor}20`}
                    >
                      <VStack align="start" spacing={2}>
                        <Text 
                          fontWeight="bold" 
                          color={primaryColor}
                        >
                          {record.courseName}
                        </Text>
                        <HStack spacing={3}>
                          <Icon 
                            as={FaCheckCircle} 
                            color="green.500" 
                          />
                          <Text>
                            {record.attendedSessions} / {record.totalSessions} Sessions
                          </Text>
                        </HStack>
                      </VStack>
                      <Text 
                        fontWeight="semibold" 
                        color={record.attendancePercentage >= 75 ? 'green.500' : 'red.500'}
                      >
                        {record.attendancePercentage.toFixed(1)}%
                      </Text>
                    </Flex>
                  ))}
                </CardBody>
              </Card>
            )}
          </GridItem>
        </Grid>
      </Container>
    </Flex>
  );
};

export default StudentProfile;
