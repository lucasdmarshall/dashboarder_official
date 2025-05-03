import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Button,
  HStack,
  Icon
} from '@chakra-ui/react';
import { 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaFileInvoiceDollar, 
  FaDownload 
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

const paymentsData = [
  {
    id: 1,
    course: 'Machine Learning',
    amount: 499.99,
    date: '2024-02-15',
    status: 'Paid',
    method: 'Credit Card'
  },
  {
    id: 2,
    course: 'Web Development',
    amount: 299.50,
    date: '2024-01-20',
    status: 'Pending',
    method: 'PayPal'
  },
  {
    id: 3,
    course: 'Data Science',
    amount: 599.99,
    date: '2023-12-10',
    status: 'Paid',
    method: 'Bank Transfer'
  }
];

const StudentPayments = () => {
  const [payments, setPayments] = useState(paymentsData);

  const totalPaid = payments
    .filter(payment => payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Flex>
      <StudentSidebar />
      
      <Box 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="85px" 
        pb={8} 
        px={6} 
        position="relative"
        bg="linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%)"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              mb={4}
            >
              <Heading 
                as="h1" 
                size="xl" 
                color="#640101" 
                borderBottom="2px solid #640101"
                pb={2}
              >
                Payment History
              </Heading>
              <Flex alignItems="center">
                <Icon 
                  as={FaMoneyBillWave} 
                  boxSize={8} 
                  color="#640101" 
                  mr={3}
                />
                <VStack align="end" spacing={0}>
                  <Text 
                    fontSize="sm" 
                    color="gray.600" 
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Total Paid
                  </Text>
                  <Text 
                    fontSize="2xl" 
                    fontWeight="bold" 
                    color="#640101"
                  >
                    ${totalPaid.toFixed(2)}
                  </Text>
                </VStack>
              </Flex>
            </Flex>

            <Box 
              bg="white" 
              borderRadius="xl" 
              boxShadow="0 4px 6px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <Table variant="simple" size="md">
                <Thead 
                  bg="#640101" 
                  color="white"
                >
                  <Tr>
                    {['Course', 'Amount', 'Date', 'Payment Method', 'Status', 'Actions'].map((header) => (
                      <Th 
                        key={header} 
                        color="white" 
                        textTransform="uppercase"
                        letterSpacing="wider"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {header}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {payments.map((payment, index) => (
                    <Tr 
                      key={payment.id}
                      bg={index % 2 === 0 ? 'gray.50' : 'white'}
                      _hover={{ 
                        bg: 'rgba(100, 1, 1, 0.05)', 
                        transition: 'background 0.2s ease',
                        transform: 'scale(1.01)'
                      }}
                      transition="all 0.2s ease"
                    >
                      <Td textAlign="center" color="gray.700">
                        {payment.course}
                      </Td>
                      <Td 
                        textAlign="center" 
                        color="gray.800" 
                        fontWeight="semibold"
                      >
                        ${payment.amount.toFixed(2)}
                      </Td>
                      <Td textAlign="center" color="gray.600">
                        {payment.date}
                      </Td>
                      <Td textAlign="center">
                        <Flex 
                          alignItems="center" 
                          justifyContent="center" 
                          color="gray.700"
                        >
                          <FaCreditCard 
                            style={{ 
                              marginRight: '8px', 
                              color: '#640101' 
                            }} 
                          />
                          {payment.method}
                        </Flex>
                      </Td>
                      <Td textAlign="center">
                        <Badge 
                          bg={
                            payment.status === 'Paid' ? '#640101' : 
                            payment.status === 'Pending' ? 'gray.500' : 
                            'gray.400'
                          }
                          color="white"
                          variant="solid"
                          borderRadius="full"
                          px={2}
                          py={1}
                        >
                          {payment.status}
                        </Badge>
                      </Td>
                      <Td textAlign="center">
                        <Button 
                          size="sm"
                          bg="white"
                          color="#640101"
                          border="1px solid #640101"
                          leftIcon={<FaDownload />}
                          _hover={{ 
                            bg: '#640101',
                            color: 'white',
                            transform: 'scale(1.05)'
                          }}
                          transition="all 0.2s ease"
                        >
                          Invoice
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              bg="white" 
              p={4} 
              borderRadius="lg"
              boxShadow="0 2px 4px rgba(0,0,0,0.05)"
            >
              <Text color="gray.600">
                Total Transactions: {payments.length}
              </Text>
              <Button 
                bg="#640101"
                color="white"
                leftIcon={<FaFileInvoiceDollar />}
                _hover={{ 
                  bg: 'darkred',
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
              >
                Download All Invoices
              </Button>
            </Flex>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentPayments;
