import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  SimpleGrid,
  Icon,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Badge,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaPaperPlane,
  FaEdit,
  FaBullhorn,
  FaCheckCircle,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const NoticeCompose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // States from previous page
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [recipientCount, setRecipientCount] = useState(0);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  
  // Form state
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // Get data from location state
  useEffect(() => {
    if (location.state) {
      if (location.state.template) {
        setSelectedTemplate(location.state.template);
        
        // Initialize placeholder values
        const initialValues = {};
        location.state.template.placeholders.forEach(placeholder => {
          initialValues[placeholder.key] = '';
        });
        setPlaceholderValues(initialValues);
        setPreviewContent(location.state.template.content);
      }
      
      if (location.state.recipients) {
        setRecipients(location.state.recipients);
      }
      
      if (location.state.recipientCount) {
        setRecipientCount(location.state.recipientCount);
      }
      
      if (location.state.selectedGrades) {
        setSelectedGrades(location.state.selectedGrades);
      }
      
      if (location.state.selectedClasses) {
        setSelectedClasses(location.state.selectedClasses);
      }
    }
  }, [location]);

  // Go back to recipients selection
  const handleBackToRecipients = () => {
    navigate('/noticeboard/students', { state: { template: selectedTemplate } });
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
    
    // Show confirm dialog
    onOpen();
  };
  
  // Confirm send notice
  const confirmSendNotice = () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      
      toast({
        title: 'Notice sent successfully',
        description: `Your notice has been sent to ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      onClose();
      
      // Redirect to noticeboard after a short delay
      setTimeout(() => {
        navigate('/noticeboard');
      }, 1500);
    }, 2000);
  };

  // If no template is selected, show error
  if (!selectedTemplate) {
    return (
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16} px={6}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Heading as="h1" size="xl" color="#640101">Compose Notice</Heading>
            <Box p={8} borderWidth="1px" borderRadius="lg" bg="red.50">
              <Text color="red.600">No template selected. Please go back and select a template.</Text>
              <Button mt={4} onClick={() => navigate('/noticeboard')}>Back to Noticeboard</Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={16} px={6}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl" color="#640101" display="flex" alignItems="center">
              <Icon as={FaBullhorn} mr={3} />
              Compose Notice
            </Heading>
          </Flex>

          <Flex alignItems="center" mb={4}>
            <Button 
              leftIcon={<FaArrowLeft />} 
              variant="outline" 
              colorScheme="red" 
              onClick={handleBackToRecipients}
              mr={4}
              isDisabled={isSent}
            >
              Back to Recipients
            </Button>
            
            <Badge colorScheme="blue" p={2} borderRadius="md" mr={2}>
              Template: {selectedTemplate.title}
            </Badge>
            
            <Badge colorScheme="green" p={2} borderRadius="md">
              Recipients: {recipientCount} student{recipientCount !== 1 ? 's' : ''}
            </Badge>
          </Flex>
          
          {selectedGrades.length > 0 && (
            <Flex wrap="wrap" gap={2} mb={2}>
              <Text fontWeight="bold">Grades:</Text>
              {selectedGrades.map(grade => (
                <Badge key={grade} colorScheme="purple" ml={1}>{grade}</Badge>
              ))}
            </Flex>
          )}
          
          {selectedClasses.length > 0 && (
            <Flex wrap="wrap" gap={2} mb={4}>
              <Text fontWeight="bold">Classes:</Text>
              {selectedClasses.map(className => (
                <Badge key={className} colorScheme="cyan" ml={1}>{className}</Badge>
              ))}
            </Flex>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {/* Form Fields */}
            <Box>
              <Heading size="md" mb={4} color="#640101">Fill in the Details</Heading>
              <VStack spacing={4} align="stretch">
                {selectedTemplate.placeholders.map(placeholder => (
                  <FormControl key={placeholder.key} isRequired={placeholder.required}>
                    <FormLabel>{placeholder.label}</FormLabel>
                    {placeholder.type === 'textarea' ? (
                      <Textarea
                        value={placeholderValues[placeholder.key] || ''}
                        onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                        placeholder={`Enter ${placeholder.label.toLowerCase()}`}
                        isDisabled={isSent}
                      />
                    ) : placeholder.type === 'date' ? (
                      <Input
                        type="date"
                        value={placeholderValues[placeholder.key] || ''}
                        onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                        isDisabled={isSent}
                      />
                    ) : (
                      <Input
                        value={placeholderValues[placeholder.key] || ''}
                        onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                        placeholder={`Enter ${placeholder.label.toLowerCase()}`}
                        isDisabled={isSent}
                      />
                    )}
                  </FormControl>
                ))}
              </VStack>
            </Box>
            
            {/* Preview */}
            <Box>
              <Heading size="md" mb={4} color="#640101">Preview</Heading>
              <Box 
                p={6} 
                borderWidth="1px" 
                borderRadius="md" 
                bg="gray.50" 
                height="100%" 
                minHeight="400px"
                overflowY="auto"
                whiteSpace="pre-line"
                position="relative"
              >
                <Text>{previewContent}</Text>
                
                {isSent && (
                  <Flex 
                    position="absolute" 
                    top="0" 
                    left="0" 
                    right="0" 
                    bottom="0" 
                    bg="rgba(255, 255, 255, 0.9)" 
                    justifyContent="center" 
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Icon as={FaCheckCircle} color="green.500" boxSize={16} mb={4} />
                    <Heading size="md" color="green.500">Notice Sent Successfully!</Heading>
                  </Flex>
                )}
              </Box>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Send Button */}
      <Box position="fixed" bottom="0" right="0" left="250px" bg="white" p={4} borderTopWidth="1px" borderColor="gray.200" zIndex={10}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">
            Sending to: {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
          </Text>
          <Button
            colorScheme="red"
            bg="#640101"
            size="lg"
            rightIcon={<FaPaperPlane />}
            onClick={handleSendNotice}
            isLoading={isSending}
            loadingText="Sending..."
            isDisabled={isSent}
          >
            {isSent ? 'Notice Sent' : 'Send Notice'}
          </Button>
        </Flex>
      </Box>
      
      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white">Confirm Send Notice</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            <Text mb={4}>Are you sure you want to send this notice to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}?</Text>
            
            {selectedGrades.length > 0 && (
              <Flex wrap="wrap" gap={2} mb={2}>
                <Text fontWeight="bold">Grades:</Text>
                {selectedGrades.map(grade => (
                  <Badge key={grade} colorScheme="purple" ml={1}>{grade}</Badge>
                ))}
              </Flex>
            )}
            
            {selectedClasses.length > 0 && (
              <Flex wrap="wrap" gap={2} mb={4}>
                <Text fontWeight="bold">Classes:</Text>
                {selectedClasses.map(className => (
                  <Badge key={className} colorScheme="cyan" ml={1}>{className}</Badge>
                ))}
              </Flex>
            )}
            
            <Text mt={4} fontWeight="bold">This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmSendNotice} isLoading={isSending}>
              Send Notice
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NoticeCompose; 