import React from 'react';
import { 
  Box, 
  Flex, 
  Image, 
  Text, 
  Spacer, 
} from '@chakra-ui/react';
import { FaRss } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

// Import the logo
import Logo from '../Untitled design.png';

// Theme colors
const THEME_COLORS = {
  primary: '#640101',
  black: '#000000',
  white: '#FFFFFF'
};

const Header = () => {
  return (
    <Box 
      as="header"
      width="100%"
      height="80px"
      bg={THEME_COLORS.white}
      color={THEME_COLORS.black}
      boxShadow="md"
      position="fixed"
      top="0"
      zIndex="1000"
      py={4}
      px={6}
    >
      <Flex 
        align="center" 
        justify="space-between" 
        maxWidth="container.xl" 
        mx="auto"
        height="100%"
      >
        {/* Logo and Name */}
        <Flex align="center" as="a" href="/" position="relative" left="-17px">
          <Image 
            src={Logo} 
            alt="Dashboarder Logo" 
            boxSize="45px" 
            mr={4}
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={THEME_COLORS.primary}
            fontFamily="'Montserrat Alternates', sans-serif"
            ml={-5}
            mt={1}
          >
            Dashboarder
          </Text>
        </Flex>

        <Spacer />
        <Flex>
          <RouterLink to="/boardwalk">
            <Flex align="center" mx={2}>
              <FaRss />
              <Text ml={1} fontWeight="bold" color={THEME_COLORS.primary}>Boardwalk</Text>
            </Flex>
          </RouterLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */