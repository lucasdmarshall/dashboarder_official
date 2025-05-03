import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { TutorProvider } from './contexts/TutorContext';
import { StudentProvider } from './contexts/StudentContext';
import { SettingsProvider } from './contexts/settingsContext';
import { AuthProvider } from './contexts/authContext';
import theme from './theme';

// Import dashboard components
import StudentDashboard from './components/dashboard/StudentDashboard';
import InstructorDashboard from './components/dashboard/InstructorDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import InstructorRegistration from './components/InstructorRegistration';
import StudentRegistration from './components/StudentRegistration';

// Import landing page
import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import InstructorHome from './pages/InstructorHome';
import AdminTutorsPage from './pages/AdminTutorsPage';
import AdminTutorRegistrationsPage from './pages/AdminTutorRegistrationsPage';
import AdminManageTutorsPage from './pages/AdminManageTutorsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import InstructorCreateCourse from './pages/InstructorCreateCourse';
import InstructorCourses from './pages/InstructorCourses';
import InstructorEditCourse from './pages/InstructorEditCourse';
import InstructorProfile from './pages/InstructorProfile';
import InstructorCourseStudents from './pages/InstructorCourseStudents';
import InstructorStudents from './pages/InstructorStudents';
import InstructorPaymentOptions from './pages/InstructorPaymentOptions';
import StudentProfile from './pages/StudentProfile';
import StudentProfileNew from './pages/StudentProfileNew';
import InstructorCourseDetails from './pages/InstructorCourseDetails';
import InstructorVideoConference from './pages/InstructorVideoConference';
import StudentFindTutor from './pages/StudentFindTutor';
import StudentCourses from './pages/StudentCourses';
import StudentSchedule from './pages/StudentSchedule';
import StudentMessages from './pages/StudentMessages';
import StudentVideoConference from './pages/StudentVideoConference';
import StudentAssignments from './pages/StudentAssignments';
import InstructorQuizDetails from './pages/InstructorQuizDetails';
import InstructorLevelPurchase from './pages/InstructorLevelPurchase';
import StudentBrowseCourses from './pages/StudentBrowseCourses';
import StudentHallPass from './pages/StudentHallPass';
import StudentReportCard from './pages/StudentReportCard';
import StudentForum from './pages/StudentForum';
import CourseDetails from './pages/CourseDetails';
import AssignmentDetails from './pages/AssignmentDetails';
import InstructorMessages from './pages/InstructorMessages';
import LoveMessage from './pages/LoveMessage';
import BoardwalkPage from './pages/BoardwalkPage';
import StudentsPage from './pages/Students';
import InstructorsPage from './pages/Instructors';
import InstitutionSidebar from './components/InstitutionSidebar';
import FormBuilder from './pages/FormBuilder';
import ManageInstructorsPage from './pages/ManageInstructors';
import StudentsList from './pages/StudentsList';
import AcademicCalendar from './pages/AcademicCalendar';
import Forum from './pages/Forum';
import CreateCourse from './pages/CreateCourse';
import CreateClass from './pages/CreateClass';
import ManageClasses from './pages/ManageClasses';
import Noticeboard from './pages/Noticeboard';
import Grades from './pages/Grades';
import NoticeRecipients from './pages/NoticeRecipients';
import NoticeTemplates from './pages/NoticeTemplates';
import NoticeStudents from './pages/NoticeStudents';
import NoticeCompose from './pages/NoticeCompose';
import Attendance from './pages/Attendance';
import ReportCard from './pages/ReportCard';
import HomeworkSubmission from './pages/HomeworkSubmission';
import TimeTable from './pages/TimeTable';
import DigitalHallPass from './pages/DigitalHallPass';

