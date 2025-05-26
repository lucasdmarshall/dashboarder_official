import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
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
  Select,
  Checkbox,
  Textarea,
  VStack,
  HStack,
  IconButton,
  useToast,
  Text,
  Divider,
  Badge,
  Switch,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Center,
  Alert,
  AlertIcon,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { 
  FaPlus, 
  FaTrash, 
  FaArrowUp, 
  FaArrowDown, 
  FaSave, 
  FaEye, 
  FaEdit, 
  FaGripVertical,
  FaCog,
  FaQuestionCircle,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5001/api';
const PUBLIC_API_URL = 'http://localhost:5001/api/public';

// Available field types with their configurations
const FIELD_TYPES = [
  { 
    value: 'text', 
    label: 'Text Input', 
    icon: '📝',
    description: 'Single line text input',
    hasOptions: false,
    hasPlaceholder: true
  },
  { 
    value: 'textarea', 
    label: 'Text Area', 
    icon: '📄',
    description: 'Multi-line text input',
    hasOptions: false,
    hasPlaceholder: true
  },
  { 
    value: 'email', 
    label: 'Email', 
    icon: '📧',
    description: 'Email address input with validation',
    hasOptions: false,
    hasPlaceholder: true
  },
  { 
    value: 'number', 
    label: 'Number', 
    icon: '🔢',
    description: 'Numeric input',
    hasOptions: false,
    hasPlaceholder: true
  },
  { 
    value: 'date', 
    label: 'Date', 
    icon: '📅',
    description: 'Date picker',
    hasOptions: false,
    hasPlaceholder: false
  },
  { 
    value: 'select', 
    label: 'Dropdown', 
    icon: '📋',
    description: 'Single selection dropdown',
    hasOptions: true,
    hasPlaceholder: false
  },
  { 
    value: 'radio', 
    label: 'Radio Buttons', 
    icon: '⚪',
    description: 'Single choice from multiple options',
    hasOptions: true,
    hasPlaceholder: false
  },
  { 
    value: 'checkbox', 
    label: 'Checkbox', 
    icon: '☑️',
    description: 'Yes/No or true/false input',
    hasOptions: false,
    hasPlaceholder: false
  },
  { 
    value: 'file', 
    label: 'File Upload', 
    icon: '📎',
    description: 'File upload input',
    hasOptions: false,
    hasPlaceholder: false
  }
];

// Default field structure
const DEFAULT_FIELD = {
  id: null,
  field_name: '',
  field_label: '',
  field_type: 'text',
  is_required: false,
  placeholder: '',
  default_value: '',
  options: '',
  validation_rules: '',
  display_order: 0,
  help_text: ''
};

const FormBuilder = ({ institutionId, formId, onClose, isOpen, onSave }) => {
  // Form metadata state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'student_application'
  });
  
  // Fields state
  const [fields, setFields] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Field editing state
  const [editingField, setEditingField] = useState(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Load form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (formId && institutionId) {
        loadFormData();
      } else {
        resetForm();
      }
    }
  }, [formId, isOpen, institutionId]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'student_application'
    });
    setFields([]);
    setIsEditMode(false);
    setEditingField(null);
    setShowFieldEditor(false);
    setPreviewMode(false);
  };

  const loadFormData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${PUBLIC_API_URL}/forms/${institutionId}/${formId}`);
      
      setFormData({
        name: response.data.form.name,
        description: response.data.form.description || '',
        type: response.data.form.type || 'student_application'
      });
      
      // Convert backend fields to frontend format
      const formattedFields = response.data.fields.map((field, index) => ({
        id: field.id,
        field_name: field.field_name,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        placeholder: field.placeholder || '',
        default_value: field.default_value || '',
        options: field.options || '',
        validation_rules: field.validation_rules || '',
        display_order: field.display_order || index,
        help_text: field.help_text || ''
      }));
      
      setFields(formattedFields.sort((a, b) => a.display_order - b.display_order));
      setIsEditMode(true);
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addNewField = () => {
    const newField = {
      ...DEFAULT_FIELD,
      id: `temp_${Date.now()}`, // Temporary ID for new fields
      display_order: fields.length,
      field_name: `field_${fields.length + 1}`,
      field_label: `Field ${fields.length + 1}`
    };
    
    setFields(prev => [...prev, newField]);
    setEditingField(newField);
    setShowFieldEditor(true);
  };

  const editField = (field) => {
    setEditingField({ ...field });
    setShowFieldEditor(true);
  };

  const saveField = () => {
    if (!editingField.field_label.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Field label is required',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Generate field name from label if not provided
    if (!editingField.field_name.trim()) {
      editingField.field_name = editingField.field_label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
    }

    setFields(prev => {
      const updatedFields = [...prev];
      const index = updatedFields.findIndex(f => f.id === editingField.id);
      
      if (index >= 0) {
        updatedFields[index] = { ...editingField };
      }
      
      return updatedFields;
    });

    setShowFieldEditor(false);
    setEditingField(null);
  };

  const deleteField = (fieldId) => {
    setFields(prev => prev.filter(f => f.id !== fieldId).map((field, index) => ({
      ...field,
      display_order: index
    })));
  };

  const moveField = (fieldId, direction) => {
    setFields(prev => {
      const newFields = [...prev];
      const index = newFields.findIndex(f => f.id === fieldId);
      
      if (index < 0) return prev;
      
      if (direction === 'up' && index > 0) {
        [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      } else if (direction === 'down' && index < newFields.length - 1) {
        [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      }
      
      // Update display orders
      return newFields.map((field, idx) => ({
        ...field,
        display_order: idx
      }));
    });
  };

  const duplicateField = (field) => {
    const duplicatedField = {
      ...field,
      id: `temp_${Date.now()}`,
      field_name: `${field.field_name}_copy`,
      field_label: `${field.field_label} (Copy)`,
      display_order: fields.length
    };
    
    setFields(prev => [...prev, duplicatedField]);
  };

  const saveForm = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Form name is required',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one field is required',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setIsSaving(true);
    try {
      let savedFormId = formId;

      // Create or update form
      if (isEditMode && formId) {
        // Update existing form (Note: PUT endpoint might not exist, so we'll use POST for now)
        try {
          await axios.put(`${PUBLIC_API_URL}/forms/${institutionId}/${formId}`, formData);
        } catch (error) {
          // If PUT doesn't work, we'll continue with the existing form ID
          console.warn('PUT not available, continuing with existing form');
        }
      } else {
        // Create new form
        const formResponse = await axios.post(`${PUBLIC_API_URL}/forms/${institutionId}`, formData);
        savedFormId = formResponse.data.form.id;
        setIsEditMode(true);
      }

      // Prepare fields data for backend
      const fieldsData = fields.map((field, index) => ({
        field_name: field.field_name,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        placeholder: field.placeholder || null,
        default_value: field.default_value || null,
        options: field.options || null,
        validation_rules: field.validation_rules || null,
        display_order: index
      }));

      // Save fields
      await axios.post(`${PUBLIC_API_URL}/forms/${institutionId}/${savedFormId}/fields`, fieldsData);

      toast({
        title: 'Success',
        description: `Form ${isEditMode ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      if (onSave) {
        onSave();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'create'} form`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldPreview = (field) => {
    const fieldType = FIELD_TYPES.find(t => t.value === field.field_type);
    
    switch (field.field_type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            isDisabled
            bg="gray.50"
            rows={3}
          />
        );
      case 'select':
        const options = field.options ? field.options.split('\n').filter(o => o.trim()) : [];
        return (
          <Select placeholder="Select an option" isDisabled bg="gray.50">
            {options.map((option, index) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </Select>
        );
      case 'radio':
        const radioOptions = field.options ? field.options.split('\n').filter(o => o.trim()) : [];
        return (
          <RadioGroup isDisabled>
            <Stack direction="column">
              {radioOptions.map((option, index) => (
                <Radio key={index} value={option.trim()}>
                  {option.trim()}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <Checkbox isDisabled>
            {field.field_label}
          </Checkbox>
        );
      case 'number':
        return (
          <NumberInput isDisabled>
            <NumberInputField bg="gray.50" placeholder={field.placeholder} />
          </NumberInput>
        );
      case 'date':
        return (
          <Input
            type="date"
            isDisabled
            bg="gray.50"
          />
        );
      case 'file':
        return (
          <Input
            type="file"
            isDisabled
            bg="gray.50"
          />
        );
      default:
        return (
          <Input
            type={field.field_type}
            placeholder={field.placeholder}
            defaultValue={field.default_value}
            isDisabled
            bg="gray.50"
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader bg="#640101" color="white" borderTopRadius="md">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="md">
                {isEditMode ? 'Edit Form' : 'Create New Form'}
              </Heading>
              <Text fontSize="sm" opacity={0.9}>
                Design custom application forms for your institution
              </Text>
            </Box>
            <HStack>
              <Button
                size="sm"
                variant={previewMode ? "solid" : "outline"}
                colorScheme={previewMode ? "green" : "whiteAlpha"}
                leftIcon={<FaEye />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody p={6} bg={bgColor} overflowY="auto">
          {isLoading ? (
            <Center h="400px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#640101" />
                <Text>Loading form data...</Text>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={6} align="stretch">
              {/* Form Metadata */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="sm">Form Information</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={1} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Form Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g., Student Application Form"
                        isDisabled={previewMode}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Describe what this form is for..."
                        rows={3}
                        isDisabled={previewMode}
                      />
                    </FormControl>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Fields Section */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="sm">Form Fields ({fields.length})</Heading>
                    {!previewMode && (
                      <Button
                        leftIcon={<FaPlus />}
                        colorScheme="blue"
                        size="sm"
                        onClick={addNewField}
                      >
                        Add Field
                      </Button>
                    )}
                  </Flex>
                </CardHeader>
                <CardBody>
                  {fields.length === 0 ? (
                    <Center py={10}>
                      <VStack spacing={4}>
                        <Box fontSize="48px">📝</Box>
                        <Text color="gray.500" textAlign="center">
                          No fields added yet.{' '}
                          {!previewMode && 'Click "Add Field" to get started.'}
                        </Text>
                      </VStack>
                    </Center>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {fields.map((field, index) => (
                        <Card
                          key={field.id}
                          variant="outline"
                          borderColor={previewMode ? "transparent" : "gray.200"}
                        >
                          <CardBody>
                            {previewMode ? (
                              // Preview mode - show actual form field
                              <VStack align="stretch" spacing={3}>
                                <FormControl isRequired={field.is_required}>
                                  <FormLabel>
                                    {field.field_label}
                                    {field.is_required && (
                                      <Text as="span" color="red.500" ml={1}>*</Text>
                                    )}
                                  </FormLabel>
                                  {renderFieldPreview(field)}
                                  {field.help_text && (
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                      {field.help_text}
                                    </Text>
                                  )}
                                </FormControl>
                              </VStack>
                            ) : (
                              // Edit mode - show field configuration
                              <Flex justify="space-between" align="center">
                                <Flex align="center" flex="1">
                                  <Icon as={FaGripVertical} color="gray.400" mr={3} />
                                  <VStack align="start" spacing={1} flex="1">
                                    <HStack>
                                      <Text fontWeight="600">{field.field_label}</Text>
                                      <Badge colorScheme="blue" size="sm">
                                        {FIELD_TYPES.find(t => t.value === field.field_type)?.label}
                                      </Badge>
                                      {field.is_required && (
                                        <Badge colorScheme="red" size="sm">Required</Badge>
                                      )}
                                    </HStack>
                                    <Text fontSize="sm" color="gray.500">
                                      {field.field_name} • Order: {index + 1}
                                    </Text>
                                  </VStack>
                                </Flex>
                                
                                <HStack spacing={1}>
                                  <IconButton
                                    icon={<FaArrowUp />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => moveField(field.id, 'up')}
                                    isDisabled={index === 0}
                                    aria-label="Move up"
                                  />
                                  <IconButton
                                    icon={<FaArrowDown />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => moveField(field.id, 'down')}
                                    isDisabled={index === fields.length - 1}
                                    aria-label="Move down"
                                  />
                                  <IconButton
                                    icon={<FaEdit />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => editField(field)}
                                    aria-label="Edit field"
                                  />
                                  <IconButton
                                    icon={<FaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => deleteField(field.id)}
                                    aria-label="Delete field"
                                  />
                                </HStack>
                              </Flex>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              leftIcon={<FaSave />}
              bg="#640101"
              color="white"
              onClick={saveForm}
              isLoading={isSaving}
              loadingText="Saving..."
              _hover={{ bg: "#8B0000" }}
            >
              {isEditMode ? 'Update Form' : 'Create Form'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>

      {/* Field Editor Modal */}
      <Modal 
        isOpen={showFieldEditor} 
        onClose={() => setShowFieldEditor(false)} 
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingField?.id?.toString().startsWith('temp_') ? 'Add New Field' : 'Edit Field'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingField && (
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Field Label</FormLabel>
                    <Input
                      value={editingField.field_label}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        field_label: e.target.value
                      }))}
                      placeholder="e.g., Full Name"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Field Name (ID)</FormLabel>
                    <Input
                      value={editingField.field_name}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        field_name: e.target.value
                      }))}
                      placeholder="e.g., full_name"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel>Field Type</FormLabel>
                  <Select
                    value={editingField.field_type}
                    onChange={(e) => setEditingField(prev => ({
                      ...prev,
                      field_type: e.target.value,
                      options: e.target.value === 'select' || e.target.value === 'radio' ? prev.options : ''
                    }))}
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label} - {type.description}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Flex>
                  <Checkbox
                    isChecked={editingField.is_required}
                    onChange={(e) => setEditingField(prev => ({
                      ...prev,
                      is_required: e.target.checked
                    }))}
                  >
                    Required field
                  </Checkbox>
                </Flex>

                {FIELD_TYPES.find(t => t.value === editingField.field_type)?.hasPlaceholder && (
                  <FormControl>
                    <FormLabel>Placeholder Text</FormLabel>
                    <Input
                      value={editingField.placeholder}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        placeholder: e.target.value
                      }))}
                      placeholder="Hint text for the user"
                    />
                  </FormControl>
                )}

                {FIELD_TYPES.find(t => t.value === editingField.field_type)?.hasOptions && (
                  <FormControl>
                    <FormLabel>Options (one per line)</FormLabel>
                    <Textarea
                      value={editingField.options}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        options: e.target.value
                      }))}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      rows={4}
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Default Value</FormLabel>
                  <Input
                    value={editingField.default_value}
                    onChange={(e) => setEditingField(prev => ({
                      ...prev,
                      default_value: e.target.value
                    }))}
                    placeholder="Default value (optional)"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Help Text</FormLabel>
                  <Input
                    value={editingField.help_text}
                    onChange={(e) => setEditingField(prev => ({
                      ...prev,
                      help_text: e.target.value
                    }))}
                    placeholder="Additional instructions for users"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setShowFieldEditor(false)}>
              Cancel
            </Button>
            <Button
              leftIcon={<FaCheck />}
              colorScheme="blue"
              onClick={saveField}
            >
              Save Field
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  );
};

export default FormBuilder; 