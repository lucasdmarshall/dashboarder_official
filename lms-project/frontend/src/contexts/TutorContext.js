import React, { createContext, useState } from 'react';

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@example.com',
      dateOfBirth: '1988-04-15',
      status: 'pending',
      documents: ['Mathematics_PhD.pdf', 'TeachingCertificate.pdf'],
      specialization: 'Advanced Mathematics'
    },
    {
      id: 2,
      name: 'David Chen',
      email: 'david.chen@example.com',
      dateOfBirth: '1992-11-22',
      status: 'pending',
      documents: ['ComputerScience_Masters.pdf', 'IndustryExperience.pdf'],
      specialization: 'Software Engineering'
    },
    {
      id: 3,
      name: 'Sophia Patel',
      email: 'sophia.patel@example.com',
      dateOfBirth: '1985-07-30',
      status: 'pending',
      documents: ['BiologyResearch.pdf', 'EducationDegree.pdf'],
      specialization: 'Biology and Science Education'
    }
  ]);

  const [approvedTutors, setApprovedTutors] = useState([]);

  const approveRegistration = (id) => {
    const registration = registrations.find(reg => reg.id === id);
    if (registration) {
      // Update registration status
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === id ? { ...reg, status: 'approved' } : reg
        )
      );

      // Add to approved tutors
      const newTutor = {
        ...registration,
        status: 'active',
        courses: 0,
        level: 'Level 1', // Default level for new tutors
        isDashboarderCertified: true // Add certification
      };
      setApprovedTutors(prev => [...prev, newTutor]);
    }
  };

  const rejectRegistration = (id) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status: 'rejected' } : reg
      )
    );
  };

  const addNewRegistration = (registration) => {
    const newRegistration = {
      ...registration,
      id: registrations.length + 1,
      status: 'pending'
    };
    setRegistrations(prev => [...prev, newRegistration]);
  };

  return (
    <TutorContext.Provider value={{
      registrations,
      approvedTutors,
      approveRegistration,
      rejectRegistration,
      addNewRegistration
    }}>
      {children}
    </TutorContext.Provider>
  );
};
