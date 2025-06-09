import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaCalendarAlt
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';
import { useSubscription } from '../contexts/subscriptionContext';

const InstructorCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { subscribeToRedMark } = useSubscription();
  
  // Get data from previous page
  const checkoutData = location.state || {};
  const { itemId, country, currency, price, annual, paymentMethod } = checkoutData;

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Color mode values
  const cardBg = useColorModeValue('white', 'brand.primary');
  const cardBorder = useColorModeValue('brand.primary', 'brand.primary');
  const primaryColor = useColorModeValue('#640101', '#640101');

  // Subscription details
  const subscriptionDetails = {
    1: {
      title: 'Red Mark',
      description: 'Verified instructor badge and enhanced visibility',
      features: [
        'Red Mark Verified Badge Display',
        'Increased Student Body Visibility',
        'Instructor Suggestion Priority',
        'Enhanced Profile Highlighting',
        'Priority Customer Support'
      ]
    }
  };

  const subscription = subscriptionDetails[itemId] || subscriptionDetails[1];

  // Redirect if no checkout data
  useEffect(() => {
    if (!itemId || !currency || !price || !paymentMethod) {
      toast({
        title: "Invalid Checkout Session",
        description: "Please start from the marketplace",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      navigate('/instructor-marketplace');
    }
  }, [itemId, currency, price, paymentMethod, navigate, toast]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Format card number input
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    if (!formData.cardNumber.replace(/\s/g, '') || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Valid card number is required';
    }
    
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Valid expiry date is required';
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }
    
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Activate Red Mark subscription
      const subscriptionResult = await subscribeToRedMark({
        annual: annual,
        paymentMethod: paymentMethod,
        currency: currency,
        price: price,
        country: country
      });

      if (subscriptionResult.success) {
        // Simulate successful payment
        toast({
          title: "Payment Successful!",
          description: "Your Red Mark subscription has been activated",
          status: "success",
          duration: 5000,
          isClosable: true
        });

        // Navigate to success page or dashboard
        navigate('/instructor-dashboard', {
          state: {
            subscriptionActivated: true,
            subscriptionType: subscription.title
          }
        });
      } else {
        throw new Error(subscriptionResult.error || 'Subscription activation failed');
      }

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/instructor-payment-options', {
      state: checkoutData
    });
  };

  if (!itemId) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color={primaryColor} />
      </Flex>
    );
  }

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="100px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Flex alignItems="center" mb={4}>
            <IconButton
              icon={<FaArrowLeft />}
              onClick={handleBack}
              mr={4}
              variant="ghost"
              colorScheme="red"
              aria-label="Go back"
            />
            <Heading size="lg" color={primaryColor}>
              <FaLock style={{ display: 'inline', marginRight: '12px' }} />
              Secure Checkout
            </Heading>
          </Flex>

          {/* Security Notice */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Secure Payment!</AlertTitle>
              <AlertDescription>
                Your payment information is encrypted and secure. We never store your card details.
              </AlertDescription>
            </Box>
          </Alert>

          <Flex direction={['column', 'column', 'row']} gap={8}>
            {/* Payment Form */}
            <Box flex={2}>
              <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                <CardHeader>
                  <Heading size="md">Payment Information</Heading>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      {/* Cardholder Name */}
                      <FormControl isRequired isInvalid={errors.cardholderName}>
                        <FormLabel>Cardholder Name</FormLabel>
                        <Input
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                          placeholder="John Doe"
                        />
                        {errors.cardholderName && (
                          <Text color="red.500" fontSize="sm">{errors.cardholderName}</Text>
                        )}
                      </FormControl>

                      {/* Card Number */}
                      <FormControl isRequired isInvalid={errors.cardNumber}>
                        <FormLabel>Card Number</FormLabel>
                        <Input
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          leftElement={<FaCreditCard color={primaryColor} />}
                        />
                        {errors.cardNumber && (
                          <Text color="red.500" fontSize="sm">{errors.cardNumber}</Text>
                        )}
                      </FormControl>

                      {/* Expiry and CVV */}
                      <HStack width="full">
                        <FormControl isRequired isInvalid={errors.expiryDate}>
                          <FormLabel>Expiry Date</FormLabel>
                          <Input
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <Text color="red.500" fontSize="sm">{errors.expiryDate}</Text>
                          )}
                        </FormControl>
                        <FormControl isRequired isInvalid={errors.cvv}>
                          <FormLabel>CVV</FormLabel>
                          <Input
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength={4}
                            type="password"
                          />
                          {errors.cvv && (
                            <Text color="red.500" fontSize="sm">{errors.cvv}</Text>
                          )}
                        </FormControl>
                      </HStack>

                      <Divider />

                      {/* Billing Address */}
                      <FormControl isRequired isInvalid={errors.billingAddress}>
                        <FormLabel>Billing Address</FormLabel>
                        <Input
                          value={formData.billingAddress}
                          onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                          placeholder="123 Main Street"
                        />
                        {errors.billingAddress && (
                          <Text color="red.500" fontSize="sm">{errors.billingAddress}</Text>
                        )}
                      </FormControl>

                      <HStack width="full">
                        <FormControl isRequired isInvalid={errors.city}>
                          <FormLabel>City</FormLabel>
                          <Input
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="New York"
                          />
                          {errors.city && (
                            <Text color="red.500" fontSize="sm">{errors.city}</Text>
                          )}
                        </FormControl>
                        <FormControl isRequired isInvalid={errors.postalCode}>
                          <FormLabel>Postal Code</FormLabel>
                          <Input
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            placeholder="10001"
                          />
                          {errors.postalCode && (
                            <Text color="red.500" fontSize="sm">{errors.postalCode}</Text>
                          )}
                        </FormControl>
                      </HStack>
                    </VStack>
                  </form>
                </CardBody>
              </Card>
            </Box>

            {/* Order Summary */}
            <Box flex={1}>
              <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                <CardHeader>
                  <Heading size="md">Order Summary</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Subscription Details */}
                    <Box>
                      <Text fontWeight="bold" mb={2}>{subscription.title} Subscription</Text>
                      <Text fontSize="sm" color="gray.600" mb={3}>
                        {subscription.description}
                      </Text>
                      
                      {/* Features */}
                      <VStack spacing={1} align="stretch">
                        {subscription.features.slice(0, 3).map((feature, index) => (
                          <Flex key={index} alignItems="center" fontSize="sm">
                            <FaCheckCircle color={primaryColor} style={{ marginRight: '8px' }} />
                            <Text>{feature}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Payment Details */}
                    <VStack spacing={2} align="stretch">
                      <Flex justifyContent="space-between">
                        <Text>Billing Type:</Text>
                        <Badge colorScheme={annual ? "green" : "blue"}>
                          {annual ? "Annual (20% Discount)" : "Monthly"}
                        </Badge>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text>Payment Method:</Text>
                        <Text fontWeight="semibold">{paymentMethod}</Text>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text>Country:</Text>
                        <Text>{country}</Text>
                      </Flex>
                    </VStack>

                    <Divider />

                    {/* Total */}
                    <Flex justifyContent="space-between" fontSize="lg" fontWeight="bold">
                      <Text>Total:</Text>
                      <Text color={primaryColor}>{currency} {price}</Text>
                    </Flex>

                    {/* Next Billing */}
                    <Flex alignItems="center" fontSize="sm" color="gray.600">
                      <FaCalendarAlt style={{ marginRight: '8px' }} />
                      <Text>
                        Next billing: {annual ? '1 year' : '1 month'} from today
                      </Text>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>

              {/* Complete Purchase Button */}
              <Button
                colorScheme="red"
                size="lg"
                width="full"
                mt={6}
                onClick={handleSubmit}
                isLoading={isProcessing}
                loadingText="Processing Payment..."
                leftIcon={<FaShieldAlt />}
                disabled={isProcessing}
              >
                Complete Purchase
              </Button>

              {/* Security Message */}
              <Text fontSize="xs" color="gray.500" textAlign="center" mt={3}>
                <FaLock style={{ display: 'inline', marginRight: '4px' }} />
                Secured by 256-bit SSL encryption
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorCheckout; 