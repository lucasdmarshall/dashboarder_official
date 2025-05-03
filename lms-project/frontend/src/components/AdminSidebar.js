import React from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Icon, 
  Flex, 
  Heading,
  Divider
} from '@chakra-ui/react';
import { 
  FaHome, 
  FaChalkboardTeacher, 
  FaUserCog, 
  FaVideo, 
  FaClipboardList, 
  FaChartBar, 
  FaCog,
  FaComments, 
  FaUsers, 
  FaBook, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, isActive, onClick }) => {
  const isLogout = label === 'Logout';
  
  return (
    <Flex
      w="full"
      alignItems="center"
      px={4}
      py={3}
      cursor="pointer"
      bg="transparent"
      borderLeft="4px solid transparent"
      transition="all 0.3s ease"
      color={isActive ? "#640101" : (isLogout ? "#640101" : "#2D3748")}
      _hover={{ 
        bg: "rgba(100, 1, 1, 0.05)",
        borderLeftColor: "#640101",
        transform: "translateX(5px)",
        color: "#640101"
      }}
      borderRadius="md"
      onClick={onClick}
    >
      <Icon 
        as={icon} 
        mr={4} 
        boxSize={5}
        color={isActive ? "#640101" : (isLogout ? "#640101" : "#2D3748")}
        transition="transform 0.3s ease"
        _groupHover={{ transform: "scale(1.1)" }}
      />
      <Text 
        color={isActive ? "#640101" : (isLogout ? "#640101" : "#2D3748")}
        fontWeight={isActive ? 'semibold' : 'normal'}
        transition="color 0.3s ease"
        flex={1}
      >
        {label}
      </Text>
      {isActive && (
        <Box 
          width="8px"
          height="8px"
          bg="#640101"
          borderRadius="full"
          opacity={0.7}
        />
      )}
    </Flex>
  );
};

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear any stored authentication tokens
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    
    // Navigate to landing page
    navigate('/');
  };

  const menuItems = [
    {
      icon: FaChalkboardTeacher,
      label: 'View Tutors',
      path: '/admin-tutors-page'
    },
    {
      icon: FaClipboardList,
      label: 'Tutor Registrations',
      path: '/admin-tutor-registrations-page'
    },
    {
      icon: FaUserCog,
      label: 'Manage Tutors',
      path: '/admin-manage-tutors-page'
    },
    {
      icon: FaUsers,
      label: 'Students',
      path: '/admin-students-page'
    },
    {
      icon: FaBook,
      label: 'Courses',
      path: '/admin-courses'
    },
    {
      icon: FaCog,
      label: 'Settings',
      path: '/admin-settings-page'
    }
  ];

  return (
    <Box 
      w="260px"
      bg="#F7FAFC" 
      h="calc(100vh - 90px)"  
      borderRight="1px" 
      borderColor="#640101"
      position="fixed"
      left={0}
      top="90px"  
      pt={8}
      zIndex="999"
      overflowY="auto"  
      boxShadow="0 4px 12px rgba(100, 1, 1, 0.05)"
      borderRadius="0 12px 12px 0"
    >
      <Flex 
        direction="column"
        h="full"
      >
        <Flex 
          direction="column"
          alignItems="center"
          mb={8}
          px={4}
          pt={4}
        >
          <Heading 
            size="lg" 
            textAlign="center" 
            color="#640101"
            fontWeight="bold"
            letterSpacing="wider"
            textTransform="uppercase"
            mb={2}
          >
            Dashboarder
          </Heading>
          <Text
            fontSize="sm"
            color="#4A0000"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Admin Control
          </Text>
        </Flex>

        <Divider 
          borderColor="#640101" 
          opacity={0.3} 
          mb={4}
        />

        <VStack 
          spacing={1}
          align="stretch"
          flex={1}
          overflowY="auto"
          px={2}
        >
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </VStack>

        <Flex 
          direction="column" 
          mt="auto" 
          mb={4}
          px={2}
        >
          <Divider 
            borderColor="#640101" 
            opacity={0.3} 
            my={4}
          />
          <SidebarItem
            icon={FaSignOutAlt}
            label="Logout"
            path="/login"
            isActive={false}
            onClick={handleLogout}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminSidebar;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */