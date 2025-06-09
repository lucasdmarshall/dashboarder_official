import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Flex, 
  Text,
  Badge,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip
} from '@chakra-ui/react';
import { FaShieldAlt, FaSearch, FaSync, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

const AdminManageTutorsPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const toast = useToast();

  const fetchRedMarkSubscribers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5001/api/admin/red-mark-subscribers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch Red Mark subscribers');
      }

      const data = await response.json();
      setSubscribers(data.subscribers || []);
      setLastUpdated(data.last_updated);
      setError(null);
    } catch (error) {
      console.error('Error fetching Red Mark subscribers:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch Red Mark subscribers',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchRedMarkSubscribers();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRedMarkSubscribers();
    setIsRefreshing(false);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (subscriber) => {
    if (subscriber.expires_soon) {
      return (
        <Badge 
          colorScheme="orange" 
          variant="subtle"
          px={2}
          py={1}
          borderRadius="md"
        >
          <HStack spacing={1}>
            <FaExclamationTriangle />
            <Text>Expires Soon</Text>
          </HStack>
        </Badge>
      );
    }
    
    return (
      <Badge 
        colorScheme="green" 
        variant="subtle"
        px={2}
        py={1}
        borderRadius="md"
      >
        <HStack spacing={1}>
          <FaShieldAlt />
          <Text>Verified</Text>
        </HStack>
      </Badge>
    );
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.last_transaction_id && subscriber.last_transaction_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Flex
      bg="linear-gradient(135deg, #F7FAFC 0%, #F1F5F9 100%)"
      minHeight="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        width="200px"
        height="200px"
        bg="rgba(100, 1, 1, 0.05)"
        transform="rotate(45deg)"
        borderRadius="50px"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="-50px"
        left="-50px"
        width="200px"
        height="200px"
        bg="rgba(100, 1, 1, 0.05)"
        transform="rotate(45deg)"
        borderRadius="50px"
        zIndex={1}
      />

      <AdminSidebar />
      
      <Box 
        ml="250px" 
        w="calc(100% - 250px)" 
        p={8}
        pt="98px"
        zIndex={10}
        position="relative"
      >
        <Container maxW="container.xl">
          <VStack align="stretch" spacing={6}>
            
            {/* Header */}
            <Box>
              <Heading 
                mb={2} 
                color="#4A0000"
                fontWeight="bold"
                letterSpacing="wide"
                position="relative"
              >
                Manage Tutors
                <Box
                  position="absolute"
                  bottom="-10px"
                  left="0"
                  height="3px"
                  width="120px"
                  bg="#640101"
                  borderRadius="full"
                />
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Manage instructors with active Red Mark subscriptions
              </Text>
            </Box>

            {/* Search Bar and Controls */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <InputGroup maxW="400px">
                <InputLeftElement>
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                />
              </InputGroup>
              
              <HStack spacing={4}>
                <Button
                  leftIcon={<FaSync />}
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  loadingText="Refreshing"
                  variant="outline"
                  borderColor="#640101"
                  color="#640101"
                  _hover={{ 
                    bg: "#640101", 
                    color: "white" 
                  }}
                  size="md"
                >
                  Refresh
                </Button>
                
                <VStack spacing={0} align="end">
                  <Text color="#640101" fontSize="sm" fontWeight="semibold">
                    {filteredSubscribers.length} active subscriber{filteredSubscribers.length !== 1 ? 's' : ''}
                  </Text>
                  {lastUpdated && (
                    <Text color="gray.500" fontSize="xs">
                      Updated: {formatDateTime(lastUpdated)}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </Flex>

            {/* Error Alert */}
            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertTitle>Error loading data!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading or Table */}
            {isLoading ? (
              <Flex justify="center" align="center" h="300px">
                <VStack spacing={4}>
                  <Spinner size="xl" color="#640101" thickness="4px" />
                  <Text color="#640101" fontWeight="medium">Loading Red Mark subscribers...</Text>
                </VStack>
              </Flex>
            ) : (
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="0 10px 30px rgba(100, 1, 1, 0.08)"
                border="1px solid"
                borderColor="gray.100"
                overflow="hidden"
              >
                <Table variant="simple">
                  <Thead bg="gray.50" borderBottom="2px solid #640101">
                    <Tr>
                      <Th color="#4A0000" fontWeight="bold" fontSize="sm">No.</Th>
                      <Th color="#4A0000" fontWeight="bold" fontSize="sm">Name</Th>
                      <Th color="#4A0000" fontWeight="bold" fontSize="sm">Status</Th>
                      <Th color="#4A0000" fontWeight="bold" fontSize="sm">Remaining Time</Th>
                      <Th color="#4A0000" fontWeight="bold" fontSize="sm">Subscribed At</Th>
                      <Th color="#4A0000" fontWeight="bold" fontSize="sm">Last Transaction ID</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredSubscribers.map((subscriber, index) => (
                      <Tr 
                        key={subscriber.id}
                        _hover={{ 
                          bg: "gray.50", 
                          transform: "translateY(-1px)", 
                          boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                        }}
                        transition="all 0.2s ease"
                      >
                        <Td fontWeight="medium" color="gray.700">
                          {index + 1}
                        </Td>
                        
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" color="#4A0000">
                              {subscriber.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {subscriber.email}
                            </Text>
                          </VStack>
                        </Td>
                        
                        <Td>
                          {getStatusBadge(subscriber)}
                        </Td>
                        
                        <Td>
                          <HStack spacing={2}>
                            <Icon 
                              as={FaClock} 
                              color={subscriber.expires_soon ? "orange.500" : "green.500"} 
                            />
                            <Text 
                              fontWeight="medium"
                              color={subscriber.expires_soon ? "orange.600" : "green.600"}
                            >
                              {subscriber.remaining_time}
                            </Text>
                          </HStack>
                        </Td>
                        
                        <Td>
                          <Text color="gray.700" fontSize="sm">
                            {formatDateTime(subscriber.subscribed_at)}
                          </Text>
                        </Td>
                        
                        <Td>
                          {subscriber.last_transaction_id ? (
                            <Tooltip label={subscriber.last_transaction_id} placement="top">
                              <Text 
                                color="blue.600" 
                                fontSize="sm" 
                                fontFamily="mono"
                                cursor="pointer"
                                _hover={{ textDecoration: "underline" }}
                                maxW="150px"
                                isTruncated
                              >
                                {subscriber.last_transaction_id}
                              </Text>
                            </Tooltip>
                          ) : (
                            <Text color="gray.400" fontSize="sm" fontStyle="italic">
                              NULL
                            </Text>
                          )}
                        </Td>
                      </Tr>
                    ))}
                    
                    {filteredSubscribers.length === 0 && !isLoading && (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={12}>
                          <VStack spacing={3}>
                            <Icon as={FaShieldAlt} boxSize={12} color="gray.300" />
                            <Text color="gray.500" fontSize="lg" fontWeight="medium">
                              {searchTerm ? 'No subscribers match your search.' : 'No Red Mark subscribers found.'}
                            </Text>
                            <Text color="gray.400" fontSize="sm">
                              {searchTerm ? 'Try adjusting your search terms.' : 'Instructors with active Red Mark subscriptions will appear here.'}
                            </Text>
                          </VStack>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default AdminManageTutorsPage;
