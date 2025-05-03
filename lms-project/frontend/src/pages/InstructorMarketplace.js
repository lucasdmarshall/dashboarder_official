  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
  SimpleGrid,
  Image
} from '@chakra-ui/react';

import {
  FaShoppingCart, 
  FaSearch, 
  FaTag,
  FaBook,
  FaMoneyBillWave,
  FaCircle,
  FaCheckCircle,
  FaBadgeCheck,
  FaChartLine
} from 'react-icons/fa';
import shieldIcon from '../icons/shield.gif';
import levelsIcon from '../icons/Animation - 1739700617609.webm';

import InstructorSidebar from '../components/InstructorSidebar';

// Mock marketplace items
const generateMarketplaceItems = () => {
  return [
    {
      id: 1,
      title: 'Red Mark',
      price: '$10/mo',
      privileges: [
        'Red Mark Verified Badge Display',
        'Increased Student Body',
        'Instructor Suggestion Priority'
      ],
      icon: FaCheckCircle,
      description: 'Exclusive instructor recognition and enhanced visibility'
    },
    {
      id: 2,
      title: 'Levels',
      price: '$20.00',
      privileges: [
        'Unlock Advanced Student Tracking',
        'Performance Tier Visualization',
        'Detailed Progress Metrics'
      ],
      icon: FaChartLine,
      description: 'Comprehensive student performance insights'
    }
  ];
};

const InstructorMarketplace = () => {
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentUserLevel, setCurrentUserLevel] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  // Color mode values
  const cardBg = '#FFFFFF';
  const cardBorder = '#640101';
  const primaryColor = '#640101';

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' }
  ];

  // Load marketplace items
  useEffect(() => {
    try {
      const mockItems = generateMarketplaceItems();
      setMarketplaceItems(mockItems);
    } catch (error) {
      toast({
        title: "Error Loading Marketplace",
        description: "Unable to fetch marketplace items. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  }, []);

  // Fetch current user level (mock implementation)
  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        // TODO: Replace with actual API call
        const mockLevel = 0;
        setCurrentUserLevel(mockLevel);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch user level",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    };

    fetchUserLevel();
  }, [toast]);

  // Add purchase handler function
  const handlePurchase = (item) => {
    if (item.title === 'Red Mark') {
      // Navigate to subscription details page
      navigate(`/instructor-marketplace-subscription?itemId=${item.id}`);
    } else if (item.title === 'Levels') {
      // Navigate directly to level purchase page without query params
      navigate('/instructor-level-purchase');
    }
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="90px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Heading 
            size="lg" 
            color="#640101" 
            display="flex" 
            alignItems="center"
          >
            <FaShoppingCart mr={3} color="#640101" />
            Marketplace
          </Heading>

          {/* Search and Filter */}
          <Flex>
            <InputGroup flex={3} mr={4}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="#640101" />
              </InputLeftElement>
              <Input 
                placeholder="Search marketplace items" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDisabled
                borderColor="#640101"
                _focus={{ borderColor: "#640101", boxShadow: `0 0 0 1px #640101` }}
              />
            </InputGroup>
            
            <Box flex={1}>
              <Input 
                as="select"
                icon={<FaTag />}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                isDisabled
                borderColor="#640101"
                _focus={{ borderColor: "#640101", boxShadow: `0 0 0 1px #640101` }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Input>
            </Box>
          </Flex>

          {/* No Items Message */}
          {marketplaceItems.length === 0 && (
            <VStack spacing={4} align="center" mt={10}>
              <Text 
                fontSize="xl" 
                color="#640101"
              >
                No marketplace items available
              </Text>
            </VStack>
          )}

          {marketplaceItems.length > 0 && (
            <SimpleGrid columns={[1, 2]} spacing={6} width="full" justifyContent="center">
              {marketplaceItems.map(item => (
                <Flex 
                  key={item.id}
                  bg="#FFFFFF"
                  borderWidth="2px"
                  borderColor="#640101"
                  boxShadow="lg"
                  overflow="hidden"
                  direction="column"
                  p={6}
                  borderRadius="xl"
                  position="relative"
                >
                  <Flex 
                    alignItems="center" 
                    justifyContent="space-between" 
                    mb={4}
                  >
                    <Heading 
                      size="md" 
                      color="#640101"
                    >
                      {item.title}
                    </Heading>
                    <Text 
                      fontWeight="bold" 
                      color="#640101"
                    >
                      {item.price}
                    </Text>
                  </Flex>

                  {item.title === 'Red Mark' ? (
                    <Flex 
                      width="100%" 
                      bg="#640101" 
                      alignItems="center" 
                      justifyContent="center" 
                      p={4}
                      mb={4}
                      borderRadius="md"
                    >
                      <Image 
                        src={shieldIcon} 
                        boxSize={48} 
                        objectFit="cover"
                        alt="Red Mark Shield"
                        p={1}
                        borderRadius="full"
                        border="2px solid white"
                        style={{ filter: 'grayscale(0.5) brightness(1.2)' }}
                      />
                    </Flex>
                  ) : (
                    <Flex 
                      width="100%" 
                      bg="#640101" 
                      alignItems="center" 
                      justifyContent="center" 
                      p={4}
                      mb={4}
                      borderRadius="md"
                    >
                      <video 
                        src={levelsIcon} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={{ 
                          width: '195px', 
                          height: '195px', 
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '3px solid white'
                        }} 
                      />
                    </Flex>
                  )}

                  <VStack 
                    align="stretch" 
                    spacing={3} 
                    flex={1} 
                    mb={4}
                  >
                    {item.privileges.map((privilege, index) => (
                      <Flex 
                        key={index} 
                        alignItems="center"
                      >
                        <FaCheckCircle color="#640101" mr={2} />
                        <Text>{privilege}</Text>
                      </Flex>
                    ))}
                  </VStack>

                  <Text 
                    fontSize="sm" 
                    mb={4} 
                    color="#640101"
                  >
                    {item.description}
                  </Text>

                  <Button
                    bg="#640101"
                    color="white"
                    _hover={{ bg: "#4A0000" }}
                    onClick={() => handlePurchase(item)}
                    width="full"
                    rightIcon={<FaShoppingCart color="white" />}
                  >
                    Purchase
                  </Button>
                </Flex>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorMarketplace;
