import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow, 
  Flex, 
  Icon, 
  Card, 
  CardHeader, 
  CardBody, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Button,
  List,
  ListItem,
  ListIcon,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Select,
  FormControl,
  FormLabel,
  Stack,
  InputGroup,
  InputLeftElement,
  IconButton,
  useToast,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack
} from '@chakra-ui/react';
import InstitutionSidebar from '../components/InstitutionSidebar';
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaBook, 
  FaCalendarAlt, 
  FaUsers,
  FaUserGraduate,
  FaChartLine,
  FaExclamationTriangle,
  FaBullhorn,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaFileUpload,
  FaFolder,
  FaFolderOpen,
  FaArrowLeft,
  FaEllipsisV,
  FaTimes,
  FaPencilAlt
} from 'react-icons/fa';

const InstitutionDashboard = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [newStudent, setNewStudent] = useState({
    name: '',
    id: '',
    email: '',
    grade: 'A',
    class: 'Class 1'
  });
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [gradeToAssign, setGradeToAssign] = useState('A');
  const [classToAssign, setClassToAssign] = useState('Class 1');
  const [currentLevel, setCurrentLevel] = useState('grades');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newItemName, setNewItemName] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [grades, setGrades] = useState([
    { id: 1, name: 'Grade 1', classes: [
      { id: 1, name: 'Class 1A', courses: [
        { id: 1, name: 'Mathematics', description: 'Basic mathematics concepts', instructor: 'Dr. Johnson', status: 'active', enrolledStudents: [
          { id: "ST001", name: "John Doe", email: "john.doe@example.com", grade: "A" },
          { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", grade: "A-" },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A+" }
        ]},
        { id: 2, name: 'Science', description: 'Introduction to natural sciences', instructor: 'Prof. Smith', status: 'active', enrolledStudents: [
          { id: "ST001", name: "John Doe", email: "john.doe@example.com", grade: "B+" },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A" }
        ]},
        { id: 3, name: 'English', description: 'English language fundamentals', instructor: 'Ms. Williams', status: 'active', enrolledStudents: [
          { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", grade: "B" },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A-" }
        ]}
      ]},
      { id: 2, name: 'Class 1B', courses: [
        { id: 4, name: 'Mathematics', description: 'Basic mathematics concepts', instructor: 'Dr. Johnson', status: 'active', enrolledStudents: [
          { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", grade: "B+" },
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "C+" }
        ]},
        { id: 5, name: 'Science', description: 'Introduction to natural sciences', instructor: 'Prof. Smith', status: 'active', enrolledStudents: [
          { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", grade: "A-" },
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "B" },
          { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", grade: "A" }
        ]},
        { id: 6, name: 'History', description: 'World history overview', instructor: 'Dr. Adams', status: 'active', enrolledStudents: [
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "B-" },
          { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", grade: "A-" }
        ]}
      ]}
    ]},
    { id: 2, name: 'Grade 2', classes: [
      { id: 3, name: 'Class 2A', courses: [
        { id: 7, name: 'Mathematics', description: 'Intermediate mathematics', instructor: 'Dr. Peterson', status: 'active', enrolledStudents: [
          { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", grade: "B+" },
          { id: "ST007", name: "James Miller", email: "james.m@example.com", grade: "B-" }
        ]},
        { id: 8, name: 'Science', description: 'Natural sciences exploration', instructor: 'Dr. Rodriguez', status: 'active', enrolledStudents: [
          { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", grade: "A-" },
          { id: "ST007", name: "James Miller", email: "james.m@example.com", grade: "C+" }
        ]},
        { id: 9, name: 'Geography', description: 'World geography fundamentals', instructor: 'Prof. Clark', status: 'active', enrolledStudents: [
          { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", grade: "B" },
          { id: "ST007", name: "James Miller", email: "james.m@example.com", grade: "B" }
        ]}
      ]},
      { id: 4, name: 'Class 2B', courses: [
        { id: 10, name: 'Mathematics', description: 'Intermediate mathematics', instructor: 'Dr. Peterson', status: 'active', enrolledStudents: [
          { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", grade: "A" },
          { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", grade: "B+" }
        ]},
        { id: 11, name: 'Science', description: 'Natural sciences exploration', instructor: 'Dr. Rodriguez', status: 'active', enrolledStudents: [
          { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", grade: "B+" },
          { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", grade: "A-" }
        ]},
        { id: 12, name: 'Art', description: 'Visual arts and expression', instructor: 'Ms. Martinez', status: 'active', enrolledStudents: [
          { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", grade: "A+" },
          { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", grade: "A" }
        ]}
      ]}
    ]},
    { id: 3, name: 'Grade 3', classes: [
      { id: 5, name: 'Class 3A', courses: [
        { id: 13, name: 'Mathematics', description: 'Advanced mathematics concepts', instructor: 'Prof. Thompson', status: 'active', enrolledStudents: [
          { id: "ST001", name: "John Doe", email: "john.doe@example.com", grade: "B" },
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "C" }
        ]},
        { id: 14, name: 'Science', description: 'Advanced scientific principles', instructor: 'Dr. Richardson', status: 'active', enrolledStudents: [
          { id: "ST001", name: "John Doe", email: "john.doe@example.com", grade: "B+" },
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "B-" }
        ]},
        { id: 15, name: 'Music', description: 'Music theory and practice', instructor: 'Mr. Wilson', status: 'active', enrolledStudents: [
          { id: "ST001", name: "John Doe", email: "john.doe@example.com", grade: "A-" },
          { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "B+" }
        ]}
      ]},
      { id: 6, name: 'Class 3B', courses: [
        { id: 16, name: 'Mathematics', description: 'Advanced mathematics concepts', instructor: 'Prof. Thompson', status: 'active', enrolledStudents: [
          { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", grade: "A" },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A-" }
        ]},
        { id: 17, name: 'Science', description: 'Advanced scientific principles', instructor: 'Dr. Richardson', status: 'active', enrolledStudents: [
          { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", grade: "B+" },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A" }
        ]},
        { id: 18, name: 'Physical Education', description: 'Physical fitness and sports', instructor: 'Coach Roberts', status: 'active', enrolledStudents: [
          { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", grade: "A+" },
          { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A" }
        ]}
      ]}
    ]}
  ]);

  // Mock data for dashboard
  const stats = {
    students: { total: 2456, increase: 8.5 },
    instructors: { total: 98, increase: 2.1 },
    courses: { total: 156, increase: 12.7 },
    classes: { total: 243, increase: 5.3 }
  };
  
  const recentActivities = [
    { id: 1, action: "New instructor registered", user: "Dr. Sarah Johnson", time: "2 hours ago" },
    { id: 2, action: "New course created", user: "Prof. Michael Wright", time: "4 hours ago" },
    { id: 3, action: "Class schedule updated", user: "Admin", time: "Yesterday" },
    { id: 4, action: "Student enrollment completed", user: "Admin", time: "Yesterday" },
    { id: 5, action: "Grades published", user: "Prof. Jane Smith", time: "2 days ago" }
  ];
  
  const upcomingEvents = [
    { id: 1, title: "Spring Semester Registration", date: "Jan 15, 2024", status: "upcoming" },
    { id: 2, title: "Faculty Meeting", date: "Jan 10, 2024", status: "upcoming" },
    { id: 3, title: "Curriculum Review", date: "Jan 12, 2024", status: "upcoming" }
  ];

  const alerts = [
    { id: 1, message: "Final grade submission deadline approaching", type: "warning" },
    { id: 2, message: "Course enrollment capacity reached for CS101", type: "info" },
    { id: 3, message: "System maintenance scheduled for January 10", type: "warning" }
  ];

  // Mock data for students
  const [students, setStudents] = useState([
    { id: "ST001", name: "John Doe", email: "john.doe@example.com", grade: "A", class: "Class 1" },
    { id: "ST002", name: "Jane Smith", email: "jane.smith@example.com", grade: "B+", class: "Class 2" },
    { id: "ST003", name: "Michael Johnson", email: "michael.j@example.com", grade: "A-", class: "Class 1" },
    { id: "ST004", name: "Emily Williams", email: "emily.w@example.com", grade: "B", class: "Class 3" },
    { id: "ST005", name: "Robert Brown", email: "robert.b@example.com", grade: "C+", class: "Class 2" },
    { id: "ST006", name: "Sarah Davis", email: "sarah.d@example.com", grade: "A+", class: "Class 1" },
    { id: "ST007", name: "James Miller", email: "james.m@example.com", grade: "B-", class: "Class 3" },
    { id: "ST008", name: "Jennifer Wilson", email: "jennifer.w@example.com", grade: "A", class: "Class 2" }
  ]);

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter students for the Add Student tab
  const filteredStudentsForSelection = students.filter(student => 
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Handle student addition
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.id || !newStudent.email) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if ID already exists
    if (students.some(student => student.id === newStudent.id)) {
      toast({
        title: "Duplicate ID",
        description: "A student with this ID already exists.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setStudents([...students, newStudent]);
    setNewStudent({ name: '', id: '', email: '', grade: 'A', class: 'Class 1' });
    
    toast({
      title: "Student Added",
      description: "The student has been successfully added.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Switch to student list tab
    setTabIndex(0);
  };

  // Handle student deletion
  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
    
    toast({
      title: "Student Removed",
      description: "The student has been successfully removed.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle input change for new student form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  // Get grade color
  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return "green";
    if (grade.startsWith('B')) return "blue";
    if (grade.startsWith('C')) return "yellow";
    if (grade.startsWith('D')) return "orange";
    return "red";
  };

  // Handle student selection toggle
  const toggleStudentSelection = (student) => {
    if (selectedStudents.some(s => s.id === student.id)) {
      // If student is already selected, remove
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      // If student is not selected, add
      setSelectedStudents([...selectedStudents, student]);
    }
  };
  
  // Handle grade assignment
  const handleAssignGrade = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student to assign a grade.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Update grades for selected students
    const updatedStudents = students.map(student => {
      if (selectedStudents.some(s => s.id === student.id)) {
        return { ...student, grade: gradeToAssign };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    
    toast({
      title: "Grades Updated",
      description: `Successfully assigned grade ${gradeToAssign} to ${selectedStudents.length} student(s).`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle class assignment
  const handleAssignClass = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student to assign a class.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Update classes for selected students
    const updatedStudents = students.map(student => {
      if (selectedStudents.some(s => s.id === student.id)) {
        return { ...student, class: classToAssign };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    
    toast({
      title: "Classes Updated",
      description: `Successfully assigned class ${classToAssign} to ${selectedStudents.length} student(s).`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Clear selected students
  const clearSelectedStudents = () => {
    setSelectedStudents([]);
  };

  // Functions to handle navigation
  const handleGradeClick = (grade) => {
    setSelectedGrade(grade);
    setCurrentLevel('classes');
  };
  
  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setCurrentLevel('courses');
  };
  
  const handleBackClick = () => {
    if (currentLevel === 'courses') {
      setCurrentLevel('classes');
      setSelectedClass(null);
    } else if (currentLevel === 'classes') {
      setCurrentLevel('grades');
      setSelectedGrade(null);
    }
  };
  
  // Function to handle creating new item
  const handleCreateNewItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentLevel === 'grades') {
      // Add new grade
      const newGrade = {
        id: Math.max(...grades.map(g => g.id), 0) + 1,
        name: newItemName,
        classes: []
      };
      setGrades([...grades, newGrade]);
    } else if (currentLevel === 'classes' && selectedGrade) {
      // Add new class to current grade
      const newClass = {
        id: Math.max(...grades.flatMap(g => g.classes.map(c => c.id)), 0) + 1,
        name: newItemName,
        courses: []
      };
      
      const updatedGrades = grades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: [...grade.classes, newClass]
          };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
      setSelectedGrade({
        ...selectedGrade,
        classes: [...selectedGrade.classes, newClass]
      });
    } else if (currentLevel === 'courses' && selectedGrade && selectedClass) {
      // Add new course to current class
      const newCourse = {
        id: Math.max(...grades.flatMap(g => g.classes.flatMap(c => c.courses.map(course => course.id))), 0) + 1,
        name: newItemName
      };
      
      const updatedGrades = grades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: [...classItem.courses, newCourse]
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
      
      // Update selectedClass
      const updatedClass = {
        ...selectedClass,
        courses: [...selectedClass.courses, newCourse]
      };
      setSelectedClass(updatedClass);
    }
    
    toast({
      title: `New ${currentLevel === 'grades' ? 'Grade' : currentLevel === 'classes' ? 'Class' : 'Course'} Created`,
      description: `${newItemName} has been created successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    setNewItemName('');
    onClose();
  };

  // Function to delete an item
  const handleDeleteItem = () => {
    if (!itemToEdit) return;
    
    if (currentLevel === 'grades') {
      // Delete grade
      setGrades(grades.filter(grade => grade.id !== itemToEdit.id));
    } else if (currentLevel === 'classes' && selectedGrade) {
      // Delete class from the current grade
      const updatedGrades = grades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.filter(classItem => classItem.id !== itemToEdit.id)
          };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
      
      // Update selectedGrade to reflect changes
      setSelectedGrade({
        ...selectedGrade,
        classes: selectedGrade.classes.filter(classItem => classItem.id !== itemToEdit.id)
      });
    } else if (currentLevel === 'courses' && selectedGrade && selectedClass) {
      // Delete course from the current class
      const updatedGrades = grades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: classItem.courses.filter(course => course.id !== itemToEdit.id)
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
      
      // Update selectedClass
      setSelectedClass({
        ...selectedClass,
        courses: selectedClass.courses.filter(course => course.id !== itemToEdit.id)
      });
    }
    
    toast({
      title: "Item Deleted",
      description: `${itemToEdit.name} has been deleted successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    setIsDeleteModalOpen(false);
    setItemToEdit(null);
    setIsEditMode(false);
  };

  // Function to rename an item
  const handleRenameItem = () => {
    if (!newName.trim() || !itemToEdit) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (currentLevel === 'grades') {
      // Rename grade
      const updatedGrades = grades.map(grade => {
        if (grade.id === itemToEdit.id) {
          return { ...grade, name: newName };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
    } else if (currentLevel === 'classes' && selectedGrade) {
      // Rename class in the current grade
      const updatedGrades = grades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === itemToEdit.id) {
                return { ...classItem, name: newName };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
      
      // Update selectedGrade
      setSelectedGrade({
        ...selectedGrade,
        classes: selectedGrade.classes.map(classItem => {
          if (classItem.id === itemToEdit.id) {
            return { ...classItem, name: newName };
          }
          return classItem;
        })
      });
      
      // If the renamed class is the currently selected class, update it
      if (selectedClass && selectedClass.id === itemToEdit.id) {
        setSelectedClass({ ...selectedClass, name: newName });
      }
    } else if (currentLevel === 'courses' && selectedGrade && selectedClass) {
      // Rename course in the current class
      const updatedGrades = grades.map(grade => {
        if (grade.id === selectedGrade.id) {
          return {
            ...grade,
            classes: grade.classes.map(classItem => {
              if (classItem.id === selectedClass.id) {
                return {
                  ...classItem,
                  courses: classItem.courses.map(course => {
                    if (course.id === itemToEdit.id) {
                      return { ...course, name: newName };
                    }
                    return course;
                  })
                };
              }
              return classItem;
            })
          };
        }
        return grade;
      });
      
      setGrades(updatedGrades);
      
      // Update selectedClass
      setSelectedClass({
        ...selectedClass,
        courses: selectedClass.courses.map(course => {
          if (course.id === itemToEdit.id) {
            return { ...course, name: newName };
          }
          return course;
        })
      });
    }
    
    toast({
      title: "Item Renamed",
      description: `Item has been renamed to ${newName} successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    setIsRenameModalOpen(false);
    setNewName('');
    setItemToEdit(null);
    setIsEditMode(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setItemToEdit(null);
    }
  };

  // Variable for selected course details
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseDetailOpen, setIsCourseDetailOpen] = useState(false);

  // Function to handle course click
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsCourseDetailOpen(true);
  };

  // Function to handle adding a student to a course
  const handleAddStudentToCourse = (student) => {
    if (!selectedCourse) return;
    
    // Check if student is already enrolled
    if (selectedCourse.enrolledStudents.some(s => s.id === student.id)) {
      toast({
        title: "Student Already Enrolled",
        description: `${student.name} is already enrolled in this course.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create updated grades with the new student added to the course
    const updatedGrades = grades.map(grade => {
      if (grade.id === selectedGrade.id) {
        return {
          ...grade,
          classes: grade.classes.map(classItem => {
            if (classItem.id === selectedClass.id) {
              return {
                ...classItem,
                courses: classItem.courses.map(course => {
                  if (course.id === selectedCourse.id) {
                    return {
                      ...course,
                      enrolledStudents: [...course.enrolledStudents, { ...student, grade: "N/A" }]
                    };
                  }
                  return course;
                })
              };
            }
            return classItem;
          })
        };
      }
      return grade;
    });
    
    // Update state
    setGrades(updatedGrades);
    
    // Update selected course
    setSelectedCourse({
      ...selectedCourse,
      enrolledStudents: [...selectedCourse.enrolledStudents, { ...student, grade: "N/A" }]
    });
    
    toast({
      title: "Student Enrolled",
      description: `${student.name} has been enrolled in ${selectedCourse.name}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to handle removing a student from a course
  const handleRemoveStudentFromCourse = (studentId) => {
    if (!selectedCourse) return;
    
    // Find student name for the toast message
    const studentToRemove = selectedCourse.enrolledStudents.find(s => s.id === studentId);
    if (!studentToRemove) return;
    
    // Create updated grades with the student removed from the course
    const updatedGrades = grades.map(grade => {
      if (grade.id === selectedGrade.id) {
        return {
          ...grade,
          classes: grade.classes.map(classItem => {
            if (classItem.id === selectedClass.id) {
              return {
                ...classItem,
                courses: classItem.courses.map(course => {
                  if (course.id === selectedCourse.id) {
                    return {
                      ...course,
                      enrolledStudents: course.enrolledStudents.filter(student => student.id !== studentId)
                    };
                  }
                  return course;
                })
              };
            }
            return classItem;
          })
        };
      }
      return grade;
    });
    
    // Update state
    setGrades(updatedGrades);
    
    // Update selected course
    setSelectedCourse({
      ...selectedCourse,
      enrolledStudents: selectedCourse.enrolledStudents.filter(student => student.id !== studentId)
    });
    
    toast({
      title: "Student Removed",
      description: `${studentToRemove.name} has been removed from ${selectedCourse.name}.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to update a student's grade in a course
  const handleUpdateStudentGrade = (studentId, newGrade) => {
    if (!selectedCourse) return;
    
    // Create updated grades with the student's grade updated
    const updatedGrades = grades.map(grade => {
      if (grade.id === selectedGrade.id) {
        return {
          ...grade,
          classes: grade.classes.map(classItem => {
            if (classItem.id === selectedClass.id) {
              return {
                ...classItem,
                courses: classItem.courses.map(course => {
                  if (course.id === selectedCourse.id) {
                    return {
                      ...course,
                      enrolledStudents: course.enrolledStudents.map(student => {
                        if (student.id === studentId) {
                          return { ...student, grade: newGrade };
                        }
                        return student;
                      })
                    };
                  }
                  return course;
                })
              };
            }
            return classItem;
          })
        };
      }
      return grade;
    });
    
    // Update state
    setGrades(updatedGrades);
    
    // Update selected course
    setSelectedCourse({
      ...selectedCourse,
      enrolledStudents: selectedCourse.enrolledStudents.map(student => {
        if (student.id === studentId) {
          return { ...student, grade: newGrade };
        }
        return student;
      })
    });
    
    toast({
      title: "Grade Updated",
      description: `Student's grade has been updated to ${newGrade}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const [courseForEnrollment, setCourseForEnrollment] = useState(null);

  // Clear selected course for enrollment when changing tabs
  const handleTabChange = (index) => {
    setTabIndex(index);
    if (index !== 2) { // If not on the Add Student tab
      setCourseForEnrollment(null);
    }
  };

  // Handle enrolling selected students in the current course
  const handleEnrollSelectedStudents = () => {
    if (!courseForEnrollment || selectedStudents.length === 0) {
      toast({
        title: "Cannot Enroll Students",
        description: "Please select a course and at least one student.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Find the grade and class for the course
    let foundGrade = null;
    let foundClass = null;
    
    for (const grade of grades) {
      for (const classItem of grade.classes) {
        for (const course of classItem.courses) {
          if (course.id === courseForEnrollment.id) {
            foundGrade = grade;
            foundClass = classItem;
            break;
          }
        }
        if (foundClass) break;
      }
      if (foundGrade) break;
    }
    
    if (!foundGrade || !foundClass) {
      toast({
        title: "Error",
        description: "Could not find the selected course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Filter out students who are already enrolled
    const newStudents = selectedStudents.filter(student => 
      !courseForEnrollment.enrolledStudents.some(enrolled => enrolled.id === student.id)
    );
    
    if (newStudents.length === 0) {
      toast({
        title: "No New Students",
        description: "All selected students are already enrolled in this course.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Add new students to the course
    const studentsToAdd = newStudents.map(student => ({
      ...student,
      grade: "N/A"
    }));
    
    // Update grades state
    const updatedGrades = grades.map(grade => {
      if (grade.id === foundGrade.id) {
        return {
          ...grade,
          classes: grade.classes.map(classItem => {
            if (classItem.id === foundClass.id) {
              return {
                ...classItem,
                courses: classItem.courses.map(course => {
                  if (course.id === courseForEnrollment.id) {
                    return {
                      ...course,
                      enrolledStudents: [...course.enrolledStudents, ...studentsToAdd]
                    };
                  }
                  return course;
                })
              };
            }
            return classItem;
          })
        };
      }
      return grade;
    });
    
    setGrades(updatedGrades);
    
    // Also update the currently selected course if it's the same one
    if (selectedCourse && selectedCourse.id === courseForEnrollment.id) {
      setSelectedCourse({
        ...selectedCourse,
        enrolledStudents: [...selectedCourse.enrolledStudents, ...studentsToAdd]
      });
    }
    
    // Update courseForEnrollment
    setCourseForEnrollment({
      ...courseForEnrollment,
      enrolledStudents: [...courseForEnrollment.enrolledStudents, ...studentsToAdd]
    });
    
    toast({
      title: "Students Enrolled",
      description: `Successfully enrolled ${newStudents.length} student(s) in ${courseForEnrollment.name}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // Clear selected students
    clearSelectedStudents();
    
    // Return to the Grade tab
    setTabIndex(1);
    setIsCourseDetailOpen(true); // Reopen the course details modal
  };

  return (
    <Box>
      <InstitutionSidebar />
      <Container 
        maxW="1190px" 
        mt="80px" 
        ml={{ base: "250px", md: "260px" }} 
        pr={{ base: 1, md: 3 }}
        pl={{ base: 1, md: 3 }}
        overflow="hidden"
      >
        <Box mb={5}>
          <Heading as="h1" size="xl" mb={2} color="#640101">Class Division</Heading>
          <Text color="gray.600">Manage students, grades and classes</Text>
        </Box>

        <Tabs isFitted variant="enclosed" colorScheme="red" index={tabIndex} onChange={handleTabChange}>
          <TabList mb="1em">
            <Tab _selected={{ color: "white", bg: "#640101" }} fontWeight="medium">Student List</Tab>
            <Tab _selected={{ color: "white", bg: "#640101" }} fontWeight="medium">Grade</Tab>
            <Tab _selected={{ color: "white", bg: "#640101" }} fontWeight="medium">Add Student</Tab>
          </TabList>
          
          <TabPanels>
            {/* Student List Tab */}
            <TabPanel>
              <Box mb={5}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="#640101" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search by name, ID, email or class..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderColor="gray.300"
                    _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                  />
                </InputGroup>
              </Box>
              
              <Box overflowX="hidden" borderWidth="1px" borderRadius="lg" borderColor="gray.200">
                <Table variant="simple" colorScheme="gray" size="sm" sx={{
                  'th, td': {
                    px: 2,
                    py: 2,
                    fontSize: 'sm'
                  }
                }}>
                  <Thead bg="#f5f5f5">
                    <Tr>
                      <Th width="12%">ID</Th>
                      <Th width="22%">NAME</Th>
                      <Th width="24%">Email</Th>
                      <Th width="12%">Grade</Th>
                      <Th width="15%">Class</Th>
                      <Th width="15%">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <Tr key={student.id}>
                          <Td>{student.id}</Td>
                          <Td>{student.name}</Td>
                          <Td>
                            <Tooltip label={student.email} placement="top" hasArrow>
                              <Text noOfLines={1} maxW="180px">{student.email}</Text>
                            </Tooltip>
                          </Td>
                          <Td>
                            <Badge colorScheme={getGradeColor(student.grade)} px={2} py={1}>
                              {student.grade}
                            </Badge>
                          </Td>
                          <Td>{student.class}</Td>
                          <Td>
                            <Flex gap={1}>
                              <IconButton 
                                icon={<FaEdit />} 
                                size="xs"
                                colorScheme="blue" 
                                aria-label="Edit student" 
                              />
                              <IconButton 
                                icon={<FaTrash />} 
                                size="xs" 
                                colorScheme="red" 
                                aria-label="Delete student" 
                                onClick={() => handleDeleteStudent(student.id)}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={4}>
                          No students found matching the search criteria.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            {/* Grade Tab */}
            <TabPanel>
              <Box mb={4}>
                {currentLevel !== 'grades' && (
                  <Button 
                    leftIcon={<FaArrowLeft />} 
                    variant="outline" 
                    colorScheme="red" 
                    size="sm"
                    onClick={handleBackClick}
                    mb={4}
                  >
                    Back
                  </Button>
                )}
                
                <Breadcrumb separator=">" mb={6} mt={currentLevel !== 'grades' ? 4 : 0}>
                  <BreadcrumbItem isCurrentPage={currentLevel === 'grades'}>
                    <BreadcrumbLink 
                      onClick={() => setCurrentLevel('grades')}
                      fontWeight={currentLevel === 'grades' ? 'bold' : 'normal'}
                      color={currentLevel === 'grades' ? '#640101' : 'gray.500'}
                    >
                      Grades
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  {selectedGrade && (
                    <BreadcrumbItem isCurrentPage={currentLevel === 'classes'}>
                      <BreadcrumbLink 
                        onClick={() => setCurrentLevel('classes')}
                        fontWeight={currentLevel === 'classes' ? 'bold' : 'normal'}
                        color={currentLevel === 'classes' ? '#640101' : 'gray.500'}
                      >
                        {selectedGrade.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                  
                  {selectedClass && (
                    <BreadcrumbItem isCurrentPage={currentLevel === 'courses'}>
                      <BreadcrumbLink 
                        fontWeight="bold"
                        color="#640101"
                      >
                        {selectedClass.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </Breadcrumb>
                
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="lg" color="#640101">
                    {currentLevel === 'grades' ? 'Grades' : 
                     currentLevel === 'classes' ? `Classes in ${selectedGrade.name}` : 
                     `Courses in ${selectedClass.name}`}
                  </Heading>
                  
                  <Button 
                    leftIcon={<FaPlus />} 
                    colorScheme="red" 
                    bg="#640101"
                    onClick={onOpen}
                  >
                    Create {currentLevel === 'grades' ? 'Grade' : 
                           currentLevel === 'classes' ? 'Class' : 'Course'}
                  </Button>
                </Flex>
                
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                  {currentLevel === 'grades' && grades.map(grade => (
                    <Box 
                      key={grade.id}
                      onClick={isEditMode ? () => setItemToEdit(grade) : () => handleGradeClick(grade)}
                      cursor="pointer"
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      p={4}
                      textAlign="center"
                      transition="all 0.2s"
                      position="relative"
                      _hover={{ 
                        transform: 'translateY(-4px)', 
                        shadow: 'md',
                        borderColor: '#640101' 
                      }}
                      bg={itemToEdit?.id === grade.id && isEditMode ? "rgba(100, 1, 1, 0.05)" : "white"}
                    >
                      {isEditMode && itemToEdit?.id === grade.id && (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FaEllipsisV />}
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                            zIndex={2}
                            aria-label="Options"
                          />
                          <MenuList minWidth="140px">
                            <MenuItem 
                              icon={<FaEdit />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToEdit(grade);
                                setNewName(grade.name);
                                setIsRenameModalOpen(true);
                              }}
                            >
                              Rename
                            </MenuItem>
                            <MenuItem 
                              icon={<FaTrash />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToEdit(grade);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                      <Box 
                        p={2} 
                        bg="#640101" 
                        color="white" 
                        width="100%" 
                        borderTopRadius="md"
                        mb={3}
                      >
                        <Icon as={FaFolder} fontSize="xl" mr={2} />
                        <Text fontWeight="bold" display="inline">
                          {grade.name}
                        </Text>
                      </Box>
                      <VStack align="stretch" spacing={2} textAlign="left">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Instructor:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {grade.classes[0]?.courses[0]?.instructor || "Dr. John Smith"}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Students:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {grade.classes.reduce((total, cls) => 
                              total + cls.courses.reduce((t, c) => 
                                t + (c.enrolledStudents?.length || 0), 0), 0) || 3}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Grading Periods:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {grade.id === 1 ? 2 : 4}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Courses:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {grade.classes.reduce((total, cls) => 
                              total + cls.courses.length, 0) || 8}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>
                  ))}
                  
                  {currentLevel === 'classes' && selectedGrade && selectedGrade.classes.map(classItem => (
                    <Box 
                      key={classItem.id}
                      onClick={isEditMode ? () => setItemToEdit(classItem) : () => handleClassClick(classItem)}
                      cursor="pointer"
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      p={4}
                      textAlign="center"
                      transition="all 0.2s"
                      position="relative"
                      _hover={{ 
                        transform: 'translateY(-4px)', 
                        shadow: 'md',
                        borderColor: '#640101' 
                      }}
                      bg={itemToEdit?.id === classItem.id && isEditMode ? "rgba(100, 1, 1, 0.05)" : "white"}
                    >
                      {isEditMode && itemToEdit?.id === classItem.id && (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FaEllipsisV />}
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                            zIndex={2}
                            aria-label="Options"
                          />
                          <MenuList minWidth="140px">
                            <MenuItem 
                              icon={<FaEdit />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToEdit(classItem);
                                setNewName(classItem.name);
                                setIsRenameModalOpen(true);
                              }}
                            >
                              Rename
                            </MenuItem>
                            <MenuItem 
                              icon={<FaTrash />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToEdit(classItem);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                      <Box 
                        p={2} 
                        bg="#640101" 
                        color="white" 
                        width="100%" 
                        borderTopRadius="md"
                        mb={3}
                      >
                        <Icon as={FaFolder} fontSize="xl" mr={2} />
                        <Text fontWeight="bold" display="inline">
                          {classItem.name}
                        </Text>
                      </Box>
                      <VStack align="stretch" spacing={2} textAlign="left">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Instructor:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {classItem.courses[0]?.instructor || "Dr. John Smith"}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Students:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {classItem.courses.reduce((total, c) => 
                              total + (c.enrolledStudents?.length || 0), 0) || 3}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Courses:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {classItem.courses.length || 8}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>
                  ))}
                  
                  {currentLevel === 'courses' && selectedClass && selectedClass.courses.map(course => (
                    <Box 
                      key={course.id}
                      onClick={isEditMode ? () => setItemToEdit(course) : () => handleCourseClick(course)}
                      cursor="pointer"
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      p={4}
                      textAlign="center"
                      transition="all 0.2s"
                      position="relative"
                      _hover={{ 
                        transform: 'translateY(-4px)', 
                        shadow: 'md',
                        borderColor: '#640101' 
                      }}
                      bg={itemToEdit?.id === course.id && isEditMode ? "rgba(100, 1, 1, 0.05)" : "white"}
                    >
                      {isEditMode && itemToEdit?.id === course.id && (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FaEllipsisV />}
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                            zIndex={2}
                            aria-label="Options"
                          />
                          <MenuList minWidth="140px">
                            <MenuItem 
                              icon={<FaEdit />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToEdit(course);
                                setNewName(course.name);
                                setIsRenameModalOpen(true);
                              }}
                            >
                              Rename
                            </MenuItem>
                            <MenuItem 
                              icon={<FaTrash />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToEdit(course);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                      <Box 
                        p={2} 
                        bg="#640101" 
                        color="white" 
                        width="100%" 
                        borderTopRadius="md"
                        mb={3}
                      >
                        <Icon as={FaFolder} fontSize="xl" mr={2} />
                        <Text fontWeight="bold" display="inline">
                          {course.name}
                        </Text>
                      </Box>
                      <VStack align="stretch" spacing={2} textAlign="left">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Instructor:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {course.instructor}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Students:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {course.enrolledStudents?.length || 0}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.600">Grade:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {course.grade || "N/A"}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
              
              {/* Modal for creating new item */}
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Create New {currentLevel === 'grades' ? 'Grade' : 
                               currentLevel === 'classes' ? 'Class' : 'Course'}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl>
                      <FormLabel>
                        {currentLevel === 'grades' ? 'Grade' : 
                         currentLevel === 'classes' ? 'Class' : 'Course'} Name
                      </FormLabel>
                      <Input 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={`Enter ${currentLevel === 'grades' ? 'grade' : 
                                      currentLevel === 'classes' ? 'class' : 'course'} name`}
                      />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      colorScheme="red" 
                      bg="#640101"
                      onClick={handleCreateNewItem}
                      isDisabled={!newItemName}
                    >
                      Create
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </TabPanel>
            
            {/* Add Student Tab */}
            <TabPanel>
              {courseForEnrollment ? (
                <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg="blue.50">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Heading size="sm">Enrolling Students in Course:</Heading>
                      <Text fontWeight="medium">{courseForEnrollment.name}</Text>
                      <Text fontSize="sm">Instructor: {courseForEnrollment.instructor}</Text>
                    </Box>
                    <Button 
                      colorScheme="blue" 
                      size="sm"
                      leftIcon={<FaUserGraduate />}
                      onClick={handleEnrollSelectedStudents}
                      isDisabled={selectedStudents.length === 0}
                    >
                      Enroll Selected ({selectedStudents.length})
                    </Button>
                  </Flex>
                </Box>
              ) : null}
              
              <Grid templateColumns={{ base: "1fr", md: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
                {/* Left Box - Student List */}
                <GridItem>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="sm"
                    bg="white"
                    height="full"
                  >
                    <Heading size="md" mb={4} color="#640101">Student List</Heading>
                    
                    <InputGroup mb={4}>
                      <InputLeftElement pointerEvents="none">
                        <FaSearch color="#640101" />
                      </InputLeftElement>
                      <Input 
                        placeholder="Search students..." 
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        borderColor="gray.300"
                        _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                      />
                    </InputGroup>
                    
                    <Box height="500px" overflowY="auto" pr={1}>
                      <Table variant="simple" size="sm" sx={{
                        'th, td': {
                          px: 2,
                          py: 2,
                          fontSize: 'sm'
                        }
                      }}>
                        <Thead position="sticky" top={0} bg="white" zIndex={1}>
                          <Tr>
                            <Th width="30%">ID</Th>
                            <Th width="55%">NAME</Th>
                            <Th width="15%">SELECT</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredStudentsForSelection.map((student) => (
                            <Tr 
                              key={student.id} 
                              bg={selectedStudents.some(s => s.id === student.id) ? "rgba(100, 1, 1, 0.05)" : "transparent"}
                              _hover={{ bg: "gray.50" }}
                            >
                              <Td>{student.id}</Td>
                              <Td>{student.name}</Td>
                              <Td>
                                <IconButton 
                                  icon={selectedStudents.some(s => s.id === student.id) ? <FaCheckCircle /> : <FaPlus />} 
                                  size="sm" 
                                  aria-label="Select student" 
                                  onClick={() => toggleStudentSelection(student)}
                                  sx={{
                                    bg: selectedStudents.some(s => s.id === student.id) ? "green.500" : "white",
                                    color: selectedStudents.some(s => s.id === student.id) ? "white" : "#640101",
                                    borderColor: selectedStudents.some(s => s.id === student.id) ? "green.500" : "#640101",
                                    borderWidth: "1px",
                                    _hover: {
                                      bg: selectedStudents.some(s => s.id === student.id) ? "green.600" : "gray.50"
                                    }
                                  }}
                                />
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </GridItem>
                
                {/* Right Side Boxes */}
                <GridItem>
                  <Grid templateRows="repeat(2, 1fr)" gap={5} height="full">
                    {/* Upper Right Box - Select Grade */}
                    <GridItem>
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="sm"
                        bg="white"
                        height="full"
                      >
                        <Heading size="md" mb={4} color="#640101">Select Grade</Heading>
                        
                        <Stack spacing={3}>
                          <Text>Selected Students: {selectedStudents.length}</Text>
                          
                          <FormControl>
                            <FormLabel>Grade to Assign</FormLabel>
                            <Select 
                              value={gradeToAssign}
                              onChange={(e) => setGradeToAssign(e.target.value)}
                              borderColor="gray.300"
                              _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                            >
                              <option value="A+">A+</option>
                              <option value="A">A</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B">B</option>
                              <option value="B-">B-</option>
                              <option value="C+">C+</option>
                              <option value="C">C</option>
                              <option value="C-">C-</option>
                              <option value="D">D</option>
                              <option value="F">F</option>
                            </Select>
                          </FormControl>
                          
                          <Button 
                            colorScheme="red" 
                            bg="#640101"
                            onClick={handleAssignGrade}
                            isDisabled={selectedStudents.length === 0}
                            width="100%"
                          >
                            Assign Grade
                          </Button>
                          
                          <Box 
                            mt={2} 
                            borderWidth="1px" 
                            borderRadius="md" 
                            p={2} 
                            height="140px" 
                            overflowY="auto"
                          >
                            <Flex justify="space-between" align="center" mb={2}>
                              <Text fontWeight="medium">Selected Students</Text>
                              {selectedStudents.length > 0 && (
                                <Button 
                                  size="xs" 
                                  colorScheme="gray" 
                                  onClick={clearSelectedStudents}
                                >
                                  Clear All
                                </Button>
                              )}
                            </Flex>
                            {selectedStudents.length > 0 ? (
                              <List spacing={1}>
                                {selectedStudents.map(student => (
                                  <ListItem key={student.id}>
                                    <Flex justify="space-between">
                                      <Text fontSize="sm">{student.name}</Text>
                                      <Badge size="sm">{student.id}</Badge>
                                    </Flex>
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Text color="gray.500" fontSize="sm">No students selected</Text>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                    </GridItem>
                    
                    {/* Lower Right Box - Select Class */}
                    <GridItem>
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="sm"
                        bg="white"
                        height="full"
                      >
                        <Heading size="md" mb={4} color="#640101">Select Class</Heading>
                        
                        <Stack spacing={3}>
                          <Text>Selected Students: {selectedStudents.length}</Text>
                          
                          <FormControl>
                            <FormLabel>Class to Assign</FormLabel>
                            <Select 
                              value={classToAssign}
                              onChange={(e) => setClassToAssign(e.target.value)}
                              borderColor="gray.300"
                              _focus={{ borderColor: "#640101", boxShadow: "0 0 0 1px #640101" }}
                            >
                              <option value="Class 1">Class 1</option>
                              <option value="Class 2">Class 2</option>
                              <option value="Class 3">Class 3</option>
                            </Select>
                          </FormControl>
                          
                          <Button 
                            colorScheme="red" 
                            bg="#640101"
                            onClick={handleAssignClass}
                            isDisabled={selectedStudents.length === 0}
                            width="100%"
                          >
                            Assign Class
                          </Button>
                          
                          <Box 
                            mt={2} 
                            borderWidth="1px" 
                            borderRadius="md" 
                            p={2} 
                            height="140px" 
                            overflowY="auto"
                          >
                            <Flex justify="space-between" align="center" mb={2}>
                              <Text fontWeight="medium">Selected Students</Text>
                              {selectedStudents.length > 0 && (
                                <Button 
                                  size="xs" 
                                  colorScheme="gray" 
                                  onClick={clearSelectedStudents}
                                >
                                  Clear All
                                </Button>
                              )}
                            </Flex>
                            {selectedStudents.length > 0 ? (
                              <List spacing={1}>
                                {selectedStudents.map(student => (
                                  <ListItem key={student.id}>
                                    <Flex justify="space-between">
                                      <Text fontSize="sm">{student.name}</Text>
                                      <Badge size="sm">{student.id}</Badge>
                                    </Flex>
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Text color="gray.500" fontSize="sm">No students selected</Text>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      
      {/* Floating Edit Button */}
      {tabIndex === 1 && (
        <Tooltip 
          label={isEditMode ? "Exit Edit Mode" : "Edit Folders"} 
          placement="left"
        >
          <IconButton
            icon={isEditMode ? <FaTimes /> : <FaPencilAlt />}
            colorScheme={isEditMode ? "red" : "blue"}
            isRound
            size="lg"
            position="fixed"
            bottom="30px"
            right="30px"
            boxShadow="0 4px 12px rgba(0,0,0,0.1)"
            opacity="0.8"
            _hover={{ opacity: 1 }}
            onClick={toggleEditMode}
            zIndex={999}
          />
        </Tooltip>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete {itemToEdit?.name}?
            <Text color="red.500" mt={2} fontSize="sm">
              This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteItem}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Rename Modal */}
      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>New Name</FormLabel>
              <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleRenameItem}>
              Rename
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Course Detail Modal */}
      <Modal isOpen={isCourseDetailOpen} onClose={() => setIsCourseDetailOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#640101" color="white" borderTopRadius="md">
            {selectedCourse?.name}
            <Badge ml={2} colorScheme={selectedCourse?.status === 'active' ? 'green' : 'yellow'}>
              {selectedCourse?.status}
            </Badge>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={4}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={4}>
              <GridItem>
                <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
                  <Heading size="sm" mb={2}>Course Information</Heading>
                  <Divider mb={3} />
                  <Stack spacing={2}>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Instructor:</Text>
                      <Text>{selectedCourse?.instructor}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Description:</Text>
                      <Text>{selectedCourse?.description}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Students Enrolled:</Text>
                      <Text>{selectedCourse?.enrolledStudents?.length || 0}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Class:</Text>
                      <Text>{selectedClass?.name}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Grade:</Text>
                      <Text>{selectedGrade?.name}</Text>
                    </Box>
                  </Stack>
                </Box>
              </GridItem>
              <GridItem>
                <Box>
                  <Heading size="sm" mb={2}>Enrolled Students</Heading>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" color="gray.600">{selectedCourse?.enrolledStudents?.length || 0} students enrolled</Text>
                    <Button 
                      size="xs" 
                      leftIcon={<FaPlus />} 
                      colorScheme="blue" 
                      onClick={() => {
                        // Open a dialog to add students
                        setCourseForEnrollment(selectedCourse);
                        setIsCourseDetailOpen(false);
                        setTabIndex(2); // Switch to Add Student tab
                      }}
                    >
                      Enroll Student
                    </Button>
                  </Flex>
                  <Divider mb={3} />
                  {selectedCourse?.enrolledStudents?.length > 0 ? (
                    <Box maxHeight="300px" overflowY="auto" pr={2}>
                      <Table variant="simple" size="sm">
                        <Thead position="sticky" top={0} bg="white" zIndex={1}>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Grade</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {selectedCourse.enrolledStudents.map(student => (
                            <Tr key={student.id}>
                              <Td>{student.id}</Td>
                              <Td>
                                <Tooltip label={student.email} placement="top">
                                  <Text>{student.name}</Text>
                                </Tooltip>
                              </Td>
                              <Td>
                                <Select 
                                  size="xs" 
                                  value={student.grade} 
                                  width="70px"
                                  onChange={(e) => handleUpdateStudentGrade(student.id, e.target.value)}
                                >
                                  <option value="N/A">N/A</option>
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="A-">A-</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="B-">B-</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="C-">C-</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </Select>
                              </Td>
                              <Td>
                                <IconButton
                                  icon={<FaTrash />}
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  aria-label="Remove student"
                                  onClick={() => handleRemoveStudentFromCourse(student.id)}
                                />
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ) : (
                    <Box p={4} textAlign="center" borderWidth="1px" borderRadius="md">
                      <Text color="gray.500">No students enrolled in this course.</Text>
                    </Box>
                  )}
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => setIsCourseDetailOpen(false)}>
              Close
            </Button>
            <Button 
              colorScheme="red" 
              bg="#640101"
              leftIcon={<FaEdit />}
              isDisabled={isEditMode}
              onClick={() => {
                setIsCourseDetailOpen(false);
                setIsEditMode(true);
                setItemToEdit(selectedCourse);
              }}
            >
              Edit Course
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InstitutionDashboard;
