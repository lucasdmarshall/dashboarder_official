/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button, 
  Flex, 
  Image,
  Grid,
  GridItem,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaChartLine, 
  FaUserGraduate,
  FaCertificate,
  FaRocket,
  FaChevronDown,
  FaUserTie,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import landingHeroImage from '../assets/landing-hero.jpg';

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleLoginOpen = () => setIsLoginOpen(true);
  const handleLoginClose = () => setIsLoginOpen(false);

  const handleInstructorClick = () => {
    // Navigate to instructor registration or information page
    navigate('/instructor-signup');
  };

  const handleSignUpClick = () => {
    // Navigate to sign up page or open sign up modal
    navigate('/signup');
  };

  const handleImageClick = () => {
    const currentTime = Date.now();
    
    // If clicks are within 500ms, increment count
    if (currentTime - lastClickTime < 500) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);
      
      // If clicked 7 times quickly, navigate to love message
      if (newClickCount >= 7) {
        console.log('Easter egg triggered!');
        navigate('/love-message');
        setClickCount(0);
        setLastClickTime(0);
      }
    } else {
      // Reset click count if too much time has passed
      setClickCount(1);
    }
    
    // Always update last click time
    setLastClickTime(currentTime);
  };

  const features = [
    {
      icon: FaChalkboardTeacher,
      title: "Interactive Learning",
      description: "Engage with dynamic, multimedia-rich course content.",
      color: "#640101"
    },
    {
      icon: FaBook,
      title: "Comprehensive Courses",
      description: "Access a wide range of courses across multiple disciplines.",
      color: "#640101"
    },
    {
      icon: FaChartLine,
      title: "Performance Tracking",
      description: "Monitor your progress with detailed analytics and insights.",
      color: "#640101"
    },
    {
      icon: FaUserGraduate,
      title: "Personalized Learning",
      description: "Tailored recommendations based on your learning style.",
      color: "#640101"
    }
  ];

  return (
    <Container 
      maxW="container.xl" 
      py={16} 
      mt="20px" 
      bg={useColorModeValue('white', 'black')}
    >
      {/* Hero Section */}
      <Grid 
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={10}
        alignItems="center"
      >
        <GridItem>
          <VStack 
            spacing={6} 
            align="start" 
            w="full"
          >
            <Heading 
              as="h1" 
              size="3xl" 
              color="#640101"
              lineHeight={1.2}
              fontWeight="bold"
            >
              Dashboarder: 
              <Text as="span" display="block" color="black" fontWeight="semibold">
                Learn. Grow. Succeed.
              </Text>
            </Heading>
            
            <Text 
              fontSize="xl" 
              color="black"
              lineHeight={1.6}
              fontWeight="medium"
            >
              Transform your learning journey with our cutting-edge Learning Management System. 
              Designed for students, instructors, and lifelong learners.
            </Text>
            
            <HStack spacing={4} mt={8} width="full" wrap="wrap">
              {/* Get Started Dropdown Button */}
              <Menu>
                <MenuButton
                  as={Button}
                  bg="#640101"
                  color="white"
                  size="lg"
                  width={"200px"}
                  height={"60px"}
                  fontSize={"xl"}
                  fontWeight={"bold"}
                  boxShadow={"lg"}
                  _hover={{ 
                    bg: "black", 
                    transform: "translateY(-2px)", 
                    boxShadow: "xl" 
                  }}
                  _active={{ bg: "black" }}
                  leftIcon={<FaRocket size={24} />}
                  rightIcon={<FaChevronDown />}
                  transition="all 0.3s ease"
                >
                  Get Started
                </MenuButton>
                <MenuList bg="white" borderColor="#640101" borderWidth="2px">
                  <MenuItem 
                    icon={<FaSignInAlt />} 
                    onClick={handleLoginOpen}
                    _hover={{ bg: "rgba(100, 1, 1, 0.05)" }}
                    fontSize="lg"
                    fontWeight="medium"
                  >
                    Login
                  </MenuItem>
                  <MenuItem 
                    icon={<FaUserPlus />} 
                    onClick={handleSignUpClick}
                    _hover={{ bg: "rgba(100, 1, 1, 0.05)" }}
                    fontSize="lg"
                    fontWeight="medium"
                  >
                    Sign Up
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* Be an Instructor Button */}
              <Button 
                onClick={handleInstructorClick}
                bg="white"
                color="#640101"
                border="2px solid #640101"
                size="lg"
                width={"200px"}
                height={"60px"}
                fontSize={"xl"}
                fontWeight={"bold"}
                boxShadow={"lg"}
                _hover={{ 
                  bg: "#640101", 
                  color: "white",
                  transform: "translateY(-2px)", 
                  boxShadow: "xl" 
                }}
                leftIcon={<FaUserTie size={24} />}
                transition="all 0.3s ease"
              >
                Be an Instructor
              </Button>
            </HStack>
          </VStack>
        </GridItem>
        
        <GridItem display={{ base: "none", md: "block" }}>
          <Image 
            src={landingHeroImage} 
            alt="Children Clapping Together" 
            borderRadius="lg"
            boxShadow="2xl"
            objectFit="cover"
            width="full"
            height="500px"
            transition="transform 0.3s ease-in-out"
            _hover={{
              transform: 'scale(1.02)'
            }}
            onClick={handleImageClick}
          />
        </GridItem>
      </Grid>

      {/* Features Section */}
      <SimpleGrid 
        columns={{ base: 1, md: 4 }} 
        spacing={10} 
        mt={20}
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="md"
      >
        {features.map((feature, index) => (
          <Box 
            key={index} 
            textAlign="center" 
            p={5} 
            borderRadius="lg"
            transition="all 0.3s"
            _hover={{ 
              transform: "scale(1.05)", 
              boxShadow: "md",
              bg: "rgba(100, 1, 1, 0.05)"
            }}
          >
            <Icon 
              as={feature.icon} 
              w={12} 
              h={12} 
              color={feature.color} 
              mb={4}
            />
            <Heading 
              size="md" 
              mb={3} 
              color="black"
            >
              {feature.title}
            </Heading>
            <Text 
              color="gray.700"
              fontWeight="medium"
            >
              {feature.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={handleLoginClose} />
    </Container>
  );
};

export default LandingPage;
