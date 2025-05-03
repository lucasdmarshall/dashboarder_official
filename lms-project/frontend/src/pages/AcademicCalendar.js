import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  Grid,
  GridItem,
  Container,
  Button,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  Tab
} from '@chakra-ui/react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaSearch
} from 'react-icons/fa';

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: 'Fall Semester Begins',
    date: '2025-08-25',
    type: 'academic',
    description: 'First day of classes for Fall 2025 semester'
  },
  {
    id: 2,
    title: 'Labor Day Holiday',
    date: '2025-09-01',
    type: 'holiday',
    description: 'No classes - Labor Day'
  },
  {
    id: 3,
    title: 'Midterm Exams',
    date: '2025-10-15',
    type: 'exam',
    description: 'Midterm examination period begins'
  },
  {
    id: 4,
    title: 'Thanksgiving Break',
    date: '2025-11-26',
    type: 'holiday',
    description: 'No classes - Thanksgiving Break'
  },
  {
    id: 5,
    title: 'Final Exams Begin',
    date: '2025-12-15',
    type: 'exam',
    description: 'Final examination period begins'
  },
  {
    id: 6,
    title: 'Winter Break Begins',
    date: '2025-12-22',
    type: 'holiday',
    description: 'Winter Break - No classes until January 12'
  },
  {
    id: 7,
    title: 'Spring Semester Begins',
    date: '2026-01-12',
    type: 'academic',
    description: 'First day of classes for Spring 2026 semester'
  }
];

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('academicEvents');
    return savedEvents ? JSON.parse(savedEvents) : sampleEvents;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'academic',
    description: ''
  });
  const [viewMode, setViewMode] = useState('month'); // 'year', 'month', 'week', 'day'
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('academicEvents', JSON.stringify(events));
  }, [events]);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of the month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Day names for display
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setSelectedEvents([]);
  };
  
  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setSelectedEvents([]);
  };
  
  // Function to handle date selection
  const handleDateSelect = (day) => {
    if (!day) return;
    
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    
    // Format selected date to YYYY-MM-DD for comparison with events
    const formattedDate = selected.toISOString().split('T')[0];
    
    // Find events for selected date
    const eventsForDate = events.filter(event => event.date === formattedDate);
    setSelectedEvents(eventsForDate);
  };
  
  // Function to check if a date has events
  const hasEvents = (day) => {
    if (!day) return false;
    
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const formattedDate = dateToCheck.toISOString().split('T')[0];
    
    return events.some(e => {
      const eventYear = parseInt(e.date.split('-')[0]);
      const eventMonth = parseInt(e.date.split('-')[1]) - 1;
      const eventDay = parseInt(e.date.split('-')[2]);

      // Debug logs - will remove after testing
      console.log('Current comparison:', {
        currentYear: currentYear,
        currentMonth: currentMonth,
        day: day,
        eventDate: e.date,
        parsedEvent: [
          parseInt(e.date.split('-')[0]),
          parseInt(e.date.split('-')[1]) - 1,
          parseInt(e.date.split('-')[2])
        ]
      });

      return (
        eventYear === currentYear &&
        eventMonth === currentMonth &&
        eventDay === day
      );
    });
  };
  
  // Function to add a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: 'Error',
        description: 'Title and date are required',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    const eventId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const eventToAdd = { ...newEvent, id: eventId };
    
    setEvents([...events, eventToAdd]);
    
    // If the added event is for the selected date, update selectedEvents
    if (selectedDate && newEvent.date === selectedDate.toISOString().split('T')[0]) {
      setSelectedEvents([...selectedEvents, eventToAdd]);
    }
    
    // Reset form and close modal
    setNewEvent({
      title: '',
      date: '',
      type: 'academic',
      description: ''
    });
    onClose();
    
    toast({
      title: 'Event Added',
      description: 'The event has been added to the calendar',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };
  
  // Function to delete an event
  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
  };
  
  // Get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'academic':
        return 'blue.500';
      case 'holiday':
        return 'green.500';
      case 'exam':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };
  
  // Function to generate calendar grid
  const generateCalendarGrid = () => {
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }
    
    return calendarDays;
  };
  
  // Calendar grid
  const calendarGrid = generateCalendarGrid();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const todayBgColor = useColorModeValue('blue.50', 'blue.900');
  const selectedBgColor = useColorModeValue('red.100', 'red.900');
  const dayBgColor = useColorModeValue('gray.50', 'gray.700');
  const headerBgColor = useColorModeValue('#640101', '#640101');
  const headerTextColor = useColorModeValue('white', 'white');
  
  // Check if a day is today
  const isToday = (day) => {
    if (!day) return false;
    
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };
  
  // Check if a day is selected
  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };
  
  // Function to generate year view calendar
  const generateYearView = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const monthName = monthNames[month];
      months.push({ month, monthName, date });
    }
    return months;
  };

  // Function to handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Reset selected date when changing views
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  // Year view calendar data
  const yearMonths = generateYearView();

  // Ensure selectedDate is always a valid Date object
  const handleDateSelection = (date) => {
    setSelectedDate(new Date(date));
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={4} align="stretch">
          {/* Header with title and add button */}
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">Academic Calendar</Text>
            <Button
              bg="#640101"
              color="white"
              leftIcon={<FaPlus />}
              _hover={{ bg: 'black' }}
              onClick={onOpen}
            >
              Add Event
            </Button>
          </Flex>

          {/* View mode tabs - iPhone style */}
          <Flex 
            width="100%" 
            justifyContent="center" 
            borderBottom="1px solid" 
            borderColor="gray.200"
            bg="white"
            borderRadius="md"
            overflow="hidden"
            mb={4}
            boxShadow="sm"
          >
            <Tabs 
              variant="unstyled" 
              index={viewMode === 'day' ? 0 : viewMode === 'week' ? 1 : viewMode === 'month' ? 2 : 3}
              width="100%"
            >
              <TabList display="flex" justifyContent="space-between" width="100%">
                <Tab 
                  flex="1" 
                  py={2} 
                  onClick={() => handleViewModeChange('day')}
                  fontWeight={viewMode === 'day' ? 'bold' : 'normal'}
                  color={viewMode === 'day' ? '#640101' : 'gray.500'}
                  borderBottom={viewMode === 'day' ? '2px solid #640101' : 'none'}
                  _hover={{ color: '#640101', opacity: 0.8 }}
                >
                  Day
                </Tab>
                <Tab 
                  flex="1" 
                  py={2} 
                  onClick={() => handleViewModeChange('week')}
                  fontWeight={viewMode === 'week' ? 'bold' : 'normal'}
                  color={viewMode === 'week' ? '#640101' : 'gray.500'}
                  borderBottom={viewMode === 'week' ? '2px solid #640101' : 'none'}
                  _hover={{ color: '#640101', opacity: 0.8 }}
                >
                  Week
                </Tab>
                <Tab 
                  flex="1" 
                  py={2} 
                  onClick={() => handleViewModeChange('month')}
                  fontWeight={viewMode === 'month' ? 'bold' : 'normal'}
                  color={viewMode === 'month' ? '#640101' : 'gray.500'}
                  borderBottom={viewMode === 'month' ? '2px solid #640101' : 'none'}
                  _hover={{ color: '#640101', opacity: 0.8 }}
                >
                  Month
                </Tab>
                <Tab 
                  flex="1" 
                  py={2} 
                  onClick={() => handleViewModeChange('year')}
                  fontWeight={viewMode === 'year' ? 'bold' : 'normal'}
                  color={viewMode === 'year' ? '#640101' : 'gray.500'}
                  borderBottom={viewMode === 'year' ? '2px solid #640101' : 'none'}
                  _hover={{ color: '#640101', opacity: 0.8 }}
                >
                  Year
                </Tab>
              </TabList>
            </Tabs>
          </Flex>

          {/* Search bar - iPhone style */}
          <Flex 
            alignItems="center" 
            bg="gray.100" 
            borderRadius="full" 
            px={4} 
            py={2} 
            mb={4}
            boxShadow="sm"
          >
            <FaSearch color="gray.500" />
            <Input 
              placeholder="Search events" 
              border="none" 
              color="gray.800"
              _focus={{ boxShadow: 'none' }} 
              _placeholder={{ color: 'gray.500' }}
              ml={2} 
              variant="unstyled"
            />
          </Flex>
          
          {/* Calendar Views */}
          {viewMode === 'year' && (
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              color="gray.800"
            >
              <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">{currentYear}</Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {yearMonths.map(({ month, monthName }) => (
                  <Box 
                    key={month} 
                    bg={month === currentMonth ? '#f8e5e5' : 'gray.50'} 
                    borderRadius="md" 
                    p={3}
                    onClick={() => {
                      setCurrentDate(new Date(currentYear, month, 1));
                      handleViewModeChange('month');
                    }}
                    cursor="pointer"
                    border="1px solid"
                    borderColor={month === currentMonth ? '#640101' : 'gray.200'}
                    _hover={{ bg: '#f8e5e5', borderColor: '#640101' }}
                  >
                    <Text fontWeight="bold" mb={2} color={month === currentMonth ? '#640101' : 'gray.700'}>{monthName}</Text>
                    <Grid templateColumns="repeat(7, 1fr)" gap={1} fontSize="xs">
                      {['S','M','T','W','T','F','S'].map((d, i) => (
                        <Text key={i} textAlign="center" color="gray.500">{d}</Text>
                      ))}
                      
                      {/* Mini calendar days */}
                      {Array.from({ length: new Date(currentYear, month + 1, 0).getDate() + new Date(currentYear, month, 1).getDay() }).map((_, i) => {
                        const day = i - new Date(currentYear, month, 1).getDay() + 1;
                        return (
                          <Text 
                            key={i} 
                            textAlign="center"
                            color={day <= 0 ? 'transparent' : day === new Date().getDate() && month === new Date().getMonth() ? '#640101' : 'gray.600'}
                            fontWeight={day > 0 && events.some(e => {
                              const eventYear = parseInt(e.date.split('-')[0]);
                              const eventMonth = parseInt(e.date.split('-')[1]) - 1;
                              const eventDay = parseInt(e.date.split('-')[2]);

                              return (
                                eventYear === currentYear &&
                                eventMonth === month &&
                                eventDay === day
                              );
                            }) ? 'bold' : 'normal'}
                          >
                            {day > 0 ? day : ''}
                          </Text>
                        );
                      })}
                    </Grid>
                  </Box>
                ))}
              </Grid>
            </Box>
          )}

          {viewMode === 'month' && (
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              color="gray.800"
            >
              {/* Calendar Header */}
              <Flex
                bg={headerBgColor}
                color={headerTextColor}
                p={4}
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="ghost"
                  color="white"
                  size="sm"
                  onClick={goToPreviousMonth}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                >
                  <FaChevronLeft />
                </Button>
                <Text fontSize="xl" fontWeight="bold">
                  {monthNames[currentMonth]} {currentYear}
                </Text>
                <Button
                  variant="ghost"
                  color="white"
                  size="sm"
                  onClick={goToNextMonth}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                >
                  <FaChevronRight />
                </Button>
              </Flex>
              
              {/* Day Names */}
              <Grid templateColumns="repeat(7, 1fr)" bg="gray.100">
                {dayNames.map((day, index) => (
                  <GridItem
                    key={index}
                    p={2}
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="sm"
                    color="gray.600"
                  >
                    {day}
                  </GridItem>
                ))}
              </Grid>
              
              {/* Calendar Days */}
              <Grid templateColumns="repeat(7, 1fr)" gap={0}>
                {calendarGrid.map((day, index) => {
                  console.log('Events:', events); // Log all events
                  console.log('Rendering day:', day, 'for month:', currentMonth); // Log the current day being rendered
                  const dayIndex = day + firstDayOfWeek - 1; // Adjust index to account for the first day of the week
                  return (
                    <GridItem
                      key={index}
                      p={2}
                      height="90px"
                      bg={
                        isSelected(day)
                          ? selectedBgColor
                          : isToday(day)
                            ? todayBgColor
                            : dayBgColor
                      }
                      border="1px solid"
                      borderColor="gray.200"
                      onClick={() => day && handleDateSelect(day)}
                      cursor={day ? 'pointer' : 'default'}
                      position="relative"
                      _hover={day ? { bg: 'gray.100' } : {}}
                    >
                      {day && (
                        <>
                          <Text
                            fontWeight={isToday(day) || isSelected(day) ? 'bold' : 'normal'}
                            color={isSelected(day) ? 'red.600' : isToday(day) ? 'blue.600' : 'inherit'}
                          >
                            {day}
                          </Text>
                          {hasEvents(day) && (
                            <Box
                              position="absolute"
                              bottom="8px"
                              left="50%"
                              transform="translateX(-50%)"
                              width="6px"
                              height="6px"
                              borderRadius="full"
                              bg="#640101"
                            />
                          )}
                        </>
                      )}
                    </GridItem>
                  );
                })}
              </Grid>
            </Box>
          )}

          {viewMode === 'week' && (
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              color="gray.800"
            >
              {/* Week View Header */}
              <Flex
                bg={headerBgColor}
                color={headerTextColor}
                p={4}
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="ghost"
                  color="white"
                  size="sm"
                  onClick={() => {
                    const prevWeek = new Date(currentDate);
                    prevWeek.setDate(prevWeek.getDate() - 7);
                    setCurrentDate(prevWeek);
                  }}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                >
                  <FaChevronLeft />
                </Button>
                <Text fontSize="xl" fontWeight="bold">
                  {monthNames[currentMonth]} {currentYear}
                </Text>
                <Button
                  variant="ghost"
                  color="white"
                  size="sm"
                  onClick={() => {
                    const nextWeek = new Date(currentDate);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setCurrentDate(nextWeek);
                  }}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                >
                  <FaChevronRight />
                </Button>
              </Flex>
              
              {/* Week Days Header */}
              <Grid templateColumns="70px repeat(7, 1fr)" bg="gray.50">
                <GridItem p={2} textAlign="center" borderRight="1px solid" borderColor="gray.200" />
                {Array.from({ length: 7 }).map((_, i) => {
                  const day = new Date(currentDate);
                  day.setDate(day.getDate() - day.getDay() + i);
                  
                  return (
                    <GridItem 
                      key={i} 
                      p={2} 
                      textAlign="center" 
                      borderBottom="1px solid" 
                      borderColor="gray.200"
                      position="relative"
                    >
                      <VStack spacing={0}>
                        <Text fontSize="sm" color="gray.500">
                          {dayNames[i].substring(0, 3)}
                        </Text>
                        <Text 
                          fontSize="lg" 
                          fontWeight={day.toDateString() === new Date().toDateString() ? "bold" : "normal"}
                          color={day.toDateString() === new Date().toDateString() ? "white" : "gray.700"}
                          bg={day.toDateString() === new Date().toDateString() ? "#640101" : "transparent"}
                          borderRadius="full"
                          width="30px"
                          height="30px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {day.getDate()}
                        </Text>
                      </VStack>
                      
                      {/* Event indicators */}
                      {events.some(e => {
                        const eventYear = parseInt(e.date.split('-')[0]);
                        const eventMonth = parseInt(e.date.split('-')[1]) - 1;
                        const eventDay = parseInt(e.date.split('-')[2]);

                        return (
                          eventYear === day.getFullYear() &&
                          eventMonth === day.getMonth() &&
                          eventDay === day.getDate()
                        );
                      }) && (
                        <Box
                          position="absolute"
                          bottom="2px"
                          left="50%"
                          transform="translateX(-50%)"
                          width="4px"
                          height="4px"
                          borderRadius="full"
                          bg="#640101"
                        />
                      )}
                    </GridItem>
                  );
                })}
              </Grid>
              
              {/* Time slots and events */}
              <Grid templateColumns="70px repeat(7, 1fr)" bg="white">
                {Array.from({ length: 24 }).map((_, hour) => (
                  <React.Fragment key={hour}>
                    <GridItem 
                      p={2} 
                      textAlign="right" 
                      color="gray.500" 
                      fontSize="xs"
                      borderRight="1px solid"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      bg="gray.50"
                    >
                      {hour === 0 ? '12 AM' : 
                       hour < 12 ? `${hour} AM` : 
                       hour === 12 ? '12 PM' : 
                       `${hour - 12} PM`}
                    </GridItem>
                    
                    {Array.from({ length: 7 }).map((_, day) => {
                      const currentDay = new Date(currentDate);
                      currentDay.setDate(currentDay.getDate() - currentDay.getDay() + day);
                      
                      // Get events for this day and hour
                      const dayEvents = events.filter(e => {
                        const eventYear = parseInt(e.date.split('-')[0]);
                        const eventMonth = parseInt(e.date.split('-')[1]) - 1;
                        const eventDay = parseInt(e.date.split('-')[2]);

                        return (
                          eventYear === currentDay.getFullYear() &&
                          eventMonth === currentDay.getMonth() &&
                          eventDay === currentDay.getDate()
                        );
                      });
                      
                      return (
                        <GridItem 
                          key={day} 
                          p={1} 
                          borderBottom="1px solid" 
                          borderRight={day < 6 ? "1px solid" : "none"}
                          borderColor="gray.200"
                          height="50px"
                          position="relative"
                          _hover={{ bg: 'gray.50' }}
                        >
                          {dayEvents.map((event, idx) => (
                            <Box 
                              key={idx}
                              position="absolute"
                              left="2px"
                              right="2px"
                              top="2px"
                              p={1}
                              borderRadius="md"
                              bg={event.type === 'academic' ? '#640101' : 
                                 event.type === 'holiday' ? 'orange.500' : 
                                 event.type === 'exam' ? 'blue.500' : 'green.500'}
                              color="white"
                              fontSize="xs"
                              fontWeight="bold"
                              cursor="pointer"
                              _hover={{ opacity: 0.9 }}
                              display={hour === 0 ? 'block' : 'none'} // Only show at the top of the day
                              onClick={() => {
                                setSelectedDate(currentDay.getDate());
                                setSelectedEvents(dayEvents);
                              }}
                            >
                              {event.title}
                              <Button 
                                size="xs" 
                                variant="ghost" 
                                colorScheme="red" 
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <FaTrash />
                              </Button>
                            </Box>
                          ))}
                        </GridItem>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          )}

          {viewMode === 'day' && (
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              color="gray.800"
            >
              {/* Day View Header */}
              <Flex
                bg={headerBgColor}
                color={headerTextColor}
                p={4}
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="ghost"
                  color="white"
                  size="sm"
                  onClick={() => {
                    const prevDay = new Date(currentDate);
                    prevDay.setDate(prevDay.getDate() - 1);
                    setCurrentDate(prevDay);
                  }}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                >
                  <FaChevronLeft />
                </Button>
                <VStack spacing={0}>
                  <Text fontSize="xl" fontWeight="bold">
                    {currentDate.getDate()} {monthNames[currentMonth]} {currentYear}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    {dayNames[currentDate.getDay()]}
                  </Text>
                </VStack>
                <Button
                  variant="ghost"
                  color="white"
                  size="sm"
                  onClick={() => {
                    const nextDay = new Date(currentDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setCurrentDate(nextDay);
                  }}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                >
                  <FaChevronRight />
                </Button>
              </Flex>
              
              {/* Mini Month Calendar */}
              <Box p={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
                <Grid templateColumns="repeat(7, 1fr)" gap={1} fontSize="xs">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <Text key={i} textAlign="center" color="gray.500">{d}</Text>
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() + new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => {
                    const day = i - new Date(currentYear, currentMonth, 1).getDay() + 1;
                    const isCurrentDay = day === currentDate.getDate();
                    
                    return (
                      <Text 
                        key={i} 
                        textAlign="center"
                        color={day <= 0 ? 'transparent' : isCurrentDay ? 'white' : 'gray.600'}
                        fontWeight={isCurrentDay ? 'bold' : 'normal'}
                        bg={isCurrentDay ? '#640101' : 'transparent'}
                        borderRadius="full"
                        cursor={day > 0 ? 'pointer' : 'default'}
                        _hover={day > 0 ? { bg: isCurrentDay ? '#640101' : '#f8e5e5', color: isCurrentDay ? 'white' : '#640101' } : {}}
                        onClick={() => {
                          if (day > 0) {
                            const newDate = new Date(currentYear, currentMonth, day);
                            setCurrentDate(newDate);
                          }
                        }}
                      >
                        {day > 0 ? day : ''}
                      </Text>
                    );
                  })}
                </Grid>
              </Box>
              
              {/* All-day events */}
              <Box borderBottom="1px solid" borderColor="gray.200" p={2}>
                <Flex>
                  <Text width="70px" fontSize="xs" color="gray.500" fontWeight="medium">all-day</Text>
                  <Box flex="1">
                    {events.filter(e => {
                      const eventYear = parseInt(e.date.split('-')[0]);
                      const eventMonth = parseInt(e.date.split('-')[1]) - 1;
                      const eventDay = parseInt(e.date.split('-')[2]);

                      return (
                        eventYear === currentYear &&
                        eventMonth === currentMonth &&
                        eventDay === currentDate.getDate()
                      );
                    }).map((event, idx) => (
                      <Box 
                        key={idx}
                        p={1}
                        mb={1}
                        borderRadius="md"
                        bg={event.type === 'academic' ? '#640101' : 
                           event.type === 'holiday' ? 'orange.500' : 
                           event.type === 'exam' ? 'blue.500' : 'green.500'}
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ opacity: 0.9 }}
                        onClick={() => {
                          setSelectedDate(currentDate.getDate());
                          setSelectedEvents([event]);
                        }}
                      >
                        {event.title}
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          colorScheme="red" 
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <FaTrash />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Flex>
              </Box>
              
              {/* Time slots */}
              <Box height="600px" overflowY="auto">
                {Array.from({ length: 24 }).map((_, hour) => (
                  <Flex key={hour} borderBottom="1px solid" borderColor="gray.200">
                    <Text 
                      width="70px" 
                      p={2} 
                      textAlign="right" 
                      color="gray.500" 
                      fontSize="xs"
                      borderRight="1px solid"
                      borderColor="gray.200"
                      bg="gray.50"
                    >
                      {hour === 0 ? '12 AM' : 
                       hour < 12 ? `${hour} AM` : 
                       hour === 12 ? '12 PM' : 
                       `${hour - 12} PM`}
                    </Text>
                    <Box 
                      flex="1" 
                      height="50px" 
                      position="relative"
                      _hover={{ bg: 'gray.50' }}
                      cursor="pointer"
                      onClick={() => {
                        // Handle click on time slot (for future implementation)
                      }}
                    />
                  </Flex>
                ))}
              </Box>
            </Box>
          )}
          
          {/* Selected Date Events */}
          {selectedDate && (
            <Box
              mt={6}
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              bg={bgColor}
              boxShadow="md"
            >
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold">
                  {selectedDate instanceof Date && !isNaN(selectedDate) ? 
                    selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
                    'Invalid Date'}
                </Text>
                <Button
                  size="sm"
                  leftIcon={<FaPlus />}
                  colorScheme="blue"
                  onClick={() => {
                    setNewEvent({
                      ...newEvent,
                      date: selectedDate.toISOString().split('T')[0]
                    });
                    onOpen();
                  }}
                >
                  Add
                </Button>
              </Flex>
              
              {selectedEvents.length === 0 ? (
                <Text color="gray.500">No events scheduled for this date.</Text>
              ) : (
                <VStack spacing={3} align="stretch">
                  {selectedEvents.map(event => (
                    <Box
                      key={event.id}
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      boxShadow="sm"
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <HStack>
                          <Badge colorScheme={
                            event.type === 'academic' ? 'blue' :
                            event.type === 'holiday' ? 'green' : 'red'
                          }>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <Text fontWeight="bold">{event.title}</Text>
                        </HStack>
                        <HStack>
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <FaTrash />
                          </Button>
                        </HStack>
                      </Flex>
                      <Text mt={2} fontSize="sm" color="gray.600">
                        {event.description}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          )}
        </VStack>
      </Container>
      
      {/* Add Event Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">Add New Event</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Event Title</FormLabel>
                <Input
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Event Type</FormLabel>
                <Select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="academic">Academic</option>
                  <option value="holiday">Holiday</option>
                  <option value="exam">Exam</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Enter event description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button bg="#640101" color="white" onClick={handleAddEvent} _hover={{ bg: 'black' }}>
              Add Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AcademicCalendar;
