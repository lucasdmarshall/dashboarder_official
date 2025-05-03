import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Flex, 
  Container,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaBuilding, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaUserPlus
} from 'react-icons/fa';

const institutionData = [
  {
    id: 1,
    name: 'Institution A',
    email: 'contact@institutiona.com',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Institution B',
    email: 'contact@institutionb.com',
    status: 'Inactive'
  },
  {
    id: 3,
    name: 'Institution C',
    email: 'contact@institutionc.com',
    status: 'Active'
  }
];

const InstitutionPage = () => {
  const [institutions, setInstitutions] = useState(institutionData);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInstitutions = institutions.filter(institution => 
    institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institution.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = '#640101';
  const headerColor = 'white';

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative" bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading 
              as="h1" 
              size="xl" 
              color="#640101"
              borderBottom="2px solid #640101"
              pb={2}
              display="flex"
              alignItems="center"
            >
              <FaBuilding style={{ marginRight: '15px' }} />
              Institutions
            </Heading>
            <Button 
              bg="#640101"
              color="white"
              leftIcon={<FaUserPlus />}
              _hover={{ 
                bg: 'black',
                transform: 'scale(1.05)'
              }}
              transition="all 0.2s ease"
            >
              Add New Institution
            </Button>
          </Flex>
          
          <Box mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search institutions by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>
          
          <Table variant="simple" size="md">
            <Thead bg={headerBgColor} color={headerColor}>
              <Tr>
                {['ID', 'Name', 'Email', 'Status', 'Actions'].map((header) => (
                  <Th 
                    key={header} 
                    color={headerColor} 
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
              {filteredInstitutions.map((institution, index) => (
                <Tr key={institution.id}>
                  <Td textAlign="center">{institution.id}</Td>
                  <Td textAlign="center">{institution.name}</Td>
                  <Td textAlign="center">{institution.email}</Td>
                  <Td textAlign="center">
                    <Badge colorScheme={institution.status === 'Active' ? 'green' : 'red'}>{institution.status}</Badge>
                  </Td>
                  <Td textAlign="center">
                    <Flex justifyContent="center" gap={2}>
                      <Button size="sm" colorScheme="blue" leftIcon={<FaEye />}>View</Button>
                      <Button size="sm" colorScheme="green" leftIcon={<FaEdit />}>Edit</Button>
                      <Button size="sm" colorScheme="red" leftIcon={<FaTrash />}>Delete</Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Container>
    </Box>
  );
};

export default InstitutionPage;
