import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import new notice pages
import NoticeStudents from './pages/NoticeStudents';
import NoticeCompose from './pages/NoticeCompose';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/noticeboard" element={<NoticeRecipients />} />
        <Route path="/noticeboard/templates" element={<NoticeTemplates />} />
        <Route path="/noticeboard/students" element={<NoticeStudents />} />
        <Route path="/noticeboard/compose" element={<NoticeCompose />} />
      </Routes>
    </Router>
  );
}

export default App; 