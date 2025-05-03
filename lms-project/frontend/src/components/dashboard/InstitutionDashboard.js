import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import InstitutionSidebar from '../InstitutionSidebar';

const InstitutionDashboard = () => {
  return (
    <Box>
      <InstitutionSidebar />
      <Container maxW="container.xl" mt="70px" p={8}>
        <h1>Welcome to the Institution Dashboard</h1>
        {/* Additional content can go here */}
      </Container>
    </Box>
  );
};

export default InstitutionDashboard;
