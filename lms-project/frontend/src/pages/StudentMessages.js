import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Input, 
  Button, 
  IconButton,
  Divider,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Stack,
  Wrap,
  WrapItem,
  Tag
} from '@chakra-ui/react';
import { 
  FaSmile,
  FaImage,
  FaTrash,
  FaPaperPlane,
  FaSearch,
  FaEllipsisV,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaBriefcase
} from 'react-icons/fa';
import StudentSidebar from '../components/StudentSidebar';
import EmojiPicker from 'emoji-picker-react';

const contacts = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    avatar: 'https://bit.ly/dan-abramov',
    lastSeen: 'Online',
    email: 'elena.rodriguez@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    specialization: 'Machine Learning',
    bio: 'Passionate researcher and educator with 10+ years of experience in AI and machine learning.',
    messages: [
      { id: 1, text: 'Hey, how are you doing?', sender: 'Elena', time: '10:30 AM' },
      { id: 2, text: 'I\'m good, thanks! How about you?', sender: 'You', time: '10:31 AM' },
      { id: 3, text: 'Working on our ML project. Need any help?', sender: 'Elena', time: '10:35 AM' }
    ]
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://bit.ly/ryan-florence',
    lastSeen: '30 min ago',
    email: 'john.smith@university.edu',
    phone: '+1 (555) 901-2345',
    department: 'Computer Science',
    specialization: 'Data Science',
    bio: 'Experienced data scientist with 5+ years of experience in data analysis and visualization.',
    messages: [
      { id: 1, text: 'Check out this new web dev resource!', sender: 'John', time: '2:15 PM' },
      { id: 2, text: 'Looks interesting, thanks!', sender: 'You', time: '2:17 PM' }
    ]
  }
];

