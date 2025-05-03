import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
  Divider,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Badge,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FaBullhorn, 
  FaArrowLeft, 
  FaArrowRight, 
  FaEdit, 
  FaClone,
  FaTrash,
  FaCheck,
  FaCalendarAlt,
  FaSave,
  FaRegFileAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Sample template data
const templateData = [
  {
    id: 1,
    title: 'Holiday Announcement',
    content: 'Subject: Holiday announcement for [HOLIDAY_TYPE]\n\nDear Students, Parents and Guardians,\n\nWe would like to inform you that the school will be closed during [HOLIDAY_TYPE] from [START_DATE] to [END_DATE], inclusive. Regular classes will resume on [RESUMPTION_DATE].\n\nWe hope you enjoy your [HOLIDAY_TYPE] well! We know not everyone celebrates [HOLIDAY_TYPE], but we hope everyone takes this opportunity to have a mental break and rejuvenate.\n\nEnjoy your time with family and friends! We will see you after the break when you return.\n\nWith best wishes,\n[SCHOOL_NAME]',
    category: 'Holiday',
    priority: 'medium',
    isPinned: false,
    isDefault: true,
    placeholders: [
      { key: 'HOLIDAY_TYPE', label: 'Holiday Type', type: 'text', required: true },
      { key: 'START_DATE', label: 'Start Date', type: 'date', required: true },
      { key: 'END_DATE', label: 'End Date', type: 'date', required: true },
      { key: 'RESUMPTION_DATE', label: 'Resumption Date', type: 'date', required: true },
      { key: 'SCHOOL_NAME', label: 'School Name', type: 'text', required: true }
    ]
  },
  {
    id: 2,
    title: 'Absentee Notice',
    content: 'Subject: Absence Notification of [STUDENT_NAME]\n\nDear [PARENT_NAME],\n\nWe would like to inform that [STUDENT_NAME] was absent for [CLASS_NAME] on [DATE] without prior notice. Kindly let us know if there are any concerns.\n\nBest Regards,\n[SCHOOL_NAME]',
    category: 'Attendance',
    priority: 'high',
    isPinned: false,
    isDefault: true,
    placeholders: [
      { key: 'STUDENT_NAME', label: 'Student Name', type: 'text', required: true },
      { key: 'PARENT_NAME', label: 'Parent\'s Name', type: 'text', required: true },
      { key: 'CLASS_NAME', label: 'Class Name', type: 'text', required: true },
      { key: 'DATE', label: 'Date of Absence', type: 'date', required: true },
      { key: 'SCHOOL_NAME', label: 'School Name', type: 'text', required: true }
    ]
  },
  {
    id: 3,
    title: 'Exam Notice',
    content: 'Subject: Upcoming Examinations - [EXAM_NAME]\n\nDear Students and Parents,\n\nThis is to inform you that [EXAM_NAME] will commence on [START_DATE] and end on [END_DATE]. Students are required to be present at least [ARRIVAL_TIME] before the examination starts.\n\nExamination Schedule:\n[EXAM_SCHEDULE]\n\nPlease ensure that all necessary stationary and materials are brought to the examination. Mobile phones and other electronic devices are strictly prohibited in the examination hall.\n\nBest Regards,\n[SCHOOL_NAME]',
    category: 'Examination',
    priority: 'high',
    isPinned: false,
    isDefault: true,
    placeholders: [
      { key: 'EXAM_NAME', label: 'Examination Name', type: 'text', required: true },
      { key: 'START_DATE', label: 'Start Date', type: 'date', required: true },
      { key: 'END_DATE', label: 'End Date', type: 'date', required: true },
      { key: 'ARRIVAL_TIME', label: 'Arrival Time (e.g., 30 minutes)', type: 'text', required: true },
      { key: 'EXAM_SCHEDULE', label: 'Examination Schedule', type: 'textarea', required: true },
      { key: 'SCHOOL_NAME', label: 'School Name', type: 'text', required: true }
    ]
  },
  {
    id: 4,
    title: 'Report Card',
    content: 'Subject: [TERM_NAME] Report Card for [STUDENT_NAME]\n\nDear [PARENT_NAME],\n\nPlease find attached the report card for [STUDENT_NAME] for [TERM_NAME] of the academic year [ACADEMIC_YEAR].\n\nThe report card will be available on the student portal from [AVAILABLE_DATE]. Parents are requested to review the report card and provide their feedback through the parent portal.\n\nIf you have any questions regarding the grades or performance, please contact the class teacher or academic coordinator.\n\nBest Regards,\n[SCHOOL_NAME]',
    category: 'Academic',
    priority: 'medium',
    isPinned: false,
    isDefault: true,
    placeholders: [
      { key: 'TERM_NAME', label: 'Term Name', type: 'text', required: true },
      { key: 'STUDENT_NAME', label: 'Student Name', type: 'text', required: true },
      { key: 'PARENT_NAME', label: 'Parent\'s Name', type: 'text', required: true },
      { key: 'ACADEMIC_YEAR', label: 'Academic Year', type: 'text', required: true },
      { key: 'AVAILABLE_DATE', label: 'Available Date', type: 'date', required: true },
      { key: 'SCHOOL_NAME', label: 'School Name', type: 'text', required: true }
    ]
  },
  {
    id: 5,
    title: 'Other',
    content: 'Subject: [SUBJECT]\n\nDear [RECIPIENT],\n\n[CONTENT]\n\nBest Regards,\n[SENDER_NAME]',
    category: 'General',
    priority: 'medium',
    isPinned: false,
    isDefault: true,
    placeholders: [
      { key: 'SUBJECT', label: 'Subject', type: 'text', required: true },
      { key: 'RECIPIENT', label: 'Recipient', type: 'text', required: true },
      { key: 'CONTENT', label: 'Content', type: 'textarea', required: true },
      { key: 'SENDER_NAME', label: 'Sender Name', type: 'text', required: true }
    ]
  }
];

