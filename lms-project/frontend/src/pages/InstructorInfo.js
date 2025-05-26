import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button, 
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaDollarSign, 
  FaClock,
  FaGraduationCap,
  FaArrowLeft,
  FaUserPlus,
  FaCheckCircle
} from 'react-icons/fa';

const InstructorInfo = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const benefits = [
    {
      icon: FaDollarSign,
      title: "Earn Money",
      description: "Set your own rates and earn from your expertise.",
      color: "#640101"
    },
    {
      icon: FaUsers,
      title: "Reach Students",
      description: "Connect with students worldwide and share your knowledge.",
      color: "#640101"
    },
    {
      icon: FaClock,
      title: "Flexible Schedule",
      description: "Teach at your own pace and on your own schedule.",
      color: "#640101"
    },
    {
      icon: FaGraduationCap,
      title: "Professional Growth",
      description: "Develop your teaching skills and build your reputation.",
      color: "#640101"
    }
  ];

  const requirements = [
    "Bachelor's degree or equivalent experience in your field",
    "Passion for teaching and helping students learn",
    "Reliable internet connection and basic tech skills",
    "Commitment to creating quality educational content"
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <HStack spacing={4} mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/')}
            color="#640101"
            size="lg"
          >
            Back to Home
          </Button>
        </HStack>

        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Icon as={FaChalkboardTeacher} w={20} h={20} color="#640101" />
          <Heading as="h1" size="2xl" color="#640101">
            Become an Instructor
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="3xl">
            Join our community of educators and share your expertise with students around the world. 
            Start teaching today and make a difference while earning from your knowledge.
          </Text>
          <Button
            bg="#640101"
            color="white"
            size="lg"
            leftIcon={<FaUserPlus />}
            onClick={() => navigate('/instructor-signup')}
            _hover={{ bg: "black" }}
          >
            Apply to Teach
          </Button>
        </VStack>

        {/* Benefits Section */}
        <Box mb={16}>
          <Heading as="h2" size="xl" textAlign="center" mb={8} color="#640101">
            Why Teach With Us?
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {benefits.map((benefit, index) => (
              <Card key={index} bg={cardBg} boxShadow="md" _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }} transition="all 0.3s">
                <CardBody textAlign="center" p={6}>
                  <Icon as={benefit.icon} w={12} h={12} color={benefit.color} mb={4} />
                  <Heading size="md" mb={3} color="#640101">
                    {benefit.title}
                  </Heading>
                  <Text color="gray.600">
                    {benefit.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Requirements Section */}
        <Box mb={16}>
          <Heading as="h2" size="xl" textAlign="center" mb={8} color="#640101">
            Instructor Requirements
          </Heading>
          <Card bg={cardBg} maxW="4xl" mx="auto" boxShadow="md">
            <CardBody p={8}>
              <VStack spacing={4} align="stretch">
                {requirements.map((requirement, index) => (
                  <HStack key={index} spacing={4}>
                    <Icon as={FaCheckCircle} color="green.500" />
                    <Text fontSize="lg">{requirement}</Text>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Box>

        {/* Call to Action */}
        <Box textAlign="center" bg={cardBg} p={12} borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="xl" mb={4} color="#640101">
            Ready to Start Teaching?
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8} maxW="2xl" mx="auto">
            Join thousands of instructors who are already making an impact and earning from their expertise. 
            The application process is simple and we'll support you every step of the way.
          </Text>
          <HStack spacing={4} justify="center">
            <Button
              bg="#640101"
              color="white"
              size="lg"
              leftIcon={<FaUserPlus />}
              onClick={() => navigate('/instructor-signup')}
              _hover={{ bg: "black" }}
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              borderColor="#640101"
              color="#640101"
              size="lg"
              onClick={() => navigate('/contact')}
              _hover={{ bg: "rgba(100, 1, 1, 0.05)" }}
            >
              Contact Us
            </Button>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default InstructorInfo; 