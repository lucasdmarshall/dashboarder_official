import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Image,
  Flex,
  Box,
  Textarea
} from '@chakra-ui/react';

const MediaUploadModal = ({ isOpen, onClose, addNewPost }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [postContent, setPostContent] = useState('');
  
  // Demo images for simulation
  const demoImages = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
  ];
  
  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setSelectedImage(randomImage);
      setIsUploading(false);
    }, 1000);
  };
  
  const handlePost = () => {
    if (!selectedImage) return;
    
    // Create new post with the image
    const newPost = {
      author: 'User Name',
      role: 'Student at Dashboarder University',
      time: 'Just now',
      content: postContent,
      image: selectedImage,
      likes: 0,
      comments: 0
    };
    
    // Add the new post to the feed
    if (addNewPost) {
      addNewPost(newPost);
    }
    
    // Reset and close
    setSelectedImage(null);
    setPostContent('');
    onClose();
  };
  
  const handleClose = () => {
    setSelectedImage(null);
    setPostContent('');
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Editor</Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {!selectedImage ? (
            <VStack align="center" spacing={4} py={8}>
              <Image 
                src="/media-upload-illustration.png" 
                fallbackSrc="https://via.placeholder.com/150"
                alt="Upload illustration"
                width="150px"
              />
              <Text fontSize="xl" fontWeight="bold">Select files to begin</Text>
              <Text color="gray.500">Share images or a single video in your post.</Text>
              <Button 
                colorScheme="blue" 
                borderRadius="full" 
                px={8} 
                mt={4}
                onClick={handleUpload}
                isLoading={isUploading}
                loadingText="Uploading"
              >
                Upload from computer
              </Button>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={4}>
              <Textarea
                placeholder="Write something about this image..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                resize="none"
                minH="100px"
                borderRadius="md"
              />
              <Box borderRadius="md" overflow="hidden">
                <Image 
                  src={selectedImage} 
                  alt="Uploaded image"
                  width="100%"
                />
              </Box>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.200">
          <Flex width="100%" justify="flex-end">
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            {selectedImage ? (
              <Button 
                colorScheme="blue" 
                onClick={handlePost}
              >
                Post
              </Button>
            ) : (
              <Button colorScheme="blue" isDisabled>
                Next
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MediaUploadModal;