// Categories for notices
const categories = ['General', 'Examination', 'Assignment', 'Class Schedule', 'Event', 'Holiday', 'Important'];

// Priorities for notices
const priorities = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'red' }
];

const NoticeTemplates = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isComposeOpen, 
    onOpen: onComposeOpen, 
    onClose: onComposeClose 
  } = useDisclosure();
  const [templates, setTemplates] = useState(templateData);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'medium',
    isPinned: false,
    isDefault: false,
    placeholders: []
  });
  
  // State for compose form
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  
  // Recipients count (would normally come from context/state)
  const [recipients, setRecipients] = useState({
    total: 25,
    grades: ['Grade 1', 'Grade 2'],
    classes: ['Class 1A', 'Class 1B', 'Class 2A'],
  });
  
  // Get priority badge color
  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'gray';
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setNewTemplate({
      ...template,
      title: template.title,
      content: template.content,
      category: template.category,
      priority: template.priority,
      isPinned: template.isPinned,
    });
    setIsEditing(true);
    onOpen();
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setNewTemplate({
      title: '',
      content: '',
      category: 'General',
      priority: 'medium',
      isPinned: false,
      isDefault: false,
      placeholders: []
    });
    setIsEditing(false);
    onOpen();
  };

  // Handle cloning a template
  const handleCloneTemplate = (template) => {
    setSelectedTemplate(null);
    setNewTemplate({
      ...template,
      title: `Copy of ${template.title}`,
      isDefault: false
    });
    setIsEditing(false);
    onOpen();
  };

  // Handle input change for template form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTemplate({
      ...newTemplate,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle input change for placeholder form
  const handlePlaceholderChange = (key, value) => {
    const newValues = { ...placeholderValues, [key]: value };
    setPlaceholderValues(newValues);
    
    // Update preview content
    let updatedContent = selectedTemplate.content;
    Object.entries(newValues).forEach(([k, v]) => {
      updatedContent = updatedContent.replace(new RegExp(`\\[${k}\\]`, 'g'), v || `[${k}]`);
    });
    
    setPreviewContent(updatedContent);
  };

  // Handle save template
  const handleSaveTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (isEditing && selectedTemplate) {
      // Update existing template
      const updatedTemplates = templates.map(template => 
        template.id === selectedTemplate.id ? { ...template, ...newTemplate } : template
      );
      setTemplates(updatedTemplates);

      toast({
        title: 'Template updated',
        description: 'The template has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } else {
      // Create new template
      const newId = Math.max(...templates.map(template => template.id), 0) + 1;
      const createdTemplate = {
        id: newId,
        ...newTemplate
      };
      setTemplates([...templates, createdTemplate]);

      toast({
        title: 'Template created',
        description: 'The template has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }

    onClose();
  };

  // Handle delete template
  const handleDeleteTemplate = (id) => {
    if (templates.find(template => template.id === id)?.isDefault) {
      toast({
        title: 'Cannot delete default template',
        description: 'Default templates cannot be deleted',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setTemplates(templates.filter(template => template.id !== id));
    
    toast({
      title: 'Template deleted',
      description: 'The template has been deleted successfully',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  // Handle back to noticeboard
  const handleBackToNoticeboard = () => {
    navigate('/noticeboard');
  };
  
  // Open compose modal
  const handleOpenComposeModal = () => {
    if (!selectedTemplate) {
      toast({
        title: 'No template selected',
        description: 'Please select a template to continue',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    // Initialize placeholder values
    const initialValues = {};
    selectedTemplate.placeholders.forEach(placeholder => {
      initialValues[placeholder.key] = '';
    });
    setPlaceholderValues(initialValues);
    setPreviewContent(selectedTemplate.content);
    
    onComposeOpen();
  };
  
  // Send notice
  const handleSendNotice = () => {
    // Validate that all required placeholders have values
    const missingFields = selectedTemplate.placeholders
      .filter(placeholder => placeholder.required && !placeholderValues[placeholder.key])
      .map(placeholder => placeholder.label);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing required fields',
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    // Here you would normally send the notice via API
    toast({
      title: 'Notice sent',
      description: `The notice has been sent to ${recipients.total} recipients`,
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    
    onComposeClose();
    navigate('/noticeboard');
  };

  // Handle continue with selected template
  const handleContinue = () => {
    handleOpenComposeModal();
  };

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16} px={6}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
              <Icon as={FaBullhorn} mr={3} />
              Select Notice Template
            </Heading>

            <Button
              colorScheme="blue"
              leftIcon={<FaRegFileAlt />}
              onClick={handleCreateTemplate}
            >
              Create New Template
            </Button>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Button 
              leftIcon={<FaArrowLeft />} 
              variant="outline" 
              colorScheme="red" 
              onClick={handleBackToNoticeboard}
            >
              Back to Noticeboard
            </Button>
          </Flex>

          {/* Templates Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {templates.map(template => (
              <Card 
                key={template.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                borderColor={selectedTemplate?.id === template.id ? "#640101" : "gray.200"}
                height="100%"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                bg={selectedTemplate?.id === template.id ? "gray.50" : "white"}
              >
                <CardHeader pb={2}>
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Heading size="md" color="#640101">{template.title}</Heading>
                    <Badge colorScheme={getPriorityColor(template.priority)}>
                      {priorities.find(p => p.value === template.priority)?.label}
                    </Badge>
                  </Flex>
                  <Badge colorScheme="purple" mt={2}>{template.category}</Badge>
                  {template.isDefault && (
                    <Badge colorScheme="gray" ml={2}>
                      Default
                    </Badge>
                  )}
                </CardHeader>
                
                <Divider />
                
                <CardBody>
                  <Box height="150px" overflow="hidden" position="relative">
                    <Text whiteSpace="pre-line" noOfLines={6}>{template.content}</Text>
                    <Box 
                      position="absolute" 
                      bottom="0" 
                      left="0" 
                      right="0" 
                      height="40px" 
                      bgGradient="linear(to-t, white, transparent)"
                    />
                  </Box>
                </CardBody>
                
                <Divider />
                
                <CardFooter pt={2}>
                  <Flex width="100%" justifyContent="space-between" alignItems="center">
                    <Button 
                      variant={selectedTemplate?.id === template.id ? "solid" : "outline"}
                      colorScheme={selectedTemplate?.id === template.id ? "green" : "blue"}
                      size="sm"
                      leftIcon={selectedTemplate?.id === template.id ? <FaCheck /> : null}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {selectedTemplate?.id === template.id ? "Selected" : "Select"}
                    </Button>
                    
                    <HStack spacing={2}>
                      <Tooltip label="Edit Template">
                        <IconButton
                          icon={<FaEdit />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleTemplateSelect(template)}
                          aria-label="Edit template"
                        />
                      </Tooltip>
                      <Tooltip label="Clone Template">
                        <IconButton
                          icon={<FaClone />}
                          size="sm"
                          colorScheme="teal"
                          variant="ghost"
                          onClick={() => handleCloneTemplate(template)}
                          aria-label="Clone template"
                        />
                      </Tooltip>
                      <Tooltip label={template.isDefault ? "Cannot Delete Default Template" : "Delete Template"}>
                        <IconButton
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteTemplate(template.id)}
                          isDisabled={template.isDefault}
                          aria-label="Delete template"
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Template Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">
            {isEditing ? "Edit Template" : "Create New Template"}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title"
                  value={newTemplate.title}
                  onChange={handleInputChange}
                  placeholder="Enter template title"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea 
                  name="content"
                  value={newTemplate.content}
                  onChange={handleInputChange}
                  placeholder="Enter template content"
                  rows={10}
                  whiteSpace="pre-line"
                />
              </FormControl>

              <Text fontSize="sm" color="gray.600">
                Use placeholders like [SUBJECT], [DATE], [TIME], [LOCATION], [SENDER_NAME] which will be replaced when using the template.
              </Text>
              
              <Flex gap={4} wrap={{ base: "wrap", md: "nowrap" }}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    name="category"
                    value={newTemplate.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    name="priority"
                    value={newTemplate.priority}
                    onChange={handleInputChange}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              leftIcon={<FaSave />}
              colorScheme="blue" 
              onClick={handleSaveTemplate}
            >
              {isEditing ? "Update Template" : "Save Template"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Compose Notice Modal */}
      <Modal isOpen={isComposeOpen} onClose={onComposeClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">
            <Flex direction="column">
              <Text>Compose {selectedTemplate?.title}</Text>
              <Text fontSize="sm" fontWeight="normal" mt={1}>
                Recipients: {recipients.total} students from {recipients.grades.length} grades, {recipients.classes.length} classes
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedTemplate && (
              <VStack spacing={6} align="stretch">
                <Box p={4} bg="blue.50" borderRadius="md">
                  <Heading size="sm" mb={2}>Fill in the template details</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Complete the form below to fill in the placeholders in the template.
                  </Text>
                </Box>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {/* Form Fields */}
                  <Box>
                    <VStack spacing={4} align="stretch">
                      {selectedTemplate.placeholders.map(placeholder => (
                        <FormControl key={placeholder.key} isRequired={placeholder.required}>
                          <FormLabel>{placeholder.label}</FormLabel>
                          {placeholder.type === 'textarea' ? (
                            <Textarea
                              value={placeholderValues[placeholder.key] || ''}
                              onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                              placeholder={`Enter ${placeholder.label.toLowerCase()}`}
                            />
                          ) : placeholder.type === 'date' ? (
                            <Input
                              type="date"
                              value={placeholderValues[placeholder.key] || ''}
                              onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                            />
                          ) : (
                            <Input
                              value={placeholderValues[placeholder.key] || ''}
                              onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                              placeholder={`Enter ${placeholder.label.toLowerCase()}`}
                            />
                          )}
                        </FormControl>
                      ))}
                    </VStack>
                  </Box>
                  
                  {/* Preview */}
                  <Box>
                    <FormControl>
                      <FormLabel>Preview</FormLabel>
                      <Box 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="md" 
                        bg="gray.50" 
                        maxHeight="400px" 
                        overflowY="auto"
                        whiteSpace="pre-line"
                      >
                        <Text>{previewContent}</Text>
                      </Box>
                    </FormControl>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onComposeClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              bg="#640101"
              onClick={handleSendNotice}
            >
              Send Notice
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Continue Button */}
      <Box position="fixed" bottom="0" right="0" left="250px" bg="white" p={4} borderTopWidth="1px" borderColor="gray.200" zIndex={10}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">
            Template: {selectedTemplate ? selectedTemplate.title : 'No template selected'}
          </Text>
          <Button
            colorScheme="red"
            bg="#640101"
            size="lg"
            rightIcon={<FaArrowRight />}
            onClick={handleContinue}
            isDisabled={!selectedTemplate}
          >
            Continue to Compose Notice
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default NoticeTemplates; 