const StudentMessages = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();

  const primaryColor = '#640101';
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      const newMessage = {
        id: selectedContact.messages.length + 1,
        text: message,
        sender: 'You',
        images: uploadedFiles.map(file => file.preview),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setSelectedContact(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      
      setMessage('');
      setUploadedFiles([]);
      setShowEmojiPicker(false);
    }
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newFiles = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles(prev => 
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const openFileUploader = () => {
    fileInputRef.current.click();
  };

  const openImagePreview = (image) => {
    setSelectedImage(image);
    onPreviewOpen();
  };

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (event, emojiData) => {
    console.log('Emoji clicked:', emojiData); // Debug log
    if (emojiData) {
      const emoji = emojiData.emoji;
      if (emoji) {
        setMessage(prevMessage => {
          console.log('Previous message:', prevMessage); // Debug log
          const newMessage = prevMessage + emoji;
          console.log('New message:', newMessage); // Debug log
          return newMessage;
        });
        setShowEmojiPicker(false);
      } else {
        console.error('No emoji found in object:', emojiData);
      }
    } else {
      console.error('Emoji data is undefined');
    }
  };

  return (
    <Flex bg={bgColor}>
      <StudentSidebar />
      
      <Flex 
        ml="250px" 
        width="calc(100% - 250px)" 
        mt="85px" 
        height="calc(100vh - 85px)"
        overflow="hidden"
      >
        {/* Contacts List */}
        <Box 
          width="350px" 
          borderRight="1px solid" 
          borderColor={primaryColor}
          bg={cardBg}
          p={4}
          overflowY="auto"
        >
          <HStack mb={4} spacing={2}>
            <Input 
              placeholder="Search contacts" 
              size="md"
              borderColor={primaryColor}
              _focus={{ borderColor: primaryColor }}
            />
            <IconButton 
              icon={<FaSearch />} 
              bg={primaryColor} 
              color="white"
              _hover={{ bg: `${primaryColor}80` }}
            />
          </HStack>

          <VStack spacing={2} align="stretch">
            {contacts.map(contact => (
              <Flex 
                key={contact.id}
                align="center"
                p={3}
                borderRadius="md"
                cursor="pointer"
                bg={selectedContact.id === contact.id ? `${primaryColor}20` : 'transparent'}
                _hover={{ bg: `${primaryColor}10` }}
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar 
                  src={contact.avatar} 
                  mr={4} 
                  border="2px solid" 
                  borderColor={selectedContact.id === contact.id ? primaryColor : 'transparent'}
                />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontWeight="bold">{contact.name}</Text>
                  <Text fontSize="xs" color="gray.500">{contact.lastSeen}</Text>
                </VStack>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Chat Window */}
        <Flex 
          flex={1} 
          flexDirection="column" 
          bg={bgColor}
        >
          {/* Chat Header */}
          <Flex 
            align="center" 
            justify="space-between" 
            p={4} 
            borderBottom="1px solid" 
            borderColor={primaryColor}
            bg={cardBg}
          >
            <HStack>
              <Avatar 
                src={selectedContact.avatar} 
                size="md" 
                border="2px solid" 
                borderColor={primaryColor}
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{selectedContact.name}</Text>
                <Text fontSize="xs" color="green.500">
                  {selectedContact.lastSeen}
                </Text>
              </VStack>
            </HStack>
            <Menu>
              <MenuButton 
                as={IconButton} 
                icon={<FaEllipsisV />} 
                variant="ghost"
                size="sm"
                color={primaryColor}
              />
              <MenuList>
                <MenuItem 
                  icon={<FaUser />} 
                  onClick={onProfileOpen}
                >
                  View Profile
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          {/* Messages */}
          <Box 
            flex={1} 
            overflowY="auto" 
            p={4}
            bg={bgColor}
          >
            <VStack spacing={4} align="stretch">
              {selectedContact.messages.map(msg => (
                <Flex 
                  key={msg.id}
                  justifyContent={msg.sender === 'You' ? 'flex-end' : 'flex-start'}
                >
                  {msg.sender !== 'You' && (
                    <Avatar 
                      src={selectedContact.avatar} 
                      mr={2} 
                      size="sm" 
                    />
                  )}
                  <Box
                    bg={msg.sender === 'You' ? `${primaryColor}20` : 'white'}
                    color={msg.sender === 'You' ? primaryColor : 'black'}
                    p={3}
                    borderRadius="lg"
                    maxWidth="70%"
                    boxShadow="sm"
                  >
                    <Text>{msg.text}</Text>
                    {msg.images && msg.images.length > 0 && (
                      <HStack spacing={2} mt={2}>
                        {msg.images.map((image, index) => (
                          <Image 
                            key={index}
                            src={image} 
                            boxSize="50px" 
                            objectFit="cover"
                            cursor="pointer"
                            onClick={() => openImagePreview(image)}
                          />
                        ))}
                      </HStack>
                    )}
                    <Text 
                      fontSize="xs" 
                      color="gray.500" 
                      textAlign={msg.sender === 'You' ? 'right' : 'left'}
                    >
                      {msg.time}
                    </Text>
                  </Box>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* Message Input */}
          <Flex 
            p={4} 
            bg={cardBg} 
            borderTop="1px solid" 
            borderColor={primaryColor}
            position="relative"
          >
            <IconButton
              icon={<FaSmile />}
              variant="ghost"
              onClick={toggleEmojiPicker}
              mr={2}
              color={primaryColor}
            />
            <IconButton
              icon={<FaImage />}
              variant="ghost"
              onClick={openFileUploader}
              mr={2}
              color={primaryColor}
            />
            
            <Input 
              flex={1}
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              borderColor={primaryColor}
              _focus={{ borderColor: primaryColor }}
            />
            
            <IconButton
              icon={<FaPaperPlane />}
              ml={2}
              bg={primaryColor}
              color="white"
              onClick={sendMessage}
              _hover={{ bg: `${primaryColor}80` }}
            />

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <HStack position="absolute" bottom="100%" left="0" spacing={2} p={2} bg={cardBg}>
                {uploadedFiles.map((file, index) => (
                  <Box key={index} position="relative">
                    <Image 
                      src={file.preview} 
                      boxSize="50px" 
                      objectFit="cover"
                      cursor="pointer"
                      onClick={() => openImagePreview(file.preview)}
                    />
                    <IconButton 
                      icon={<FaTrash />}
                      size="xs"
                      position="absolute"
                      top="-5px"
                      right="-5px"
                      colorScheme="red"
                      onClick={() => removeFile(index)}
                    />
                  </Box>
                ))}
              </HStack>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <Box 
                ref={emojiPickerRef}
                position="absolute" 
                bottom="100%" 
                right="0"
                zIndex={10}
                boxShadow="md"
              >
                <EmojiPicker 
                  onEmojiClick={(emojiData, event) => {
                    console.log('Full emoji data:', emojiData, event);
                    onEmojiClick(event, emojiData);
                  }}
                  width="100%"
                />
              </Box>
            )}
          </Flex>

          {/* Media Upload Input (Hidden) */}
          <Input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            display="none"
          />

          {/* Image Preview Modal */}
          <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Image Preview</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedImage && (
                  <Image 
                    src={selectedImage} 
                    maxW="100%" 
                    maxH="70vh" 
                    objectFit="contain" 
                    mx="auto" 
                  />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Instructor Profile Modal */}
          <Modal isOpen={isProfileOpen} onClose={onProfileClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Flex align="center">
                  <Avatar 
                    src={selectedContact.avatar} 
                    size="xl" 
                    mr={4} 
                    border="2px solid" 
                    borderColor={primaryColor}
                  />
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">{selectedContact.name}</Heading>
                    <Text color="gray.500">{selectedContact.department}</Text>
                  </VStack>
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>Biography</Text>
                    <Text>{selectedContact.bio}</Text>
                  </Box>
                  
                  <Divider />
                  
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <FaEnvelope color={primaryColor} />
                      <Text>{selectedContact.email}</Text>
                    </HStack>
                    <HStack>
                      <FaPhone color={primaryColor} />
                      <Text>{selectedContact.phone}</Text>
                    </HStack>
                    <HStack>
                      <FaGraduationCap color={primaryColor} />
                      <Text>Specialization: {selectedContact.specialization}</Text>
                    </HStack>
                  </VStack>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StudentMessages;
