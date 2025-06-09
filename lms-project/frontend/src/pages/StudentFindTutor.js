import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  useToast
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaEye, 
  FaCommentDots, 
  FaUserCircle, 
  FaTimes, 
  FaStar, 
  FaGlobeAmericas, 
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import StudentSidebar from '../components/StudentSidebar';
import { useSubscription } from '../contexts/subscriptionContext';
import VerifiedBadge, { InstructorNameWithBadge } from '../components/VerifiedBadge';

const tutorData = [
  { 
    id: 1,
    name: "Elena Rodriguez", 
    profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
    subject: "Machine Learning",
    country: "United States",
    lat: 40.7128,  // New York
    lng: -74.0060,
    rating: 4.8
  },
  { 
    id: 11,
    name: "Dr. Alex Chen", 
    profilePhoto: "https://randomuser.me/api/portraits/men/11.jpg",
    subject: "Machine Learning",
    country: "Canada",
    lat: 43.6532,  // Toronto
    lng: -79.3832,
    rating: 4.7
  },
  { 
    id: 12,
    name: "Maria Santos", 
    profilePhoto: "https://randomuser.me/api/portraits/women/12.jpg",
    subject: "Machine Learning",
    country: "Brazil",
    lat: -23.5505,  // São Paulo
    lng: -46.6333,
    rating: 4.6
  },
  { 
    id: 13,
    name: "Raj Patel", 
    profilePhoto: "https://randomuser.me/api/portraits/men/13.jpg",
    subject: "Machine Learning",
    country: "India",
    lat: 19.0760,  // Mumbai
    lng: 72.8777,
    rating: 4.9
  },
  { 
    id: 2,
    name: "John Smith", 
    profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
    subject: "Web Development",
    country: "United Kingdom",
    lat: 51.5074,  // London
    lng: -0.1276,
    rating: 4.5
  },
  { 
    id: 14,
    name: "Sophie Martin", 
    profilePhoto: "https://randomuser.me/api/portraits/women/14.jpg",
    subject: "Web Development",
    country: "France",
    lat: 48.8566,  // Paris
    lng: 2.3522,
    rating: 4.7
  },
  { 
    id: 15,
    name: "Diego Rodriguez", 
    profilePhoto: "https://randomuser.me/api/portraits/men/15.jpg",
    subject: "Web Development",
    country: "Spain",
    lat: 40.4168,  // Madrid
    lng: -3.7038,
    rating: 4.6
  },
  { 
    id: 3,
    name: "Sarah Chen", 
    profilePhoto: "https://randomuser.me/api/portraits/women/2.jpg",
    subject: "Data Science",
    country: "China",
    lat: 31.2304,  // Shanghai
    lng: 121.4737,
    rating: 4.7
  },
  { 
    id: 16,
    name: "Jake Thompson", 
    profilePhoto: "https://randomuser.me/api/portraits/men/16.jpg",
    subject: "Data Science",
    country: "Australia",
    lat: -33.8688,  // Sydney
    lng: 151.2093,
    rating: 4.8
  },
  { 
    id: 17,
    name: "Isabella Garcia", 
    profilePhoto: "https://randomuser.me/api/portraits/women/17.jpg",
    subject: "Data Science",
    country: "Mexico",
    lat: 19.4326,  // Mexico City
    lng: -99.1332,
    rating: 4.6
  },
  { 
    id: 4,
    name: "Carlos Martinez", 
    profilePhoto: "https://randomuser.me/api/portraits/men/2.jpg",
    subject: "Cloud Computing",
    country: "Argentina",
    lat: -34.6037,  // Buenos Aires
    lng: -58.3816,
    rating: 4.6
  },
  { 
    id: 18,
    name: "Anna Kowalski", 
    profilePhoto: "https://randomuser.me/api/portraits/women/18.jpg",
    subject: "Cloud Computing",
    country: "Poland",
    lat: 52.2297,  // Warsaw
    lng: 21.0122,
    rating: 4.7
  },
  { 
    id: 19,
    name: "Mohammed Al-Fayed", 
    profilePhoto: "https://randomuser.me/api/portraits/men/19.jpg",
    subject: "Cloud Computing",
    country: "United Arab Emirates",
    lat: 25.2048,  // Dubai
    lng: 55.2708,
    rating: 4.5
  },
  { 
    id: 5,
    name: "Aisha Khan", 
    profilePhoto: "https://randomuser.me/api/portraits/women/3.jpg",
    subject: "Artificial Intelligence",
    country: "India",
    lat: 28.6139,  // Delhi
    lng: 77.2090,
    rating: 4.9
  },
  { 
    id: 20,
    name: "Liam O'Connor", 
    profilePhoto: "https://randomuser.me/api/portraits/men/20.jpg",
    subject: "Artificial Intelligence",
    country: "Ireland",
    lat: 53.4129,  // Dublin
    lng: -8.2439,
    rating: 4.7
  },
  { 
    id: 21,
    name: "Yuki Tanaka", 
    profilePhoto: "https://randomuser.me/api/portraits/women/21.jpg",
    subject: "Artificial Intelligence",
    country: "Japan",
    lat: 35.6762,  // Tokyo
    lng: 139.6503,
    rating: 4.8
  },
  { 
    id: 6,
    name: "Michael Lee", 
    profilePhoto: "https://randomuser.me/api/portraits/men/3.jpg",
    subject: "Cybersecurity",
    country: "United States of America",
    lat: 37.7749,  // San Francisco
    lng: -122.4194,
    rating: 4.7
  },
  { 
    id: 22,
    name: "Emma Wilson", 
    profilePhoto: "https://randomuser.me/api/portraits/women/22.jpg",
    subject: "Cybersecurity",
    country: "Canada",
    lat: 49.2827,  // Vancouver
    lng: -123.1207,
    rating: 4.6
  },
  { 
    id: 23,
    name: "Klaus Mueller", 
    profilePhoto: "https://randomuser.me/api/portraits/men/23.jpg",
    subject: "Cybersecurity",
    country: "Germany",
    lat: 52.5200,  // Berlin
    lng: 13.4050,
    rating: 4.8
  },
  { 
    id: 7,
    name: "Emma Watson", 
    profilePhoto: "https://randomuser.me/api/portraits/women/4.jpg",
    subject: "Blockchain",
    country: "France",
    lat: 48.8566,  // Paris
    lng: 2.3522,
    rating: 4.6
  },
  { 
    id: 24,
    name: "Vitalik Buterin", 
    profilePhoto: "https://randomuser.me/api/portraits/men/24.jpg",
    subject: "Blockchain",
    country: "Canada",
    lat: 43.6532,  // Toronto
    lng: -79.3832,
    rating: 4.9
  },
  { 
    id: 25,
    name: "Sofia Nakamoto", 
    profilePhoto: "https://randomuser.me/api/portraits/women/25.jpg",
    subject: "Blockchain",
    country: "Japan",
    lat: 35.6762,  // Tokyo
    lng: 139.6503,
    rating: 4.7
  },
  { 
    id: 8,
    name: "Alex Johnson", 
    profilePhoto: "https://randomuser.me/api/portraits/men/4.jpg",
    subject: "Quantum Computing",
    country: "Australia",
    lat: -33.8688,  // Sydney
    lng: 151.2093,
    rating: 4.5
  },
  { 
    id: 26,
    name: "Dr. Quantum Zhang", 
    profilePhoto: "https://randomuser.me/api/portraits/men/26.jpg",
    subject: "Quantum Computing",
    country: "China",
    lat: 31.2304,  // Shanghai
    lng: 121.4737,
    rating: 4.8
  },
  { 
    id: 27,
    name: "Elena Popova", 
    profilePhoto: "https://randomuser.me/api/portraits/women/27.jpg",
    subject: "Quantum Computing",
    country: "Russia",
    lat: 55.7558,  // Moscow
    lng: 37.6173,
    rating: 4.7
  },
  { 
    id: 9,
    name: "Olivia Brown", 
    profilePhoto: "https://randomuser.me/api/portraits/women/5.jpg",
    subject: "Robotics",
    country: "Japan",
    lat: 35.6762,  // Tokyo
    lng: 139.6503,
    rating: 4.8
  },
  { 
    id: 28,
    name: "Dr. Roberto Silva", 
    profilePhoto: "https://randomuser.me/api/portraits/men/28.jpg",
    subject: "Robotics",
    country: "Brazil",
    lat: -23.5505,  // São Paulo
    lng: -46.6333,
    rating: 4.7
  },
  { 
    id: 29,
    name: "Kim Soo-jin", 
    profilePhoto: "https://randomuser.me/api/portraits/women/29.jpg",
    subject: "Robotics",
    country: "South Korea",
    lat: 37.5665,  // Seoul
    lng: 126.9780,
    rating: 4.9
  },
  { 
    id: 10,
    name: "David Kim", 
    profilePhoto: "https://randomuser.me/api/portraits/men/5.jpg",
    subject: "Natural Language Processing",
    country: "South Korea",
    lat: 37.5665,  // Seoul
    lng: 126.9780,
    rating: 4.7
  },
  { 
    id: 30,
    name: "Dr. Amelia Rodriguez", 
    profilePhoto: "https://randomuser.me/api/portraits/women/30.jpg",
    subject: "Natural Language Processing",
    country: "United States",
    lat: 40.7128,  // New York
    lng: -74.0060,
    rating: 4.8
  },
  { 
    id: 31,
    name: "Hiroshi Nakamura", 
    profilePhoto: "https://randomuser.me/api/portraits/men/31.jpg",
    subject: "Natural Language Processing",
    country: "Japan",
    lat: 35.6762,  // Tokyo
    lng: 139.6503,
    rating: 4.6
  }
];

const tutorCountryMap = {
  "United States": {
    cities: ["New York", "San Francisco", "Los Angeles"],
    tutors: tutorData.filter(tutor => tutor.country === "United States")
  },
  "United Kingdom": {
    cities: ["London", "Manchester", "Edinburgh"],
    tutors: tutorData.filter(tutor => tutor.country === "United Kingdom")
  },
  "China": {
    cities: ["Shanghai", "Beijing", "Guangzhou"],
    tutors: tutorData.filter(tutor => tutor.country === "China")
  },
  "Argentina": {
    cities: ["Buenos Aires", "Córdoba"],
    tutors: tutorData.filter(tutor => tutor.country === "Argentina")
  },
  "India": {
    cities: ["Delhi", "Mumbai", "Bangalore"],
    tutors: tutorData.filter(tutor => tutor.country === "India")
  },
  "France": {
    cities: ["Paris", "Lyon", "Marseille"],
    tutors: tutorData.filter(tutor => tutor.country === "France")
  },
  "Australia": {
    cities: ["Sydney", "Melbourne", "Brisbane"],
    tutors: tutorData.filter(tutor => tutor.country === "Australia")
  },
  "Japan": {
    cities: ["Tokyo", "Osaka", "Kyoto"],
    tutors: tutorData.filter(tutor => tutor.country === "Japan")
  },
  "South Korea": {
    cities: ["Seoul", "Busan", "Incheon"],
    tutors: tutorData.filter(tutor => tutor.country === "South Korea")
  },
  "Canada": {
    cities: ["Toronto", "Vancouver", "Montreal"],
    tutors: tutorData.filter(tutor => tutor.country === "Canada")
  },
  "Brazil": {
    cities: ["São Paulo", "Rio de Janeiro", "Brasília"],
    tutors: tutorData.filter(tutor => tutor.country === "Brazil")
  },
  "Mexico": {
    cities: ["Mexico City", "Guadalajara", "Monterrey"],
    tutors: tutorData.filter(tutor => tutor.country === "Mexico")
  },
  "Poland": {
    cities: ["Warsaw", "Kraków", "Łódź"],
    tutors: tutorData.filter(tutor => tutor.country === "Poland")
  },
  "United Arab Emirates": {
    cities: ["Dubai", "Abu Dhabi", "Sharjah"],
    tutors: tutorData.filter(tutor => tutor.country === "United Arab Emirates")
  },
  "Ireland": {
    cities: ["Dublin", "Cork", "Limerick"],
    tutors: tutorData.filter(tutor => tutor.country === "Ireland")
  },
  "Germany": {
    cities: ["Berlin", "Munich", "Hamburg"],
    tutors: tutorData.filter(tutor => tutor.country === "Germany")
  },
  "Russia": {
    cities: ["Moscow", "Saint Petersburg", "Novosibirsk"],
    tutors: tutorData.filter(tutor => tutor.country === "Russia")
  }
};

