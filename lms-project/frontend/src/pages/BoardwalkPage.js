import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Input, 
  Avatar, 
  Button, 
  Image, 
  Grid, 
  GridItem,
  Card,
  CardBody,
  Spacer,
  IconButton,
  useDisclosure,
  Divider,
  Badge,
  Flex,
  Center,
  Heading,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaImage, FaVideo, FaEllipsisH, FaThumbsUp, FaHeart, FaTimes, FaCheck, FaFire, FaStar, FaBookmark, FaTachometerAlt } from 'react-icons/fa';
import PostModal from '../components/PostModal';
import MediaUploadModal from '../components/MediaUploadModal';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5001/api';

// Animation keyframes for the background only (not cards)
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Particle component for the animated background
const Particle = ({ index }) => {
  const size = Math.random() * 4 + 2;
  const duration = Math.random() * 20 + 10;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const delay = Math.random() * 5;

  const floatAnimation = keyframes`
    0% { transform: translate(${initialX}vw, ${initialY}vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(${initialX + (Math.random() * 20 - 10)}vw, ${initialY - 30}vh) rotate(360deg); opacity: 0; }
  `;

  return (
    <Box
      position="absolute"
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="full"
      bg="rgba(255, 0, 0, 0.6)"
      sx={{
        animation: `${floatAnimation} ${duration}s infinite`,
        animationDelay: `${delay}s`,
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)',
      }}
    />
  );
};

// ALGORITHMIC PERSONALIZATION FUNCTIONS
class FeedAlgorithm {
  constructor(userId) {
    this.userId = userId;
    try {
      this.userInteractions = this.loadUserInteractions();
      this.userPreferences = this.calculateUserPreferences();
    } catch (error) {
      console.warn('Error loading user interactions, resetting:', error);
      // Reset to clean state if there's any corruption
      this.userInteractions = {
        liked: [],
        skipped: [],
        viewTime: {},
        categories: {},
        institutions: {}
      };
      this.userPreferences = this.calculateUserPreferences();
      // Save the clean state
      this.saveUserInteractions();
    }
  }

