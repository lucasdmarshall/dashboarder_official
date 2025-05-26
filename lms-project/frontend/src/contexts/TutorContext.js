import React, { createContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const API_URL = 'http://localhost:5001/api';

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Fetch instructor registrations from backend
  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/instructor-registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend structure
        const transformedData = data.map(reg => ({
          id: reg.id,
          name: reg.name,
          email: reg.email,
          dateOfBirth: reg.submitted_at ? new Date(reg.submitted_at).toLocaleDateString() : 'N/A',
          status: reg.status,
          specialization: reg.specialization || 'Not specified',
          education: reg.education || 'Not specified',
          experience: reg.experience || 'Not specified',
          bio: reg.bio || '',
          phone: reg.phone || '',
          certifications: reg.certifications || '',
          linkedin_profile: reg.linkedin_profile || '',
          portfolio_url: reg.portfolio_url || '',
          submitted_at: reg.submitted_at,
          reviewed_at: reg.reviewed_at,
          review_notes: reg.review_notes || ''
        }));
        setRegistrations(transformedData);
      } else {
        console.error('Failed to fetch registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  // Fetch approved instructors from backend
  const fetchApprovedTutors = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/instructors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApprovedTutors(data);
      } else {
        console.error('Failed to fetch approved instructors');
      }
    } catch (error) {
      console.error('Error fetching approved instructors:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRegistrations();
    fetchApprovedTutors();
  }, []);

  const approveRegistration = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authorization token found');
      }

      const response = await fetch(`${API_URL}/admin/instructor-registrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'approved',
          review_notes: 'Application approved by admin'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: 'Registration Approved',
          description: 'Instructor registration has been approved successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refresh the data
        await fetchRegistrations();
        await fetchApprovedTutors();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to approve registration');
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      toast({
        title: 'Approval Failed',
        description: error.message || 'Failed to approve registration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRegistration = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authorization token found');
      }

      const response = await fetch(`${API_URL}/admin/instructor-registrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'rejected',
          review_notes: 'Application rejected by admin'
        }),
      });

      if (response.ok) {
        toast({
          title: 'Registration Rejected',
          description: 'Instructor registration has been rejected.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });

        // Refresh the data
        await fetchRegistrations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reject registration');
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast({
        title: 'Rejection Failed',
        description: error.message || 'Failed to reject registration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewRegistration = (registration) => {
    // This function is for local state updates if needed
    // The actual registration creation happens in the signup flow
    fetchRegistrations(); // Refresh from backend
  };

  return (
    <TutorContext.Provider value={{
      registrations,
      approvedTutors,
      isLoading,
      approveRegistration,
      rejectRegistration,
      addNewRegistration,
      fetchRegistrations,
      fetchApprovedTutors
    }}>
      {children}
    </TutorContext.Provider>
  );
};
