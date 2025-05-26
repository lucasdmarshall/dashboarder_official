import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Checkbox,
  VStack,
  Heading,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Divider,
  Alert,
  AlertIcon,
  FormErrorMessage
} from '@chakra-ui/react';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5001/api';

const FormViewer = ({ institutionId, formId, isOpen, onClose, isPreviewMode = false }) => {
  const [form, setForm] = useState(null);
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const toast = useToast();

  // Load form data when component mounts
  useEffect(() => {
    if (formId && isOpen && institutionId) {
      loadFormData();
    }
  }, [formId, isOpen, institutionId]);

  const loadFormData = async () => {
    if (!institutionId || !formId) {
      toast({
        title: 'Error',
        description: 'Missing required parameters',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      
      const response = await axios.get(`${API_URL}/forms/${institutionId}/${formId}`, { headers });
      setForm(response.data.form);
      setFields(response.data.fields);
      
      // Initialize form values with default values if available
      const initialValues = {};
      response.data.fields.forEach(field => {
        initialValues[field.id] = field.default_value || '';
      });
      setFormValues(initialValues);
      
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when field is updated
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (field.is_required && (!formValues[field.id] || formValues[field.id].trim() === '')) {
        newErrors[field.id] = 'This field is required';
        isValid = false;
      }
      
      // Email validation
      if (field.field_type === 'email' && formValues[field.id] && !/\S+@\S+\.\S+/.test(formValues[field.id])) {
        newErrors[field.id] = 'Please enter a valid email address';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Skip validation in preview mode
    if (isPreviewMode) {
      toast({
        title: 'Preview Mode',
        description: 'Form submission is disabled in preview mode',
        status: 'info',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Format the submission data
      const submissionData = {
        values: Object.entries(formValues).map(([fieldId, value]) => ({
          field_id: parseInt(fieldId),
          value: value
        }))
      };
      
      // Get current user ID if available
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        submissionData.submitted_by = user.id;
      }
      
      // Submit the form
      const response = await axios.post(
        `${API_URL}/forms/${institutionId}/${formId}/submit`,
        submissionData
      );
      
      setSubmitSuccess(true);
      toast({
        title: 'Success',
        description: 'Form submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Reset form values after successful submission
      setTimeout(() => {
        const initialValues = {};
        fields.forEach(field => {
          initialValues[field.id] = field.default_value || '';
        });
        setFormValues(initialValues);
        setSubmitSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on its type
  const renderField = (field) => {
    switch (field.field_type) {
      case 'text':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <FormLabel>{field.label}</FormLabel>
            <Input
              type="text"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      case 'email':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <FormLabel>{field.label}</FormLabel>
            <Input
              type="email"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      case 'number':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <FormLabel>{field.label}</FormLabel>
            <Input
              type="number"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      case 'date':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <FormLabel>{field.label}</FormLabel>
            <Input
              type="date"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      case 'select':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <FormLabel>{field.label}</FormLabel>
            <Select
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder="Select an option"
            >
              {field.options && Array.isArray(field.options) && field.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </Select>
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      case 'textarea':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <FormLabel>{field.label}</FormLabel>
            <Textarea
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      case 'checkbox':
        return (
          <FormControl 
            key={field.id} 
            mb={4} 
            isRequired={field.is_required} 
            isInvalid={errors[field.id]}
          >
            <Checkbox
              isChecked={formValues[field.id] === 'true'}
              onChange={(e) => handleInputChange(field.id, e.target.checked ? 'true' : 'false')}
            >
              {field.label}
            </Checkbox>
            {errors[field.id] && <FormErrorMessage>{errors[field.id]}</FormErrorMessage>}
          </FormControl>
        );
        
      default:
        return (
          <FormControl key={field.id} mb={4}>
            <FormLabel>{field.label}</FormLabel>
            <Input
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
          </FormControl>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="#640101" color="white">
          {isPreviewMode ? 'Form Preview' : form?.name || 'Form'}
          {isPreviewMode && <Text fontSize="sm" fontWeight="normal">Preview Mode - Submission Disabled</Text>}
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody>
          {isLoading ? (
            <Box p={4} textAlign="center">
              <Text>Loading form...</Text>
            </Box>
          ) : submitSuccess ? (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              Form submitted successfully. Thank you!
            </Alert>
          ) : (
            <VStack spacing={4} align="stretch" p={2}>
              {form && (
                <Box mb={4}>
                  <Heading size="md">{form.name}</Heading>
                  {form.description && (
                    <Text mt={2} color="gray.600">{form.description}</Text>
                  )}
                  <Divider mt={3} mb={3} />
                </Box>
              )}
              
              {fields.length === 0 ? (
                <Box p={4} textAlign="center">
                  <Text color="gray.500">This form has no fields.</Text>
                </Box>
              ) : (
                // Sort fields by display_order
                [...fields]
                  .sort((a, b) => a.display_order - b.display_order)
                  .map(field => renderField(field))
              )}
            </VStack>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          {!isLoading && !submitSuccess && fields.length > 0 && (
            <Button 
              bg="#640101" 
              color="white" 
              onClick={handleSubmit} 
              isLoading={isSubmitting}
              _hover={{ bg: "#500101" }}
              isDisabled={isPreviewMode}
            >
              {isPreviewMode ? 'Preview Only' : 'Submit Form'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormViewer; 