  // Load user interaction history from localStorage
  loadUserInteractions() {
    try {
      const key = `boardwalk_interactions_${this.userId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return {
          liked: [],
          skipped: [],
          viewTime: {},
          categories: {},
          institutions: {}
        };
      }
      
      const parsed = JSON.parse(stored);
      
      // Validate the structure and provide defaults for missing properties
      return {
        liked: Array.isArray(parsed.liked) ? parsed.liked : [],
        skipped: Array.isArray(parsed.skipped) ? parsed.skipped : [],
        viewTime: typeof parsed.viewTime === 'object' && parsed.viewTime !== null ? parsed.viewTime : {},
        categories: typeof parsed.categories === 'object' && parsed.categories !== null ? parsed.categories : {},
        institutions: typeof parsed.institutions === 'object' && parsed.institutions !== null ? parsed.institutions : {}
      };
    } catch (error) {
      console.warn('Error parsing stored user interactions:', error);
      // Return clean default structure if parsing fails
      return {
        liked: [],
        skipped: [],
        viewTime: {},
        categories: {},
        institutions: {}
      };
    }
  }

  // Save user interactions with cleanup to prevent quota exceeded
  saveUserInteractions() {
    try {
      // Cleanup old data to prevent quota issues
      this.cleanupOldInteractions();
      
      const key = `boardwalk_interactions_${this.userId}`;
      const dataToSave = JSON.stringify(this.userInteractions);
      
      // Check if data size is reasonable (less than 1MB)
      if (dataToSave.length > 1000000) {
        console.warn('User interactions data too large, performing aggressive cleanup');
        this.aggressiveCleanup();
      }
      
      localStorage.setItem(key, JSON.stringify(this.userInteractions));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded, clearing old interactions');
        this.clearOldInteractions();
        // Try again with cleaned data
        try {
          const key = `boardwalk_interactions_${this.userId}`;
          localStorage.setItem(key, JSON.stringify(this.userInteractions));
        } catch (secondError) {
          console.error('Still unable to save after cleanup:', secondError);
        }
      } else {
        console.error('Error saving user interactions:', error);
      }
    }
  }

  // Cleanup old interactions (keep only last 30 days and limit counts)
  cleanupOldInteractions() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Limit liked interactions to last 100
    if (this.userInteractions.liked.length > 100) {
      this.userInteractions.liked = this.userInteractions.liked
        .filter(interaction => interaction.timestamp > thirtyDaysAgo)
        .slice(-100); // Keep only last 100
    }
    
    // Limit skipped interactions to last 50 (less important than likes)
    if (this.userInteractions.skipped.length > 50) {
      this.userInteractions.skipped = this.userInteractions.skipped
        .filter(interaction => interaction.timestamp > thirtyDaysAgo)
        .slice(-50);
    }
    
    // Clean up view time data older than 30 days
    Object.keys(this.userInteractions.viewTime).forEach(postId => {
      if (this.userInteractions.viewTime[postId].timestamp < thirtyDaysAgo) {
        delete this.userInteractions.viewTime[postId];
      }
    });
  }

  // Aggressive cleanup when data is too large
  aggressiveCleanup() {
    // Keep only last 50 likes and 25 skips
    this.userInteractions.liked = this.userInteractions.liked.slice(-50);
    this.userInteractions.skipped = this.userInteractions.skipped.slice(-25);
    
    // Clear view time data
    this.userInteractions.viewTime = {};
    
    // Reset category and institution scores but keep structure
    Object.keys(this.userInteractions.categories).forEach(category => {
      const current = this.userInteractions.categories[category];
      this.userInteractions.categories[category] = {
        likes: Math.min(current.likes, 10),
        skips: Math.min(current.skips, 10)
      };
    });
    
    Object.keys(this.userInteractions.institutions).forEach(instId => {
      const current = this.userInteractions.institutions[instId];
      this.userInteractions.institutions[instId] = {
        likes: Math.min(current.likes, 10),
        skips: Math.min(current.skips, 10)
      };
    });
  }

  // Clear all old interactions and start fresh
  clearOldInteractions() {
    this.userInteractions = {
      liked: [],
      skipped: [],
      viewTime: {},
      categories: {},
      institutions: {}
    };
  }

  // Calculate user preferences based on interaction history
  calculateUserPreferences() {
    const { liked, skipped, categories, institutions } = this.userInteractions;
    
    // Calculate category scores
    const categoryScores = {};
    Object.keys(categories).forEach(category => {
      const likes = categories[category].likes || 0;
      const skips = categories[category].skips || 0;
      const total = likes + skips;
      categoryScores[category] = total > 0 ? likes / total : 0.5;
    });

    // Calculate institution scores
    const institutionScores = {};
    Object.keys(institutions).forEach(instId => {
      const likes = institutions[instId].likes || 0;
      const skips = institutions[instId].skips || 0;
      const total = likes + skips;
      institutionScores[instId] = total > 0 ? likes / total : 0.5;
    });

    return {
      categoryScores,
      institutionScores,
      totalLikes: liked.length,
      totalSkips: skipped.length
    };
  }

  // Personalized scoring algorithm for posts
  scorePost(post) {
    let score = 0.5; // Base score

    // Recency boost (newer posts get higher scores)
    const postAge = Date.now() - new Date(post.created_at).getTime();
    const daysSincePost = postAge / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - (daysSincePost / 30)); // Decay over 30 days
    score += recencyScore * 0.3;

    // Institution preference score
    const instScore = this.userPreferences.institutionScores[post.institution_id] || 0.5;
    score += instScore * 0.3;

    // Content-based scoring
    if (post.image_url) {
      score += 0.2; // Visual content boost
    }

    // Engagement boost
    const totalEngagement = (post.likes || 0) + (post.comments || 0);
    const engagementScore = Math.min(1, totalEngagement / 100); // Normalize to max 100 interactions
    score += engagementScore * 0.2;

    // Novelty score (avoid showing same institution too often)
    const recentInstitutionViews = this.getRecentInstitutionViews();
    if (recentInstitutionViews[post.institution_id] > 2) {
      score *= 0.7; // Reduce score for over-shown institutions
    }

    // Random factor for discovery
    score += (Math.random() - 0.5) * 0.2;

    return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
  }

  // Track user interaction
  recordInteraction(postId, action, post) {
    const now = Date.now();
    
    if (action === 'like') {
      this.userInteractions.liked.push({ postId, timestamp: now });
      this.updateCategoryScore(post, 'like');
      this.updateInstitutionScore(post.institution_id, 'like');
    } else if (action === 'skip') {
      this.userInteractions.skipped.push({ postId, timestamp: now });
      this.updateCategoryScore(post, 'skip');
      this.updateInstitutionScore(post.institution_id, 'skip');
    }

    this.saveUserInteractions();
  }

  updateCategoryScore(post, action) {
    const category = this.extractCategory(post);
    if (!this.userInteractions.categories[category]) {
      this.userInteractions.categories[category] = { likes: 0, skips: 0 };
    }
    
    if (action === 'like') {
      this.userInteractions.categories[category].likes++;
    } else if (action === 'skip') {
      this.userInteractions.categories[category].skips++;
    }
  }

  updateInstitutionScore(institutionId, action) {
    if (!this.userInteractions.institutions[institutionId]) {
      this.userInteractions.institutions[institutionId] = { likes: 0, skips: 0 };
    }
    
    if (action === 'like') {
      this.userInteractions.institutions[institutionId].likes++;
    } else if (action === 'skip') {
      this.userInteractions.institutions[institutionId].skips++;
    }
  }

  extractCategory(post) {
    // Extract category from post content/title (simple keyword matching)
    const text = (post.title + ' ' + post.content).toLowerCase();
    
    if (text.includes('math') || text.includes('calculus') || text.includes('algebra')) return 'mathematics';
    if (text.includes('science') || text.includes('physics') || text.includes('chemistry')) return 'science';
    if (text.includes('art') || text.includes('design') || text.includes('creative')) return 'arts';
    if (text.includes('business') || text.includes('management') || text.includes('economics')) return 'business';
    if (text.includes('computer') || text.includes('programming') || text.includes('tech')) return 'technology';
    if (text.includes('language') || text.includes('english') || text.includes('literature')) return 'language';
    
    return 'general';
  }

  getRecentInstitutionViews() {
    const recent = {};
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // Last 24 hours
    
    [...this.userInteractions.liked, ...this.userInteractions.skipped]
      .filter(interaction => interaction.timestamp > cutoff)
      .forEach(interaction => {
        // We'd need to store institution_id with interactions for this to work perfectly
        // For now, we'll use a simplified approach
      });
    
    return recent;
  }

  // Advanced sorting algorithm combining multiple factors
  personalizePostOrder(posts) {
    // Score all posts
    const scoredPosts = posts.map(post => ({
      ...post,
      personalScore: this.scorePost(post)
    }));

    // Sort by personalized score (descending)
    scoredPosts.sort((a, b) => b.personalScore - a.personalScore);

    // Apply diversity injection - ensure variety every 5 posts
    const diversifiedPosts = [];
    const institutionBuffer = [];
    
    for (let i = 0; i < scoredPosts.length; i++) {
      const post = scoredPosts[i];
      
      // Every 5th position, inject a random post for discovery
      if (i > 0 && i % 5 === 0 && scoredPosts.length > i + 5) {
        const randomIndex = i + Math.floor(Math.random() * 5);
        const randomPost = scoredPosts[randomIndex];
        if (randomPost && !diversifiedPosts.find(p => p.id === randomPost.id)) {
          diversifiedPosts.push(randomPost);
          continue;
        }
      }
      
      // Avoid consecutive posts from same institution
      if (diversifiedPosts.length > 0) {
        const lastPost = diversifiedPosts[diversifiedPosts.length - 1];
        if (lastPost.institution_id === post.institution_id) {
          // Find next post from different institution
          const alternativeIndex = scoredPosts.findIndex((p, idx) => 
            idx > i && 
            p.institution_id !== post.institution_id && 
            !diversifiedPosts.find(dp => dp.id === p.id)
          );
          
          if (alternativeIndex !== -1) {
            diversifiedPosts.push(scoredPosts[alternativeIndex]);
            // Add current post to buffer for later
            institutionBuffer.push(post);
            continue;
          }
        }
      }
      
      diversifiedPosts.push(post);
    }

    // Add buffered posts at the end
    diversifiedPosts.push(...institutionBuffer.filter(p => !diversifiedPosts.find(dp => dp.id === p.id)));

    return diversifiedPosts;
  }
}

const BoardwalkPage = () => {
  // Generate particles for the background
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push(<Particle key={i} index={i} />);
  }
  
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();
  const { isOpen: isMediaModalOpen, onOpen: onMediaModalOpen, onClose: onMediaModalClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  
  // State for real database posts and user management
  const [allPosts, setAllPosts] = useState([]);
  const [personalizedPosts, setPersonalizedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [feedAlgorithm, setFeedAlgorithm] = useState(null);
  const [institutionDetails, setInstitutionDetails] = useState({});

  // Current post index for swiping
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  // Track if we're out of posts
  const [noMorePosts, setNoMorePosts] = useState(false);
  // Track drag direction
  const [dragDirection, setDragDirection] = useState(null);
  // Animation controls
  const controls = useAnimation();

  // Navigate to appropriate dashboard based on user type
  const goToDashboard = () => {
    if (!currentUser || currentUser.isAnonymous) {
      navigate('/login');
      return;
    }
    
    // Check user role and navigate accordingly
    if (currentUser.role === 'instructor' || currentUser.user_type === 'instructor') {
      navigate('/instructor-dashboard');
    } else if (currentUser.role === 'student' || currentUser.user_type === 'student') {
      navigate('/student-dashboard');
    } else {
      // Default fallback
      navigate('/dashboard');
    }
  };

  // Initialize user and fetch data
  useEffect(() => {
    initializeUser();
    fetchPosts();
  }, []);

  // Initialize personalized feed when user and posts are loaded
  useEffect(() => {
    if (currentUser && allPosts.length > 0) {
      const algorithm = new FeedAlgorithm(currentUser.id || 'anonymous');
      setFeedAlgorithm(algorithm);
      
      // Apply personalized ordering
      const personalizedOrder = algorithm.personalizePostOrder(allPosts);
      setPersonalizedPosts(personalizedOrder);
      setCurrentPostIndex(0);
      setNoMorePosts(false);
    }
  }, [currentUser, allPosts]);

  const initializeUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Anonymous user - create temporary ID
        const anonymousId = localStorage.getItem('anonymousUserId') || 
          'anon_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('anonymousUserId', anonymousId);
        setCurrentUser({ id: anonymousId, name: 'Anonymous User', isAnonymous: true });
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Fallback to anonymous
      const anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
      setCurrentUser({ id: anonymousId, name: 'Anonymous User', isAnonymous: true });
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const posts = await response.json();
      setAllPosts(posts);
      
      // Fetch institution details for each unique institution
      const uniqueInstitutionIds = [...new Set(posts.map(post => post.institution_id))];
      const institutionDetailsMap = {};
      
      for (const institutionId of uniqueInstitutionIds) {
        try {
          const institutionResponse = await fetch(`${API_URL}/institutions/${institutionId}/profile`);
          if (institutionResponse.ok) {
            const institutionData = await institutionResponse.json();
            institutionDetailsMap[institutionId] = institutionData;
          }
        } catch (error) {
          console.error(`Error fetching details for institution ${institutionId}:`, error);
        }
      }
      
      setInstitutionDetails(institutionDetailsMap);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new post to the feed
  const addNewPost = (newPost) => {
    const updatedPosts = [newPost, ...allPosts];
    setAllPosts(updatedPosts);
    
    // Re-personalize with new post
    if (feedAlgorithm) {
      const personalizedOrder = feedAlgorithm.personalizePostOrder(updatedPosts);
      setPersonalizedPosts(personalizedOrder);
      setCurrentPostIndex(0);
      setNoMorePosts(false);
    }
  };

  // Handle swipe left (dislike/skip)
  const handleSwipeLeft = () => {
    const currentPost = personalizedPosts[currentPostIndex];
    if (feedAlgorithm && currentPost) {
      feedAlgorithm.recordInteraction(currentPost.id, 'skip', currentPost);
    }

    controls.start({ 
      x: -500, 
      opacity: 0,
      rotate: -20,
      transition: { duration: 0.5 }
    }).then(() => {
      moveToNextPost();
    });
  };

  // Handle swipe right (like)
  const handleSwipeRight = () => {
    const currentPost = personalizedPosts[currentPostIndex];
    if (feedAlgorithm && currentPost) {
      feedAlgorithm.recordInteraction(currentPost.id, 'like', currentPost);
    }

    controls.start({ 
      x: 500, 
      opacity: 0,
      rotate: 20,
      transition: { duration: 0.5 }
    }).then(() => {
      // Like the post (update in state)
      const updatedPosts = [...personalizedPosts];
      updatedPosts[currentPostIndex].likes = (updatedPosts[currentPostIndex].likes || 0) + 1;
      setPersonalizedPosts(updatedPosts);
      
      toast({
        title: 'Post Liked!',
        description: 'Added to your favorites',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      moveToNextPost();
    });
  };

  // Move to next post
  const moveToNextPost = () => {
    if (currentPostIndex < personalizedPosts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    } else {
      setNoMorePosts(true);
    }
  };

  // Reset to first post with new personalized order
  const resetPosts = () => {
    if (feedAlgorithm && allPosts.length > 0) {
      // Re-personalize the feed based on updated user preferences
      const personalizedOrder = feedAlgorithm.personalizePostOrder(allPosts);
      setPersonalizedPosts(personalizedOrder);
    }
    
    setCurrentPostIndex(0);
    setNoMorePosts(false);
    controls.set({ x: 0, opacity: 1, rotate: 0 });
  };

  // Handle drag end
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50; // Reduced threshold for easier swiping
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Consider both offset and velocity for more natural feel
    if (offset < -swipeThreshold || velocity < -500) {
      handleSwipeLeft();
    } else if (offset > swipeThreshold || velocity > 500) {
      handleSwipeRight();
    } else {
      // Spring back to center with smooth animation
      controls.start({ 
        x: 0, 
        opacity: 1, 
        rotate: 0,
        scale: 1,
        transition: { 
          type: "spring",
          damping: 20,
          stiffness: 300
        }
      });
    }
    setDragDirection(null);
  };

  // Handle drag
  const handleDrag = (event, info) => {
    const offset = info.offset.x;
    
    if (offset < -30) {
      setDragDirection('left');
    } else if (offset > 30) {
      setDragDirection('right');
    } else {
      setDragDirection(null);
    }
  };

  if (loading) {
    return (
      <Box 
        minH="100vh" 
        maxH="100vh"
        overflow="hidden"
        position="relative"
        bgGradient="linear(to-br, black, #300)"
        sx={{
          backgroundSize: "200% 200%",
          animation: `${gradientAnimation} 15s ease infinite`,
        }}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="red.500" />
          <Text color="white" fontSize="lg">Loading personalized feed...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      minH="100vh" 
      maxH="100vh"
      overflow="hidden"
      position="relative"
      bgGradient="linear(to-br, black, #300)"
      sx={{
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 15s ease infinite`,
      }}
    >
      {/* Animated particles */}
      {particles}
      
