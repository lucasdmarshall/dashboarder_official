import React from 'react';
import { Flex, Tag, TagLabel } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const TutorNameDisplay = ({ tutor, size = "sm" }) => {
  return (
    <Flex alignItems="center">
      {tutor.name}
      {tutor.isDashboarderCertified && (
        <Tag size={size} colorScheme="green" ml={2}>
          <FaCheckCircle />
          <TagLabel>Dashboarder Certified</TagLabel>
        </Tag>
      )}
    </Flex>
  );
};

export default TutorNameDisplay;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */