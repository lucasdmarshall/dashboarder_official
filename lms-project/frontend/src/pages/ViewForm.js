import React, { useState, useEffect } from 'react';
import { Box, VStack, Input, Select, Button, FormControl, FormLabel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from '@chakra-ui/react';

const ViewForm = ({ formFields, isOpen, onClose }) => {
  const [formValues, setFormValues] = useState({});
  
  // Reset form values when modal opens or formFields change
  useEffect(() => {
    if (isOpen) {
      setFormValues({});
    }
  }, [isOpen, formFields]);

  const handleInputChange = (fieldLabel, value) => {
    setFormValues({
      ...formValues,
      [fieldLabel]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', formValues);
    // Here you would typically send the form data to a server
    alert('Registration submitted successfully!');
    // onClose(); // Removed to keep modal open
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
            <Box as="span" fontSize="3xl" color="#640101" fontWeight="bold">
              <Box as="span" mr={2} display="inline-block">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#640101">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </Box>
              Student Registration
            </Box>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} maxHeight="70vh" overflowY="auto">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {formFields.map((field, index) => (
                <FormControl key={index} isRequired={field.required}>
                  <FormLabel fontWeight="bold">
                    {field.label}
                  </FormLabel>
                  {field.type === 'text' && (
                    <Input 
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      borderColor="#640101"
                      borderWidth="1px"
                      _hover={{ borderColor: '#640101' }}
                      _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    />
                  )}
                  {field.type === 'number' && (
                    <Input 
                      type="number"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      borderColor="#640101"
                      borderWidth="1px"
                      _hover={{ borderColor: '#640101' }}
                      _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    />
                  )}
                  {field.type === 'email' && (
                    <Input 
                      type="email"
                      placeholder={`Enter your email`}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      borderColor="#640101"
                      borderWidth="1px"
                      _hover={{ borderColor: '#640101' }}
                      _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    />
                  )}
                  {field.type === 'select' && (
                    <Select 
                      placeholder="Select option"
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      borderColor="#640101"
                      borderWidth="1px"
                      _hover={{ borderColor: '#640101' }}
                      _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    >
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </Select>
                  )}
                  {field.type === 'file' && (
                    <Input 
                      type="file"
                      onChange={(e) => handleInputChange(field.label, e.target.files)}
                      borderColor="#640101"
                      borderWidth="1px"
                      _hover={{ borderColor: '#640101' }}
                      _focus={{ borderColor: '#640101', boxShadow: '0 0 0 1px #640101' }}
                    />
                  )}
                </FormControl>
              ))}
            </VStack>
            <Button
              mt={8}
              colorScheme="red"
              bg="#640101"
              color="white"
              type="submit"
              width="100%"
              _hover={{ bg: 'black' }}
            >
              Submit Registration
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewForm;
