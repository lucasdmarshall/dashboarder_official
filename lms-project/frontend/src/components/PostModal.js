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
  Textarea,
  VStack,
  HStack,
  Text,
  Image,
  Flex,
  Avatar,
  Box,
  useToast
} from '@chakra-ui/react';
import { FaImage, FaVideo, FaSmile } from 'react-icons/fa';

const PostModal = ({ isOpen, onClose, addNewPost }) => {
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const toast = useToast();

  const handleSubmit = () => {
    if (!postContent.trim()) {
      toast({
        title: 'Empty post',
        description: 'Please write something before posting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    // Create new post object
    const newPost = {
      author: 'User Name',
      role: 'Student at Dashboarder University',
      time: 'Just now',
      content: postContent,
      image: previewImage,
      likes: 0,
      comments: 0
    };
    
    // Add the new post to the feed
    addNewPost(newPost);
    
    // Reset form and close modal
    setPostContent('');
    setPreviewImage(null);
    setIsSubmitting(false);
    onClose();
    
    toast({
      title: 'Post created',
      description: 'Your post has been published to the feed.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImageUpload = () => {
    // For demo purposes, we'll just set a random image
    const demoImages = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
    ];
    
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    setPreviewImage(randomImage);
  };

  const handleClose = () => {
    setPostContent('');
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            <Avatar 
              size="sm" 
              mr={2} 
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" 
            />
            <Text>Create a post</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Textarea 
              placeholder="What do you want to talk about?" 
              size="lg" 
              variant="unstyled"
              minH="100px"
              fontSize="xl"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              resize="none"
            />
            
            {previewImage && (
              <Box position="relative">
                <Image 
                  src={previewImage} 
                  alt="Upload preview"
                  borderRadius="md"
                  mb={4}
                />
                <Button 
                  position="absolute" 
                  top="2" 
                  right="2" 
                  size="sm" 
                  colorScheme="red" 
                  borderRadius="full"
                  onClick={() => setPreviewImage(null)}
                >
                  Remove
                </Button>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.200">
          <HStack spacing={4} width="100%">
            <Button 
              leftIcon={<FaImage />} 
              variant="ghost" 
              colorScheme="blue"
              onClick={handleImageUpload}
            >
              Photo
            </Button>
            <Button leftIcon={<FaVideo />} variant="ghost" colorScheme="green">Video</Button>
            <Button leftIcon={<FaSmile />} variant="ghost">Emoji</Button>
            <Flex flex={1} />
            <Button 
              colorScheme="blue" 
              borderRadius="full"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Posting"
              isDisabled={!postContent.trim()}
            >
              Post
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
