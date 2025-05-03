import React, { createContext, useState, useContext } from 'react';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@example.com',
      dateOfBirth: '2000-05-15',
      enrollmentDate: '2022-09-01',
      courses: 3,
      status: 'active',
      major: 'Computer Science',
      graduationYear: 2026
    },
    {
      id: 2,
      name: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      dateOfBirth: '2001-11-22',
      enrollmentDate: '2021-09-01',
      courses: 4,
      status: 'active',
      major: 'Data Science',
      graduationYear: 2025
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      dateOfBirth: '2002-03-10',
      enrollmentDate: '2023-01-15',
      courses: 2,
      status: 'probation',
      major: 'Business Administration',
      graduationYear: 2027
    }
  ]);

  const updateStudent = (id, updatedData) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
  };

  const suspendStudent = (id) => {
    updateStudent(id, { status: 'suspended' });
  };

  const activateStudent = (id) => {
    updateStudent(id, { status: 'active' });
  };

  return (
    <StudentContext.Provider 
      value={{ 
        students, 
        updateStudent, 
        suspendStudent, 
        activateStudent 
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
