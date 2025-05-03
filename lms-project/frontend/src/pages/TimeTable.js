import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  useToast,
  Divider,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { 
  FaClock, 
  FaEdit,
  FaFilePdf,
  FaSave,
  FaPlus,
  FaTrash,
  FaUserGraduate,
  FaChalkboard,
  FaBook,
  FaCalendarCheck
} from 'react-icons/fa';

// Sample data for grades and classes
const gradesData = [
  { 
    id: 1, 
    name: 'Grade 1', 
    classes: [
      { id: 1, name: 'Class 1A' },
      { id: 2, name: 'Class 1B' },
    ]
  },
  { 
    id: 2, 
    name: 'Grade 2', 
    classes: [
      { id: 3, name: 'Class 2A' },
    ]
  }
];

// Sample course data
const coursesData = [
  { id: 1, name: 'Mathematics', instructor: 'Dr. Johnson' },
  { id: 2, name: 'Science', instructor: 'Prof. Smith' },
  { id: 3, name: 'English', instructor: 'Ms. Williams' },
  { id: 4, name: 'History', instructor: 'Prof. Adams' },
  { id: 5, name: 'Geography', instructor: 'Ms. Martinez' },
  { id: 6, name: 'Physics', instructor: 'Dr. Brown' },
  { id: 7, name: 'Chemistry', instructor: 'Dr. Garcia' },
  { id: 8, name: 'Arts', instructor: 'Ms. Taylor' },
  { id: 9, name: 'Music', instructor: 'Mr. Wilson' },
];

// Sample time slots
const timeSlots = [
  { id: 1, label: '8:00 AM - 8:45 AM' },
  { id: 2, label: '8:50 AM - 9:35 AM' },
  { id: 3, label: '9:40 AM - 10:25 AM' },
  { id: 4, label: '10:30 AM - 11:15 AM' },
  { id: 5, label: '11:20 AM - 12:05 PM' },
  { id: 6, label: '12:10 PM - 12:55 PM' },
  { id: 7, label: '1:00 PM - 1:45 PM' },
  { id: 8, label: '1:50 PM - 2:35 PM' },
  { id: 9, label: '2:40 PM - 3:25 PM' },
];

// Days of the week
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Sample timetable data
const generateSampleTimetable = () => {
  const timetable = {};
  
  gradesData.forEach(grade => {
    grade.classes.forEach(classItem => {
      timetable[classItem.id] = {};
      
      weekdays.forEach(day => {
        timetable[classItem.id][day] = {};
        
        timeSlots.forEach(slot => {
          // 70% chance of having a class in this slot
          if (Math.random() < 0.7) {
            const randomCourse = coursesData[Math.floor(Math.random() * coursesData.length)];
            timetable[classItem.id][day][slot.id] = {
              courseId: randomCourse.id,
              courseName: randomCourse.name,
              instructor: randomCourse.instructor,
              room: `Room ${Math.floor(Math.random() * 20) + 101}`
            };
          } else {
            timetable[classItem.id][day][slot.id] = null; // Empty slot
          }
        });
      });
    });
  });
  
  return timetable;
};

// Sample timetable data
const sampleTimetable = generateSampleTimetable();