// Import Header
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <TutorProvider>
          <StudentProvider>
            <SettingsProvider>
              <Router>
                <Header />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/institution-dashboard" element={<InstitutionDashboard />} />
                  <Route path="/instructor-registration" element={<InstructorRegistration />} />
                  <Route path="/student-registration" element={<StudentRegistration />} />
                  <Route path="/student-home" element={<StudentHome />} />
                  <Route path="/instructor-home" element={<InstructorHome />} />
                  <Route path="/admin-tutors-page" element={<AdminTutorsPage />} />
                  <Route path="/admin-tutor-registrations-page" element={<AdminTutorRegistrationsPage />} />
                  <Route path="/admin-manage-tutors-page" element={<AdminManageTutorsPage />} />
                  <Route path="/admin-students-page" element={<AdminStudentsPage />} />
                  <Route path="/admin-settings-page" element={<AdminSettingsPage />} />
                  <Route path="/admin-courses" element={<AdminCoursesPage />} />
                  <Route path="/admin-courses-page" element={<AdminCoursesPage />} />
                  <Route path="/instructor-create-course" element={<InstructorCreateCourse />} />
                  <Route path="/instructor-courses" element={<InstructorCourses />} />
                  <Route path="/instructor-edit-course/:courseId" element={<InstructorEditCourse />} />
                  <Route path="/instructor-profile" element={<InstructorProfile />} />
                  <Route path="/instructor-course-students/:courseId" element={<InstructorCourseStudents />} />
                  <Route path="/instructor-students" element={<InstructorStudents />} />
                  <Route path="/instructor-payment-options" element={<InstructorPaymentOptions />} />
                  <Route path="/student-profile" element={<StudentProfile />} />
                  <Route path="/student-profile/:studentId" element={<StudentProfile />} />
                  <Route path="/student-profile-new" element={<StudentProfileNew />} />
                  <Route path="/instructor-course-details/:courseId" element={<InstructorCourseDetails />} />
                  <Route path="/instructor-video-conference/:courseId" element={<InstructorVideoConference />} />
                  <Route path="/student-find-tutor" element={<StudentFindTutor />} />
                  <Route path="/student-courses" element={<StudentCourses />} />
                  <Route path="/student-schedule" element={<StudentSchedule />} />
                  <Route path="/student-messages" element={<StudentMessages />} />
                  <Route path="/student-video-conference/:courseId" element={<StudentVideoConference />} />
                  <Route path="/student-assignments" element={<StudentAssignments />} />
                  <Route path="/instructor-quiz-details/:quizId" element={<InstructorQuizDetails />} />
                  <Route path="/instructor-level-purchase" element={<InstructorLevelPurchase />} />
                  <Route path="/student-browse-courses" element={<StudentBrowseCourses />} />
                  <Route path="/browse-courses" element={<StudentBrowseCourses />} />
                  <Route path="/student-hall-pass" element={<StudentHallPass />} />
                  <Route path="/student-report-card" element={<StudentReportCard />} />
                  <Route path="/student-forum" element={<StudentForum />} />
                  <Route path="/course/:courseId" element={<CourseDetails />} />
                  <Route path="/assignment/:assignmentId" element={<AssignmentDetails />} />
                  <Route 
                    path="/instructor/messages" 
                    element={
                      <ProtectedRoute>
                        <InstructorMessages />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/love-message" element={<LoveMessage />} />
                  <Route path="/boardwalk" element={<BoardwalkPage />} />
                  <Route path="/students" element={<><InstitutionSidebar /><StudentsPage /></>} />
                  <Route path="/instructors" element={<><InstitutionSidebar /><InstructorsPage /></>} />
                  <Route path="/manage-instructors" element={<><InstitutionSidebar /><ManageInstructorsPage /></>} />
                  <Route path="/students-list" element={<><InstitutionSidebar /><StudentsList /></>} />
                  <Route path="/academic-calendar" element={<><InstitutionSidebar /><AcademicCalendar /></>} />
                  <Route path="/forum" element={<><InstitutionSidebar /><Forum /></>} />
                  <Route path="/create-course" element={<><InstitutionSidebar /><CreateCourse /></>} />
                  <Route path="/create-class" element={<><InstitutionSidebar /><CreateClass /></>} />
                  <Route path="/manage-classes" element={<><InstitutionSidebar /><ManageClasses /></>} />
                  <Route path="/noticeboard" element={<><InstitutionSidebar /><NoticeRecipients /></>} />
                  <Route path="/noticeboard/templates" element={<><InstitutionSidebar /><NoticeTemplates /></>} />
                  <Route path="/noticeboard/students" element={<><InstitutionSidebar /><NoticeStudents /></>} />
                  <Route path="/noticeboard/compose" element={<><InstitutionSidebar /><NoticeCompose /></>} />
                  <Route path="/grades" element={<><InstitutionSidebar /><Grades /></>} />
                  <Route path="/attendance" element={<><InstitutionSidebar /><Attendance /></>} />
                  <Route path="/report-card" element={<><InstitutionSidebar /><ReportCard /></>} />
                  <Route path="/homework-submission" element={<><InstitutionSidebar /><HomeworkSubmission /></>} />
                  <Route path="/time-table" element={<><InstitutionSidebar /><TimeTable /></>} />
                  <Route path="/digital-hall-pass" element={<><InstitutionSidebar /><DigitalHallPass /></>} />
                  <Route path="/form-builder" element={<FormBuilder />} />
                </Routes>
              </Router>
            </SettingsProvider>
          </StudentProvider>
        </TutorProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;