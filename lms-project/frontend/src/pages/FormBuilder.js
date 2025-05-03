import React, { useState } from 'react';
import { Button, Input, Text, VStack, Flex, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Checkbox, Box } from '@chakra-ui/react';
import { FaPlus, FaArrowUp, FaSave } from 'react-icons/fa';

const FormBuilder = ({ isOpen, onClose, setFormFields: setParentFormFields }) => {
  const [formFields, setFormFields] = useState([]);
  const [newField, setNewField] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);

  const addField = () => {
    if (newField) {
      setFormFields([...formFields, { label: newField, type: fieldType, required: isRequired }]);
      setNewField('');
      setIsRequired(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    console.log('Files uploaded:', files);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', formFields);
    setParentFormFields(formFields);
    alert('Form fields submitted successfully!');
    // onClose(); // Removed to keep modal open
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Form Field</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Field Label</FormLabel>
              <Input placeholder="Enter field label" value={newField} onChange={(e) => setNewField(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Field Type</FormLabel>
              <Select value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="select">Select</option>
                <option value="file">Document Upload</option>
              </Select>
            </FormControl>
            <FormControl display={fieldType === 'file' ? 'block' : 'none'}>
              <FormLabel>Upload Document</FormLabel>
              <Input type="file" onChange={handleFileUpload} />
            </FormControl>
            <FormControl>
              <Checkbox isChecked={isRequired} onChange={(e) => setIsRequired(e.target.checked)}>Required Field</Checkbox>
            </FormControl>
          </VStack>
          {formFields.map((field, index) => (
            <Flex key={index} alignItems="center" justifyContent="space-between" p={2} borderWidth={1} borderColor="gray.300" borderRadius="md" mt={4}>
              <Text fontWeight="bold">{field.label} ({field.type}) {field.required && '(Required)'}</Text>
              <Button onClick={() => removeField(index)} colorScheme="red">Remove</Button>
            </Flex>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={addField}
            borderRadius="50%"
            width="50px"
            height="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            sx={{
              perspective: '1000px',
              '&:hover': {
                transform: 'rotateY(15deg) rotateX(15deg) scale(1.1)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }
            }}
            transition="all 0.3s ease"
            marginRight="2"
          >
            <Box
              position="absolute"
              width="100%"
              height="100%"
              borderRadius="50%"
              bg="rgba(255, 0, 0, 0.5)"
              opacity="0.5"
              transform="translateZ(-10px)"
              transition="all 0.3s ease"
            />
            <FaPlus color="white" />
          </Button>
          <Button
            colorScheme="red"
            onClick={handleSubmit}
            borderRadius="50%"
            width="50px"
            height="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            sx={{
              perspective: '1000px',
              '&:hover': {
                transform: 'rotateY(15deg) rotateX(15deg) scale(1.1)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }
            }}
            transition="all 0.3s ease"
            marginRight="2"
          >
            <Box
              position="absolute"
              width="100%"
              height="100%"
              borderRadius="50%"
              bg="rgba(255, 0, 0, 0.5)"
              opacity="0.5"
              transform="translateZ(-10px)"
              transition="all 0.3s ease"
            />
            <FaArrowUp color="white" />
          </Button>
          <Button
            colorScheme="red"
            onClick={onClose}
            borderRadius="50%"
            width="50px"
            height="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            sx={{
              perspective: '1000px',
              '&:hover': {
                transform: 'rotateY(15deg) rotateX(15deg) scale(1.1)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }
            }}
            transition="all 0.3s ease"
          >
            <Box
              position="absolute"
              width="100%"
              height="100%"
              borderRadius="50%"
              bg="rgba(255, 0, 0, 0.5)"
              opacity="0.5"
              transform="translateZ(-10px)"
              transition="all 0.3s ease"
            />
            <FaSave color="white" />
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormBuilder;
