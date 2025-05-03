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
  Heading, 
  Text, 
  Button, 
  Flex, 
  Image,
  Grid,
  GridItem,
  Icon,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaChartLine, 
  FaUserGraduate,
  FaCertificate,
  FaRocket
} from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import landingHeroImage from '../assets/landing-hero.jpg';

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
            
            <Flex gap={4} mt={6}>
              <Button 
                onClick={handleOpen} 
                bg="#640101"
                color="white"
                size="lg"
                _hover={{ bg: "black" }}
                leftIcon={<FaRocket />}
              >
                Login
              </Button>
              
              <Button 
                as={Link} 
                to="/instructor-registration" 
                variant="outline"
                borderColor="#640101"
                color="#640101"
                size="lg"
              >
                Be an Instructor
              </Button>

              <Button 
                as={Link} 
                to="/student-registration" 
                variant="solid" 
                bg="#640101"
                color="white"
                size="lg"
                _hover={{ bg: "black" }}
              >
                Sign Up
              </Button>
            </Flex>
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
      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </Container>
  );
};

export default LandingPage;
