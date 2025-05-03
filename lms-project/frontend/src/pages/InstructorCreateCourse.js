  import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Icon,
  FormHelperText,
  Image,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  SimpleGrid,
  Container,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaBook, 
  FaPlusCircle, 
  FaCloudUploadAlt,
  FaTrash 
} from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';

const InstructorCreateCourse = () => {
  // Course Details State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseRequirements, setCourseRequirements] = useState([]);
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [coursePrice, setCoursePrice] = useState('');
  const [priceType, setPriceType] = useState('paid');

  // Refs for file input
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Course Categories
  const courseCategories = [
    'Programming',
    'Web Development', 
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Business',
    'Design',
    'Other'
  ];

  // Requirements Handlers
  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setCourseRequirements([...courseRequirements, currentRequirement.trim()]);
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (requirementToRemove) => {
    setCourseRequirements(courseRequirements.filter(req => req !== requirementToRemove));
  };

  // Image Upload Handlers
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPEG, PNG, or GIF image.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Create URL for image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseImage({
          file: file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCourseImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateCourse = () => {
    // Validate form
    if (!courseTitle || !courseDescription || !courseCategory || courseRequirements.length === 0) {
      toast({
        title: "Course Creation Failed",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Price validation
    if (priceType === 'paid') {
      const price = parseFloat(coursePrice);
      if (isNaN(price) || price < 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid positive price for paid courses.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    // Prepare course data
    const newCourse = {
      id: Date.now(), // Temporary unique ID
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      requirements: courseRequirements,
      image: courseImage ? courseImage.preview : 'https://via.placeholder.com/300x200?text=Course+Image',
      price: priceType === 'paid' ? parseFloat(coursePrice).toFixed(2) : '0.00',
      priceType: priceType,
      createdAt: new Date().toLocaleDateString(),
      
      // Add instructor details from localStorage
      instructor: localStorage.getItem('instructorName') || 'Unknown Instructor',
      instructorId: localStorage.getItem('instructorCode') || 'N/A'
    };

    // TODO: In a real app, this would be an API call to save the course
    // For now, we'll use localStorage to simulate persistence
    const existingCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
    const updatedCourses = [...existingCourses, newCourse];
    localStorage.setItem('instructorCourses', JSON.stringify(updatedCourses));

    // Show success toast and navigate to courses page
    toast({
      title: "Course Created Successfully",
      description: `${newCourse.title} has been added to your courses.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Navigate to courses page
    navigate('/instructor-courses');
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="90px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg" color="brand.primary" display="flex" alignItems="center">
            <Box as={FaBook} mr={3} color="brand.primary0" />
            Create New Course
          </Heading>

          <Box bg="white" p={8} borderRadius="md" boxShadow="md">
            <VStack spacing={6} align="stretch">
              {/* Course Image Upload */}
              <FormControl>
                <FormLabel>Course Image</FormLabel>
                <Input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  display="none"
                />
                <Flex 
                  border="2px dashed" 
                  borderColor="brand.primary" 
                  borderRadius="md" 
                  p={4} 
                  justify="center" 
                  align="center" 
                  flexDirection="column"
                >
                  {courseImage ? (
                    <Flex flexDirection="column" align="center">
                      <Image 
                        src={courseImage.preview} 
                        alt="Course Preview" 
                        maxH="200px" 
                        objectFit="cover" 
                        mb={4}
                      />
                      <HStack>
                        <Button 
                          leftIcon={<FaTrash />} 
                          colorScheme="red" 
                          variant="outline"
                          onClick={removeImage}
                        >
                          Remove
                        </Button>
                      </HStack>
                          
          
          
      
          
          
    </Flex>
                  ) : (
                    <VStack>
                      <Icon as={FaCloudUploadAlt} boxSize={12} color="brand.primary" />
                      <Text color="brand.primary0">
                        Click to upload course image (Max 5MB)
                      </Text>
                      <Button 
                        leftIcon={<FaCloudUploadAlt />} 
                        colorScheme="blue" 
                        variant="outline"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Upload Image
                      </Button>
                    </VStack>
                  )}
                      
          
          
    </Flex>
                <FormHelperText>
                  Recommended image size: 1200x630 pixels
                </FormHelperText>
              </FormControl>

              {/* Course Title */}
              <FormControl isRequired>
                <FormLabel>Course Title</FormLabel>
                <Input 
                  placeholder="Enter course title" 
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </FormControl>

              {/* Course Description */}
              <FormControl isRequired>
                <FormLabel>Course Description</FormLabel>
                <Textarea 
                  placeholder="Describe your course" 
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={4}
                />
              </FormControl>

              {/* Course Category */}
              <FormControl isRequired>
                <FormLabel>Course Category</FormLabel>
                <Select 
                  placeholder="Select category"
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                >
                  {courseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Course Price */}
              <FormControl>
                <FormLabel>Course Price</FormLabel>
                <HStack>
                  <Input 
                    type="number" 
                    placeholder="Enter course price" 
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                  />
                  <Select 
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                  >
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                  </Select>
                </HStack>
              </FormControl>

              {/* Course Requirements */}
              <FormControl>
                <FormLabel>Course Requirements</FormLabel>
                <HStack mb={4}>
                  <Input 
                    placeholder="Enter a course requirement" 
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                  />
                  <Button 
                    leftIcon={<FaPlusCircle />} 
                    colorScheme="blue" 
                    onClick={addRequirement}
                  >
                    Add
                  </Button>
                </HStack>
                
                {courseRequirements.length > 0 && (
                  <SimpleGrid columns={2} spacing={2} mt={4}>
                    {courseRequirements.map((requirement, index) => (
                      <Tag 
                        key={index} 
                        size="md" 
                        variant="subtle" 
                        colorScheme="blue"
                      >
                        <TagLabel>{requirement}</TagLabel>
                        <TagCloseButton onClick={() => removeRequirement(requirement)} />
                      </Tag>
                    ))}
                  </SimpleGrid>
                )}
              </FormControl>

              {/* Create Course Button */}
              <Button 
                colorScheme="green" 
                size="lg" 
                mt={4} 
                onClick={handleCreateCourse}
              >
                Create Course
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
          
          
          
    </Flex>
  );
};

export default InstructorCreateCourse;
