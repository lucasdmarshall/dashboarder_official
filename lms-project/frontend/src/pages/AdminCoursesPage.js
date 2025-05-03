import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Badge,
  Text,
  Icon,
  InputLeftElement,
  InputGroup,
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
  useToast
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaFilter,
  FaTrash,
  FaLock,
  FaUnlock,
  FaTag,
  FaEdit
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isPriceOpen, onOpen: onPriceOpen, onClose: onPriceClose } = useDisclosure();
  const { isOpen: isLockOpen, onOpen: onLockOpen, onClose: onLockClose } = useDisclosure();
  const [newPrice, setNewPrice] = useState('');
  const toast = useToast();

  // Sample course data (replace with actual API call)
  const initialCourses = [
    {
      id: 1,
      title: 'Introduction to Python',
      category: 'Programming',
      instructor: 'John Doe',
      price: 49.99,
      totalStudents: 150,
      status: 'Active',
      isOverpriced: false,
      isLocked: false
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      category: 'Web Development',
      instructor: 'Jane Smith',
      price: 99.99,
      totalStudents: 250,
      status: 'Active',
      isOverpriced: false,
      isLocked: false
    }
  ];

  useEffect(() => {
    // Filter courses based on search term and category
    const filteredCourses = initialCourses.filter(course => 
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === '' || course.category.toLowerCase() === categoryFilter.toLowerCase())
    );
    setCourses(filteredCourses);
  }, [searchTerm, categoryFilter]);

  const handleDeleteCourse = () => {
    if (selectedCourse) {
      const updatedCourses = courses.filter(course => course.id !== selectedCourse.id);
      setCourses(updatedCourses);
      toast({
        title: "Course Deleted",
        description: `${selectedCourse.title} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      onDeleteClose();
    }
  };

  const handleFlagOverprice = (course) => {
    const updatedCourses = courses.map(c => 
      c.id === course.id ? { ...c, isOverpriced: !c.isOverpriced } : c
    );
    setCourses(updatedCourses);
    toast({
      title: course.isOverpriced ? "Overpriced Flag Removed" : "Course Flagged as Overpriced",
      description: `${course.title} has been ${course.isOverpriced ? 'unflagged' : 'flagged'}.`,
      status: "warning",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
  };

  const handleChangePrice = () => {
    if (selectedCourse && newPrice) {
      const updatedCourses = courses.map(course => 
        course.id === selectedCourse.id ? { ...course, price: parseFloat(newPrice) } : course
      );
      setCourses(updatedCourses);
      toast({
        title: "Price Updated",
        description: `${selectedCourse.title} price updated to $${newPrice}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      onPriceClose();
      setNewPrice('');
    }
  };

  const handleToggleLock = (course) => {
    const updatedCourses = courses.map(c => 
      c.id === course.id ? { ...c, isLocked: !c.isLocked, status: c.isLocked ? 'Active' : 'Locked' } : c
    );
    setCourses(updatedCourses);
    toast({
      title: course.isLocked ? "Course Unlocked" : "Course Locked",
      description: `${course.title} has been ${course.isLocked ? 'unlocked' : 'locked'}.`,
      status: course.isLocked ? "success" : "warning",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
  };

  return (
    <Flex
      bg="linear-gradient(135deg, #F7FAFC 0%, #F1F5F9 100%)"
      minHeight="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        width="200px"
        height="200px"
        bg="rgba(100, 1, 1, 0.05)"
        transform="rotate(45deg)"
        borderRadius="50px"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="-50px"
        left="-50px"
        width="200px"
        height="200px"
        bg="rgba(100, 1, 1, 0.05)"
        transform="rotate(45deg)"
        borderRadius="50px"
        zIndex={1}
      />

      <AdminSidebar />
      <Box 
        ml="250px"  
        width="calc(100% - 250px)" 
        pt="98px" 
        pb={8} 
        px={6}
        zIndex={10}
        position="relative"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading 
              textAlign="center" 
              w="100%" 
              color="#4A0000"
              fontWeight="bold"
              letterSpacing="wide"
              position="relative"
            >
              Course Management
              <Box
                position="absolute"
                bottom="-10px"
                left="50%"
                transform="translateX(-50%)"
                height="3px"
                width="100px"
                bg="#640101"
                borderRadius="full"
              />
            </Heading>
            
            {/* Search Section */}
            <HStack spacing={4}>
              <InputGroup>
                <InputLeftElement 
                  pointerEvents="none"
                  children={<Icon as={FaSearch} color="#4A0000" />}
                />
                <Input 
                  placeholder="Search courses..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderColor="rgba(100, 1, 1, 0.2)"
                  _hover={{ borderColor: "#640101" }}
                  focusBorderColor="#640101"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement 
                  pointerEvents="none"
                  children={<Icon as={FaFilter} color="#4A0000" />}
                />
                <Select 
                  placeholder="Filter by Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  borderColor="rgba(100, 1, 1, 0.2)"
                  _hover={{ borderColor: "#640101" }}
                  focusBorderColor="#640101"
                >
                  <option value="programming">Programming</option>
                  <option value="web-development">Web Development</option>
                  <option value="data-science">Data Science</option>
                </Select>
              </InputGroup>
            </HStack>

            {/* Courses Table */}
            <Table 
              variant="soft-rounded" 
              bg="white" 
              boxShadow="0 10px 30px rgba(100, 1, 1, 0.08)"
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.100"
            >
              <Thead 
                bg="gray.50"
                borderBottom="2px solid #640101"
              >
                <Tr>
                  <Th color="#4A0000" fontWeight="bold">Title</Th>
                  <Th color="#4A0000" fontWeight="bold">Category</Th>
                  <Th color="#4A0000" fontWeight="bold">Instructor</Th>
                  <Th color="#4A0000" fontWeight="bold">Price</Th>
                  <Th color="#4A0000" fontWeight="bold">Total Students</Th>
                  <Th color="#4A0000" fontWeight="bold">Status</Th>
                  <Th color="#4A0000" fontWeight="bold">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {courses.map(course => (
                  <Tr 
                    key={course.id}
                    _hover={{ 
                      bg: "gray.50", 
                      transform: "translateY(-2px)", 
                      boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                    }}
                    transition="all 0.3s ease"
                  >
                    <Td>{course.title}</Td>
                    <Td>{course.category}</Td>
                    <Td>{course.instructor}</Td>
                    <Td>
                      <Badge 
                        bg={course.isOverpriced ? 'rgba(255, 0, 0, 0.1)' : 'rgba(100, 1, 1, 0.1)'}
                        color={course.isOverpriced ? 'red.600' : '#640101'}
                        borderWidth="1px"
                        borderColor={course.isOverpriced ? 'rgba(255, 0, 0, 0.2)' : 'rgba(100, 1, 1, 0.2)'}
                        fontWeight="semibold"
                      >
                        ${course.price}
                      </Badge>
                    </Td>
                    <Td>{course.totalStudents}</Td>
                    <Td>
                      <Badge 
                        bg={
                          course.status === 'Locked' ? 'rgba(255, 0, 0, 0.1)' : 
                          course.status === 'Active' ? 'rgba(0, 255, 0, 0.1)' : 
                          'rgba(100, 1, 1, 0.1)'
                        }
                        color={
                          course.status === 'Locked' ? 'red.600' : 
                          course.status === 'Active' ? 'green.600' : 
                          '#640101'
                        }
                        borderWidth="1px"
                        borderColor={
                          course.status === 'Locked' ? 'rgba(255, 0, 0, 0.2)' : 
                          course.status === 'Active' ? 'rgba(0, 255, 0, 0.2)' : 
                          'rgba(100, 1, 1, 0.2)'
                        }
                        fontWeight="semibold"
                        textTransform="capitalize"
                      >
                        {course.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button 
                          size="xs" 
                          colorScheme="red" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedCourse(course);
                            onDeleteOpen();
                          }}
                        >
                          <Icon as={FaTrash} />
                        </Button>
                        <Button 
                          size="xs" 
                          colorScheme="yellow" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedCourse(course);
                            onPriceOpen();
                          }}
                        >
                          <Icon as={FaEdit} />
                        </Button>
                        <Button 
                          size="xs" 
                          colorScheme="orange" 
                          variant="ghost"
                          onClick={() => handleFlagOverprice(course)}
                        >
                          <Icon as={FaTag} color={course.isOverpriced ? 'orange.500' : 'gray.500'} />
                        </Button>
                        <Button 
                          size="xs" 
                          colorScheme={course.isLocked ? 'green' : 'red'} 
                          variant="ghost"
                          onClick={() => handleToggleLock(course)}
                        >
                          <Icon as={course.isLocked ? FaUnlock : FaLock} />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {courses.length === 0 && (
              <Text 
                textAlign="center" 
                color="#4A0000"
                fontWeight="semibold"
              >
                No courses found matching your search
              </Text>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Delete Course Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent bg="white" color="#4A0000">
          <ModalHeader>Delete Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the course "{selectedCourse?.title}"?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteCourse}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Change Price Modal */}
      <Modal isOpen={isPriceOpen} onClose={onPriceClose}>
        <ModalOverlay />
        <ModalContent bg="white" color="#4A0000">
          <ModalHeader>Change Course Price</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>New Price for "{selectedCourse?.title}"</FormLabel>
              <Input 
                type="number" 
                value={newPrice} 
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new price"
                borderColor="rgba(100, 1, 1, 0.2)"
                _hover={{ borderColor: "#640101" }}
                focusBorderColor="#640101"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onPriceClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleChangePrice}>
              Update Price
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AdminCoursesPage;
