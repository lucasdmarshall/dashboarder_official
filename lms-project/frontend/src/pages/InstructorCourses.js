import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  SimpleGrid, 
  Text, 
  Button, 
  Flex,
  Image,
  Badge,
  useColorModeValue,
  useToast,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { FaBook, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InstructorSidebar from '../components/InstructorSidebar';

// Temporary mock data - will be replaced with actual state management
const initialCourses = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React development',
    category: 'Web Development',
    requirements: ['Basic JavaScript knowledge', 'HTML/CSS understanding'],
    image: 'https://via.placeholder.com/300x200?text=React+Course',
    createdAt: new Date().toLocaleDateString(),
    price: 20,
    priceType: 'paid'
  }
];

const CourseCard = ({ course, onEdit, onDelete, onViewStudents }) => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate(`/instructor-course-details/${course.id}`);
  };

  return (
    <Box 
      borderWidth="2px" 
      borderRadius="xl" 
      overflow="hidden" 
      bg="white"
      borderColor="#640101"
      boxShadow="0 10px 15px rgba(100, 1, 1, 0.1)"
      transition="all 0.3s"
      _hover={{ 
        transform: 'scale(1.02)', 
        bg: 'rgba(100, 1, 1, 0.05)'
      }}
      onClick={handleCourseClick}
      cursor="pointer"
    >
      <Image 
        src={course.image} 
        alt={course.title} 
        objectFit="cover" 
        w="full" 
        h="200px"
        border="2px solid #640101"
      />
      
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading size="md" color="#640101">{course.title}</Heading>
          <Badge 
            bg="rgba(100, 1, 1, 0.2)" 
            color="#640101"
            borderRadius="full"
            px={2}
            py={1}
          >
            {course.category}
          </Badge>
        </Flex>
        
        <Text color="black" mb={3} noOfLines={2}>
          {course.description}
        </Text>
        
        <Box mb={3}>
          <Text fontWeight="bold" mb={1} color="#640101">Requirements:</Text>
          {course.requirements.map((req, index) => (
            <Badge 
              key={index} 
              bg="rgba(100, 1, 1, 0.1)" 
              color="#640101"
              mr={1} 
              mb={1} 
              borderRadius="full"
              px={2}
              py={1}
            >
              {req}
            </Badge>
          ))}
        </Box>
        
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="black">
            Created: {course.createdAt}
          </Text>
          
          <HStack onClick={(e) => e.stopPropagation()}>
            <Badge 
              bg={course.priceType === 'free' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(100, 1, 1, 0.2)'}
              color="#640101"
              borderRadius="full"
              px={2}
              py={1}
            >
              {course.priceType === 'free' ? 'Free' : `$${course.price}`}
            </Badge>
            <IconButton 
              icon={<FaEdit />} 
              bg="rgba(100, 1, 1, 0.1)"
              color="#640101"
              size="sm" 
              aria-label="Edit Course"
              _hover={{ bg: 'rgba(100, 1, 1, 0.2)' }}
              onClick={() => onEdit(course)}
            />
            <IconButton 
              icon={<FaUsers />} 
              bg="rgba(100, 1, 1, 0.1)"
              color="#640101"
              size="sm" 
              aria-label="View Students"
              _hover={{ bg: 'rgba(100, 1, 1, 0.2)' }}
              onClick={() => onViewStudents(course)}
            />
            <IconButton 
              icon={<FaTrash />} 
              bg="rgba(100, 1, 1, 0.1)"
              color="#640101"
              size="sm"
              aria-label="Delete Course"
              _hover={{ bg: 'rgba(100, 1, 1, 0.2)' }}
              onClick={() => onDelete(course.id)}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  // Load courses from localStorage on component mount
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    setCourses(storedCourses);
  }, []);

  const handleEditCourse = (course) => {
    navigate(`/instructor-edit-course/${course.id}`);
  };

  const handleViewStudents = (course) => {
    navigate(`/instructor-course-students/${course.id}`);
  };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    
    localStorage.setItem('instructorCourses', JSON.stringify(updatedCourses));
    
    setCourses(updatedCourses);

    toast({
      title: "Course Deleted",
      description: "The course has been removed from your list.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="90px" pb={8} px={6} bg="white">
        <VStack spacing={8} align="stretch">
          <Heading 
            size="lg" 
            color="#640101" 
            display="flex" 
            alignItems="center"
            borderBottom="2px solid #640101"
            pb={2}
          >
            <Box as={FaBook} mr={3} color="#640101" />
            My Courses
          </Heading>

          {courses.length === 0 ? (
            <Flex 
              justify="center" 
              align="center" 
              direction="column" 
              bg="rgba(100, 1, 1, 0.05)" 
              border="2px solid #640101"
              p={10} 
              borderRadius="xl"
            >
              <Text fontSize="xl" color="black" mb={4}>
                No courses created yet
              </Text>
              <Button 
                bg="#640101"
                color="white"
                _hover={{ bg: 'black' }}
                onClick={() => navigate('/instructor-create-course')}
              >
                Create First Course
              </Button>
            </Flex>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onViewStudents={handleViewStudents}
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorCourses;