const TimeTable = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State for managing the view
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [timetableData, setTimetableData] = useState(sampleTimetable);
  const [currentTimetable, setCurrentTimetable] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // State for class schedule editing
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  
  // Load timetable when class is selected
  useEffect(() => {
    if (selectedClass) {
      const classTimetable = timetableData[selectedClass.id] || {};
      setCurrentTimetable(classTimetable);
    } else {
      setCurrentTimetable(null);
    }
  }, [selectedClass, timetableData]);
  
  // Handle grade selection
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass(null);
    setCurrentTimetable(null);
    setEditMode(false);
  };
  
  // Handle class selection
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setEditMode(false);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  // Handle schedule item click for editing
  const handleScheduleItemClick = (day, timeSlotId) => {
    if (!editMode) return;
    
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlotId);
    
    const currentItem = currentTimetable[day][timeSlotId];
    if (currentItem) {
      setSelectedCourse(currentItem.courseId);
      setSelectedRoom(currentItem.room);
    } else {
      setSelectedCourse(null);
      setSelectedRoom('');
    }
    
    onOpen();
  };
  
  // Update schedule item
  const updateScheduleItem = () => {
    if (!selectedDay || !selectedTimeSlot) return;
    
    const updatedTimetable = { ...timetableData };
    
    if (selectedCourse) {
      const course = coursesData.find(c => c.id === selectedCourse);
      updatedTimetable[selectedClass.id][selectedDay][selectedTimeSlot] = {
        courseId: selectedCourse,
        courseName: course.name,
        instructor: course.instructor,
        room: selectedRoom
      };
    } else {
      // Remove class from this slot
      updatedTimetable[selectedClass.id][selectedDay][selectedTimeSlot] = null;
    }
    
    setTimetableData(updatedTimetable);
    onClose();
    
    toast({
      title: "Schedule updated",
      description: "The timetable has been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Send timetable as PDF
  const sendTimetableAsPDF = () => {
    toast({
      title: "Sending PDF",
      description: `Timetable for ${selectedClass.name} has been sent as PDF`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Generate a badge color based on course name (for visual variety)
  const getCourseBadgeColor = (courseName) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal', 'cyan', 'red', 'yellow'];
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16}>
      <Container maxW="container.xl" px={6}>
        <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
          <Icon as={FaClock} mr={3} />
          Time Table
        </Heading>
        <Text color="gray.600" mt={2} mb={6}>
          Manage and view class schedules with easy PDF export capability.
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          {/* Grade Selection */}
          <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
            <Heading size="md" mb={4} color="#640101">
              <Flex align="center">
                <Icon as={FaUserGraduate} mr={2} />
                Grades
              </Flex>
            </Heading>
            <VStack spacing={2} align="stretch">
              {gradesData.map(grade => (
                <Button
                  key={grade.id}
                  variant={selectedGrade?.id === grade.id ? "solid" : "outline"}
                  colorScheme={selectedGrade?.id === grade.id ? "red" : "gray"}
                  justifyContent="flex-start"
                  onClick={() => handleGradeSelect(grade)}
                  size="sm"
                  width="100%"
                >
                  {grade.name}
                </Button>
              ))}
            </VStack>
          </Box>
          
          {/* Class Selection */}
          <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
            <Heading size="md" mb={4} color="#640101">
              <Flex align="center">
                <Icon as={FaChalkboard} mr={2} />
                Classes
              </Flex>
            </Heading>
            {selectedGrade ? (
              <VStack spacing={2} align="stretch">
                {selectedGrade.classes.map(classItem => (
                  <Button
                    key={classItem.id}
                    variant={selectedClass?.id === classItem.id ? "solid" : "outline"}
                    colorScheme={selectedClass?.id === classItem.id ? "red" : "gray"}
                    justifyContent="flex-start"
                    onClick={() => handleClassSelect(classItem)}
                    size="sm"
                    width="100%"
                  >
                    {classItem.name}
                  </Button>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">Please select a grade first</Text>
            )}
          </Box>
          
          {/* Time Table Actions */}
          <Box borderWidth="1px" borderRadius="lg" p={4} height="fit-content">
            <Heading size="md" mb={4} color="#640101">
              <Flex align="center">
                <Icon as={FaBook} mr={2} />
                Actions
              </Flex>
            </Heading>
            {selectedClass ? (
              <VStack spacing={2} align="stretch">
                <Button
                  leftIcon={<FaEdit />}
                  colorScheme={editMode ? "green" : "blue"}
                  onClick={toggleEditMode}
                  size="sm"
                  width="100%"
                >
                  {editMode ? "Save Changes" : "Edit Time Table"}
                </Button>
                <Button
                  leftIcon={<FaFilePdf />}
                  colorScheme="red"
                  bg="#640101"
                  onClick={sendTimetableAsPDF}
                  size="sm"
                  width="100%"
                >
                  Send as PDF
                </Button>
              </VStack>
            ) : (
              <Text color="gray.500">Please select a class to view its timetable</Text>
            )}
          </Box>
        </SimpleGrid>
        
        {selectedClass && currentTimetable && (
          <Box 
            mt={6} 
            borderWidth="1px" 
            borderRadius="lg" 
            p={4} 
            boxShadow="sm"
            bg={editMode ? "yellow.50" : "white"}
            position="relative"
            transition="all 0.3s"
          >
            {editMode && (
              <Badge 
                colorScheme="yellow" 
                position="absolute" 
                top="-10px" 
                right="10px"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="sm"
              >
                Edit Mode
              </Badge>
            )}
            
            <Heading size="md" mb={4} color="#640101" textAlign="center">
              {selectedClass.name} Weekly Schedule
            </Heading>
            
            <Table variant="simple" size="md" colorScheme="gray">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="15%">Time</Th>
                  {weekdays.map(day => (
                    <Th key={day} textAlign="center">{day}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {timeSlots.map(slot => (
                  <Tr key={slot.id}>
                    <Td fontWeight="bold">{slot.label}</Td>
                    {weekdays.map(day => {
                      const scheduleItem = currentTimetable[day][slot.id];
                      
                      return (
                        <Td 
                          key={`${day}-${slot.id}`} 
                          bg={scheduleItem ? `${getCourseBadgeColor(scheduleItem.courseName)}.50` : 'white'}
                          p={2}
                          textAlign="center"
                          cursor={editMode ? "pointer" : "default"}
                          onClick={() => handleScheduleItemClick(day, slot.id)}
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={editMode ? { bg: 'gray.100' } : {}}
                          transition="all 0.2s"
                        >
                          {scheduleItem ? (
                            <VStack spacing={1} align="center">
                              <Text fontWeight="bold" fontSize="sm">{scheduleItem.courseName}</Text>
                              <Text fontSize="xs">{scheduleItem.instructor}</Text>
                              <Text fontSize="xs" color="gray.600">{scheduleItem.room}</Text>
                            </VStack>
                          ) : (
                            editMode && (
                              <Text color="gray.400" fontSize="sm">Click to add</Text>
                            )
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
            
            <Text fontSize="sm" mt={4} color="gray.500" textAlign="center">
              {editMode 
                ? "Click on any cell to add or edit a class" 
                : "Click 'Edit Time Table' to make changes"}
            </Text>
          </Box>
        )}
        
        {/* Edit Schedule Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="#640101">
              Edit Schedule - {selectedDay} {selectedTimeSlot && timeSlots.find(s => s.id === selectedTimeSlot)?.label}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Course</FormLabel>
                  <Select 
                    placeholder="Select course"
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">-- No class --</option>
                    {coursesData.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.instructor})
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl isDisabled={!selectedCourse}>
                  <FormLabel>Room</FormLabel>
                  <Input 
                    placeholder="Enter room number or name"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                bg="#640101"
                leftIcon={<FaSave />}
                onClick={updateScheduleItem}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default TimeTable; 