      {/* Main content - Centered Layout with better spacing */}
      <Box maxW="1400px" mx="auto" px={4} py={4} pt={20} h="100vh">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 350px 1fr" }} gap={8} alignItems="start" h="calc(100vh - 80px)">
          
          {/* Left side - User insights (hidden on smaller screens) */}
          <GridItem display={{ base: "none", lg: "block" }} h="100%">
            <Box 
              bg="rgba(0, 0, 0, 0.7)" 
              p={6} 
              borderRadius="lg" 
              color="white" 
              position="sticky" 
              top="20px"
              maxH="calc(100vh - 120px)"
              overflowY="auto"
            >
              <Heading size="md" mb={4}>Your Feed Insights</Heading>
              
              {currentUser && !currentUser.isAnonymous && feedAlgorithm && (
                <VStack align="stretch" spacing={4} mb={6}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Total Likes:</Text>
                    <Badge colorScheme="green">
                      {feedAlgorithm.userPreferences.totalLikes}
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Posts Viewed:</Text>
                    <Badge colorScheme="blue">
                      {feedAlgorithm.userPreferences.totalLikes + feedAlgorithm.userPreferences.totalSkips}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    Your preferences help personalize this feed
                  </Text>
                </VStack>
              )}
              
              <Divider borderColor="rgba(255, 255, 255, 0.2)" mb={4} />
              
