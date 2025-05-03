import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  VStack, 
  Text, 
  Icon, 
  Flex, 
  Heading,
  useColorModeValue 
} from '@chakra-ui/react';
import { 
  FaHome,
  FaBook, 
  FaTasks, 
  FaUserGraduate,
  FaCertificate,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaCalendar,
  FaEnvelope,
  FaMoneyBillWave,
  FaChalkboard,
  FaGlobeAmericas,
  FaUser,
  FaIdCard,
  FaFileAlt,
  FaComments
} from 'react-icons/fa';

const SidebarItem = ({ icon, label, path, isActive, onClick }) => {
  const isLogout = label === 'Logout';
  
  return (
    <Flex
      w="full"
      alignItems="center"
      px={5}
      py={3}
      cursor="pointer"
      bg={isActive ? '#640101' : (isLogout ? 'red.50' : 'transparent')}
      color={isActive ? 'white' : (isLogout ? 'red.600' : 'gray.700')}
      _hover={{ 
        bg: isActive ? '#8B0000' : (isLogout ? 'red.100' : 'rgba(100, 1, 1, 0.1)'), 
        color: isActive ? 'white' : (isLogout ? 'red.700' : '#640101') 
      }}
      borderRight={isActive ? '4px solid' : 'none'}
      borderColor={isActive ? 'white' : (isLogout ? 'red.500' : 'transparent')}
      onClick={onClick}
    >
      <Icon as={icon} mr={4} boxSize={5} />
      <Text fontWeight={isActive ? 'semibold' : 'normal'}>{label}</Text>
    </Flex>
  );
};

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { 
      icon: FaHome, 
      label: 'Dash Home', 
      path: '/student-home' 
    },
    { 
      icon: FaBook, 
      label: 'My Courses', 
      path: '/student-courses' 
    },
    { 
      icon: FaChalkboard, 
      label: 'Browse Courses', 
      path: '/browse-courses' 
    },
    { 
      icon: FaCalendar, 
      label: 'My Schedule', 
      path: '/student-schedule' 
    },
    { 
      icon: FaEnvelope, 
      label: 'My Dash Chat', 
      path: '/student-messages' 
    },
    { 
      icon: FaComments, 
      label: 'My Forum', 
      path: '/student-forum' 
    },
    { 
      icon: FaTasks, 
      label: 'My Assignments', 
      path: '/student-assignments' 
    },
    { 
      icon: FaFileAlt, 
      label: 'My Report Card', 
      path: '/student-report-card' 
    },
    { 
      icon: FaUser,  
      label: 'My Profile', 
      path: '/student-profile-new' 
    },
    { 
      icon: FaIdCard, 
      label: 'Request Hall Pass', 
      path: '/student-hall-pass' 
    },
    { 
      icon: FaSignOutAlt, 
      label: 'Logout', 
      path: '/' 
    }
  ];

  return (
    <Box 
      w="250px" 
      bg="white" 
      h="calc(100vh - 85px)"  
      borderRight="1px" 
      borderColor="#640101"
      position="fixed"
      left={0}
      top="85px"  
      pt={8}
      zIndex="999"
      overflowY="auto"  
    >
      <Heading 
        size="lg" 
        textAlign="center" 
        mb={8} 
        color="#640101"
        fontWeight="bold"
      >
        Student Dashboard
      </Heading>

      <VStack 
        spacing={0} 
        align="stretch"
        boxShadow="md"
      >
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={item.label === 'Logout' ? handleLogout : () => navigate(item.path)}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default StudentSidebar;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */