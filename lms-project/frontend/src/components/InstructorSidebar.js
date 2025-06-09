// External library imports
import React, { useState, useEffect } from 'react';
import { Global } from '@emotion/react';
import '@fontsource/montserrat-alternates/400.css';
import { useNavigate, useLocation } from 'react-router-dom';

// Chakra UI imports
import { 
  Box, 
  VStack, 
  Text, 
  Icon, 
  Flex, 
  Heading,
  useColorModeValue,
  IconButton,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react';

// React Icons imports
import { 
  FaChartLine, 
  FaPlusCircle, 
  FaBook, 
  FaUsers, 
  FaClipboardList, 
  FaFileUpload, 
  FaSignOutAlt,
  FaUserCircle,
  FaHome,
  FaComments,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaFileAlt,
  FaIdCard,
  FaStore
} from 'react-icons/fa';

const THEME_COLORS = {
  primary: '#640101',     // Deep Red
  secondary: '#4A0000',   // Darker Red
  accent: '#8B0000',      // Dark Red
  black: '#000000',
  white: '#FFFFFF'
};

const FontStyles = () => (
  <Global
    styles={`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
@font-face {
  font-family: 'Lora';
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Montserrat Alternates';
  font-weight: 400;
  font-style: normal;
}`}
  />
);

const SidebarItem = ({ icon, label, path, isActive, onClick, isCollapsed }) => {
  const isLogout = label === 'Logout';
  
  return (
    <Flex
      w="full"
      alignItems="center"
      px={isCollapsed ? 2 : 5}
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
      title={isCollapsed ? label : undefined}
      justifyContent={isCollapsed ? "center" : "flex-start"}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      transform="translateZ(0)"
      style={{
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      <Icon 
        as={icon} 
        boxSize={5} 
        transition="transform 0.3s ease"
        _groupHover={{ transform: 'scale(1.1)' }}
      />
      {!isCollapsed && (
        <Text 
          fontWeight={isActive ? 'semibold' : 'normal'} 
          ml={4}
          transition="opacity 0.3s ease"
          opacity={isCollapsed ? 0 : 1}
        >
          {label}
        </Text>
      )}
    </Flex>
  );
};

const InstructorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage on initial render
    const storedState = localStorage.getItem('instructorSidebarCollapsed');
    return storedState === 'true';
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive behavior
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  useEffect(() => {
    // Close mobile drawer when route changes
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const menuItems = [
    { 
      icon: FaHome, 
      label: 'Dash Home', 
      path: '/instructor-dashboard' 
    },
    { 
      icon: FaBook, 
      label: 'Courses', 
      path: '/instructor-courses' 
    },
    { 
      icon: FaEnvelope, 
      label: 'Dash Chat', 
      path: '/instructor/messages' 
    },
    { 
      icon: FaUsers, 
      label: 'Students', 
      path: '/instructor-students' 
    },
    { 
      icon: FaCalendarAlt, 
      label: 'My Time Table', 
      path: '/instructor-timetable' 
    },
    { 
      icon: FaFileAlt, 
      label: 'Report Card', 
      path: '/instructor-report-card' 
    },
    { 
      icon: FaIdCard, 
      label: 'Hall Pass', 
      path: '/instructor-hall-pass' 
    },
    { 
      icon: FaComments, 
      label: 'Forum', 
      path: '/instructor-forum' 
    },
    { 
      icon: FaUserCircle, 
      label: 'My Profile', 
      path: '/instructor-profile' 
    },
    { 
      icon: FaStore, 
      label: 'Marketplace', 
      path: '/instructor-marketplace' 
    }
  ];

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    // Store in localStorage for persistence
    localStorage.setItem('instructorSidebarCollapsed', String(newState));
    
    // Dispatch a custom event so other components can react to the sidebar state
    window.dispatchEvent(new CustomEvent('instructorSidebarToggle', { 
      detail: { isCollapsed: newState }
    }));
  };

  return (
    <>
      <Box
        w={isCollapsed ? "60px" : "250px"}
        bg="white"
        h="calc(100vh - 85px)"
        position="fixed"
        left={0}
        top="85px"
        borderRight="1px"
        borderColor="#640101"
        boxShadow="md"
        zIndex={10}
        overflowY="auto"
        pt={8}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        transform="translateZ(0)"
        willChange="width"
        style={{
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <FontStyles />
        {!isCollapsed && (
          <Heading 
            size="lg" 
            textAlign="center" 
            mb={8} 
            color="#640101"
            fontWeight="bold"
            transition="opacity 0.3s ease"
            opacity={isCollapsed ? 0 : 1}
          >
            Instructor Dashboard
          </Heading>
        )}
        <VStack 
          spacing={0} 
          align="stretch"
          boxShadow="md"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          transform="translateZ(0)"
        >
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              isCollapsed={isCollapsed}
            />
          ))}
          <SidebarItem
            icon={FaSignOutAlt}
            label="Logout"
            path="/"
            isActive={false}
            onClick={handleLogout}
            isCollapsed={isCollapsed}
          />
        </VStack>
      </Box>
      
      <IconButton
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        icon={isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        position="fixed"
        left={isCollapsed ? "60px" : "250px"}
        top="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        colorScheme="red"
        size="sm"
        borderRadius="full"
        boxShadow="md"
        bg="white"
        _hover={{ bg: "gray.100" }}
        onClick={toggleSidebar}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      />
    </>
  );
};

export default InstructorSidebar;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */