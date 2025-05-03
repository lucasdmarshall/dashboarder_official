  import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Container,
  useToast,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { 
  FaBook, 
  FaCalendar, 
  FaClipboardList, 
  FaUsers, 
  FaChalkboard, 
  FaCog,
  FaEdit,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

const InstructorEditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Course State
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Academic Calendar State
  const [academicEvents, setAcademicEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: ''
  });

  // Syllabus State
  const [syllabusSections, setSyllabusSections] = useState([]);
  const [newSyllabusSection, setNewSyllabusSection] = useState({
    title: '',
    description: '',
    learningObjectives: []
  });

  // Course Content State
  const [courseSections, setCourseSections] = useState([]);
  const [newCourseSection, setNewCourseSection] = useState({
    title: '',
    lectures: []
  });

  // Load course data on component mount
  useEffect(() => {
    // Retrieve course from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    const foundCourse = storedCourses.find(c => c.id === parseInt(courseId));

    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      // Redirect if course not found
      navigate('/instructor-courses');
      toast({
        title: "Course Not Found",
        description: "The specified course could not be found.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [courseId, navigate, toast]);

  // Academic Calendar Handlers
  const addAcademicEvent = () => {
    if (newEvent.title && newEvent.date) {
      setAcademicEvents([...academicEvents, { 
        ...newEvent, 
        id: Date.now() 
      }]);
      setNewEvent({ title: '', date: '', description: '' });
    }
  };

  const removeAcademicEvent = (eventId) => {
    setAcademicEvents(academicEvents.filter(event => event.id !== eventId));
  };

  // Syllabus Handlers
  const addSyllabusSection = () => {
    if (newSyllabusSection.title) {
      setSyllabusSections([...syllabusSections, { 
        ...newSyllabusSection, 
        id: Date.now() 
      }]);
      setNewSyllabusSection({ 
        title: '', 
        description: '', 
        learningObjectives: [] 
      });
    }
  };

  const removeSyllabusSection = (sectionId) => {
    setSyllabusSections(syllabusSections.filter(section => section.id !== sectionId));
  };

  // Course Content Handlers
  const addCourseSection = () => {
    if (newCourseSection.title) {
      setCourseSections([...courseSections, { 
        ...newCourseSection, 
        id: Date.now() 
      }]);
      setNewCourseSection({ 
        title: '', 
        lectures: [] 
      });
    }
  };

  const removeCourseSection = (sectionId) => {
    setCourseSections(courseSections.filter(section => section.id !== sectionId));
  };

  // Save Course Changes
  const saveCourseChanges = () => {
    // Update course in localStorage
    const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    const updatedCourses = storedCourses.map(c => 
      c.id === course.id 
        ? { 
            ...c, 
            academicEvents, 
            syllabusSections, 
            courseSections 
          } 
        : c
    );

    localStorage.setItem('instructorCourses', JSON.stringify(updatedCourses));

    // Show success toast
    toast({
      title: "Course Updated",
      description: `${course.title} has been successfully updated.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!course) return null;

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="85px" pb={8} px={6} bg="white">
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
            Edit Course: {course.title}
          </Heading>

          <Tabs 
            variant="enclosed" 
            colorScheme="red" 
            index={activeTab} 
            onChange={setActiveTab}
          >
            <TabList borderColor="#640101">
              <Tab 
                color="black" 
                _selected={{ 
                  color: 'white', 
                  bg: '#640101' 
                }}
              >
                <FaClipboardList style={{ marginRight: '10px' }} /> Course Details
              </Tab>
              <Tab 
                color="black" 
                _selected={{ 
                  color: 'white', 
                  bg: '#640101' 
                }}
              >
                <FaCalendar style={{ marginRight: '10px' }} /> Academic Calendar
              </Tab>
              <Tab 
                color="black" 
                _selected={{ 
                  color: 'white', 
                  bg: '#640101' 
                }}
              >
                <FaChalkboard style={{ marginRight: '10px' }} /> Syllabus
              </Tab>
              <Tab 
                color="black" 
                _selected={{ 
                  color: 'white', 
                  bg: '#640101' 
                }}
              >
                <FaCog style={{ marginRight: '10px' }} /> Course Content
              </Tab>
              <Tab 
                color="black" 
                _selected={{ 
                  color: 'white', 
                  bg: '#640101' 
                }}
              >
                <FaCog style={{ marginRight: '10px' }} /> Course Settings
              </Tab>
            </TabList>

            <TabPanels>
              {/* Course Details Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel color="#640101">Course Title</FormLabel>
                    <Input 
                      value={course.title} 
                      onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                      borderColor="#640101" 
                      _hover={{ borderColor: 'black' }}
                      focusBorderColor="#640101"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="#640101">Description</FormLabel>
                    <Textarea 
                      value={course.description} 
                      onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                      borderColor="#640101" 
                      _hover={{ borderColor: 'black' }}
                      focusBorderColor="#640101"
                      rows={4}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Academic Calendar Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack>
                    <Input 
                      placeholder="Event Title" 
                      borderColor="#640101" 
                      _hover={{ borderColor: 'black' }}
                      focusBorderColor="#640101"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input 
                      type="date" 
                      borderColor="#640101" 
                      _hover={{ borderColor: 'black' }}
                      focusBorderColor="#640101"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Button 
                      leftIcon={<FaPlus />}
                      bg="#640101"
                      color="white"
                      _hover={{ bg: 'black' }}
                      onClick={addAcademicEvent}
                    >
                      Add Event
                    </Button>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    {academicEvents.map(event => (
                      <Flex 
                        key={event.id} 
                        justify="space-between" 
                        align="center"
                        bg="rgba(100, 1, 1, 0.05)"
                        border="2px solid #640101"
                        borderRadius="xl"
                        p={4}
                      >
                        <VStack align="start" spacing={1}>
                          <Text color="#640101" fontWeight="bold">{event.title}</Text>
                          <Text color="black">{event.date}</Text>
                        </VStack>
                        <IconButton 
                          icon={<FaTrash />}
                          bg="rgba(100, 1, 1, 0.1)"
                          color="#640101"
                          _hover={{ bg: 'rgba(100, 1, 1, 0.2)' }}
                          onClick={() => removeAcademicEvent(event.id)}
                        />
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Syllabus Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack>
                    <Input 
                      placeholder="Section Title" 
                      borderColor="#640101" 
                      _hover={{ borderColor: 'black' }}
                      focusBorderColor="#640101"
                      value={newSyllabusSection.title}
                      onChange={(e) => setNewSyllabusSection(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Button 
                      leftIcon={<FaPlus />}
                      bg="#640101"
                      color="white"
                      _hover={{ bg: 'black' }}
                      onClick={addSyllabusSection}
                    >
                      Add Section
                    </Button>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    {syllabusSections.map(section => (
                      <Flex 
                        key={section.id} 
                        justify="space-between" 
                        align="center"
                        bg="rgba(100, 1, 1, 0.05)"
                        border="2px solid #640101"
                        borderRadius="xl"
                        p={4}
                      >
                        <VStack align="start" spacing={1}>
                          <Text color="#640101" fontWeight="bold">{section.title}</Text>
                        </VStack>
                        <IconButton 
                          icon={<FaTrash />}
                          bg="rgba(100, 1, 1, 0.1)"
                          color="#640101"
                          _hover={{ bg: 'rgba(100, 1, 1, 0.2)' }}
                          onClick={() => removeSyllabusSection(section.id)}
                        />
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Course Content Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack>
                    <Input 
                      placeholder="Section Title" 
                      borderColor="#640101" 
                      _hover={{ borderColor: 'black' }}
                      focusBorderColor="#640101"
                      value={newCourseSection.title}
                      onChange={(e) => setNewCourseSection(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Button 
                      leftIcon={<FaPlus />}
                      bg="#640101"
                      color="white"
                      _hover={{ bg: 'black' }}
                      onClick={addCourseSection}
                    >
                      Add Section
                    </Button>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    {courseSections.map(section => (
                      <Flex 
                        key={section.id} 
                        justify="space-between" 
                        align="center"
                        bg="rgba(100, 1, 1, 0.05)"
                        border="2px solid #640101"
                        borderRadius="xl"
                        p={4}
                      >
                        <VStack align="start" spacing={1}>
                          <Text color="#640101" fontWeight="bold">{section.title}</Text>
                        </VStack>
                        <IconButton 
                          icon={<FaTrash />}
                          bg="rgba(100, 1, 1, 0.1)"
                          color="#640101"
                          _hover={{ bg: 'rgba(100, 1, 1, 0.2)' }}
                          onClick={() => removeCourseSection(section.id)}
                        />
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Course Settings Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel color="#640101">Course Category</FormLabel>
                    <Select 
                      value={course.category}
                      onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Business">Business</option>
                      <option value="Design">Design</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Flex justify="flex-end" mt={6}>
            <Button 
              leftIcon={<FaEdit />}
              bg="#640101"
              color="white"
              size="lg"
              _hover={{ bg: 'black' }}
              onClick={saveCourseChanges}
            >
              Save Changes
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorEditCourse;
