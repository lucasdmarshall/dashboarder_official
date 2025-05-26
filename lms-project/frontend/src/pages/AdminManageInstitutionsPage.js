import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Flex,
  Text,
  Icon,
  Tooltip,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaSearch,
  FaBuilding
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

// API base URL - updated to match our FastAPI backend
const API_URL = 'http://localhost:5001/api';

const AdminManageInstitutionsPage = () => {
  // State for institutions data
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  
  // Load institutions from API on component mount
  useEffect(() => {
    fetchInstitutions();
  }, []);
  
  // Function to fetch institutions from the API
  const fetchInstitutions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/institutions`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInstitutions(data || []);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Failed to load institutions. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load institutions. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter institutions based on search query
  const filteredInstitutions = institutions.filter(institution => 
    institution.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institution.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institution.id?.toString().includes(searchQuery)
  );

  // Handle opening the edit modal
  const handleEditInstitution = (institution) => {
    setSelectedInstitution(institution);
    setIsEditModalOpen(true);
  };

  // Handle opening the add modal
  const handleAddInstitution = () => {
    setSelectedInstitution({
      name: '',
      email: '',
      password: ''
    });
    setIsAddModalOpen(true);
  };

  // Handle saving changes to an existing institution
  const handleSaveChanges = async () => {
    try {
      // Validate required fields
      if (!selectedInstitution.name || !selectedInstitution.email) {
        toast({
          title: "Validation Error",
          description: "Name and email are required fields.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }
      
      // Create payload for API
      const payload = {
        name: selectedInstitution.name,
        email: selectedInstitution.email
      };
      
      // Add password if provided (for updates, password is optional)
      if (selectedInstitution.password && selectedInstitution.password.trim() !== '') {
        payload.password = selectedInstitution.password;
      }
      
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      // Update institution via API
      const response = await fetch(`${API_URL}/institutions/${selectedInstitution.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update institution');
      }
      
      const updatedInstitution = await response.json();
      
      // Update the institutions array with the updated institution
      setInstitutions(institutions.map(inst => 
        inst.id === updatedInstitution.id ? updatedInstitution : inst
      ));

      // Close modal and show success toast
      setIsEditModalOpen(false);
      toast({
        title: "Institution Updated",
        description: `${selectedInstitution.name} has been updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true
      });
      
    } catch (error) {
      console.error('Error updating institution:', error);
      let errorMessage = 'Failed to update institution';
      
      if (error.message && error.message !== '[object Object]') {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Handle adding a new institution
  const handleAddNewInstitution = async () => {
    try {
      // Validate required fields
      if (!selectedInstitution.name || !selectedInstitution.email || !selectedInstitution.password) {
        toast({
          title: "Validation Error",
          description: "Name, email, and password are required fields.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }
      
      // Create payload for API
      const payload = {
        name: selectedInstitution.name,
        email: selectedInstitution.email,
        password: selectedInstitution.password
      };
      
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      // Create new institution via API
      const response = await fetch(`${API_URL}/institutions/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create institution');
      }
      
      const newInstitution = await response.json();
      
      // Update local state with the new institution
      setInstitutions([...institutions, newInstitution]);

      // Close modal and show success toast
      setIsAddModalOpen(false);
      toast({
        title: "Institution Added",
        description: `${selectedInstitution.name} has been added successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true
      });
      
    } catch (error) {
      console.error('Error adding institution:', error);
      let errorMessage = 'Failed to add institution';
      
      if (error.message && error.message !== '[object Object]') {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Open delete confirmation dialog
  const openDeleteConfirmation = (institution) => {
    setInstitutionToDelete(institution);
    setIsDeleteAlertOpen(true);
  };

  // Handle deleting an institution
  const handleDeleteInstitution = async () => {
    try {
      if (!institutionToDelete) return;
      
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      // Delete institution via API
      const response = await fetch(`${API_URL}/institutions/${institutionToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      setInstitutions(institutions.filter(inst => inst.id !== institutionToDelete.id));
      
      // Close alert and show success toast
      setIsDeleteAlertOpen(false);
      setInstitutionToDelete(null);
      
      toast({
        title: "Institution Deleted",
        description: "The institution has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete institution',
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

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
      
      <Container 
        maxW="container.xl" 
        ml="250px" 
        pt="98px"
        pb={8} 
        px={6}
        zIndex={10}
        position="relative"
      >
        {isLoading ? (
          <Flex justify="center" align="center" height="50vh">
            <Spinner 
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#640101"
              size="xl"
            />
          </Flex>
        ) : error ? (
          <Flex direction="column" justify="center" align="center" height="50vh">
            <Text color="red.500" fontSize="lg" mb={4}>{error}</Text>
            <Button colorScheme="red" onClick={fetchInstitutions}>Try Again</Button>
          </Flex>
        ) : (
          <>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Heading 
                mb={2} 
                color="#4A0000"
                fontWeight="bold"
                letterSpacing="wide"
                position="relative"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaBuilding} mr={3} />
                Manage Institutions
                <Box
                  position="absolute"
                  bottom="-10px"
                  left="0"
                  height="3px"
                  width="100px"
                  bg="#640101"
                  borderRadius="full"
                />
              </Heading>
              
              <Button 
                bg="#640101"
                color="white"
                leftIcon={<FaPlus />}
                _hover={{ 
                  bg: "#4A0000",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(100, 1, 1, 0.2)"
                }}
                transition="all 0.3s ease"
                onClick={handleAddInstitution}
              >
                Add Institution
              </Button>
            </Flex>
            
            <Box mb={6}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search by name, email, or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="white"
                  boxShadow="sm"
                  borderColor="gray.200"
                  _hover={{ borderColor: "#640101" }}
                  _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                />
              </InputGroup>
            </Box>
            
            <Table 
              variant="simple" 
              bg="white" 
              boxShadow="0 10px 30px rgba(100, 1, 1, 0.08)"
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.100"
            >
              <Thead 
                bg="gray.50"
                borderBottom="2px solid #640101"
              >
                <Tr>
                  <Th color="#4A0000" fontWeight="bold">No.</Th>
                  <Th color="#4A0000" fontWeight="bold">Institution Name</Th>
                  <Th color="#4A0000" fontWeight="bold">ID</Th>
                  <Th color="#4A0000" fontWeight="bold">Email</Th>
                  <Th color="#4A0000" fontWeight="bold">Student Count</Th>
                  <Th color="#4A0000" fontWeight="bold">Password</Th>
                  <Th color="#4A0000" fontWeight="bold">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((institution, index) => (
                    <Tr 
                      key={institution.id}
                      _hover={{ 
                        bg: "gray.50", 
                        transform: "translateY(-2px)", 
                        boxShadow: "0 4px 6px rgba(100, 1, 1, 0.05)"
                      }}
                      transition="all 0.3s ease"
                    >
                      <Td>{index + 1}</Td>
                      <Td>{institution.name}</Td>
                      <Td>{institution.id}</Td>
                      <Td>{institution.email}</Td>
                      <Td>{institution.student_count}</Td>
                      <Td>{institution.password}</Td>
                      <Td>
                        <Flex gap={2}>
                          <Tooltip label="Edit Institution" placement="top">
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => handleEditInstitution(institution)}
                            >
                              <Icon as={FaEdit} />
                            </Button>
                          </Tooltip>
                          <Tooltip label="Delete Institution" placement="top">
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => openDeleteConfirmation(institution)}
                            >
                              <Icon as={FaTrash} />
                            </Button>
                          </Tooltip>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={6}>
                      <Text color="gray.500">No institutions found</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            
            {/* Edit Institution Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader color="#640101">Edit Institution</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Institution Name</FormLabel>
                      <Input 
                        value={selectedInstitution?.name || ''} 
                        onChange={(e) => setSelectedInstitution({...selectedInstitution, name: e.target.value})}
                        placeholder="Enter institution name"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        value={selectedInstitution?.email || ''} 
                        onChange={(e) => setSelectedInstitution({...selectedInstitution, email: e.target.value})}
                        placeholder="Enter institution email"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Password (leave blank to keep current)</FormLabel>
                      <Input 
                        type="password"
                        value={selectedInstitution?.password || ''} 
                        onChange={(e) => setSelectedInstitution({...selectedInstitution, password: e.target.value})}
                        placeholder="Enter new password"
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button bg="#640101" color="white" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            
            {/* Add Institution Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader color="#640101">Add New Institution</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Institution Name</FormLabel>
                      <Input 
                        value={selectedInstitution?.name || ''} 
                        onChange={(e) => setSelectedInstitution({...selectedInstitution, name: e.target.value})}
                        placeholder="Enter institution name"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        value={selectedInstitution?.email || ''} 
                        onChange={(e) => setSelectedInstitution({...selectedInstitution, email: e.target.value})}
                        placeholder="Enter institution email"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input 
                        type="password"
                        value={selectedInstitution?.password || ''} 
                        onChange={(e) => setSelectedInstitution({...selectedInstitution, password: e.target.value})}
                        placeholder="Enter institution password"
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button bg="#640101" color="white" onClick={handleAddNewInstitution}>
                    Add Institution
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </Container>
      
      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Institution
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {institutionToDelete?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteInstitution} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default AdminManageInstitutionsPage;

/**
 * Dashboarder LMS - Learning Management System
 * Copyright (C) 2023 Dashboarder
 * 
 * This file is part of Dashboarder LMS.
 * 
 * Dashboarder LMS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
