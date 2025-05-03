import React, { useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton
} from '@chakra-ui/react';
import { 
  FaCheckCircle, 
  FaShieldAlt, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaChartLine 
} from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import InstructorSidebar from '../components/InstructorSidebar';

const MarketplaceItemDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemId = queryParams.get('itemId') || '1';  // Default to first item if not specified
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'brand.primary');
  const cardBorder = useColorModeValue('brand.primary', 'brand.primary');
  const primaryColor = useColorModeValue('brand.primary', 'brand.primary');

  // Marketplace items details
  const marketplaceItems = {
    1: {
      id: 1,
      title: 'Red Mark',
      price: '$10/mo',
      originalPrice: '$15/mo',
      savings: '33%',
      privileges: [
        'Red Mark Verified Badge Display',
        'Increased Student Body Visibility',
        'Instructor Suggestion Priority',
        'Enhanced Profile Highlighting',
        'Priority Customer Support'
      ],
      description: 'Elevate your instructor profile with exclusive recognition and enhanced visibility.',
      icon: FaShieldAlt,
      features: [
        { 
          title: 'Verified Badge', 
          description: 'Stand out with a premium verified instructor badge',
          icon: FaCheckCircle
        },
        { 
          title: 'Visibility Boost', 
          description: 'Get more exposure to potential students',
          icon: FaChartLine
        },
        { 
          title: 'Priority Support', 
          description: 'Dedicated customer support for premium instructors',
          icon: FaMoneyBillWave
        }
      ]
    },
    2: {
      id: 2,
      title: 'Levels',
      price: '$5.00/mo',
      originalPrice: '$8/mo',
      savings: '37%',
      privileges: [
        'Unlock Advanced Student Tracking',
        'Performance Tier Visualization',
        'Detailed Progress Metrics',
        'Comprehensive Student Insights',
        'Predictive Performance Analytics'
      ],
      description: 'Gain deep insights into student performance with advanced tracking and analytics.',
      icon: FaChartLine,
      features: [
        { 
          title: 'Performance Tracking', 
          description: 'Detailed insights into student progress',
          icon: FaChartLine
        },
        { 
          title: 'Advanced Analytics', 
          description: 'Predictive performance metrics',
          icon: FaShieldAlt
        },
        { 
          title: 'Comprehensive Reporting', 
          description: 'In-depth student performance reports',
          icon: FaMoneyBillWave
        }
      ]
    }
  };

  const item = marketplaceItems[itemId];

  const [isAnnualBilling, setIsAnnualBilling] = useState(false);

  const handleSubscribe = () => {
    // Open confirmation dialog
    onConfirmOpen();
  };

  const confirmSubscription = () => {
    // Navigate to payment options page
    navigate(`/instructor-payment-options?itemId=${item.id}&annual=${isAnnualBilling}`);
  };

  if (!item) {
    return (
      <Flex>
        <InstructorSidebar />
        <Container maxW="container.xl" ml="250px" mt="85px" pb={8} px={6}>
          <Text>Marketplace item not found</Text>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="85px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Heading 
            size="lg" 
            color={primaryColor} 
            display="flex" 
            alignItems="center"
          >
            <item.icon mr={3} color={primaryColor} />
            {item.title} Subscription
          </Heading>

          <SimpleGrid columns={[1, 2]} spacing={6}>
            {/* Subscription Details */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={cardBorder}
              boxShadow="md"
            >
              <CardHeader>
                <Heading size="md">Subscription Benefits</Heading>
              </CardHeader>
              <CardBody>
                <Text mb={4}>{item.description}</Text>
                <List spacing={3}>
                  {item.privileges.map((privilege, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FaCheckCircle} color={primaryColor} />
                      {privilege}
                    </ListItem>
                  ))}
                </List>
              </CardBody>
              <Divider />
              <CardFooter>
                <VStack align="stretch" width="full">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">Monthly Price</Text>
                    <Text fontSize="xl" fontWeight="bold" color={primaryColor}>
                      {item.price}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text>Original Price</Text>
                    <Text textDecoration="line-through" color="brand.primary0">
                      {item.originalPrice}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">Savings</Text>
                    <Text color="brand.primary0" fontWeight="bold">
                      {item.savings}
                    </Text>
                  </Flex>
                </VStack>
              </CardFooter>
            </Card>

            {/* Features Breakdown */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={cardBorder}
              boxShadow="md"
            >
              <CardHeader>
                <Heading size="md">Key Features</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={1} spacing={4}>
                  {item.features.map((feature, index) => (
                    <Flex key={index} align="center">
                      <feature.icon size="24" color={primaryColor} style={{ marginRight: '15px' }} />
                      <Box>
                        <Text fontWeight="bold">{feature.title}</Text>
                        <Text color="brand.primary0">{feature.description}</Text>
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </CardBody>
              <Divider />
              <CardFooter>
                <VStack width="full">
                  <Checkbox 
                    isChecked={isAnnualBilling}
                    onChange={(e) => setIsAnnualBilling(e.target.checked)}
                  >
                    Pay Annually (Additional 20% Discount)
                  </Checkbox>
                  <Button 
                    colorScheme="blue" 
                    width="full" 
                    onClick={handleSubscribe}
                  >
                    Subscribe Now
                  </Button>
                </VStack>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </VStack>

        {/* Payment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Complete Your Subscription</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Card Number</FormLabel>
                  <Input placeholder="1234 5678 9012 3456" leftElement={<FaCreditCard />} />
                </FormControl>
                <Flex width="full">
                  <FormControl mr={4}>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input placeholder="MM/YY" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CVV</FormLabel>
                    <Input placeholder="123" type="password" />
                  </FormControl>
                </Flex>
                <Text>
                  Total: {isAnnualBilling 
                    ? `$${(parseFloat(item.price.replace('$', '')) * 12 * 0.8).toFixed(2)}/year` 
                    : item.price}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={confirmSubscription}>
                Confirm Subscription
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Confirmation Dialog */}
        <AlertDialog
          isOpen={isConfirmOpen}
          onClose={onConfirmClose}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Subscription</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to subscribe to {item.title}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button variant="ghost" onClick={onConfirmClose}>Cancel</Button>
              <Button colorScheme="blue" onClick={confirmSubscription}>Confirm</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Container>
    </Flex>
  );
};

export default MarketplaceItemDetails;