              <Heading size="md" mb={4}>Feed Stats</Heading>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontSize="sm">Total Posts:</Text>
                  <Badge>{allPosts.length}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Current Position:</Text>
                  <Badge>{currentPostIndex + 1} of {personalizedPosts.length}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Institutions:</Text>
                  <Badge>{Object.keys(institutionDetails).length}</Badge>
                </HStack>
                
                <Text fontSize="xs" color="gray.400" mt={4}>
                  Powered by personalized algorithms
                </Text>
              </VStack>
            </Box>
          </GridItem>
          
          {/* Center - Main Swiping Cards */}
          <GridItem>
            {/* User Info & Personalization Status (Compact) */}
            {currentUser && !currentUser.isAnonymous && (
              <Card bg="rgba(0, 0, 0, 0.7)" color="white" shadow="lg" mb={4} w="100%" maxW="380px" mx="auto">
                <CardBody py={3}>
                  <HStack justify="center" spacing={3}>
                    <Avatar size="sm" name={currentUser.name} />
                    <Text fontSize="sm">Welcome back, {currentUser.name}!</Text>
                    <Badge size="sm" colorScheme="red">Personalized</Badge>
                  </HStack>
                </CardBody>
              </Card>
            )}
            
            {/* Main Portrait Card Design - Centered and More Compact */}
            <Box position="relative" h="480px" maxW="320px" mx="auto" display="flex" alignItems="center" justifyContent="center">
              {noMorePosts ? (
                <Center h="100%">
                  <VStack spacing={4}>
                    <Text color="white" fontSize="xl">No more posts to show</Text>
                    <Button 
                      leftIcon={<FaFire />} 
                      colorScheme="red" 
                      onClick={resetPosts}
                      size="lg"
                    >
                      Refresh Feed
                    </Button>
                  </VStack>
                </Center>
              ) : personalizedPosts.length === 0 ? (
                <Center h="100%">
                  <VStack spacing={4}>
                    <Text color="white" fontSize="xl">No posts available</Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      Check back later for new content from institutions
                    </Text>
                  </VStack>
                </Center>
              ) : !loading && personalizedPosts.length > 0 && currentPostIndex < personalizedPosts.length ? (
                <AnimatePresence>
                  <Box position="relative" h="100%" w="100%">
                    <motion.div
                      key={currentPostIndex}
                      drag="x"
                      dragConstraints={{ left: -80, right: 80 }}
                      dragElastic={0.2}
                      onDragEnd={handleDragEnd}
                      onDrag={handleDrag}
                      animate={controls}
                      initial={{ x: 0, opacity: 1, scale: 1 }}
                      whileDrag={{ 
                        scale: 1.03,
                        rotate: dragDirection === 'left' ? -3 : dragDirection === 'right' ? 3 : 0
                      }}
                      transition={{ 
                        type: "spring",
                        damping: 25,
                        stiffness: 300
                      }}
                      style={{ 
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        cursor: 'grab'
                      }}
                      whileTap={{ cursor: 'grabbing' }}
                    >
                      <Card 
                        shadow="2xl" 
                        borderRadius="xl" 
                        overflow="hidden" 
                        h="100%"
                        position="relative"
                        bg="#111"
                        color="white"
                        borderWidth="0"
                        maxW="320px"
                        mx="auto"
                        transform="auto"
                      >
                        <CardBody p={0}>
                          <VStack h="100%" spacing={0} align="stretch">
                            {/* Main Image First - Smaller */}
                            {personalizedPosts[currentPostIndex]?.image_url ? (
                              <Box 
                                overflow="hidden" 
                                h="240px"
                                position="relative"
                              >
                                <Image 
                                  src={personalizedPosts[currentPostIndex].image_url} 
                                  alt="Post image" 
                                  width="100%"
                                  height="100%"
                                  objectFit="cover"
                                  objectPosition="center"
                                />
                                
                                {/* Gradient overlay for text readability */}
                                <Box 
                                  position="absolute"
                                  bottom="0"
                                  left="0"
                                  right="0"
                                  height="120px"
                                  bgGradient="linear(to-t, black, transparent)"
                                  zIndex="1"
                                />
                                
                                {/* Institution info positioned at the bottom of the image */}
                                <HStack 
                                  position="absolute" 
                                  bottom="0" 
                                  left="0" 
                                  width="100%" 
                                  p={4} 
                                  zIndex="2"
                                  align="center"
                                >
                                  <Avatar 
                                    size="md" 
                                    name={personalizedPosts[currentPostIndex].institution_name} 
                                    border="2px solid white"
                                    src={institutionDetails[personalizedPosts[currentPostIndex].institution_id]?.profile_picture}
                                  />
                                  <Box flex="1" ml={2}>
                                    <Text fontWeight="bold" color="white" fontSize="lg">
                                      {personalizedPosts[currentPostIndex].institution_name}
                                    </Text>
                                    <Text fontSize="xs" color="gray.200" noOfLines={1}>
                                      {institutionDetails[personalizedPosts[currentPostIndex].institution_id]?.description || 'Educational Institution'}
                                    </Text>
                                  </Box>
                                  <Badge bg="red.600" color="white" fontSize="2xs" px={2} py={1}>
                                    {new Date(personalizedPosts[currentPostIndex].created_at).toLocaleDateString()}
                                  </Badge>
                                </HStack>
                              </Box>
                            ) : (
                              <Box 
                                h="200px" 
                                bg="gray.900" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                              >
                                <VStack>
                                  <Avatar 
                                    size="xl" 
                                    name={personalizedPosts[currentPostIndex].institution_name} 
                                    border="2px solid #640101"
                                    src={institutionDetails[personalizedPosts[currentPostIndex].institution_id]?.profile_picture}
                                  />
                                  <Heading size="md" mt={2}>
                                    {personalizedPosts[currentPostIndex].institution_name}
                                  </Heading>
                                  <Text fontSize="sm" color="gray.400" textAlign="center" noOfLines={2}>
                                    {institutionDetails[personalizedPosts[currentPostIndex].institution_id]?.description || 'Educational Institution'}
                                  </Text>
                                </VStack>
                              </Box>
                            )}
                            
                            {/* Content Section - More Compact */}
                            <Box p={4} bg="#111" flex="1">
                              {/* Post Title */}
                              <Text 
                                fontSize="lg" 
                                fontWeight="bold"
                                color="white"
                                mb={2}
                                lineHeight="1.2"
                                noOfLines={2}
                              >
                                {personalizedPosts[currentPostIndex].title}
                              </Text>
                              
                              {/* Post Content */}
                              <Text 
                                fontSize="sm" 
                                color="gray.300"
                                lineHeight="1.4"
                                mb={3}
                                noOfLines={3}
                              >
                                {personalizedPosts[currentPostIndex].content}
                              </Text>
                              
                              {/* Engagement Section */}
                              <HStack spacing={4} mt={3}>
                                <HStack>
                                  <IconButton
                                    icon={<FaHeart />}
                                    variant="ghost"
                                    color="red.400"
                                    aria-label="Like"
                                    size="sm"
                                  />
                                  <Text fontSize="sm" color="gray.400" fontWeight="medium">
                                    {personalizedPosts[currentPostIndex].likes || 0}
                                  </Text>
                                </HStack>
                                
                                <IconButton
                                  icon={<FaBookmark />}
                                  variant="ghost"
                                  color="gray.400"
                                  aria-label="Save"
                                  size="sm"
                                />
                                
                                <Spacer />
                                
                                {personalizedPosts[currentPostIndex].is_featured && (
                                  <Badge colorScheme="red" variant="solid" px={2} py={1} fontSize="xs">
                                    Featured
                                  </Badge>
                                )}
                              </HStack>
                              
                              {/* Personalization Score (Debug Info) */}
                              {personalizedPosts[currentPostIndex].personalScore && (
                                <Text fontSize="xs" color="gray.600" mt={3}>
                                  Relevance: {(personalizedPosts[currentPostIndex].personalScore * 100).toFixed(0)}%
                                </Text>
                              )}
                            </Box>
                          </VStack>

                          {/* Enhanced Swipe indicators - Smaller */}
                          {dragDirection === 'left' && (
                            <Box 
                              position="absolute" 
                              top="60%" 
                              left="20px" 
                              transform="translateY(-50%)"
                              bg="rgba(255, 0, 0, 0.9)"
                              borderRadius="full"
                              p={3}
                              opacity={0.95}
                              borderWidth="2px"
                              borderColor="red.400"
                              boxShadow="0 0 15px rgba(255, 0, 0, 0.6)"
                            >
                              <FaTimes color="white" size="20px" />
                            </Box>
                          )}
                          
                          {dragDirection === 'right' && (
                            <Box 
                              position="absolute" 
                              top="60%" 
                              right="20px" 
                              transform="translateY(-50%)"
                              bg="rgba(255, 215, 0, 0.9)"
                              borderRadius="full"
                              p={3}
                              opacity={0.95}
                              borderWidth="2px"
                              borderColor="yellow.400"
                              boxShadow="0 0 15px rgba(255, 215, 0, 0.6)"
                            >
                              <FaStar color="white" size="20px" />
                            </Box>
                          )}
                        </CardBody>
                      </Card>
                    </motion.div>
                  </Box>
                </AnimatePresence>
              ) : loading ? (
                <VStack spacing={4}>
                  <Spinner size="xl" color="red.500" />
                  <Text color="white" fontSize="lg">Loading personalized feed...</Text>
                </VStack>
              ) : null}
            </Box>