const eyeIconStyles = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
    }
    50% {
      transform: scale(1.2);
      box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
    }
  }

  @keyframes searchHighlight {
    0% {
      background-color: rgba(255, 215, 0, 0.1);
      transform: scale(1);
    }
    50% {
      background-color: rgba(255, 215, 0, 0.3);
      transform: scale(1.1);
    }
    100% {
      background-color: rgba(255, 215, 0, 0.1);
      transform: scale(1);
    }
  }

  .tutor-eye-icon-wrapper {
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1000;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .tutor-eye-icon-wrapper.search-highlight {
    animation: searchHighlight 1.5s ease-in-out infinite;
  }

  .tutor-eye-icon {
    transition: transform 0.2s ease;
    filter: drop-shadow(0 0 3px rgba(0,0,0,0.5)) !important;
  }

  .tutor-eye-icon-wrapper:hover .tutor-eye-icon {
    transform: scale(1.1);
  }

  .tutor-eye-icon-wrapper.active .tutor-eye-icon {
    animation: pulse 1s infinite;
  }

  .tutor-eye-icon-wrapper.active {
    background-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
`;

const StudentFindTutor = () => {
  const globeEl = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tutorPosition, setTutorPosition] = useState({ x: 0, y: 0 });
  const { isOpen: isMessageModalOpen, onOpen: onMessageModalOpen, onClose: onMessageModalClose } = useDisclosure();
  const [messageText, setMessageText] = useState('');
  const toast = useToast();
  
  // State to track subject search
  const [subjectSearchIndex, setSubjectSearchIndex] = useState(0);
  const [subjectSearchTutors, setSubjectSearchTutors] = useState([]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = eyeIconStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Search and filter tutors
  const handleSearch = () => {
    // Normalize and trim the search term
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Support multiple search formats
    const searchParts = normalizedSearch.split(',').map(part => part.trim());
    
    // Find tutors matching the search criteria
    const matchingTutors = tutorData.filter(tutor => {
      // Combine all searchable fields
      const searchFields = [
        tutor.name.toLowerCase(), 
        tutor.country.toLowerCase(), 
        tutor.subject.toLowerCase(),
        // Add additional searchable fields like city or skills
        ...(tutorCountryMap[tutor.country]?.cities || []).map(city => city.toLowerCase())
      ];

      // If only one search term, do broad search
      if (searchParts.length === 1) {
        return searchFields.some(field => 
          field.includes(normalizedSearch)
        );
      }
      
      // Multi-parameter search with partial matching
      return searchParts.every(part => 
        searchFields.some(field => field.includes(part))
      );
    });

    // Set filtered tutors and selected subject
    setFilteredTutors(matchingTutors);
    setSelectedSubject(searchTerm);
    setCurrentTutorIndex(0);

    // If tutors found, select first tutor and rotate globe
    if (matchingTutors.length > 0) {
      setSelectedTutor(matchingTutors[0]);
      
      // Rotate globe to first tutor's location
      if (globeEl.current) {
        // Get current point of view to preserve zoom
        const currentView = globeEl.current.pointOfView();

        globeEl.current.pointOfView({
          lat: matchingTutors[0].lat, 
          lng: matchingTutors[0].lng, 
          altitude: currentView.altitude  // Preserve current altitude
        }, 1000);

        // Add highlight to matching eye icons
        setTimeout(() => {
          // Remove previous highlights
          document.querySelectorAll('.tutor-eye-icon-wrapper').forEach(el => {
            el.classList.remove('search-highlight');
          });

          // Highlight matching tutor icons
          matchingTutors.forEach(tutor => {
            const eyeIcon = document.querySelector(`.tutor-eye-icon-wrapper[data-tutor-id="${tutor.id}"]`);
            if (eyeIcon) {
              eyeIcon.classList.add('search-highlight');
            }
          });
        }, 1000); // Delay to match globe rotation
      }
    } else {
      setSelectedTutor(null);
      toast({
        title: "No Tutors Found",
        description: `No tutors found for "${searchTerm}"`,
        status: "warning",
        duration: 2000,
        isClosable: true
      });
    }
  };

  // Cycle through tutors when clicking next
  const handleNextTutor = () => {
    if (filteredTutors.length > 0) {
      const nextIndex = (currentTutorIndex + 1) % filteredTutors.length;
      const nextTutor = filteredTutors[nextIndex];
      
      setCurrentTutorIndex(nextIndex);
      setSelectedTutor(nextTutor);

      // Rotate globe to next tutor's location
      if (globeEl.current) {
        const currentView = globeEl.current.pointOfView();
        globeEl.current.pointOfView({
          lat: nextTutor.lat, 
          lng: nextTutor.lng, 
          altitude: currentView.altitude
        }, 1000);

        // Add animation to the corresponding eye icon
        setTimeout(() => {
          // Remove any previous active states
          document.querySelectorAll('.tutor-eye-icon-wrapper').forEach(el => {
            el.classList.remove('active');
          });

          // Find and animate the eye icon for the next tutor
          const nextEyeIcon = document.querySelector(`.tutor-eye-icon-wrapper[data-tutor-id="${nextTutor.id}"]`);
          if (nextEyeIcon) {
            nextEyeIcon.classList.add('active');

            // Remove active class after animation completes
            setTimeout(() => {
              nextEyeIcon.classList.remove('active');
            }, 1000);
          }
        }, 1000); // Delay to match globe rotation
      }
    }
  };

  // Cycle through tutors for the current subject
  const cycleNextTutor = () => {
    if (filteredTutors.length > 1) {
      const nextIndex = (currentTutorIndex + 1) % filteredTutors.length;
      setCurrentTutorIndex(nextIndex);
      setSelectedTutor(filteredTutors[nextIndex]);
      
      // Rotate globe to new tutor's location
      if (globeEl.current) {
        // Get current point of view to preserve zoom
        const currentView = globeEl.current.pointOfView();

        globeEl.current.pointOfView({
          lat: filteredTutors[nextIndex].lat, 
          lng: filteredTutors[nextIndex].lng, 
          altitude: currentView.altitude  // Preserve current altitude
        }, 1000);
      }
    } else {
      toast({
        title: "No More Tutors",
        description: "There are no other tutors for this subject.",
        status: "info",
        duration: 2000,
        isClosable: true
      });
    }
  };

  // Cycle to previous tutor
  const handlePreviousTutor = () => {
    if (filteredTutors.length > 0) {
      // Calculate previous index, wrapping around if needed
      const prevIndex = (currentTutorIndex - 1 + filteredTutors.length) % filteredTutors.length;
      const prevTutor = filteredTutors[prevIndex];
      
      setCurrentTutorIndex(prevIndex);
      setSelectedTutor(prevTutor);

      // Rotate globe to previous tutor's location
      if (globeEl.current) {
        const currentView = globeEl.current.pointOfView();
        globeEl.current.pointOfView({
          lat: prevTutor.lat, 
          lng: prevTutor.lng, 
          altitude: currentView.altitude
        }, 1000);

        // Add animation to the corresponding eye icon
        setTimeout(() => {
          // Remove any previous active states
          document.querySelectorAll('.tutor-eye-icon-wrapper').forEach(el => {
            el.classList.remove('active');
          });

          // Find and animate the eye icon for the previous tutor
          const prevEyeIcon = document.querySelector(`.tutor-eye-icon-wrapper[data-tutor-id="${prevTutor.id}"]`);
          if (prevEyeIcon) {
            prevEyeIcon.classList.add('active');

            // Remove active class after animation completes
            setTimeout(() => {
              prevEyeIcon.classList.remove('active');
            }, 1000);
          }
        }, 1000); // Delay to match globe rotation
      }
    }
  };

  // Generate eye icons from tutor data
  const eyeIcons = useMemo(() => {
    return tutorData.map(tutor => ({
      type: 'point', 
      lat: tutor.lat, 
      lng: tutor.lng,
      color: 'rgba(255, 0, 0, 0.7)',
      radius: 0.3,
      tutor: tutor,
      label: () => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.zIndex = '1000';
        div.style.pointerEvents = 'auto';
        div.style.cursor = 'pointer';
        
        div.innerHTML = `
          <div class="tutor-eye-icon-wrapper" data-tutor-id="${tutor.id}">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="30" 
              height="30" 
              viewBox="0 0 24 24" 
              class="tutor-eye-icon"
              style="filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));"
            >
              <g fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5C5.5 5 2 12 2 12s3.5 7 10 7 10 -7 10 -7 -3.5 -7 -10 -7Z" />
                <circle cx="12" cy="12" r="3" fill="#FFD700" />
              </g>
            </svg>
          </div>
        `;
        
        // Add click event listener to the wrapper
        div.querySelector('.tutor-eye-icon-wrapper').addEventListener('click', (event) => {
          event.stopPropagation();
          handleTutorSelect(tutor, event);
        });
        
        return div;
      }
    }));
  }, []);

  // Realistic globe theme
  const mapTheme = {
    background: 'black',         // Deep space-like background
    textColor: '#FFFFFF',        // White text
    accentColor: '#4A90E2',      // Soft blue accent
    borderColor: 'rgba(0,0,0,0.8)', // Black border with slight transparency
    globeOverlay: 'rgba(255, 0, 0, 0.1)'  // Transparent red overlay
  };

  // Realistic lighting configuration
  const lightConfig = {
    ambientLightColor: '#202020',     // Soft ambient light
    diffuseLightColor: '#FFFFFF',     // White diffuse light
    specularLightColor: '#FFFFFF',    // White specular highlights
  };

  useEffect(() => {
    // Fetch world countries data
    fetch('//unpkg.com/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(worldJson => {
        // Use topojson to convert to GeoJSON
        const countries = topojson.feature(worldJson, worldJson.objects.countries);
        setCountries(countries);
      })
      .catch(error => {
        console.error('Failed to fetch world data:', error);
      });
  }, []);

  useEffect(() => {
    // Customize globe appearance
    if (globeEl.current) {
      // Base zoom level set to 0.6 - current optimal view
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 0.6 });
      
      // Disable zooming, enable rotation
      globeEl.current.controls().enableRotate = true;
      globeEl.current.controls().rotateSpeed = 1.0;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      if (selectedTutor) {
        globeEl.current.controls().enableRotate = false;
      } else {
        globeEl.current.controls().enableRotate = true;
      }
    }
  }, [selectedTutor]);

  // Handle tutor selection and tooltip positioning
  const handleTutorSelect = (tutor, event) => {
    // Find the closest eye icon wrapper
    const eyeIconWrapper = event.target.closest('.tutor-eye-icon-wrapper');
    
    if (eyeIconWrapper) {
      // Remove any previous active states
      document.querySelectorAll('.tutor-eye-icon-wrapper').forEach(el => {
        el.classList.remove('active');
      });

      // Add active class to trigger animation
      eyeIconWrapper.classList.add('active');

      // Remove active class after animation completes
      setTimeout(() => {
        eyeIconWrapper.classList.remove('active');
      }, 1000);

      // Get precise bounding rectangle of the eye icon
      const iconRect = eyeIconWrapper.getBoundingClientRect();
      
      // Calculate the center of the eye icon
      const iconCenterX = iconRect.left + iconRect.width / 2;
      const iconCenterY = iconRect.top + iconRect.height / 2;
      
      // Set the tutor position to the exact center of the eye icon
      setTutorPosition({
        x: iconCenterX,
        y: iconCenterY
      });
      
      // Set the selected tutor
      setSelectedTutor(tutor);
    }
  };

  // Handle sending a message to the tutor
  const handleSendMessage = async () => {
    if (!selectedTutor || messageText.trim() === '') {
      toast({
        title: "Message Error",
        description: "Please enter a message before sending.",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      // TODO: Replace with actual API call to send message
      console.log('Sending message to:', selectedTutor.name);
      console.log('Message:', messageText);

      // Simulate message sending
      await new Promise(resolve => setTimeout(resolve, 500));

      // Close modal and show success toast
      onMessageModalClose();
      setMessageText('');
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedTutor.name}`,
        status: "success",
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: "Message Send Failed",
        description: "Unable to send message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Flex>
      <StudentSidebar />

      <Box ml="250px" width="calc(100% - 250px)" mt="85px" pb={8} px={6} position="relative">
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading 
              as="h1" 
              size="xl" 
              color="#640101"
              borderBottom="2px solid #640101"
              pb={2}
            >
              <Flex alignItems="center">
                <FaUserCircle style={{ marginRight: '15px' }} />
                Find a Tutor
              </Flex>
            </Heading>

            {/* Search Bar */}
            <InputGroup>
              <HStack spacing={2} width="100%">
                <Input
                  placeholder="Search Tutors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  flex={1}
                />
                <IconButton
                  icon={<FaSearch />}
                  colorScheme="blue"
                  aria-label="Search Tutors"
                  onClick={handleSearch}
                />
                {filteredTutors.length > 1 && (
                  <IconButton
                    icon={<FaArrowLeft />}
                    colorScheme="red"
                    aria-label="Previous Tutor"
                    onClick={handlePreviousTutor}
                  />
                )}
                <IconButton
                  icon={<FaArrowRight />}
                  colorScheme="green"
                  aria-label="Next Tutor"
                  onClick={handleNextTutor}
                  isDisabled={filteredTutors.length <= 1}
                />
              </HStack>
            </InputGroup>

            {/* Interactive Globe */}
            <Box 
              width="full" 
              height="600px" 
              bg={mapTheme.background}
              borderRadius="lg"
              overflow="hidden"
              position="relative"
              className="globe-container"
            >
              <Globe
                ref={globeEl}
                width="100%"
                height="100%"
                backgroundColor={mapTheme.background}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                
                // Auto-rotation settings
                autoRotate={!selectedTutor}
                autoRotateSpeed={0.5}
                
                // 3D Elevation Effects
                showAtmosphere={true}
                atmosphereColor="rgba(255, 255, 255, 0.1)"
                atmosphereAltitude={0.25}
                
                // Lighting and Depth
                enableLighting={true}
                ambientLightColor={lightConfig.ambientLightColor}
                diffuseLightColor={lightConfig.diffuseLightColor}
                specularLightColor={lightConfig.specularLightColor}
                lightPosition={{ lat: 45, lng: 0, altitude: 2 }}
                
                // Country borders
                polygonsData={countries ? countries.features : []}
                polygonLat={d => d3.geoPath().centroid(d)[1]}
                polygonLng={d => d3.geoPath().centroid(d)[0]}
                polygonCapColor={() => 'transparent'}
                polygonSideColor={() => mapTheme.borderColor}
                polygonStrokeColor={() => mapTheme.borderColor}
                polygonStrokeWidth={1.5}
                polygonAltitude={0.005}  // Minimal elevation for borders
                
                // Disable default point rendering
                pointColor={() => 'transparent'}
                pointRadius={0}
                
                // Eye Icons
                htmlElementsData={eyeIcons}
                htmlLat={d => d.lat}
                htmlLng={d => d.lng}
                htmlElement={d => d.label()}
                
                // Polygon hover interaction
                onPolygonHover={(polygon) => {
                  setHoveredCountry(polygon ? polygon.properties.name : null);
                }}
              />

              {/* Tutor Info Pointing Box */}
              {selectedTutor && (
                <Box
                  position="fixed"
                  left={`${tutorPosition.x}px`}
                  top={`${tutorPosition.y}px`}
                  transform="translate(-50%, -50%)"
                  zIndex={1000}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  p={2}
                  maxWidth="250px"
                  width="100%"
                >
                  <Flex alignItems="center">
                    <Avatar 
                      src={selectedTutor.profilePhoto} 
                      size="sm" 
                      mr={2} 
                    />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="bold" fontSize="sm">
                        {selectedTutor.name}
                      </Text>
                      <Text color="brand.primary0" fontSize="xs">
                        {selectedTutor.subject}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <HStack>
                        <Icon as={FaStar} color="yellow.400" boxSize={3} />
                        <Text fontSize="xs" fontWeight="bold">
                          {selectedTutor.rating}
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <IconButton
                          icon={<FaUserCircle />}
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          aria-label="View Profile"
                          onClick={() => {
                            // TODO: Implement profile view logic
                            console.log('View Profile:', selectedTutor.name);
                          }}
                        />
                        <IconButton
                          icon={<FaCommentDots />}
                          size="xs"
                          variant="ghost"
                          colorScheme="green"
                          aria-label="Send Message"
                          onClick={() => {
                            onMessageModalOpen();
                          }}
                        />
                        <IconButton
                          icon={<FaTimes />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          aria-label="Close"
                          onClick={() => setSelectedTutor(null)}
                        />
                      </HStack>
                    </VStack>
                  </Flex>
                </Box>
              )}

              {/* Message Modal */}
              <Modal 
                isOpen={isMessageModalOpen} 
                onClose={onMessageModalClose}
                size="md"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Send Message to {selectedTutor?.name}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack spacing={4}>
                      <Avatar 
                        src={selectedTutor?.profilePhoto} 
                        size="xl" 
                        name={selectedTutor?.name} 
                      />
                      <Text fontWeight="bold">
                        {selectedTutor?.subject} Tutor
                      </Text>
                      <Textarea 
                        placeholder={`Write a message to ${selectedTutor?.name}`}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={4}
                      />
                    </VStack>
                  </ModalBody>
                  <ModalFooter>
                    <Button 
                      colorScheme="blue" 
                      mr={3} 
                      onClick={handleSendMessage}
                      isDisabled={messageText.trim() === ''}
                    >
                      Send Message
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={onMessageModalClose}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* Red Overlay for 3D Glasses Effect */}
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                backgroundColor={mapTheme.globeOverlay}
                pointerEvents="none"
                zIndex="10"
              />
            </Box>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default StudentFindTutor;
