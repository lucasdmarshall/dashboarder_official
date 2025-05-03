import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Flex,
  Avatar,
  Input,
  IconButton,
  Container,
  Heading,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image
} from '@chakra-ui/react';
import {
  FaComments,
  FaPaperPlane,
  FaSearch,
  FaSmile,
  FaImage,
  FaFile,
  FaTrash
} from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import InstructorSidebar from '../components/InstructorSidebar';
import useSidebarState from '../hooks/useSidebarState';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Emily Johnson',
    avatar: 'https://bit.ly/dan-abramov',
    lastMessage: 'Can we discuss the upcoming project?',
    messages: [
      { id: 1, sender: 'Emily Johnson', text: 'Hi Professor, can we discuss the upcoming project?', time: '2:30 PM' },
      { id: 2, sender: 'You', text: 'Sure, what specific aspects would you like to discuss?', time: '2:35 PM' }
    ]
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://bit.ly/code-beast',
    lastMessage: 'Grading criteria for the last assignment',
    messages: [
      { id: 1, sender: 'Michael Chen', text: 'Could you clarify the grading criteria for the last assignment?', time: '10:15 AM' }
    ]
  }
];

const InstructorMessages = () => {
  const [activeConversation, setActiveConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const isSidebarCollapsed = useSidebarState();

  const bgColor = '#FFFFFF';
  const textColor = '#000000';
  const accentColor = '#640101';
  const borderColor = '#640101';

  const sendMessage = () => {
    if (newMessage.trim() || uploadedFiles.length > 0) {
      const messageContent = {
        id: activeConversation.messages.length + 1,
        sender: 'You',
        text: newMessage,
        files: uploadedFiles,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };

      activeConversation.messages.push(messageContent);
      setNewMessage('');
      setUploadedFiles([]);
      setShowEmojiPicker(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Flex>
      <InstructorSidebar />
      <Box 
        ml={isSidebarCollapsed ? "60px" : "250px"}
        width={isSidebarCollapsed ? "calc(100% - 60px)" : "calc(100% - 250px)"}
        height="100vh"
        bg={bgColor}
        p={4}
        transition="all 0.3s ease"
      >
        <Container maxW={isSidebarCollapsed ? "container.xl" : "container.lg"} pt={16}>
          <Heading 
            mb={6} 
            color={textColor}
            display="flex" 
            alignItems="center"
          >
            <FaComments style={{ marginRight: '10px', color: accentColor }} /> 
            Dash Chat
          </Heading>

          <Box 
            bg={bgColor} 
            borderRadius="lg" 
            boxShadow="md" 
            border={`1px solid ${borderColor}`}
            height="calc(100vh - 150px)"
            display="flex"
          >
            {/* Conversations List */}
            <VStack 
              width="300px" 
              borderRight={`1px solid ${borderColor}`}
              spacing={4}
              p={4}
              alignItems="stretch"
            >
              <Input 
                placeholder="Search conversations" 
                leftIcon={<FaSearch color={accentColor} />}
                borderColor={borderColor}
                _hover={{ borderColor: accentColor }}
                focusBorderColor={accentColor}
              />
              
              {MOCK_CONVERSATIONS.map(conversation => (
                <HStack
                  key={conversation.id}
                  p={3}
                  spacing={4}
                  cursor="pointer"
                  bg={activeConversation?.id === conversation.id ? `${accentColor}10` : 'transparent'}
                  borderRadius="md"
                  _hover={{ bg: `${accentColor}10` }}
                  onClick={() => setActiveConversation(conversation)}
                  borderBottom={`1px solid ${borderColor}20`}
                >
                  <Avatar src={conversation.avatar} size="md" />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontWeight="bold" color={textColor}>{conversation.name}</Text>
                    <Text 
                      fontSize="sm" 
                      color={textColor}
                      opacity={0.7}
                      isTruncated 
                      maxWidth="200px"
                    >
                      {conversation.lastMessage}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>

            {/* Message Thread */}
            <VStack 
              flex={1} 
              p={4} 
              spacing={4} 
              justifyContent="space-between" 
              height="100%"
            >
              {/* Message Header */}
              <Flex 
                width="full" 
                justifyContent="space-between" 
                alignItems="center" 
                borderBottom={`1px solid ${borderColor}`} 
                pb={4}
              >
                <HStack>
                  <Avatar src={activeConversation.avatar} size="md" />
                  <Text fontWeight="bold" color={textColor}>{activeConversation.name}</Text>
                </HStack>
              </Flex>

              {/* Message Thread */}
              <VStack 
                width="full" 
                height="calc(100% - 250px)" 
                overflowY="auto" 
                spacing={4}
              >
                {activeConversation.messages.map(message => (
                  <Flex 
                    key={message.id} 
                    width="full" 
                    justifyContent={message.sender === 'You' ? 'flex-end' : 'flex-start'}
                  >
                    <Box
                      maxWidth="70%"
                      bg={message.sender === 'You' ? `${accentColor}20` : `${borderColor}10`}
                      color={textColor}
                      p={3}
                      borderRadius="lg"
                      border={`1px solid ${borderColor}`}
                    >
                      <Text>{message.text}</Text>
                      {message.files && message.files.map((file, index) => (
                        file.type.startsWith('image/') ? (
                          <Image 
                            key={index} 
                            src={file.url} 
                            alt={file.name} 
                            maxH="200px" 
                            mt={2} 
                            borderRadius="md" 
                          />
                        ) : (
                          <HStack 
                            key={index} 
                            bg="gray.100" 
                            p={2} 
                            borderRadius="md" 
                            mt={2}
                            spacing={3}
                          >
                            <FaFile />
                            <Text>{file.name}</Text>
                          </HStack>
                        )
                      ))}
                      <Text 
                        fontSize="xs" 
                        color={textColor}
                        opacity={0.7}
                        textAlign="right"
                        mt={1}
                      >
                        {message.time}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <Flex width="full" overflowX="auto" py={2}>
                  {uploadedFiles.map((file, index) => (
                    <Box 
                      key={index} 
                      position="relative" 
                      mr={2}
                    >
                      {file.type.startsWith('image/') ? (
                        <Image 
                          src={file.url} 
                          alt={file.name} 
                          boxSize="100px" 
                          objectFit="cover" 
                          borderRadius="md" 
                        />
                      ) : (
                        <HStack 
                          bg="gray.100" 
                          p={2} 
                          borderRadius="md"
                          spacing={3}
                        >
                          <FaFile />
                          <Text>{file.name}</Text>
                        </HStack>
                      )}
                      <IconButton 
                        icon={<FaTrash />} 
                        size="xs" 
                        position="absolute" 
                        top={0} 
                        right={0} 
                        colorScheme="red"
                        onClick={() => removeFile(index)}
                      />
                    </Box>
                  ))}
                </Flex>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <Box position="absolute" bottom="100px" right="400px">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </Box>
              )}

              {/* Message Input */}
              <Flex width="full" position="relative">
                <Tooltip label="Emoji">
                  <IconButton 
                    icon={<FaSmile />} 
                    variant="ghost"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    mr={2}
                  />
                </Tooltip>
                <Tooltip label="Upload File">
                  <IconButton 
                    icon={<FaImage />} 
                    variant="ghost"
                    onClick={() => fileInputRef.current.click()}
                    mr={2}
                  />
                </Tooltip>
                <Input 
                  flex={1} 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  borderColor={borderColor}
                  _hover={{ borderColor: accentColor }}
                  focusBorderColor={accentColor}
                />
                <IconButton 
                  icon={<FaPaperPlane />} 
                  ml={2} 
                  onClick={sendMessage} 
                  bg={accentColor}
                  color="white"
                  _hover={{ bg: `${accentColor}CC` }}
                />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                />
              </Flex>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Flex>
  );
};

export default InstructorMessages;
