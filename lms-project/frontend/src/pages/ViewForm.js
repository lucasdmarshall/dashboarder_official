import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Input, 
  Select, 
  Button, 
  FormControl, 
  FormLabel, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  ModalFooter,
  useToast,
  Checkbox,
  InputGroup,
  InputRightElement,
  Text,
  Spinner,
  Flex,
  Textarea,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// API base URL
const API_URL = 'http://localhost:5001/api';
// Public API URL (no auth required)
const PUBLIC_API_URL = 'http://localhost:5001/api/public';

const ViewForm = ({ isOpen, onClose, institutionId }) => {
  const [form, setForm] = useState(null);
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();

  // Fetch student registration form when modal opens
  useEffect(() => {
    if (isOpen && institutionId) {
      fetchStudentRegistrationForm();
    }
  }, [isOpen, institutionId]);

  const fetchStudentRegistrationForm = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a default empty form in case we can't fetch one
      setForm({
        id: 0,
        name: 'Student Registration Form',
        description: 'Form for registering new students',
        type: 'student_application',
      });
      
      // Set default fields as a fallback
      const defaultFields = [
        { id: 'firstName', field_name: 'firstName', field_label: 'First Name', field_type: 'text', is_required: 1 },
        { id: 'lastName', field_name: 'lastName', field_label: 'Last Name', field_type: 'text', is_required: 1 },
        { id: 'email', field_name: 'email', field_label: 'Email', field_type: 'email', is_required: 1 }
      ];
      setFields(defaultFields);
      
      // Initialize default values
      const initialValues = {};
      defaultFields.forEach(field => {
        initialValues[field.field_name] = '';
      });
      setFormValues(initialValues);
      
      // Try to fetch the form
      if (!institutionId) {
        setError('No institution ID provided');
        setIsLoading(false);
        return;
      }
      
      // Fetch forms for this institution
      const response = await axios.get(`${PUBLIC_API_URL}/forms/${institutionId}`);
      
      if (response.data?.forms?.length > 0) {
        // Get the student application form
        const studentForm = response.data.forms.find(f => f.type === 'student_application') || response.data.forms[0];
        
        if (!studentForm) {
          // Use the default form we set above
          toast({
            title: 'No Form Found',
            description: 'Using default registration form instead',
            status: 'warning',
            duration: 3000,
            isClosable: true
          });
          setIsLoading(false);
          return;
        }
        
        // Get the form fields for this form
        try {
          const fieldsResponse = await axios.get(`${PUBLIC_API_URL}/forms/${institutionId}/${studentForm.id}`);
          
          if (fieldsResponse.data?.form && fieldsResponse.data?.fields?.length > 0) {
            setForm(fieldsResponse.data.form);
            setFields(fieldsResponse.data.fields);
            
            // Initialize form values
            const initialValues = {};
            fieldsResponse.data.fields.forEach(field => {
              initialValues[field.field_name] = field.default_value || '';
            });
            setFormValues(initialValues);
          } else {
            // Keep using default fields
            toast({
              title: 'Form Found But No Fields',
              description: 'Using default registration fields instead',
              status: 'warning',
              duration: 3000,
              isClosable: true
            });
          }
        } catch (error) {
          console.error('Error fetching form fields:', error);
          toast({
            title: 'Error Fetching Form Details',
            description: 'Using default registration form instead',
            status: 'warning',
            duration: 3000,
            isClosable: true
          });
        }
      } else {
        // Keep using default form
        toast({
          title: 'No Forms Found',
          description: 'Please create a form using the "Create/edit form" button',
          status: 'warning',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast({
        title: 'Error Loading Form',
        description: 'Using a default registration form instead',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    // Preview mode - inputs are disabled, no changes allowed
    return;
  };
  
  const togglePasswordVisibility = (fieldId) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // This is a preview modal - no submission allowed
    toast({
      title: 'Preview Mode',
      description: 'This is a preview of your form. Students will see this when they click "Apply Now" on your posts.',
      status: 'info',
      duration: 4000,
      isClosable: true
    });
  };
  
  // Render field based on type
  const renderField = (field) => {
    if (!field) return null;
    
    const fieldId = field.field_name || field.id;
    const fieldValue = field.default_value || field.placeholder || '';
    const isRequired = field.is_required === 1;
    const fieldLabel = field.field_label || 'Field';
    const placeholder = field.placeholder || `Enter ${fieldLabel.toLowerCase()}`;
    
    switch (field.field_type) {
      case 'text':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Input 
              value={fieldValue}
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            />
          </FormControl>
        );
        
      case 'email':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Input 
              type="email"
              value={fieldValue}
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            />
          </FormControl>
        );
        
      case 'password':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Input 
              type="password"
              value="••••••••"
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            />
          </FormControl>
        );
        
      case 'select':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Select 
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            >
              {/* Parse options from field */}
              {(field.options ? 
                (typeof field.options === 'string' ? 
                  field.options.split('\n').filter(o => o.trim()) : 
                  Array.isArray(field.options) ? 
                    field.options : 
                    []
                ) : 
                ['Option 1', 'Option 2', 'Option 3']
              ).map((option, idx) => (
                <option key={idx} value={typeof option === 'string' ? option.trim() : option}>
                  {typeof option === 'string' ? option.trim() : option}
                </option>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'checkbox':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <Checkbox 
              isDisabled
              colorScheme="red"
            >
              <Text color="gray.600">{fieldLabel}</Text>
            </Checkbox>
          </FormControl>
        );
        
      case 'date':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Input 
              type="date"
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            />
          </FormControl>
        );
        
      case 'number':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <NumberInput
              borderColor="#640101"
              isDisabled
            >
              <NumberInputField 
                placeholder={placeholder}
                bg="gray.50"
                color="gray.600"
              />
            </NumberInput>
          </FormControl>
        );
        
      case 'textarea':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Textarea 
              value={fieldValue}
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
              rows={3}
            />
          </FormControl>
        );

      case 'radio':
        const radioOptions = field.options ? 
          (typeof field.options === 'string' ? 
            field.options.split('\n').filter(o => o.trim()) : 
            Array.isArray(field.options) ? 
              field.options : 
              []
          ) : 
          ['Option 1', 'Option 2'];
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <VStack align="start" spacing={2}>
              {radioOptions.map((option, idx) => (
                <Checkbox
                  key={idx}
                  isDisabled
                  colorScheme="red"
                >
                  <Text color="gray.600">{typeof option === 'string' ? option.trim() : option}</Text>
                </Checkbox>
              ))}
            </VStack>
          </FormControl>
        );

      case 'file':
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Input 
              type="file"
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            />
          </FormControl>
        );
        
      default:
        return (
          <FormControl key={fieldId} isRequired={isRequired} mb={4}>
            <FormLabel fontWeight="bold">{fieldLabel}</FormLabel>
            <Input 
              value={fieldValue}
              placeholder={placeholder}
              borderColor="#640101"
              isDisabled
              bg="gray.50"
              color="gray.600"
            />
          </FormControl>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="#640101" color="white" borderTopRadius="md">
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="700">
              📋 Form Preview
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              {form?.name || 'Student Application Form'} - This is how students will see your form
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6} maxHeight="70vh" overflowY="auto" bg="gray.50">
          {isLoading ? (
            <Flex justify="center" align="center" padding="40px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#640101" />
                <Text>Loading form preview...</Text>
              </VStack>
            </Flex>
          ) : error ? (
            <Text color="red.500" textAlign="center" padding="40px">
              {error}
            </Text>
          ) : fields.length === 0 ? (
            <Flex direction="column" align="center" justify="center" padding="40px">
              <Text color="gray.500" textAlign="center" mb={4} fontSize="lg">
                📝 No form created yet
              </Text>
              <Text color="gray.600" textAlign="center" mb={6}>
                Please create a form first using the "Create/edit form" button to see the preview.
              </Text>
              <Button onClick={onClose} colorScheme="red" variant="outline">
                Close
              </Button>
            </Flex>
          ) : (
          <form onSubmit={handleSubmit}>
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
              <VStack spacing={4} align="stretch">
                {form?.description && (
                  <Text color="gray.600" mb={4}>
                    {form.description}
                  </Text>
                )}
                
                {fields.map(field => renderField(field))}
                
                <Button
                  mt={6}
                  colorScheme="red"
                  bg="#640101"
                  color="white"
                  type="submit"
                  width="100%"
                  _hover={{ bg: '#8B0000' }}
                  size="lg"
                >
                  Submit Application (Preview Only)
                </Button>
              </VStack>
            </Box>
          </form>
          )}
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="gray.200">
          <VStack spacing={2} width="100%">
            <Text fontSize="sm" color="gray.600" textAlign="center">
              💡 This is a preview of your form. Students will fill this out when they click "Apply Now" on your posts.
            </Text>
            <Button onClick={onClose} variant="outline">
              Close Preview
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewForm;
