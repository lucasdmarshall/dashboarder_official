import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Text,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FaEdit, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FormBuilder from '../components/FormBuilder';
import FormViewer from '../components/FormViewer';

// API base URL
const API_URL = 'http://localhost:5001/api';

const Forms = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);
  const [error, setError] = useState(null);
  
  const { isOpen: isFormBuilderOpen, onOpen: onFormBuilderOpen, onClose: onFormBuilderClose } = useDisclosure();
  const { isOpen: isFormViewerOpen, onOpen: onFormViewerOpen, onClose: onFormViewerClose } = useDisclosure();
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
  
  const cancelRef = React.useRef();
  const toast = useToast();

  // Check for valid institutionId
  useEffect(() => {
    if (!institutionId) {
      const storedInstitutionId = localStorage.getItem('institutionId');
      if (storedInstitutionId) {
        navigate(`/institution/${storedInstitutionId}/forms`);
      } else {
        setError("Institution ID not found. Please return to the dashboard and try again.");
        setIsLoading(false);
      }
    }
  }, [institutionId, navigate]);

  // Load forms when component mounts
  useEffect(() => {
    if (institutionId) {
      fetchForms();
    }
  }, [institutionId]);

  const fetchForms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      
      const response = await axios.get(`${API_URL}/forms/${institutionId}`, { headers });
      setForms(response.data.forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError("Failed to load forms. Please check your connection and try again.");
      toast({
        title: 'Error',
        description: 'Failed to load forms',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForm = () => {
    setSelectedForm(null); // Clear selected form for create mode
    onFormBuilderOpen();
  };

  const handleEditForm = (form) => {
    setSelectedForm(form);
    onFormBuilderOpen();
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    onFormViewerOpen();
  };

  const handleDeleteConfirm = (form) => {
    setFormToDelete(form);
    onDeleteAlertOpen();
  };

  const handleDeleteForm = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      
      await axios.delete(`${API_URL}/forms/${institutionId}/${formToDelete.id}`, { headers });
      
      // Remove from state
      setForms(forms.filter(f => f.id !== formToDelete.id));
      
      toast({
        title: 'Success',
        description: 'Form deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete form',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      onDeleteAlertClose();
      setFormToDelete(null);
    }
  };

  const handleFormSave = () => {
    // Refresh forms list after save
    fetchForms();
  };

  const getFormTypeBadge = (type) => {
    let color;
    let label;
    
    switch (type) {
      case 'student_application':
        color = 'blue';
        label = 'Student Application';
        break;
      case 'contact':
        color = 'green';
        label = 'Contact Form';
        break;
      case 'feedback':
        color = 'purple';
        label = 'Feedback Form';
        break;
      default:
        color = 'gray';
        label = 'Custom Form';
    }
    
    return <Badge colorScheme={color}>{label}</Badge>;
  };

  return (
    <Container 
      maxW="container.xl" 
      py={6}
      mt="80px" 
      ml={{ base: "250px", md: "260px" }} 
      pr={{ base: 1, md: 3 }}
      pl={{ base: 1, md: 3 }}
    >
      {error ? (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg" color="#640101">Forms Management</Heading>
            <Button 
              leftIcon={<FaPlus />} 
              onClick={handleCreateForm} 
              bg="#640101" 
              color="white"
              _hover={{ bg: "#500101" }}
            >
              Create Form
            </Button>
          </Flex>
          
          {isLoading ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" color="#640101" />
            </Flex>
          ) : forms.length === 0 ? (
            <Box p={6} textAlign="center" bg="gray.50" borderRadius="md">
              <Text fontSize="lg" mb={4}>No forms found</Text>
              <Button 
                leftIcon={<FaPlus />} 
                onClick={handleCreateForm} 
                colorScheme="blue"
              >
                Create Your First Form
              </Button>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" border="1px" borderColor="gray.200" borderRadius="md">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Description</Th>
                    <Th>Created At</Th>
                    <Th width="160px" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {forms.map((form) => (
                    <Tr key={form.id}>
                      <Td fontWeight="medium">{form.name}</Td>
                      <Td>{getFormTypeBadge(form.type)}</Td>
                      <Td>{form.description ? form.description.substring(0, 50) + (form.description.length > 50 ? '...' : '') : '-'}</Td>
                      <Td>{new Date(form.created_at).toLocaleDateString()}</Td>
                      <Td>
                        <Flex justify="center" gap={2}>
                          <IconButton
                            aria-label="View form"
                            icon={<FaEye />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleViewForm(form)}
                          />
                          <IconButton
                            aria-label="Edit form"
                            icon={<FaEdit />}
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleEditForm(form)}
                          />
                          <IconButton
                            aria-label="Delete form"
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteConfirm(form)}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      )}
      
      {/* Form Builder Modal */}
      {institutionId && (
        <FormBuilder
          institutionId={institutionId}
          formId={selectedForm?.id}
          isOpen={isFormBuilderOpen}
          onClose={onFormBuilderClose}
          onSave={handleFormSave}
        />
      )}
      
      {/* Form Viewer Modal */}
      {institutionId && selectedForm && (
        <FormViewer
          institutionId={institutionId}
          formId={selectedForm.id}
          isOpen={isFormViewerOpen}
          onClose={onFormViewerClose}
          isPreviewMode={true}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Form
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the form "{formToDelete?.name}"?
              This action cannot be undone, and all form submissions will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteForm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default Forms; 