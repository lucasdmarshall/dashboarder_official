import React from 'react';
import { Box, Heading, VStack, Text, Container } from '@chakra-ui/react';

const LoveMessage = () => {
  return (
    <Container centerContent height="100vh" display="flex" alignItems="center" justifyContent="center" bg="pink.50">
      <VStack spacing={6} textAlign="center" p={8} bg="white" borderRadius="xl" boxShadow="2xl">
        <Heading 
          size="2xl" 
          bgGradient="linear(to-r, pink.400, red.500)" 
          bgClip="text"
          fontWeight="extrabold"
        >
          I Love You
        </Heading>
        <Heading size="xl" color="pink.600">
          Shun Lae Thant Sinn
        </Heading>
        <Text fontSize="lg" color="gray.600">
          A special message just for you ❤️
        </Text>
      </VStack>
    </Container>
  );
};

export default LoveMessage;
