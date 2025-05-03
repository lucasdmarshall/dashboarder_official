import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback 
} from 'react';
import { 
  Box, 
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Tooltip,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhoneSlash, 
  FaComments,
  FaHandPaper,
  FaUserGraduate,
  FaExclamationTriangle
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useNavigate, useBeforeUnload } from 'react-router-dom';

const StudentVideoConference = () => {
  const videoRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: isEndCallModalOpen, onOpen: openEndCallModal, onClose: closeEndCallModal } = useDisclosure();

  // Refs for Agora client and tracks
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);

  // Agora configuration
  const APP_ID = 'c69569724b564fb68bb7fd0f47262852';
  const TOKEN = null;
  const CHANNEL = 'student-course-channel';

  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [permissionError, setPermissionError] = useState(null);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Prevent accidental navigation
  useBeforeUnload(
    useCallback((event) => {
      event.preventDefault();
      event.returnValue = '';
    }, [])
  );

  // Prevent browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, document.title, window.location.href);
      openEndCallModal();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // End Call with Confirmation
  const handleEndCall = useCallback(async () => {
    try {
      // Unpublish and close tracks
      if (localTracksRef.current) {
        await clientRef.current.unpublish(localTracksRef.current);
        localTracksRef.current.forEach(track => track.close());
      }
      
      // Leave channel
      await clientRef.current.leave();
      
      toast({
        title: "Call Ended",
        description: "You have left the video conference.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to board room
      navigate('/boardroom');
    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: "Error",
        description: "Failed to end the call properly.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [navigate, toast]);

  // Initialize Agora Client
  const initializeAgoraClient = useCallback(async () => {
    try {
      console.log('Starting Agora Client Initialization');
      
      // Ensure video container exists and create one if it doesn't
      if (!videoRef.current) {
        console.warn('Video container not found, creating a new one');
        const newVideoContainer = document.createElement('div');
        newVideoContainer.id = 'video-container';
        newVideoContainer.style.width = '100%';
        newVideoContainer.style.height = '100%';
        newVideoContainer.style.backgroundColor = 'black';
        
        // Find the parent container and append the new video container
        const parentContainer = document.querySelector('.video-parent-container');
        if (parentContainer) {
          parentContainer.appendChild(newVideoContainer);
          videoRef.current = newVideoContainer;
        } else {
          console.error('Parent container not found');
          setPermissionError('Unable to create video container');
          return;
        }
      }

      // Check microphone permissions before initializing
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (permissionError) {
        console.error('Microphone permission denied:', permissionError);
        setPermissionError('Microphone access is required. Please grant permissions.');
        return;
      }

      // Initialize Agora client
      console.log('Creating Agora Client');
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Set up event listeners
      clientRef.current.on('connection-state-change', (state) => {
        console.log('Agora Connection State:', state);
      });

      clientRef.current.on('error', (err) => {
        console.error('Agora Client Error:', err);
        setPermissionError(`Agora Error: ${err.message}`);
      });

      console.log('Attempting to join channel');
      try {
        await clientRef.current.join(APP_ID, CHANNEL, TOKEN, null);
        console.log('Successfully joined channel');
      } catch (joinError) {
        console.error('Failed to join channel:', joinError);
        setPermissionError(`Failed to join channel: ${joinError.message}`);
        return;
      }
      
      // Create only audio track
      console.log('Creating microphone audio track');
      let audioTrack;
      try {
        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      } catch (audioError) {
        console.error('Failed to create audio track:', audioError);
        setPermissionError(`Audio track error: ${audioError.message}`);
        return;
      }
      
      localTracksRef.current = [audioTrack];
      
      // Publish audio track
      console.log('Publishing audio track');
      try {
        await clientRef.current.publish(localTracksRef.current);
        console.log('Successfully published audio track');
      } catch (publishError) {
        console.error('Failed to publish track:', publishError);
        setPermissionError(`Publish error: ${publishError.message}`);
      }
      
    } catch (error) {
      console.error('Comprehensive Agora initialization error:', error);
      setPermissionError(`Initialization failed: ${error.message}`);
    }
  }, []);

  // Comprehensive error handling in useEffect
  useEffect(() => {
    const initAndHandleErrors = async () => {
      try {
        await initializeAgoraClient();
      } catch (error) {
        console.error('Initialization in useEffect failed:', error);
        setPermissionError(`Unexpected error: ${error.message}`);
      }
    };

    initAndHandleErrors();
    
    // Cleanup on unmount
    return () => {
      try {
        endCall();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, []);

  // Toggle Microphone
  const toggleMicrophone = useCallback(() => {
    if (localTracksRef.current[0]) {
      if (isMicrophoneOn) {
        localTracksRef.current[0].setMuted(true);
      } else {
        localTracksRef.current[0].setMuted(false);
      }
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  }, [isMicrophoneOn]);

  // Raise Hand Feature
  const handleRaiseHand = useCallback(() => {
    const newHandRaisedState = !isHandRaised;
    setIsHandRaised(newHandRaisedState);

    // Notify with a toast
    toast({
      title: newHandRaisedState ? "Hand Raised" : "Hand Lowered",
      description: newHandRaisedState 
        ? "You've raised your hand. The instructor will notice soon." 
        : "You've lowered your hand.",
      status: newHandRaisedState ? "info" : "warning",
      duration: 3000,
      isClosable: true,
      position: "top"
    });

    // TODO: Implement actual hand raise notification to instructor
    console.log(`Hand ${newHandRaisedState ? 'raised' : 'lowered'}`);
  }, [isHandRaised, toast]);

  // End Call
  const endCall = useCallback(async () => {
    try {
      // Unpublish and close tracks
      if (localTracksRef.current) {
        await clientRef.current.unpublish(localTracksRef.current);
        localTracksRef.current.forEach(track => track.close());
      }
      
      // Leave channel
      await clientRef.current.leave();
      
      toast({
        title: "Call Ended",
        description: "You have left the video conference.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      navigate('/boardroom');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, []);

  return (
    <Flex>
      <StudentSidebar />
      
      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative">
        <Flex direction="column" height="100vh">
          {/* Video Container */}
          <Box 
            className="video-parent-container"
            flex="1" 
            bg="black" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            position="relative"
          >
            {permissionError ? (
              <VStack spacing={4} color="white">
                <FaExclamationTriangle size="48px" color="yellow" />
                <Text>{permissionError}</Text>
                <Text>Please check your microphone permissions</Text>
              </VStack>
            ) : (
              <Flex 
                ref={videoRef}
                width="100%" 
                height="100%" 
                bg="black"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <FaUserGraduate size="100px" color="white" />
                <Text color="white" mt={4} textAlign="center">
                  Watching Instructor's Screen
                </Text>
                {/* Placeholder for instructor's screen */}
                <Box 
                  mt={4} 
                  width="80%" 
                  height="60%" 
                  border="2px solid white" 
                  borderRadius="md"
                >
                  <Text color="brand.primary" textAlign="center" mt="50%">
                    Instructor's Screen
                  </Text>
                </Box>
              </Flex>
            )}
          </Box>
          
          {/* Controls */}
          <Flex 
            bg="#640101" 
            color="white" 
            p={4} 
            justifyContent="space-between" 
            alignItems="center"
          >
            <HStack spacing={4}>
              <Tooltip label={isMicrophoneOn ? "Mute" : "Unmute"}>
                <IconButton
                  icon={isMicrophoneOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  onClick={toggleMicrophone}
                  variant="outline"
                  colorScheme="whiteAlpha"
                />
              </Tooltip>
              
              <Tooltip label={isHandRaised ? "Lower Hand" : "Raise Hand"}>
                <Button
                  leftIcon={<FaHandPaper />}
                  colorScheme={isHandRaised ? "yellow" : "whiteAlpha"}
                  variant="outline"
                  onClick={handleRaiseHand}
                >
                  {isHandRaised ? "Hand Raised" : "Raise Hand"}
                </Button>
              </Tooltip>
            </HStack>
            
            <HStack spacing={4}>
              <Button 
                leftIcon={<FaPhoneSlash />} 
                colorScheme="red" 
                onClick={openEndCallModal}
              >
                Leave Class
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>

      {/* End Call Confirmation Modal */}
      <Modal isOpen={isEndCallModalOpen} onClose={closeEndCallModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to leave the class?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeEndCallModal}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleEndCall}>
              Leave Class
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default StudentVideoConference;
