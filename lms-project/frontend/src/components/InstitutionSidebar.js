import React, { useState } from 'react';
import { Box, VStack, Text, Flex, Icon, Collapse } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaDatabase, 
  FaListAlt, 
  FaCalendarAlt, 
  FaComments, 
  FaChevronDown, 
  FaChevronRight,
  FaBook,
  FaChalkboard,
  FaBullhorn,
  FaGraduationCap,
  FaHome,
  FaClipboardCheck,
  FaUserCheck,
  FaFileAlt,
  FaTasks,
  FaClock,
  FaIdBadge
} from 'react-icons/fa';

const InstitutionSidebar = () => {
  const [isStudentDataOpen, setIsStudentDataOpen] = useState(false);
  const [isCourseManagementOpen, setIsCourseManagementOpen] = useState(false);
  const location = useLocation();

  return (
    <Box
      w="250px"
      p={5}
      bg="gray.100"
      borderRightWidth="1px"
      borderColor="gray.200"
      height="calc(100vh - 80px)"
      mt="80px"
      position="fixed"
      left={0}
      top={0}
      zIndex={10}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#d0d0d0',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#c0c0c0',
        },
      }}
    >
      <VStack align="start" spacing={4} width="100%">
        {/* Dashboard link */}
        <Flex 
          as={RouterLink} 
          to="/institution-dashboard"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          bg={location.pathname === '/institution-dashboard' ? 'rgba(100, 1, 1, 0.1)' : 'transparent'}
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
        >
          <Icon as={FaHome} color="#640101" mr={2} />
          <Text fontSize="lg" fontWeight="bold" color="#640101">Class Division</Text>
        </Flex>
        
        {/* Student Data Management Section - MOVED UP */}
        <Text fontSize="lg" fontWeight="bold" color="#640101">Student Data Management</Text>
        <Flex
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          cursor="pointer"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          onClick={() => setIsStudentDataOpen(!isStudentDataOpen)}
          transition="all 0.2s"
        >
          <FaDatabase color="#640101" />
          <Text ml={2} color="gray.700" flex="1">Student Data</Text>
          <Icon 
            as={isStudentDataOpen ? FaChevronDown : FaChevronRight} 
            color="#640101" 
            fontSize="sm" 
          />
        </Flex>

        <Collapse in={isStudentDataOpen} animateOpacity>
          <VStack align="start" spacing={2} pl={6} width="100%">
            <Flex 
              as={RouterLink} 
              to="/students-list"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaListAlt color="#640101" />
              <Text ml={2} color="gray.700">Students List</Text>
            </Flex>
            <Flex 
              as={RouterLink} 
              to="/academic-calendar"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaCalendarAlt color="#640101" />
              <Text ml={2} color="gray.700">Academic Calendar</Text>
            </Flex>
            <Flex 
              as={RouterLink} 
              to="/forum"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaComments color="#640101" />
              <Text ml={2} color="gray.700">Forum</Text>
            </Flex>
            <Flex 
              as={RouterLink} 
              to="/grades"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaGraduationCap color="#640101" />
              <Text ml={2} color="gray.700">Grades</Text>
            </Flex>
          </VStack>
        </Collapse>
        
        {/* Registration Section */}
        <Text fontSize="lg" fontWeight="bold" color="#640101">Registration</Text>
        <VStack align="start" spacing={2}>
          <Flex 
            as={RouterLink} 
            to="/students"
            alignItems="center"
            p={2}
            borderRadius="md"
            width="100%"
            _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
            transition="all 0.2s"
          >
            <FaUserGraduate color="#640101" />
            <Text ml={2} color="gray.700">Students</Text>
          </Flex>
          <Flex 
            as={RouterLink} 
            to="/instructors"
            alignItems="center"
            p={2}
            borderRadius="md"
            width="100%"
            _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
            transition="all 0.2s"
          >
            <FaChalkboardTeacher color="#640101" />
            <Text ml={2} color="gray.700">Instructors</Text>
          </Flex>
        </VStack>
        <Flex 
          as={RouterLink} 
          to="/manage-instructors"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
        >
          <FaChalkboardTeacher color="#640101" />
          <Text ml={2} color="gray.700">Manage Instructors</Text>
        </Flex>

        {/* Course Management Section */}
        <Text fontSize="lg" fontWeight="bold" color="#640101" mt={4}>Course Management</Text>
        <Flex
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          cursor="pointer"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          onClick={() => setIsCourseManagementOpen(!isCourseManagementOpen)}
          transition="all 0.2s"
        >
          <FaBook color="#640101" />
          <Text ml={2} color="gray.700" flex="1">Course Management</Text>
          <Icon 
            as={isCourseManagementOpen ? FaChevronDown : FaChevronRight} 
            color="#640101" 
            fontSize="sm" 
          />
        </Flex>

        <Collapse in={isCourseManagementOpen} animateOpacity>
          <VStack align="start" spacing={2} pl={6} width="100%">
            <Flex 
              as={RouterLink} 
              to="/create-course"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaBook color="#640101" />
              <Text ml={2} color="gray.700">Create Course</Text>
            </Flex>
            <Flex 
              as={RouterLink} 
              to="/create-class"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaChalkboard color="#640101" />
              <Text ml={2} color="gray.700">Create Class</Text>
            </Flex>
            <Flex 
              as={RouterLink} 
              to="/manage-classes"
              alignItems="center"
              p={2}
              borderRadius="md"
              width="100%"
              _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
              transition="all 0.2s"
            >
              <FaChalkboard color="#640101" />
              <Text ml={2} color="gray.700">Manage Classes</Text>
            </Flex>
          </VStack>
        </Collapse>

        {/* Noticeboard Section */}
        <Flex 
          as={RouterLink} 
          to="/noticeboard"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
          mt={4}
        >
          <FaBullhorn color="#640101" />
          <Text ml={2} color="gray.700">Noticeboard</Text>
        </Flex>
        
        {/* Attendance Section - standalone menu */}
        <Flex 
          as={RouterLink} 
          to="/attendance"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
          mt={4}
        >
          <FaUserCheck color="#640101" />
          <Text ml={2} color="gray.700">Attendance</Text>
        </Flex>
        
        {/* Report Card Section - new standalone menu */}
        <Flex 
          as={RouterLink} 
          to="/report-card"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
          mt={4}
        >
          <FaFileAlt color="#640101" />
          <Text ml={2} color="gray.700">Report Card</Text>
        </Flex>
        
        {/* Homework Submission Section - new menu */}
        <Flex 
          as={RouterLink} 
          to="/homework-submission"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
          mt={4}
        >
          <FaTasks color="#640101" />
          <Text ml={2} color="gray.700">Homework Submission</Text>
        </Flex>
        
        {/* Time Table Section */}
        <Flex 
          as={RouterLink} 
          to="/time-table"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
          mt={4}
        >
          <FaClock color="#640101" />
          <Text ml={2} color="gray.700">Time Table</Text>
        </Flex>
        
        {/* Digital Hall Pass Section */}
        <Flex 
          as={RouterLink} 
          to="/digital-hall-pass"
          alignItems="center"
          p={2}
          borderRadius="md"
          width="100%"
          _hover={{ bg: 'rgba(100, 1, 1, 0.1)' }}
          transition="all 0.2s"
          mt={4}
        >
          <FaIdBadge color="#640101" />
          <Text ml={2} color="gray.700">Digital Hall Pass</Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default InstitutionSidebar;