            {/* Enhanced Swipe Buttons - Smaller */}
            {!noMorePosts && personalizedPosts.length > 0 && (
              <HStack justify="center" spacing={10} mt={4} mb={2}>
                <IconButton
                  icon={<FaTimes />}
                  bg="rgba(255, 0, 0, 0.2)"
                  color="red.400"
                  size="lg"
                  isRound
                  onClick={handleSwipeLeft}
                  aria-label="Skip"
                  borderWidth="2px"
                  borderColor="red.400"
                  _hover={{ 
                    bg: "rgba(255, 0, 0, 0.3)",
                    transform: "scale(1.1)",
                    boxShadow: "0 0 15px rgba(255, 0, 0, 0.4)"
                  }}
                  transition="all 0.2s"
                  h="50px"
                  w="50px"
                />
                <IconButton
                  icon={<FaStar />}
                  bg="rgba(255, 215, 0, 0.2)"
                  color="yellow.400"
                  size="lg"
                  isRound
                  onClick={handleSwipeRight}
                  aria-label="Star"
                  borderWidth="2px"
                  borderColor="yellow.400"
                  _hover={{ 
                    bg: "rgba(255, 215, 0, 0.3)",
                    transform: "scale(1.1)",
                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.4)"
                  }}
                  transition="all 0.2s"
                  h="50px"
                  w="50px"
                />
              </HStack>
            )}
          </GridItem>
          
          {/* Right side - Quick Actions & Instructions */}
          <GridItem display={{ base: "none", lg: "block" }} h="100%">
            <Box 
              bg="rgba(0, 0, 0, 0.7)" 
              p={6} 
              borderRadius="lg" 
              color="white" 
              position="sticky" 
              top="20px"
              maxH="calc(100vh - 120px)"
              overflowY="auto"
            >
              <Heading size="md" mb={4}>How to Use</Heading>
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Box bg="red.500" borderRadius="full" p={2}>
                    <FaTimes color="white" size="16px" />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="bold">Swipe Left / Click ✗</Text>
                    <Text fontSize="xs" color="gray.400">Skip this post</Text>
                  </VStack>
                </HStack>
                
                <HStack>
                  <Box bg="yellow.500" borderRadius="full" p={2}>
                    <FaStar color="white" size="16px" />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="bold">Swipe Right / Click ⭐</Text>
                    <Text fontSize="xs" color="gray.400">Like & save to favorites</Text>
                  </VStack>
                </HStack>
                
                <Divider borderColor="rgba(255, 255, 255, 0.2)" />
                
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  Drag cards left or right for smooth swiping experience
                </Text>
              </VStack>
              
              {/* Go to Dashboard Button */}
              <Divider borderColor="rgba(255, 255, 255, 0.2)" my={4} />
              <Button
                leftIcon={<FaTachometerAlt />}
                colorScheme="blue"
                variant="solid"
                size="md"
                onClick={goToDashboard}
                width="100%"
              >
                {currentUser && !currentUser.isAnonymous 
                  ? `Go to ${currentUser.role === 'instructor' || currentUser.user_type === 'instructor' ? 'Instructor' : 'Student'} Dashboard`
                  : 'Login to Access Dashboard'
                }
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </Box>
      
      {/* Modals */}
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={onPostModalClose} 
        onPostSubmit={addNewPost} 
      />
      <MediaUploadModal 
        isOpen={isMediaModalOpen} 
        onClose={onMediaModalClose} 
      />
    </Box>
  );
};

export default BoardwalkPage;
