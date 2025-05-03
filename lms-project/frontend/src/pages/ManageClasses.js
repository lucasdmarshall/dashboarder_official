import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Flex,
  IconButton,
  useColorModeValue,
  Button,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaEye
} from 'react-icons/fa';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = useColorModeValue('#640101', '#640101');
  const headerColor = useColorModeValue('white', 'white');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const cardHoverBgColor = useColorModeValue('gray.50', 'gray.600');

  // Load classes from localStorage
  useEffect(() => {
    // Get classes from localStorage
    const storedClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    
    // If no stored classes, use sample data for demonstration
    if (storedClasses.length === 0) {
      const sampleClasses = [
        {
          id: 1,
          name: 'Advanced Mathematics',
          description: 'A comprehensive class covering advanced mathematical concepts',
          courses: [
            { id: 1, name: 'Calculus' },
            { id: 2, name: 'Linear Algebra' }
          ],
          students: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
          ],
          createdAt: '2025-03-15T10:30:00'
        },
        {
          id: 2,
          name: 'Computer Science Fundamentals',
          description: 'Introduction to core computer science concepts and programming',
          courses: [
            { id: 3, name: 'Introduction to Programming' },
            { id: 4, name: 'Data Structures' }
          ],
          students: [
            { id: 4, name: 'Alice Williams', email: 'alice@example.com' },
            { id: 5, name: 'Charlie Brown', email: 'charlie@example.com' }
          ],
          createdAt: '2025-03-16T14:15:00'
        }
      ];
      setClasses(sampleClasses);
    } else {
      setClasses(storedClasses);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter classes based on search term
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort classes based on selected option
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'nameDesc') {
      return b.name.localeCompare(a.name);
    } else if (sortOption === 'date') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'dateDesc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'students') {
      return a.students.length - b.students.length;
    } else if (sortOption === 'studentsDesc') {
      return b.students.length - a.students.length;
    }
    return 0;
  });

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (classToDelete) {
      // This would be an API call in a real application
      setClasses(classes.filter(cls => cls.id !== classToDelete.id));
      
      toast({
        title: 'Class deleted',
        description: `${classToDelete.name} has been successfully deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsDeleteAlertOpen(false);
      setClassToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteAlert = (cls) => {
    setClassToDelete(cls);
    setIsDeleteAlertOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Box 
        bg={headerBgColor} 
        color={headerColor} 
        p={4} 
        borderRadius="md" 
        mb={6}
        boxShadow="md"
      >
        <Heading size="lg">Manage Classes</Heading>
        <Text mt={2}>View, edit, and manage all classes</Text>
      </Box>

      {/* Search and filter controls */}
      <Flex mb={6} justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search classes..." 
            value={searchTerm} 
            onChange={handleSearchChange}
            borderColor="gray.300"
          />
        </InputGroup>

        <Flex gap={3}>
          <Menu>
            <MenuButton 
              as={Button} 
              rightIcon={<FaSort />} 
              variant="outline" 
              colorScheme="gray"
            >
              Sort By
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSortOption('name')}>Name (A-Z)</MenuItem>
              <MenuItem onClick={() => setSortOption('nameDesc')}>Name (Z-A)</MenuItem>
              <Divider />
              <MenuItem onClick={() => setSortOption('date')}>Date (Oldest first)</MenuItem>
              <MenuItem onClick={() => setSortOption('dateDesc')}>Date (Newest first)</MenuItem>
              <Divider />
              <MenuItem onClick={() => setSortOption('students')}>Students (Fewest first)</MenuItem>
              <MenuItem onClick={() => setSortOption('studentsDesc')}>Students (Most first)</MenuItem>
            </MenuList>
          </Menu>

          <Button 
            leftIcon={<FaFilter />} 
            variant="outline" 
            colorScheme="gray"
          >
            Filter
          </Button>
        </Flex>
      </Flex>

      {/* Classes grid */}
      {sortedClasses.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sortedClasses.map(cls => (
            <Box 
              key={cls.id}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={cardBorderColor}
              overflow="hidden"
              bg={cardBgColor}
              boxShadow="sm"
              transition="all 0.3s"
              _hover={{ 
                transform: 'translateY(-5px)', 
                boxShadow: 'md',
                borderColor: '#640101',
                bg: cardHoverBgColor
              }}
            >
              <Box p={5}>
                <Heading size="md" mb={2} color="#640101">{cls.name}</Heading>
                <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                  {cls.description}
                </Text>
                
                <Flex mb={3} wrap="wrap" gap={2}>
                  <Badge colorScheme="purple">{cls.courses.length} Courses</Badge>
                  <Badge colorScheme="green">{cls.students.length} Students</Badge>
                  <Badge colorScheme="blue">Created: {formatDate(cls.createdAt)}</Badge>
                </Flex>
                
                <Text fontSize="sm" fontWeight="bold" mb={1}>Courses:</Text>
                <Flex mb={3} wrap="wrap" gap={1}>
                  {cls.courses.slice(0, 3).map(course => (
                    <Badge key={course.id} colorScheme="teal" mr={1} mb={1}>
                      {course.name}
                    </Badge>
                  ))}
                  {cls.courses.length > 3 && (
                    <Badge colorScheme="teal">+{cls.courses.length - 3} more</Badge>
                  )}
                </Flex>
                
                <Text fontSize="sm" fontWeight="bold" mb={1}>Students:</Text>
                <Flex mb={4} wrap="wrap" gap={1}>
                  {cls.students.slice(0, 3).map(student => (
                    <Badge key={student.id} colorScheme="blue" mr={1} mb={1}>
                      {student.name}
                    </Badge>
                  ))}
                  {cls.students.length > 3 && (
                    <Badge colorScheme="blue">+{cls.students.length - 3} more</Badge>
                  )}
                </Flex>
              </Box>
              
              <Flex 
                p={3} 
                bg="gray.50" 
                justifyContent="flex-end" 
                borderTop="1px" 
                borderColor="gray.200"
              >
                <IconButton
                  icon={<FaEye />}
                  aria-label="View class"
                  mr={2}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                />
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Edit class"
                  mr={2}
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                />
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Delete class"
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => openDeleteAlert(cls)}
                />
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            {searchTerm ? 'No classes match your search criteria' : 'No classes available yet'}
          </Text>
          <Button 
            mt={4} 
            colorScheme="red" 
            as="a" 
            href="/create-class"
            bg="#640101"
            _hover={{ bg: '#800202' }}
          >
            Create New Class
          </Button>
        </Box>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Class
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {classToDelete?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ManageClasses;
