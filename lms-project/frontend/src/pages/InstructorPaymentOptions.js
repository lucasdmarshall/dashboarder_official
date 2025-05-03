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
  Select,
  FormControl,
  FormLabel,
  Input,
  Divider,
  HStack,
  Icon,
  useToast
} from '@chakra-ui/react';
import { 
  FaGlobeAmericas, 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaPaypal,
  FaChevronDown
} from 'react-icons/fa';
import { 
  CreditCardIcon,
  PayPalIcon,
  ApplePayIcon,
  SEPAIcon,
  GooglePayIcon,
  BankTransferIcon,
  UPIIcon,
  NetBankingIcon,
  InteracIcon,
  BPAYIcon,
  AlipayIcon,
  WeChatPayIcon,
  BoletoIcon,
  PayNowIcon,
  PayTMIcon,
  LinePayIcon,
  UnionPayIcon,
  PIXIcon,
  SofortIcon,
  PayPayIcon,
  CashAppIcon
} from '../icons/PaymentIcons';
import { useLocation, useNavigate } from 'react-router-dom';
import InstructorSidebar from '../components/InstructorSidebar';

// Mock list of countries and their currencies
const countryCurrencies = [
  { country: 'United States', currency: 'USD', flag: '🇺🇸' },
  { country: 'European Union', currency: 'EUR', flag: '🇪🇺' },
  { country: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { country: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { country: 'India', currency: 'INR', flag: '🇮🇳' },
  { country: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { country: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { country: 'China', currency: 'CNY', flag: '🇨🇳' },
  { country: 'Brazil', currency: 'BRL', flag: '🇧🇷' },
  { country: 'Singapore', currency: 'SGD', flag: '🇸🇬' }
];

// Currency conversion rates (mock data)
const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  INR: 83.20,
  CAD: 1.35,
  AUD: 1.52,
  CNY: 7.16,
  BRL: 4.95,
  SGD: 1.34
};

// Payment methods by country
const paymentMethodsByCountry = {
  'United States': [
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'American Express', 'Discover'] 
    },
    { 
      name: 'PayPal', 
      icon: PayPalIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Apple Pay', 
      icon: ApplePayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Google Pay', 
      icon: GooglePayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Bank Transfer', 
      icon: BankTransferIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Cash App', 
      icon: CashAppIcon, 
      supportedCards: [] 
    }
  ],
  'European Union': [
    { 
      name: 'SEPA Transfer', 
      icon: SEPAIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'Maestro', 'Electron'] 
    },
    { 
      name: 'Google Pay', 
      icon: GooglePayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Apple Pay', 
      icon: ApplePayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Sofort', 
      icon: SofortIcon, 
      supportedCards: [] 
    }
  ],
  'United Kingdom': [
    { 
      name: 'Bank Transfer', 
      icon: BankTransferIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'Maestro', 'American Express'] 
    },
    { 
      name: 'PayPal', 
      icon: PayPalIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Apple Pay', 
      icon: ApplePayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Google Pay', 
      icon: GooglePayIcon, 
      supportedCards: [] 
    }
  ],
  'Japan': [
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['JCB', 'Visa', 'Mastercard', 'American Express'] 
    },
    { 
      name: 'Bank Transfer', 
      icon: BankTransferIcon, 
      supportedCards: [] 
    },
    { 
      name: 'PayPay', 
      icon: PayPayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'LINE Pay', 
      icon: LinePayIcon, 
      supportedCards: [] 
    }
  ],
  'India': [
    { 
      name: 'UPI', 
      icon: UPIIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'RuPay', 'American Express'] 
    },
    { 
      name: 'Net Banking', 
      icon: NetBankingIcon, 
      supportedCards: [] 
    },
    { 
      name: 'PayTM', 
      icon: PayTMIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Google Pay', 
      icon: GooglePayIcon, 
      supportedCards: [] 
    }
  ],
  'Canada': [
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'American Express'] 
    },
    { 
      name: 'Interac', 
      icon: InteracIcon, 
      supportedCards: [] 
    },
    { 
      name: 'PayPal', 
      icon: PayPalIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Apple Pay', 
      icon: ApplePayIcon, 
      supportedCards: [] 
    }
  ],
  'Australia': [
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'American Express'] 
    },
    { 
      name: 'BPAY', 
      icon: BPAYIcon, 
      supportedCards: [] 
    },
    { 
      name: 'PayPal', 
      icon: PayPalIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Google Pay', 
      icon: GooglePayIcon, 
      supportedCards: [] 
    }
  ],
  'China': [
    { 
      name: 'Alipay', 
      icon: AlipayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'WeChat Pay', 
      icon: WeChatPayIcon, 
      supportedCards: [] 
    },
    { 
      name: 'UnionPay', 
      icon: UnionPayIcon, 
      supportedCards: [] 
    }
  ],
  'Brazil': [
    { 
      name: 'Boleto', 
      icon: BoletoIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'Elo'] 
    },
    { 
      name: 'PIX', 
      icon: PIXIcon, 
      supportedCards: [] 
    }
  ],
  'Singapore': [
    { 
      name: 'PayNow', 
      icon: PayNowIcon, 
      supportedCards: [] 
    },
    { 
      name: 'Credit Card', 
      icon: CreditCardIcon, 
      supportedCards: ['Visa', 'Mastercard', 'American Express'] 
    },
    { 
      name: 'PayPal', 
      icon: PayPalIcon, 
      supportedCards: [] 
    }
  ]
};

const InstructorPaymentOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryParams = new URLSearchParams(location.search);
  
  // Retrieve subscription details from previous page
  const itemId = queryParams.get('itemId') || '1';
  const isAnnualBilling = queryParams.get('annual') === 'true';

  // Marketplace items details (same as previous page)
  const marketplaceItems = {
    1: {
      id: 1,
      title: 'Red Mark',
      priceUSD: 10,
      annualDiscount: 0.2
    },
    2: {
      id: 2,
      title: 'Levels',
      priceUSD: 5,
      annualDiscount: 0.2
    }
  };

  const item = marketplaceItems[itemId];

  // State management
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [convertedPrice, setConvertedPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Color mode values
  const cardBg = useColorModeValue('white', 'brand.primary');
  const cardBorder = useColorModeValue('brand.primary', 'brand.primary');
  const primaryColor = useColorModeValue('brand.primary', 'brand.primary');

  // Calculate price based on billing and currency
  useEffect(() => {
    if (selectedCurrency && item) {
      // Base price calculation
      let basePrice = item.priceUSD;
      
      // Apply annual discount if selected
      if (isAnnualBilling) {
        basePrice *= 12 * (1 - item.annualDiscount);
      }

      // Convert to selected currency
      const rate = currencyRates[selectedCurrency] || 1;
      const convertedAmount = basePrice * rate;
      
      setConvertedPrice(convertedAmount.toFixed(2));
    }
  }, [selectedCurrency, isAnnualBilling, item]);

  const handleContinuePayment = () => {
    // Validate selection
    if (!selectedCountry || !selectedCurrency || !selectedPaymentMethod) {
      toast({
        title: "Selection Required",
        description: "Please select country, currency and payment method",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Navigate to final payment page
    navigate('/instructor-final-payment', {
      state: {
        itemId,
        country: selectedCountry,
        currency: selectedCurrency,
        price: convertedPrice,
        annual: isAnnualBilling,
        paymentMethod: selectedPaymentMethod
      }
    });
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="100px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Heading 
            size="lg" 
            color={primaryColor} 
            display="flex" 
            alignItems="center"
          >
            <FaGlobeAmericas style={{marginRight: '10px'}} />
            Payment Options
          </Heading>

          <SimpleGrid columns={[1, 2]} spacing={6}>
            {/* Country and Currency Selection */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={cardBorder}
              boxShadow="md"
            >
              <CardHeader>
                <Heading size="md">Select Your Location</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      placeholder="Select your country"
                      value={selectedCountry}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setSelectedCountry(selected);
                        // Automatically set currency based on country
                        const countryData = countryCurrencies.find(c => c.country === selected);
                        if (countryData) {
                          setSelectedCurrency(countryData.currency);
                        }
                      }}
                    >
                      {countryCurrencies.map((country) => (
                        <option key={country.country} value={country.country}>
                          {country.flag} {country.country}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Currency</FormLabel>
                    <Select 
                      placeholder="Select currency"
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                      {countryCurrencies.map((country) => (
                        <option key={country.currency} value={country.currency}>
                          {country.currency}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <Box position="relative" width="full">
                      <Select 
                        placeholder="Select payment method"
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        icon={<></>}  
                        sx={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          backgroundColor: useColorModeValue('white', 'brand.primary'),
                          borderWidth: '1px',
                          borderColor: useColorModeValue('brand.primary', 'brand.primary'),
                          borderRadius: 'md',
                          padding: '10px 15px',
                          paddingRight: '50px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          _hover: {
                            borderColor: useColorModeValue('brand.primary0', 'brand.primary')
                          }
                        }}
                      >
                        {paymentMethodsByCountry[selectedCountry] && paymentMethodsByCountry[selectedCountry].map((method) => (
                          <option key={method.name} value={method.name}>
                            {method.name}
                          </option>
                        ))}
                      </Select>
                      <Box 
                        position="absolute" 
                        top="50%" 
                        right="10px" 
                        transform="translateY(-50%)" 
                        pointerEvents="none"
                      >
                        <Icon 
                          as={FaChevronDown} 
                          color={useColorModeValue('brand.primary0', 'brand.primary')} 
                        />
                      </Box>
                    </Box>
                  </FormControl>

                  {/* Payment Method Cards */}
                  {paymentMethodsByCountry[selectedCountry] && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={4} mt={4}>
                      {paymentMethodsByCountry[selectedCountry].map((method) => (
                        <Box 
                          key={method.name}
                          borderWidth="1px"
                          borderRadius="lg"
                          p={4}
                          textAlign="center"
                          cursor="pointer"
                          bg={selectedPaymentMethod === method.name 
                            ? useColorModeValue('brand.primary', 'blue.900') 
                            : useColorModeValue('white', 'brand.primary')
                          }
                          borderColor={selectedPaymentMethod === method.name 
                            ? useColorModeValue('brand.primary0', 'brand.primary') 
                            : useColorModeValue('brand.primary', 'brand.primary')
                          }
                          transition="all 0.3s"
                          _hover={{
                            transform: 'scale(1.05)',
                            boxShadow: 'md'
                          }}
                          onClick={() => setSelectedPaymentMethod(method.name)}
                        >
                          <VStack spacing={3}>
                            <method.icon 
                              size="64" 
                              width="64px" 
                              height="64px" 
                            />
                            <Text fontWeight="bold">{method.name}</Text>
                            {method.supportedCards.length > 0 && (
                              <Text 
                                fontSize="sm" 
                                color={useColorModeValue('brand.primary0', 'brand.primary')}
                              >
                                {method.supportedCards.join(' • ')}
                              </Text>
                            )}
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Subscription Summary */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={cardBorder}
              boxShadow="md"
            >
              <CardHeader>
                <Heading size="md">Subscription Summary</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Flex justifyContent="space-between">
                    <Text>Subscription</Text>
                    <Text fontWeight="bold">{item.title}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>Billing Type</Text>
                    <Text fontWeight="bold">
                      {isAnnualBilling ? 'Annual (20% Discount)' : 'Monthly'}
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">Total Price</Text>
                    <Text fontSize="lg" fontWeight="bold" color={primaryColor}>
                      {selectedCurrency ? `${selectedCurrency} ${convertedPrice}` : 'Select Currency'}
                    </Text>
                  </Flex>
                </VStack>
              </CardBody>
              <CardFooter>
                <Button 
                  colorScheme="blue" 
                  width="full" 
                  onClick={handleContinuePayment}
                  isDisabled={!selectedCountry || !selectedCurrency || !selectedPaymentMethod}
                >
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Flex>
  );
};

export default InstructorPaymentOptions;
