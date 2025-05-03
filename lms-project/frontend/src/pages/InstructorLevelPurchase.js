import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Button, 
  useColorModeValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useToast,
  Icon,
  Tooltip,
  Divider,
  HStack,
  Tag,
  TagLabel,
  TagRightIcon
} from '@chakra-ui/react';
import { 
  FaChartLine, 
  FaUnlock, 
  FaTrophy, 
  FaInfoCircle, 
  FaCheckCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InstructorSidebar from '../components/InstructorSidebar';

// Detailed level benefits
const levelBenefits = {
  0: {
    description: "Basic Instructor Level",
    features: [
      "Create and manage basic courses",
      "Limited student tracking",
      "Standard platform access"
    ],
    color: "#640101"  // Deep Red
  },
  1: {
    description: "Advanced Instructor Level",
    features: [
      "Enhanced student performance tracking",
      "Detailed analytics dashboard",
      "Priority support",
      "Advanced course creation tools"
    ],
    color: "#640101"  // Deep Red
  },
  2: {
    description: "Professional Instructor Level",
    features: [
      "Comprehensive student insights",
      "Advanced marketing tools",
      "Customizable course branding",
      "Dedicated account manager"
    ],
    color: "#640101"  // Deep Red
  },
  3: {
    description: "Expert Instructor Level",
    features: [
      "AI-powered student performance predictions",
      "Advanced revenue sharing",
      "Premium course certification",
      "Global instructor recognition"
    ],
    color: "#640101"  // Deep Red
  },
  4: {
    description: "Master Instructor Level",
    features: [
      "Elite platform features",
      "Exclusive instructor community",
      "Advanced monetization options",
      "Personalized growth strategies"
    ],
    color: "#640101"  // Deep Red
  },
  5: {
    description: "Pinnacle Instructor Level",
    features: [
      "Ultimate platform access",
      "Top-tier instructor status",
      "Comprehensive platform partnership",
      "Maximum revenue potential"
    ],
    color: "#640101"  // Deep Red
  }
};

const InstructorLevelPurchase = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Color mode values
  const cardBg = '#FFFFFF';
  const cardBorder = '#640101';
  const primaryColor = '#640101';

  // Level pricing details
  const levelPrices = [
    { from: 0, to: 1, price: 20 },
    { from: 1, to: 2, price: 40 },
    { from: 2, to: 3, price: 60 },
    { from: 3, to: 4, price: 80 },
    { from: 4, to: 5, price: 100 }
  ];

  const [currentLevel, setCurrentLevel] = useState(0);
  const [availableLevels, setAvailableLevels] = useState([]);

  useEffect(() => {
    // TODO: Fetch current user level from backend
    const fetchCurrentLevel = async () => {
      try {
        // Replace with actual API call
        const level = 0; // Mock current level
        setCurrentLevel(level);

        // Show all level options
        setAvailableLevels(levelPrices);
      } catch (error) {
        console.error('Error fetching current level:', error);
      }
    };

    fetchCurrentLevel();
  }, []);

  const isLevelUpgradeable = (levelOption) => {
    // Only allow immediate next level upgrade
    return levelOption.from === currentLevel;
  };

  const handleLevelPurchase = (levelOption) => {
    // Navigate to payment options with level upgrade details
    navigate(`/instructor-payment-options?itemId=2&annual=false&fromLevel=${levelOption.from}&toLevel=${levelOption.to}&price=${levelOption.price}`);
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="100px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading 
              size="lg" 
              color="#640101"
            >
              Instructor Level Upgrade
            </Heading>
            <HStack>
              <Text fontWeight="bold">Current Level:</Text>
              <Tag 
                size="lg" 
                colorScheme="red"
                bg="#640101"
                color="white"
                variant="solid"
              >
                <TagLabel>Level {currentLevel}</TagLabel>
                <TagRightIcon as={FaTrophy} />
              </Tag>
            </HStack>
          </Flex>

          <Box 
            bg="#640101" 
            p={6} 
            borderRadius="lg"
          >
            <Flex alignItems="center">
              <Icon as={FaInfoCircle} mr={3} color="white" boxSize={6} />
              <Text color="white">
                Upgrade your instructor level to unlock advanced features, 
                enhanced analytics, and increased platform capabilities.
              </Text>
            </Flex>
          </Box>

          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {levelPrices.map((levelOption) => (
              <Card 
                key={levelOption.to}
                bg={cardBg} 
                borderWidth="2px" 
                borderColor="#640101"
                boxShadow="md"
                opacity={levelOption.from < currentLevel ? 0.6 : 1}
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-10px)',
                  boxShadow: 'xl'
                }}
              >
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">
                      Level {levelOption.from} to Level {levelOption.to}
                    </Heading>
                    <Icon 
                      as={FaUnlock} 
                      color="#640101" 
                      boxSize={6} 
                    />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      color="#640101"
                    >
                      ${levelOption.price}
                    </Text>
                    <Text fontStyle="italic">
                      {levelBenefits[levelOption.to].description}
                    </Text>
                    <Divider />
                    <VStack align="start" spacing={2}>
                      {levelBenefits[levelOption.to].features.map((feature, index) => (
                        <Flex key={index} alignItems="center">
                          <Icon 
                            as={FaCheckCircle} 
                            mr={2} 
                            color="#640101" 
                          />
                          <Text fontSize="sm">{feature}</Text>
                        </Flex>
                      ))}
                    </VStack>
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button 
                    bg="#640101"
                    color="white"
                    _hover={{ bg: "#4A0000" }}
                    width="full"
                    rightIcon={<FaChartLine />}
                    onClick={() => handleLevelPurchase(levelOption)}
                    isDisabled={!isLevelUpgradeable(levelOption)}
                  >
                    {isLevelUpgradeable(levelOption) 
                      ? `Upgrade to Level ${levelOption.to} - $${levelOption.price}` 
                      : 'Not Available'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorLevelPurchase;
