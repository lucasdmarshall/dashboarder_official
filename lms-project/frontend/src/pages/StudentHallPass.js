import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  Container,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  HStack,
  Divider,
  Select,
  Grid,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react';
import { FaIdCard, FaCheck, FaClock } from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';

// Sample history data - in a real app, this would come from an API
const initialHallPassHistory = [
  {
    id: 1,
    date: '2025-05-01',
    code: '183756',
    fromTime: '10:30',
    toTime: '11:00',
    reason: 'Meeting with counselor',
    destination: 'Guidance Office'
  },
  {
    id: 2,
    date: '2025-04-28',
    code: '459201',
    fromTime: '13:15',
    toTime: '13:45',
    reason: 'Nurse visit',
    destination: 'Health Center'
  }
];

const StudentHallPass = () => {
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [fromHour, setFromHour] = useState('');
  const [fromMinute, setFromMinute] = useState('00');
  const [fromAmPm, setFromAmPm] = useState('AM');
  const [toHour, setToHour] = useState('');
  const [toMinute, setToMinute] = useState('00');
  const [toAmPm, setToAmPm] = useState('AM');
  const [isLoading, setIsLoading] = useState(false);
  const [hallPassCode, setHallPassCode] = useState(null);
  const [hallPassHistory, setHallPassHistory] = useState(initialHallPassHistory);
  
  const accentColor = useColorModeValue('#640101', 'red.200');
  const toast = useToast();

  // Helper function to generate time options
  const getTimeOptions = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push(i.toString());
    }
    
    const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
    
    return { hours, minutes };
  };

  const { hours, minutes } = getTimeOptions();

  // Function to format time for display and validation
  const formatTime = (hour, minute, amPm) => {
    if (!hour) return '';
    return `${hour}:${minute} ${amPm}`;
  };

  // Function to convert 12-hour format to 24-hour for comparison
  const convertTo24Hour = (hour, minute, amPm) => {
    let hourNum = parseInt(hour);
    if (amPm === 'PM' && hourNum < 12) hourNum += 12;
    if (amPm === 'AM' && hourNum === 12) hourNum = 0;
    return `${hourNum.toString().padStart(2, '0')}:${minute}`;
  };

  // Function to generate random 6-digit hall pass code
  const generateHallPassCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const fromTimeFormatted = formatTime(fromHour, fromMinute, fromAmPm);
    const toTimeFormatted = formatTime(toHour, toMinute, toAmPm);
    
    // Validate form
    if (!reason || !destination || !fromHour || !toHour) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if to time is after from time
    const from24 = convertTo24Hour(fromHour, fromMinute, fromAmPm);
    const to24 = convertTo24Hour(toHour, toMinute, toAmPm);
    
    if (from24 >= to24) {
      toast({
        title: 'Invalid time range',
        description: 'End time must be after start time',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      const code = generateHallPassCode();
      setHallPassCode(code);
      setIsLoading(false);
      
      // Add to history
      const today = new Date().toISOString().split('T')[0];
      const newHallPass = {
        id: hallPassHistory.length + 1,
        date: today,
        code,
        fromTime: fromTimeFormatted,
        toTime: toTimeFormatted,
        reason,
        destination
      };
      
      setHallPassHistory([newHallPass, ...hallPassHistory]);
      
      // Show success message
      toast({
        title: 'Hall Pass Generated',
        description: `Your hall pass code is: ${code}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2000); // 2-second simulated loading time
  };

  const resetForm = () => {
    setReason('');
    setDestination('');
    setFromHour('');
    setFromMinute('00');
    setFromAmPm('AM');
    setToHour('');
    setToMinute('00');
    setToAmPm('AM');
    setHallPassCode(null);
  };

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
        bg="gray.50"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" color={accentColor}>Request Hall Pass</Heading>
            
            <Card 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              boxShadow="md"
              bg="white"
            >
              <CardHeader 
                bg={`${accentColor}10`} 
                borderBottom={`1px solid ${accentColor}20`}
                p={4}
              >
                <Flex alignItems="center">
                  <FaIdCard size={24} color={accentColor} />
                  <Heading size="md" ml={4} color={accentColor}>
                    Hall Pass Request Form
                  </Heading>
                </Flex>
              </CardHeader>
              
              <CardBody p={6}>
                {hallPassCode ? (
                  <VStack spacing={6} align="center">
                    <Heading size="lg" color={accentColor}>
                      Your Hall Pass is Ready
                    </Heading>
                    
                    <Box 
                      border="2px dashed" 
                      borderColor={accentColor} 
                      p={6} 
                      borderRadius="md" 
                      width="100%"
                      textAlign="center"
                    >
                      <Heading size="4xl" color={accentColor} mb={4}>
                        {hallPassCode}
                      </Heading>
                      <Text fontWeight="bold">Valid: {formatTime(fromHour, fromMinute, fromAmPm)} - {formatTime(toHour, toMinute, toAmPm)}</Text>
                      <Text>Destination: {destination}</Text>
                    </Box>
                    
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">
                        If you don't arrive on time, your hall pass access will be deactivated for 7 days. 
                        For more queries, please contact your institution.
                      </Text>
                    </Alert>
                    
                    <Button 
                      colorScheme="red" 
                      bg={accentColor}
                      _hover={{ bg: "#8B0000" }}
                      onClick={resetForm}
                    >
                      Request Another Pass
                    </Button>
                  </VStack>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Reason</FormLabel>
                        <Textarea 
                          value={reason} 
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Please provide a reason for your hall pass request"
                        />
                      </FormControl>
                      
                      <FormControl isRequired>
                        <FormLabel>Destination</FormLabel>
                        <Input 
                          value={destination} 
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Where are you going?"
                        />
                      </FormControl>
                      
                      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        <FormControl isRequired>
                          <FormLabel>From Time</FormLabel>
                          <HStack spacing={2} align="flex-start">
                            <Select 
                              placeholder="Hour" 
                              width="33%" 
                              value={fromHour}
                              onChange={(e) => setFromHour(e.target.value)}
                              borderColor="gray.300"
                            >
                              {hours.map(hour => (
                                <option key={`from-hour-${hour}`} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </Select>
                            
                            <Select 
                              width="33%" 
                              value={fromMinute}
                              onChange={(e) => setFromMinute(e.target.value)}
                              borderColor="gray.300"
                            >
                              {minutes.map(minute => (
                                <option key={`from-minute-${minute}`} value={minute}>
                                  {minute}
                                </option>
                              ))}
                            </Select>
                            
                            <RadioGroup 
                              value={fromAmPm} 
                              onChange={setFromAmPm}
                              width="33%"
                            >
                              <Stack direction="row" spacing={4}>
                                <Radio 
                                  value="AM" 
                                  colorScheme="red" 
                                  borderColor="gray.400"
                                >
                                  AM
                                </Radio>
                                <Radio 
                                  value="PM" 
                                  colorScheme="red" 
                                  borderColor="gray.400"
                                >
                                  PM
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </HStack>
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>To Time</FormLabel>
                          <HStack spacing={2} align="flex-start">
                            <Select 
                              placeholder="Hour" 
                              width="33%"
                              value={toHour}
                              onChange={(e) => setToHour(e.target.value)}
                              borderColor="gray.300"
                            >
                              {hours.map(hour => (
                                <option key={`to-hour-${hour}`} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </Select>
                            
                            <Select 
                              width="33%"
                              value={toMinute}
                              onChange={(e) => setToMinute(e.target.value)}
                              borderColor="gray.300"
                            >
                              {minutes.map(minute => (
                                <option key={`to-minute-${minute}`} value={minute}>
                                  {minute}
                                </option>
                              ))}
                            </Select>
                            
                            <RadioGroup 
                              value={toAmPm} 
                              onChange={setToAmPm}
                              width="33%"
                            >
                              <Stack direction="row" spacing={4}>
                                <Radio 
                                  value="AM" 
                                  colorScheme="red" 
                                  borderColor="gray.400"
                                >
                                  AM
                                </Radio>
                                <Radio 
                                  value="PM" 
                                  colorScheme="red" 
                                  borderColor="gray.400"
                                >
                                  PM
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </HStack>
                        </FormControl>
                      </Grid>
                      
                      <Alert status="warning" borderRadius="md" mt={2}>
                        <AlertIcon />
                        <Text fontSize="sm">
                          If you don't arrive on time, your hall pass access will be deactivated for 7 days. 
                          For more queries, please contact your institution.
                        </Text>
                      </Alert>
                      
                      <Button 
                        type="submit" 
                        colorScheme="red" 
                        bg={accentColor}
                        _hover={{ bg: "#8B0000" }}
                        mt={4}
                        isLoading={isLoading}
                        loadingText="Generating..."
                        rightIcon={isLoading ? <Spinner size="sm" /> : <FaCheck />}
                      >
                        Generate My Hall Pass
                      </Button>
                    </VStack>
                  </form>
                )}
              </CardBody>
            </Card>
            
            <Divider my={4} />
            
            <Card 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              boxShadow="md"
              bg="white"
            >
              <CardHeader 
                bg={`${accentColor}10`} 
                borderBottom={`1px solid ${accentColor}20`}
                p={4}
              >
                <Flex alignItems="center">
                  <FaClock size={24} color={accentColor} />
                  <Heading size="md" ml={4} color={accentColor}>
                    Hall Pass History
                  </Heading>
                </Flex>
              </CardHeader>
              
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg={`${accentColor}05`}>
                      <Tr>
                        <Th>No.</Th>
                        <Th>Date</Th>
                        <Th>Hall Pass Code</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th>Reason</Th>
                        <Th>Destination</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {hallPassHistory.map((pass, index) => (
                        <Tr key={pass.id}>
                          <Td>{index + 1}</Td>
                          <Td>{pass.date}</Td>
                          <Td>
                            <Badge colorScheme="red" variant="solid" px={2} py={1}>
                              {pass.code}
                            </Badge>
                          </Td>
                          <Td>{pass.fromTime}</Td>
                          <Td>{pass.toTime}</Td>
                          <Td>{pass.reason}</Td>
                          <Td>{pass.destination}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentHallPass;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */ 