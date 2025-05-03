  import React, { 
  useState, 
  useEffect, 
  useRef,
  useCallback, 
  useMemo 
} from "react";
import { 
  Box, 
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  ButtonGroup,
  Select,
  Textarea,
  Wrap,
  WrapItem,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  useDisclosure,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Sidebar,
  Container,
  extendTheme,
  ChakraProvider
} from "@chakra-ui/react";

import {
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaPhoneSlash, 
  FaExclamationTriangle,
  FaPencilAlt,
  FaEraser,
  FaTrash,
  FaEdit,
  FaCode,
  FaStickyNote,
  FaSave,
  FaPalette,
  FaCircle,
  FaRulerVertical,
  FaTrashRestore,
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaDesktop,
  FaComments,
  FaPaperPlane,
  FaThumbsUp,
  FaHeart,
  FaHandPeace,
  FaLaugh,
  FaSurprise,
  FaThinkPeaks,
  FaHandPaper,
  FaSmile,
  FaUserGraduate,
  FaCommentDots,
  FaTimes
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import MonacoEditor from 'react-monaco-editor';
import SimplePeer from 'simple-peer';
import AgoraRTC from 'agora-rtc-sdk-ng';

// Enhanced Color Theme for Video Conference
const VIDEO_CONFERENCE_COLORS = {
  // Primary Color Palette
  primary: '#640101',       // Deep Red
  primaryDark: '#4A0000',   // Darker Red
  primaryLight: 'rgba(100, 1, 1, 0.1)',  // Light Red Background

  // Background and Surface Colors
  background: '#F7FAFC',    // Soft light background
  surface: '#FFFFFF',       // Pure white for cards and surfaces

  // Text Colors
  text: {
    primary: '#2D3748',     // Deep gray for primary text
    secondary: '#4A5568',   // Slightly lighter gray for secondary text
    muted: '#718096'        // Muted gray for less important text
  },

  // Accent and Semantic Colors
  accent: {
    success: '#2E8B57',     // Deep green for positive states
    warning: '#D2691E',     // Deep orange for caution
    error: '#8B0000',       // Dark red for errors
    info: '#640101'         // Deep red for informational states
  },

  // Border and Divider Colors
  border: {
    light: 'rgba(100, 1, 1, 0.2)',  // Soft red border
    medium: 'rgba(100, 1, 1, 0.3)'  // Medium red border
  },

  // Shadow and Overlay Colors
  shadow: 'rgba(100, 1, 1, 0.2)',   // Soft red shadow
  overlay: 'rgba(100, 1, 1, 0.05)'  // Subtle red overlay
};

// Enhanced Theme Configuration
const videoConferenceTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: VIDEO_CONFERENCE_COLORS.background,
        color: VIDEO_CONFERENCE_COLORS.text.primary,
        fontFamily: 'Inter, sans-serif'
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          bg: VIDEO_CONFERENCE_COLORS.primaryDark,
          transform: 'scale(1.02)'
        }
      },
      variants: {
        solid: {
          bg: VIDEO_CONFERENCE_COLORS.primary,
          color: 'white',
          _hover: {
            bg: VIDEO_CONFERENCE_COLORS.primaryDark
          }
        },
        outline: {
          borderColor: VIDEO_CONFERENCE_COLORS.primary,
          color: VIDEO_CONFERENCE_COLORS.primary,
          _hover: {
            bg: VIDEO_CONFERENCE_COLORS.primaryLight
          }
        }
      }
    },
    IconButton: {
      baseStyle: {
        bg: VIDEO_CONFERENCE_COLORS.primary,
        color: 'white',
        _hover: {
          bg: VIDEO_CONFERENCE_COLORS.primaryDark,
          transform: 'scale(1.1)'
        }
      }
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: VIDEO_CONFERENCE_COLORS.surface,
          boxShadow: `0 4px 6px ${VIDEO_CONFERENCE_COLORS.shadow}`
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: VIDEO_CONFERENCE_COLORS.surface,
          borderColor: VIDEO_CONFERENCE_COLORS.border.light,
          boxShadow: `0 4px 6px ${VIDEO_CONFERENCE_COLORS.shadow}`
        }
      }
    }
  }
});

const InstructorVideoConference = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const toast = useToast();

  // Refs for Agora client and tracks
  const clientRef = React.useRef(null);
  const localTracksRef = React.useRef([]);

  // Agora configuration
  const APP_ID = 'c69569724b564fb68bb7fd0f47262852';
  const TOKEN = null;
  const CHANNEL = `course-${courseId}`;

  const [isMicrophoneOn, setIsMicrophoneOn] = React.useState(true);
  const [isCameraOn, setIsCameraOn] = React.useState(true);
  const [permissionError, setPermissionError] = React.useState(null);
  const [mediaStream, setMediaStream] = React.useState(null);
  
  // Whiteboard states
  const [isDrawingMode, setIsDrawingMode] = React.useState(false);
  const [tool, setTool] = React.useState('pencil');
  const [penColor, setPenColor] = React.useState('#000000');
  const [eraserColor, setEraserColor] = React.useState('#FFFFFF');
  const [brushRadius, setBrushRadius] = React.useState(2);

  // Drawing state
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [lastPosition, setLastPosition] = React.useState({ x: 0, y: 0 });

  // Color picker state
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  // Pen size picker state
  const [showSizePicker, setShowSizePicker] = React.useState(false);

  // Eraser size picker state
  const [showEraserSizePicker, setShowEraserSizePicker] = React.useState(false);

  // Text editor state
  const [isTextEditorMode, setIsTextEditorMode] = React.useState(false);
  const [textEditorContent, setTextEditorContent] = React.useState('');
  const [textFormat, setTextFormat] = React.useState({
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
    font: 'Arial',
    fontSize: '16px'
  });

  // Code editor state
  const [isCodeEditorMode, setIsCodeEditorMode] = React.useState(false);
  const [codeEditorContent, setCodeEditorContent] = React.useState('');
  const [codeLanguage, setCodeLanguage] = React.useState('python');
  const [editorTheme, setEditorTheme] = React.useState('vs-dark');

  // End call state
  const [isCallEnded, setIsCallEnded] = React.useState(false);

  // Screen share state
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const screenShareRef = React.useRef(null);
  const peerRef = React.useRef(null);

  // Live chat state
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: 'Instructor',
      text: 'Welcome to the live chat! Feel free to ask questions.',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system'
    },
    {
      id: 2,
      sender: 'Student 1',
      text: 'Can you explain the last part of the lecture?',
      timestamp: new Date().toLocaleTimeString(),
      type: 'message'
    },
    {
      id: 3,
      sender: 'Instructor',
      text: 'Sure! Which specific part are you referring to?',
      timestamp: new Date().toLocaleTimeString(),
      type: 'message'
    }
  ]);
  const [newMessage, setNewMessage] = React.useState('');

  // Reaction Button Component
  const ReactionButton = () => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isHandRaised, setIsHandRaised] = React.useState(false);
    const [activeReaction, setActiveReaction] = React.useState(null);

    // Predefined reactions
    const reactions = [
      { icon: FaThumbsUp, name: 'Thumbs Up', color: 'blue' },
      { icon: FaHeart, name: 'Love', color: 'red' },
      { icon: FaHandPeace, name: 'Peace', color: 'green' },
      { icon: FaLaugh, name: 'Laugh', color: 'yellow' },
      { icon: FaSurprise, name: 'Wow', color: 'orange' },
      { icon: FaThinkPeaks, name: 'Thinking', color: 'purple' }
    ];

    const handleReaction = (reaction) => {
      console.log(`Reaction sent: ${reaction.name}`);
      setActiveReaction(reaction);
      setIsPopoverOpen(false);

      // Auto-clear reaction after 3 seconds
      setTimeout(() => {
        setActiveReaction(null);
      }, 3000);
    };

    const toggleHandRaise = () => {
      const newHandRaisedState = !isHandRaised;
      setIsHandRaised(newHandRaisedState);
      
      console.log(`Hand ${newHandRaisedState ? 'raised' : 'lowered'}`);
    };

    return (
      <Box position="relative">
        <Tooltip label="Reactions">
          <IconButton
            icon={isHandRaised ? <FaHandPaper /> : (activeReaction ? <activeReaction.icon /> : <FaSmile />)}
            colorScheme={isHandRaised ? "yellow" : (activeReaction ? activeReaction.color : "purple")}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            size="lg"
            borderRadius="full"
            aria-label="Reactions and Hand Raise"
          />
        </Tooltip>

        {isPopoverOpen && (
          <Box 
            position="absolute" 
            bottom="100%" 
            left="50%" 
            transform="translateX(-50%)"
            bg="white" 
            boxShadow="md" 
            borderRadius="md" 
            p={4}
            zIndex={10}
          >
            <VStack spacing={4}>
              {/* Hand Raise Section */}
              <Button 
                leftIcon={<FaHandPaper />}
                colorScheme={isHandRaised ? "green" : "gray"}
                onClick={toggleHandRaise}
                width="100%"
              >
                {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
              </Button>

              {/* Reactions Grid */}
              <Wrap spacing={2} justify="center">
                {reactions.map((reaction) => (
                  <WrapItem key={reaction.name}>
                    <Tooltip label={reaction.name}>
                      <IconButton
                        icon={<reaction.icon />}
                        onClick={() => handleReaction(reaction)}
                        colorScheme={reaction.color}
                        variant="outline"
                        aria-label={reaction.name}
                      />
                    </Tooltip>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          </Box>
        )}
      </Box>
    );
  };

  // Attendance Button Component
  const AttendanceButton = () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [students, setStudents] = React.useState([
      { id: 1, name: 'Alice Johnson', present: false },
      { id: 2, name: 'Bob Smith', present: false },
      { id: 3, name: 'Charlie Brown', present: false },
      { id: 4, name: 'Diana Prince', present: false },
      { id: 5, name: 'Ethan Hunt', present: false }
    ]);

    const openModal = () => {
      setIsModalVisible(true);
    };

    const closeModal = () => {
      setIsModalVisible(false);
    };

    const toggleStudentPresence = (studentId) => {
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === studentId 
            ? { ...student, present: !student.present } 
            : student
        )
      );
    };

    const submitAttendance = () => {
      const presentStudents = students.filter(student => student.present);
      console.log('Attendance submitted:', 
        presentStudents.map(student => student.name)
      );
      closeModal();
    };

    return (
      <>
        <IconButton
          icon={<FaUserGraduate />}
          colorScheme="green"
          onClick={openModal}
          size="md"
          borderRadius="full"
          aria-label="Open Attendance"
        />

        {isModalVisible && (
          <Box 
            position="fixed" 
            top="0" 
            left="0" 
            width="100%" 
            height="100%" 
            bg="rgba(0,0,0,0.5)" 
            zIndex={9999} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Box 
              bg="white" 
              width="90%" 
              maxWidth="600px" 
              maxHeight="80%" 
              borderRadius="xl" 
              p={4} 
              position="relative"
            >
              <Box 
                position="absolute" 
                top={2} 
                right={2} 
                cursor="pointer"
                onClick={closeModal}
              >
                ✖️
              </Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Student Attendance
              </Text>
              <VStack spacing={4} align="stretch" maxHeight="400px" overflowY="auto">
                {students.map((student) => (
                  <Flex 
                    key={student.id} 
                    justifyContent="space-between" 
                    alignItems="center"
                    bg={student.present ? "brand.primary" : "brand.primary"}
                    p={3}
                    borderRadius="md"
                  >
                    <Text>{student.name}</Text>
                    <Checkbox
                      isChecked={student.present}
                      onChange={() => toggleStudentPresence(student.id)}
                      colorScheme="green"
                    />
                        
          
          
      
      <ChatButton />
    </Flex>
                ))}
              </VStack>
              <Flex mt={4} justifyContent="flex-end">
                <Button 
                  colorScheme="blue" 
                  mr={3} 
                  onClick={submitAttendance}
                >
                  Submit Attendance
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                    
          
          
    </Flex>
            </Box>
          </Box>
        )}
      </>
    );
  };

  // Chat Button Component
  const ChatButton = () => {
    const [isChatOpen, setIsChatOpen] = React.useState(false);

    return (
      <IconButton
        icon={<FaCommentDots />}
        colorScheme="blue"
        onClick={() => setIsChatOpen(!isChatOpen)}
        size="md"
        borderRadius="full"
        aria-label="Open Chat"
      />
    );
  };

  // Live Chat Component
  const LiveChatButton = () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [messages, setMessages] = React.useState([
      {
        id: 1,
        sender: 'System',
        text: 'Welcome to the live chat support!',
        timestamp: '14:30',
        type: 'system'
      },
      {
        id: 2,
        sender: 'Student Alex',
        text: 'I have a question about the recent lecture.',
        timestamp: '14:35',
        type: 'message'
      }
    ]);
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = React.useRef(null);

    const openModal = () => {
      setIsModalVisible(true);
    };

    const closeModal = () => {
      setIsModalVisible(false);
    };

    const sendMessage = () => {
      if (newMessage.trim() === '') return;

      const messageToSend = {
        id: messages.length + 1,
        sender: 'Instructor',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: 'message'
      };

      setMessages([...messages, messageToSend]);
      setNewMessage('');
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages]);

    return (
      <>
        <IconButton
          icon={<FaComments />}
          colorScheme="purple"
          onClick={openModal}
          size="md"
          borderRadius="full"
          aria-label="Open Live Chat"
        />

        {isModalVisible && (
          <Box 
            position="fixed" 
            top="0" 
            left="0" 
            width="100%" 
            height="100%" 
            bg="rgba(0,0,0,0.5)" 
            zIndex={9999} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Box 
              bg="white" 
              width="90%" 
              maxWidth="600px" 
              maxHeight="80%" 
              borderRadius="xl" 
              p={4} 
              position="relative"
            >
              <Box 
                position="absolute" 
                top={2} 
                right={2} 
                cursor="pointer"
                onClick={closeModal}
              >
                ✖️
              </Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Live Chat
              </Text>
              <Box 
                overflowY="auto" 
                height="400px" 
                borderWidth="1px" 
                borderRadius="md" 
                p={3}
              >
                {messages.map((msg) => (
                  <Flex 
                    key={msg.id} 
                    justifyContent={msg.sender === 'Instructor' ? 'flex-end' : 'flex-start'}
                    mb={2}
                  >
                    <Box
                      maxWidth="80%"
                      bg={
                        msg.sender === 'Instructor' ? 'brand.primary' : 
                        msg.sender === 'System' ? 'brand.primary' : 
                        'brand.primary'
                      }
                      p={2}
                      borderRadius="md"
                    >
                      <Text fontWeight="bold" fontSize="xs">{msg.sender}</Text>
                      <Text>{msg.text}</Text>
                      <Text fontSize="xs" color="brand.primary0" textAlign="right">
                        {msg.timestamp}
                      </Text>
                    </Box>
                  </Flex>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              <HStack mt={4}>
                <Input 
                  placeholder="Type your message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <IconButton 
                  icon={<FaPaperPlane />} 
                  colorScheme="blue" 
                  onClick={sendMessage}
                />
              </HStack>
            </Box>
          </Box>
        )}
       </>
     );
   };

  // Screen Share Button Component
  const ScreenShareButton = () => {
    const [isScreenSharing, setIsScreenSharing] = React.useState(false);

    const toggleScreenShare = async () => {
      try {
        // If not currently sharing, start screen share
        if (!isScreenSharing) {
          // Request screen share
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
          });

          // Create a new peer
          peerRef.current = new SimplePeer({
            initiator: true,
            stream: stream,
            onStream: (stream) => {
              // Set the stream to video element
              if (screenShareRef.current) {
                screenShareRef.current.srcObject = stream;
              }
            },
            onSignal: (signal) => {
              // Handle signal
              console.log('Signal:', signal);
            }
          });

          setIsScreenSharing(true);

          // Show success toast
          toast({
            title: "Screen Sharing",
            description: "Screen sharing started",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } 
        // If already sharing, stop screen share
        else {
          // Destroy the peer
          peerRef.current.destroy();

          setIsScreenSharing(false);

          // Show stop toast
          toast({
            title: "Screen Sharing Stopped",
            description: "You have stopped sharing your screen",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Screen share error:', error);
        
        // Error handling
        toast({
          title: "Screen Share Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        setIsScreenSharing(false);
      }
    };

    return (
      <IconButton
        icon={<FaDesktop color={isScreenSharing ? "red" : "blue"} />}
        colorScheme={isScreenSharing ? "red" : "blue"}
        onClick={toggleScreenShare}
        size="md"
        borderRadius="full"
      />
    );
  };

  // Note Button Component
  const NoteButton = () => {
    return (
      <Tooltip label="Notes" placement="right">
        <Box position="relative">
          <IconButton
            icon={<FaStickyNote />}
            colorScheme={isDrawingMode ? "blue" : "gray"}
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              setShowColorPicker(false);
              setShowSizePicker(false);
              setShowEraserSizePicker(false);
            }}
            size="md"
            borderRadius="full"
          />
          {isDrawingMode && (
            <Flex 
              position="absolute" 
              left="100%" 
              top="0" 
              ml={2} 
              direction="column" 
              bg="white" 
              boxShadow="md" 
              borderRadius="md" 
              p={2} 
              zIndex={1000}
            >
              {/* Pen Tools */}
              <Tooltip label="Pencil">
                <IconButton
                  icon={<FaPencilAlt />}
                  onClick={() => setTool('pencil')}
                  variant={tool === 'pencil' ? 'solid' : 'ghost'}
                  colorScheme="blue"
                  size="sm"
                  mb={2}
                />
              </Tooltip>

              <Tooltip label="Eraser">
                <IconButton
                  icon={<FaEraser />}
                  onClick={() => setTool('eraser')}
                  variant={tool === 'eraser' ? 'solid' : 'ghost'}
                  colorScheme="red"
                  size="sm"
                  mb={2}
                />
              </Tooltip>

              {/* Color Picker */}
              <Tooltip label="Pen Color">
                <IconButton
                  icon={<FaPalette />}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  variant={showColorPicker ? 'solid' : 'ghost'}
                  colorScheme="purple"
                  size="sm"
                  mb={2}
                />
              </Tooltip>

              {showColorPicker && (
                <Input 
                  type="color" 
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  size="sm"
                  mb={2}
                />
              )}

              {/* Brush Size */}
              <Tooltip label="Brush Size">
                <IconButton
                  icon={<FaRulerVertical />}
                  onClick={() => setShowSizePicker(!showSizePicker)}
                  variant={showSizePicker ? 'solid' : 'ghost'}
                  colorScheme="green"
                  size="sm"
                  mb={2}
                />
              </Tooltip>

              {showSizePicker && (
                <Slider 
                  defaultValue={brushRadius} 
                  min={1} 
                  max={20} 
                  onChange={(val) => setBrushRadius(val)}
                  mb={2}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              )}

              {/* Eraser Size */}
              <Tooltip label="Eraser Size">
                <IconButton
                  icon={<FaTrashRestore />}
                  onClick={() => setShowEraserSizePicker(!showEraserSizePicker)}
                  variant={showEraserSizePicker ? 'solid' : 'ghost'}
                  colorScheme="orange"
                  size="sm"
                  mb={2}
                />
              </Tooltip>

              {showEraserSizePicker && (
                <Slider 
                  defaultValue={brushRadius} 
                  min={1} 
                  max={20} 
                  onChange={(val) => setBrushRadius(val)}
                  mb={2}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              )}
                  
          
          
    </Flex>
          )}
        </Box>
      </Tooltip>
    );
  };

  // Initialize Agora client
  React.useEffect(() => {
    // Create client
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const initializeClient = async () => {
      try {
        // Join channel
        await client.join(APP_ID, CHANNEL, TOKEN);

        // Create and publish local tracks
        const [audioTrack, videoTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack(),
          AgoraRTC.createCameraVideoTrack()
        ]);

        // Store local tracks
        localTracksRef.current = [audioTrack, videoTrack];

        // Publish tracks
        await client.publish(localTracksRef.current);

      } catch (error) {
        console.error('Agora initialization error:', error);
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to video conference",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    initializeClient();

    // Cleanup
    return () => {
      // Unpublish and close tracks
      if (localTracksRef.current.length > 0) {
        localTracksRef.current.forEach(track => track.close());
      }

      // Leave channel
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, [CHANNEL]);

  // Screen share handler
  const toggleScreenShare = React.useCallback(async () => {
    try {
      // If not currently sharing, start screen share
      if (!isScreenSharing) {
        // Request screen share
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });

        // Create a new peer
        peerRef.current = new SimplePeer({
          initiator: true,
          stream: stream,
          onStream: (stream) => {
            // Set the stream to video element
            if (screenShareRef.current) {
              screenShareRef.current.srcObject = stream;
            }
          },
          onSignal: (signal) => {
            // Handle signal
            console.log('Signal:', signal);
          }
        });

        setIsScreenSharing(true);

        // Show success toast
        toast({
          title: "Screen Sharing",
          description: "Screen sharing started",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } 
      // If already sharing, stop screen share
      else {
        // Destroy the peer
        peerRef.current.destroy();

        setIsScreenSharing(false);

        // Show stop toast
        toast({
          title: "Screen Sharing Stopped",
          description: "You have stopped sharing your screen",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Screen share error:', error);
      
      // Error handling
      toast({
        title: "Screen Share Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setIsScreenSharing(false);
    }
  }, [isScreenSharing, toast]);

  // Screen share preview
  const renderScreenShare = () => {
    if (!isScreenSharing) return null;

    return (
      <Box 
        position="fixed" 
        bottom="20px" 
        right="20px" 
        width="300px" 
        height="200px" 
        zIndex={1000} 
        borderRadius="md" 
        overflow="hidden"
        boxShadow="lg"
        bg="black"
      >
        <video
          ref={screenShareRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: 'white'
          }}
        />
        <Button 
          position="absolute"
          bottom="10px"
          left="50%"
          transform="translateX(-50%)"
          colorScheme="red"
          size="sm"
          onClick={toggleScreenShare}
        >
          Stop Sharing
        </Button>
      </Box>
    );
  };

  // Font options
  const fontOptions = [
    'Arial', 
    'Times New Roman', 
    'Courier New', 
    'Verdana', 
    'Georgia', 
    'Palatino Linotype', 
    'Lucida Console'
  ];

  const fontSizes = [
    '12px', 
    '14px', 
    '16px', 
    '18px', 
    '20px', 
    '24px', 
    '28px', 
    '36px'
  ];

  // Code language options
  const codeLanguages = [
    'python', 
    'javascript', 
    'typescript', 
    'java', 
    'cpp', 
    'csharp',
    'ruby', 
    'go', 
    'rust', 
    'swift', 
    'kotlin', 
    'scala', 
    'php', 
    'r', 
    'dart', 
    'haskell', 
    'lua', 
    'perl', 
    'shell', 
    'sql'
  ];

  // Background and text colors
  const bgColor = useColorModeValue('white', 'gray.900');
  const controlBgColor = useColorModeValue('brand.primary', 'brand.primary');
  const sidebarBgColor = useColorModeValue('brand.primary', 'brand.primary');

  // Media stream setup
  const setupMediaStream = React.useCallback(async () => {
    try {
      // Check if media devices are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      // Request permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setMediaStream(stream);

    } catch (error) {
      console.error('Media access error:', error);
      
      // Detailed error handling
      let errorMessage = 'Unable to access camera or microphone.';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permission denied. Please allow camera and microphone access.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found on this device.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Unable to find suitable camera or microphone settings.';
      }

      setPermissionError(errorMessage);
      
      toast({
        title: "Media Access Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Toggle camera on/off
  const toggleCamera = React.useCallback(() => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      
      if (isCameraOn) {
        // Turn camera off
        videoTracks.forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
      } else {
        // Turn camera back on
        setupMediaStream();
        setIsCameraOn(true);
      }
    }
  }, [mediaStream, isCameraOn, setupMediaStream]);

  // Initial media stream setup
  React.useEffect(() => {
    setupMediaStream();
    
    return () => {
      // Cleanup media stream on component unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupMediaStream]);

  // Precise drawing handler
  const handleDrawing = React.useCallback((e) => {
    if (!isDrawingMode || !isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Get precise mouse/touch position
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    // Configure drawing context with high precision
    ctx.lineWidth = tool === 'eraser' ? brushRadius * 4 : brushRadius;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Set drawing mode
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
    }

    // Precise line drawing
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Update last position
    setLastPosition({ x: currentX, y: currentY });
  }, [isDrawingMode, isDrawing, tool, brushRadius, penColor, lastPosition]);

  // Precise start drawing
  const startDrawing = React.useCallback((e) => {
    if (!isDrawingMode) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const startX = (e.clientX - rect.left) * scaleX;
    const startY = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setLastPosition({ x: startX, y: startY });
  }, [isDrawingMode]);

  // Precise stop drawing
  const stopDrawing = React.useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Effect to set up event listeners with precise tracking
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawingMode) return;

    // Precise mouse events
    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      handleDrawing(e);
    };

    // Precise touch events
    const handleTouchMove = (e) => {
      if (!isDrawing) return;
      const touch = e.touches[0];
      handleDrawing(touch);
      e.preventDefault(); // Prevent scrolling
    };

    // Add precise event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events with high precision
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      const mouseEvent = new MouseEvent('mouseup');
      canvas.dispatchEvent(mouseEvent);
      e.preventDefault();
    }, { passive: false });

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', () => {});
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', () => {});
    };
  }, [isDrawingMode, startDrawing, handleDrawing, stopDrawing, isDrawing]);

  // Initialize canvas when drawing mode changes
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size to full window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60; // Subtract control height

    // Set white background when entering drawing mode
    if (isDrawingMode) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isDrawingMode]);

  // Clear canvas function
  const clearCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Monaco Editor options
  const editorDidMount = (editor, monaco) => {
    editor.focus();
  };

  const handleEditorChange = (value) => {
    setCodeEditorContent(value);
  };

  // End call handler
  const handleEndCall = React.useCallback(() => {
    // Attempt to stop media devices completely
    const stopMediaDevices = async () => {
      try {
        // Get all media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        // Stop all active streams
        const streams = document.querySelectorAll('video');
        streams.forEach(stream => {
          const mediaStream = stream.srcObject;
          if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
          }
          stream.srcObject = null;
        });

        // Revoke media access
        devices.forEach(device => {
          if (device.kind === 'videoinput' || device.kind === 'audioinput') {
            navigator.mediaDevices.getUserMedia({
              video: device.kind === 'videoinput',
              audio: device.kind === 'audioinput'
            }).then(stream => {
              stream.getTracks().forEach(track => track.stop());
            });
          }
        });
      } catch (error) {
        console.error('Error stopping media devices:', error);
      }
    };

    // Stop media devices
    stopMediaDevices();

    // Reset all media-related states
    setMediaStream(null);
    setIsCameraOn(false);
    setIsMicrophoneOn(false);

    // Set call ended state
    setIsCallEnded(true);

    // Redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/instructor-courses');
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(redirectTimer);
      stopMediaDevices();
    };
  }, [navigate]);

  // Additional cleanup effect
  React.useEffect(() => {
    return () => {
      // Ensure media devices are stopped when component unmounts
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  if (isCallEnded) {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        bg="rgba(0,0,0,0.7)"
        color="white"
        zIndex={9999}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box 
          textAlign="center" 
          bg="white" 
          color="black" 
          p={8} 
          borderRadius="lg" 
          boxShadow="xl"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Your Meeting Has Ended
          </Text>
          <Text fontSize="md" color="brand.primary" mb={4}>
            You will be redirected to your courses shortly...
          </Text>
          <Text fontSize="sm" color="brand.primary0" fontWeight="bold">
            Please refresh the page to prevent battery drain
          </Text>
        </Box>
            
          
          
    </Flex>
    );
  }

  return (
    <ChakraProvider theme={videoConferenceTheme}>
      <Flex 
        direction="column" 
        bg={VIDEO_CONFERENCE_COLORS.background} 
        height="100vh" 
        width="100vw"
        position="fixed"
        top="0"
        left="0"
        zIndex="9999"
      >
        {permissionError ? (
          <Flex 
            direction="column" 
            justify="center" 
            align="center" 
            height="full" 
            textAlign="center" 
            p={6}
          >
            <Box color="brand.primary0" fontSize="6xl" mb={4}>
              <FaExclamationTriangle />
            </Box>
            <Text color="white" fontSize="2xl" mb={4}>
              {permissionError}
            </Text>
            <Button 
              colorScheme="red" 
              onClick={() => navigate('/instructor-courses')}
            >
              Return to Courses
            </Button>
              
          
          
    </Flex>
        ) : (
          <Flex 
            direction="column" 
            height="100%"
            position="relative"
          >
            {/* Whiteboard Canvas */}
            {isTextEditorMode || isCodeEditorMode ? (
              isTextEditorMode ? (
                <Box 
                  position="absolute" 
                  top="0" 
                  left="0" 
                  width="100%" 
                  height="100%" 
                  zIndex={20} 
                  bg="white" 
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={4}
                >
                  <Box 
                    width="80%" 
                    height="80%" 
                    bg="white" 
                    boxShadow="lg" 
                    borderRadius="md"
                    border="1px solid #E2E8F0"
                  >
                    {/* Text Editor Toolbar */}
                    <Flex 
                      width="100%" 
                      bg="brand.primary" 
                      p={2} 
                      alignItems="center" 
                      borderTopLeftRadius="md" 
                      borderTopRightRadius="md"
                    >
                      {/* Font Family Selector */}
                      <Select
                        size="sm"
                        width="150px"
                        mr={2}
                        value={textFormat.font}
                        onChange={(e) => setTextFormat(prev => ({...prev, font: e.target.value}))}
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </Select>

                      {/* Font Size Selector */}
                      <Select
                        size="sm"
                        width="100px"
                        mr={4}
                        value={textFormat.fontSize}
                        onChange={(e) => setTextFormat(prev => ({...prev, fontSize: e.target.value}))}
                      >
                        {fontSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </Select>

                      {/* Font Styling */}
                      <ButtonGroup mr={4} isAttached variant="outline" size="sm">
                        <Tooltip label="Bold">
                          <IconButton
                            icon={<FaBold />}
                            isActive={textFormat.bold}
                            onClick={() => setTextFormat(prev => ({...prev, bold: !prev.bold}))}
                          />
                        </Tooltip>
                        <Tooltip label="Italic">
                          <IconButton
                            icon={<FaItalic />}
                            isActive={textFormat.italic}
                            onClick={() => setTextFormat(prev => ({...prev, italic: !prev.italic}))}
                          />
                        </Tooltip>
                        <Tooltip label="Underline">
                          <IconButton
                            icon={<FaUnderline />}
                            isActive={textFormat.underline}
                            onClick={() => setTextFormat(prev => ({...prev, underline: !prev.underline}))}
                          />
                        </Tooltip>
                      </ButtonGroup>

                      {/* Text Alignment */}
                      <ButtonGroup mr={4} isAttached variant="outline" size="sm">
                        <Tooltip label="Align Left">
                          <IconButton
                            icon={<FaAlignLeft />}
                            isActive={textFormat.alignment === 'left'}
                            onClick={() => setTextFormat(prev => ({...prev, alignment: 'left'}))}
                          />
                        </Tooltip>
                        <Tooltip label="Align Center">
                          <IconButton
                            icon={<FaAlignCenter />}
                            isActive={textFormat.alignment === 'center'}
                            onClick={() => setTextFormat(prev => ({...prev, alignment: 'center'}))}
                          />
                        </Tooltip>
                        <Tooltip label="Align Right">
                          <IconButton
                            icon={<FaAlignRight />}
                            isActive={textFormat.alignment === 'right'}
                            onClick={() => setTextFormat(prev => ({...prev, alignment: 'right'}))}
                          />
                        </Tooltip>
                      </ButtonGroup>

                      {/* Save Button */}
                      <Tooltip label="Save Notes">
                        <IconButton
                          icon={<FaSave />}
                          colorScheme="green"
                          size="sm"
                          ml="auto"
                          onClick={() => {
                            // TODO: Implement save functionality
                            console.log('Saving notes:', textEditorContent);
                          }}
                        />
                      </Tooltip>
                        
          
          
    </Flex>

                    {/* Text Area */}
                    <Textarea
                      width="100%"
                      height="calc(100% - 50px)"
                      placeholder="Start typing your notes here..."
                      resize="none"
                      value={textEditorContent}
                      onChange={(e) => setTextEditorContent(e.target.value)}
                      fontFamily={textFormat.font}
                      fontSize={textFormat.fontSize}
                      fontWeight={textFormat.bold ? 'bold' : 'normal'}
                      fontStyle={textFormat.italic ? 'italic' : 'normal'}
                      textDecoration={textFormat.underline ? 'underline' : 'none'}
                      textAlign={textFormat.alignment}
                      border="1px solid #E2E8F0"
                      borderRadius="md"
                      p={2}
                      outline="none"
                      _focus={{
                        boxShadow: 'none',
                        borderColor: 'brand.primary0'
                      }}
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    />
                  </Box>
                </Box>
              ) : (
                <Box 
                  position="absolute" 
                  top="0" 
                  left="0" 
                  width="100%" 
                  height="100%" 
                  zIndex={20} 
                  bg="white" 
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={4}
                >
                  <Box 
                    width="80%" 
                    height="80%" 
                    bg="white" 
                    boxShadow="lg" 
                    borderRadius="md"
                    border="1px solid #E2E8F0"
                  >
                    {/* Code Editor Toolbar */}
                    <Flex 
                      width="100%" 
                      bg="brand.primary" 
                      p={2} 
                      alignItems="center" 
                      borderTopLeftRadius="md" 
                      borderTopRightRadius="md"
                      height="50px"
                    >
                      {/* Language Selector */}
                      <Select
                        size="sm"
                        width="150px"
                        mr={4}
                        value={codeLanguage}
                        onChange={(e) => setCodeLanguage(e.target.value)}
                      >
                        {codeLanguages.map(lang => (
                          <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                        ))}
                      </Select>

                      {/* Theme Selector */}
                      <Select
                        size="sm"
                        width="150px"
                        mr={4}
                        placeholder="Select Theme"
                        value={editorTheme}
                        onChange={(e) => setEditorTheme(e.target.value)}
                      >
                        <option value="vs-dark">VS Dark</option>
                        <option value="vs-light">VS Light</option>
                        <option value="hc-black">High Contrast</option>
                      </Select>

                      {/* Save Button */}
                      <Tooltip label="Save Code">
                        <IconButton
                          icon={<FaSave />}
                          colorScheme="green"
                          size="sm"
                          ml="auto"
                          onClick={() => {
                            // TODO: Implement save functionality
                            console.log('Saving code:', codeEditorContent);
                          }}
                        />
                      </Tooltip>
                        
          
          
    </Flex>

                    {/* Code Editor */}
                    <Box 
                      width="100%" 
                      height="calc(100% - 50px)" 
                      border="none"
                    >
                      <MonacoEditor
                        width="100%"
                        height="100%"
                        language={codeLanguage}
                        theme={editorTheme}
                        value={codeEditorContent}
                        options={{
                          selectOnLineNumbers: true,
                          roundedSelection: false,
                          readOnly: false,
                          cursorStyle: 'line',
                          automaticLayout: true,
                          lineNumbers: 'on',
                          glyphMargin: true,
                          folding: true,
                          lineNumbersMinChars: 3,
                          minimap: { enabled: false },
                          scrollbar: {
                            vertical: 'auto',
                            horizontal: 'auto',
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10
                          },
                          padding: {
                            top: 10,
                            bottom: 10
                          }
                        }}
                        onChange={handleEditorChange}
                        editorDidMount={editorDidMount}
                      />
                    </Box>
                  </Box>
                </Box>
              )
            ) : (
              <canvas 
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: isDrawingMode ? 10 : 1,
                  backgroundColor: 'white',
                  pointerEvents: isDrawingMode ? 'auto' : 'none',
                  opacity: isDrawingMode ? 1 : 0.5,
                  cursor: isDrawingMode 
                    ? (tool === 'pencil' 
                      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(penColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'/%3E%3C/svg%3E") 0 24, auto`
                      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E") 12 12, auto`)
                    : 'default'
                }}
              />
            )}

            {/* Small Video Feed */}
            <Box 
              position="absolute" 
              top={4} 
              right={4} 
              width="250px" 
              height="180px" 
              zIndex={20}
              boxShadow="lg"
              borderRadius="md"
              overflow="hidden"
            >
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                style={{
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transform: 'scaleX(-1)', // Flip video horizontally
                  backgroundColor: 'black'
                }}
              />
            </Box>

            {/* Sidebar Buttons */}
            <HStack 
              position="absolute" 
              top={4} 
              left={4} 
              spacing={4}
              bg={VIDEO_CONFERENCE_COLORS.surface}
              p={2}
              borderRadius="md"
              boxShadow="md"
              zIndex={20}
            >
              <NoteButton />
              <Tooltip label="Text Editor" placement="right">
                <IconButton
                  icon={isTextEditorMode ? <FaPencilAlt /> : <FaEdit />}
                  colorScheme={isTextEditorMode ? "green" : "gray"}
                  size="md"
                  borderRadius="full"
                  onClick={() => setIsTextEditorMode(!isTextEditorMode)}
                />
              </Tooltip>
              <Tooltip label="Code Editor" placement="right">
                <IconButton
                  icon={isCodeEditorMode ? <FaCode /> : <FaCode />}
                  colorScheme={isCodeEditorMode ? "green" : "gray"}
                  size="md"
                  borderRadius="full"
                  onClick={() => setIsCodeEditorMode(!isCodeEditorMode)}
                />
              </Tooltip>
              <ScreenShareButton />
            </HStack>

            {/* Screen Share Preview */}
            {renderScreenShare()}

            {/* Bottom Controls */}
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              bg={VIDEO_CONFERENCE_COLORS.surface}
              py={2}
              px={4}
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              zIndex="20"
            >
              <HStack spacing={4}>
                <Tooltip label={isMicrophoneOn ? "Mute" : "Unmute"}>
                  <IconButton
                    icon={isMicrophoneOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                    colorScheme={isMicrophoneOn ? "green" : "red"}
                    onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}
                    size="lg"
                    borderRadius="full"
                    isDisabled={!!permissionError}
                  />
                </Tooltip>

                <Tooltip label={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}>
                  <IconButton
                    icon={isCameraOn ? <FaVideo /> : <FaVideoSlash />}
                    colorScheme={isCameraOn ? "green" : "red"}
                    onClick={toggleCamera}
                    size="lg"
                    borderRadius="full"
                    isDisabled={!!permissionError}
                  />
                </Tooltip>

                {/* End Call */}
                <Tooltip label="End Call">
                  <IconButton
                    icon={<FaPhoneSlash />}
                    colorScheme="red"
                    onClick={handleEndCall}
                    size="lg"
                    borderRadius="full"
                  />
                </Tooltip>
              </HStack>

              <HStack spacing={4}>
                {/* Reaction Button */}
                <ReactionButton />
                
                {/* Attendance Button */}
                <AttendanceButton />
                
                {/* Live Chat Button */}
                <LiveChatButton />
              </HStack>
                
          
          
    </Flex>
              
          
          
    </Flex>
      )}
          
          
          
    </Flex>
    </ChakraProvider>
  );
};

export default InstructorVideoConference;
