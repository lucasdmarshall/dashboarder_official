import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import VerifiedBadge from './VerifiedBadge';

// Reusable component for displaying instructor names with verified badges
const InstructorNameDisplay = ({ 
  instructorId, 
  instructorName, 
  fontSize = "md",
  fontWeight = "normal",
  color = "inherit",
  badgeSize = "sm",
  badgeVariant = "shield",
  showTooltip = true,
  textProps = {},
  ...flexProps 
}) => {
  return (
    <Flex alignItems="center" display="inline-flex" {...flexProps}>
      <Text 
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        {...textProps}
      >
        {instructorName}
      </Text>
      <VerifiedBadge 
        instructorId={instructorId}
        size={badgeSize}
        variant={badgeVariant}
        showTooltip={showTooltip}
      />
    </Flex>
  );
};

// Higher-order component to wrap any text/component with verified badge
export const withVerifiedBadge = (Component) => {
  return ({ instructorId, badgeProps, ...props }) => (
    <Flex alignItems="center" display="inline-flex">
      <Component {...props} />
      <VerifiedBadge instructorId={instructorId} {...badgeProps} />
    </Flex>
  );
};

export default InstructorNameDisplay; 