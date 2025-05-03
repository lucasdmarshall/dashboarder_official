  Box, 
  Container, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  Select,
  Flex,
  Grid,
  GridItem,
  useToast
} from '@chakra-ui/react';
import { FaFileUpload, FaBook, FaFolderOpen } from 'react-icons/fa';
import InstructorSidebar from '../components/InstructorSidebar';
import ChatButton from '../components/ChatButton';

const CourseMaterialCard = ({ title, type, date }) => (
  <GridItem 
    bg="white" 
    p={4} 
    borderRadius="md" 
    boxShadow="md" 
    borderWidth={1} 
    borderColor="brand.primary"
  >
    <Flex justify="space-between" align="center">
      <HStack>
        <Box as={type === 'Lecture Notes' ? FaBook : FaFolderOpen} color="brand.primary0" />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{title}</Text>
          <Text fontSize="sm" color="brand.primary0">{type}</Text>
        </VStack>
      </HStack>
      <Text fontSize="sm" color="brand.primary">{date}</Text>
          
          
          
      
      <ChatButton />
    </Flex>
  </GridItem>
);

const InstructorCourseMaterials = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [file, setFile] = useState(null);
  const toast = useToast();

  const courses = [
    { id: 1, name: 'Advanced Python Programming' },
    { id: 2, name: 'Web Development Fundamentals' },
    { id: 3, name: 'Data Science Bootcamp' }
  ];

  const materialTypes = [
    'Lecture Notes',
    'Slides',
    'Assignments',
    'Reference Materials'
  ];

  const existingMaterials = [
    { 
      title: 'Python Basics Lecture', 
      type: 'Lecture Notes', 
      date: 'Feb 10, 2025' 
    },
    { 
      title: 'Web Dev Project Guidelines', 
      type: 'Assignments', 
      date: 'Jan 25, 2025' 
    }
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    toast({
      title: "File Selected",
      description: `${uploadedFile.name} is ready to upload`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const submitMaterial = () => {
    if (!selectedCourse || !materialType || !file) {
      toast({
        title: "Upload Failed",
        description: "Please select a course, material type, and file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Upload Successful",
      description: `${file.name} uploaded to ${selectedCourse}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form
    setSelectedCourse('');
    setMaterialType('');
    setFile(null);
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Container maxW="container.xl" ml="250px" mt="85px" pb={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg" color="brand.primary">
            Course Materials
          </Heading>

          {/* Upload Section */}
          <Box bg="white" p={6} borderRadius="md" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Select Course</FormLabel>
                <Select 
                  placeholder="Choose a course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Material Type</FormLabel>
                <Select 
                  placeholder="Select material type"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                >
                  {materialTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Upload File</FormLabel>
                <Input 
                  type="file" 
                  p={1}
                  onChange={handleFileUpload}
                />
              </FormControl>

              <Button 
                leftIcon={<FaFileUpload />} 
                colorScheme="blue" 
                onClick={submitMaterial}
              >
                Upload Material
              </Button>
            </VStack>
          </Box>

          {/* Existing Materials */}
          <Box bg="white" p={6} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4} color="brand.primary">
              Existing Materials
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {existingMaterials.map((material, index) => (
                <CourseMaterialCard 
                  key={index}
                  title={material.title}
                  type={material.type}
                  date={material.date}
                />
              ))}
            </Grid>
          </Box>
        </VStack>
      </Container>
          
          
          
    </Flex>
  );
};

export default InstructorCourseMaterials;
