import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

const StudentBrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Placeholder course data
  const courseCategories = [
    'IGCSE English', 
    'IGCSE Mathematics', 
    'IGCSE Science', 
    'IGCSE Business Studies', 
    'IGCSE Computer Science', 
    'IGCSE Art & Design'
  ];

  const sampleCourses = [
    {
      id: 1,
      title: 'IGCSE English Language',
      category: 'IGCSE English',
      description: 'Comprehensive preparation for IGCSE English Language examination',
      instructor: 'Sarah Thompson',
      price: 79.99,
      level: 'Intermediate'
    },
    {
      id: 2,
      title: 'IGCSE English Literature',
      category: 'IGCSE English',
      description: 'In-depth study of literary texts for IGCSE English Literature',
      instructor: 'Michael Roberts',
      price: 84.99,
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'IGCSE Mathematics',
      category: 'IGCSE Mathematics',
      description: 'Comprehensive mathematics course covering all IGCSE syllabus topics',
      instructor: 'Dr. Elena Rodriguez',
      price: 89.99,
      level: 'Intermediate'
    },
    {
      id: 4,
      title: 'IGCSE Additional Mathematics',
      category: 'IGCSE Mathematics',
      description: 'Advanced mathematics for students seeking deeper mathematical understanding',
      instructor: 'John Chen',
      price: 94.99,
      level: 'Advanced'
    },
    {
      id: 5,
      title: 'IGCSE Combined Science',
      category: 'IGCSE Science',
      description: 'Comprehensive course covering Biology, Chemistry, and Physics',
      instructor: 'Dr. Amelia Patel',
      price: 99.99,
      level: 'Intermediate'
    },
    {
      id: 6,
      title: 'IGCSE Biology',
      category: 'IGCSE Science',
      description: 'Detailed study of biological concepts and exam preparation',
      instructor: 'Dr. James Wilson',
      price: 84.99,
      level: 'Intermediate'
    },
    {
      id: 7,
      title: 'IGCSE Chemistry',
      category: 'IGCSE Science',
      description: 'Comprehensive chemistry course for IGCSE examination',
      instructor: 'Dr. Rachel Green',
      price: 84.99,
      level: 'Intermediate'
    },
    {
      id: 8,
      title: 'IGCSE Physics',
      category: 'IGCSE Science',
      description: 'Detailed physics course covering all IGCSE syllabus topics',
      instructor: 'Dr. David Kumar',
      price: 84.99,
      level: 'Intermediate'
    },
    {
      id: 9,
      title: 'IGCSE Business Studies',
      category: 'IGCSE Business Studies',
      description: 'Comprehensive introduction to business principles and practices',
      instructor: 'Emma Johnson',
      price: 79.99,
      level: 'Intermediate'
    },
    {
      id: 10,
      title: 'IGCSE Computer Science',
      category: 'IGCSE Computer Science',
      description: 'Fundamental computer science concepts and programming skills',
      instructor: 'Alex Wong',
      price: 89.99,
      level: 'Intermediate'
    }
  ];

  useEffect(() => {
    // Filter courses based on search and category
    const filteredCourses = sampleCourses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || course.category === selectedCategory)
    );
    setCourses(filteredCourses);
  }, [searchTerm, selectedCategory]);

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
          <VStack spacing={8} align="stretch">
            <Heading textAlign="center" color="#640101">Browse Courses</Heading>
            
            {/* Search and Filter Section */}
            <HStack>
              <Input 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderColor="#640101"
                focusBorderColor="#640101"
                _hover={{ borderColor: 'darkred' }}
                leftElement={<FaSearch color="#640101" />}
              />
              <Select 
                placeholder="Select Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                borderColor="#640101"
                focusBorderColor="#640101"
                _hover={{ borderColor: 'darkred' }}
              >
                {courseCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </HStack>

            {/* Courses Grid */}
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {courses.map(course => (
                <Card 
                  key={course.id} 
                  borderWidth="1px" 
                  borderColor="#640101"
                  bg="white"
                  boxShadow="lg"
                  _hover={{
                    transform: 'scale(1.02)',
                    boxShadow: 'xl',
                    borderColor: 'darkred'
                  }}
                >
                  <CardHeader>
                    <Heading size="md" color="#640101">{course.title}</Heading>
                    <Badge 
                      bg="#640101" 
                      color="white" 
                      mt={2}
                    >
                      {course.category}
                    </Badge>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Text color="gray.700">{course.description}</Text>
                      <HStack justify="space-between">
                        <Text fontWeight="bold" color="gray.700">Instructor: {course.instructor}</Text>
                        <Badge 
                          bg="#640101" 
                          color="white"
                        >
                          {course.level}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="bold" color="#640101">${course.price}</Text>
                        <Button 
                          bg="#640101" 
                          color="white"
                          size="sm"
                          _hover={{ 
                            bg: 'darkred',
                            transform: 'scale(1.05)'
                          }}
                        >
                          Enroll Now
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {courses.length === 0 && (
              <Text textAlign="center" color="#640101">
                No courses found matching your search
              </Text>
            )}
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentBrowseCourses;
