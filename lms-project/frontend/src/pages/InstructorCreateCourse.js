import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const InstructorCreateCourse = () => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Show an error message
    toast({
      title: "Access Denied",
      description: "Instructors cannot create courses. Courses are assigned by administrators.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    
    // Redirect to the instructor courses page
    navigate('/instructor-courses');
  }, [navigate, toast]);

  return null; // Component doesn't render anything
};

export default InstructorCreateCourse;
