import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tooltip, 
  Icon,
  Flex,
  Text
} from '@chakra-ui/react';
import { 
  FaCheckCircle, 
  FaShieldAlt,
  FaCertificate
} from 'react-icons/fa';
import { useSubscription } from '../contexts/subscriptionContext';

const VerifiedBadge = ({ 
  instructorId,
  size = 'sm', 
  showTooltip = true,
  variant = 'shield',
  color = '#640101'
}) => {
  const { hasActiveRedMark, getSubscriptionDetails } = useSubscription();
  const [isVerified, setIsVerified] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // If no instructorId provided, don't render anything
  if (!instructorId) {
    return null;
  }
  
  // Check verification status on component mount and when instructorId changes
  useEffect(() => {
    let mounted = true;
    
    const checkVerification = async () => {
      setLoading(true);
      try {
        const verified = await hasActiveRedMark(instructorId);
        if (mounted) {
          setIsVerified(verified);
          
          if (verified && showTooltip) {
            const details = await getSubscriptionDetails(instructorId);
            if (mounted) {
              setSubscriptionDetails(details);
            }
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        if (mounted) {
          setIsVerified(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    checkVerification();
    
    return () => {
      mounted = false;
    };
  }, [instructorId, hasActiveRedMark, getSubscriptionDetails, showTooltip]);

  // Don't render anything if not verified or still loading
  if (loading || !isVerified) {
    return null;
  }

  // Size configurations
  const sizeConfigs = {
    xs: { icon: 12, text: 'text-xs', padding: 'px-1' },
    sm: { icon: 14, text: 'text-sm', padding: 'px-2' },
    md: { icon: 16, text: 'text-base', padding: 'px-3' },
    lg: { icon: 20, text: 'text-lg', padding: 'px-4' }
  };

  const config = sizeConfigs[size] || sizeConfigs.sm;

  // Icon selection based on variant
  const getIcon = () => {
    const iconProps = {
      size: config.icon,
      color: color,
      style: { filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))' }
    };

    switch (variant) {
      case 'check':
        return <FaCheckCircle {...iconProps} />;
      case 'badge':
        return <FaCertificate {...iconProps} />;
      case 'shield':
      default:
        return <FaShieldAlt {...iconProps} />;
    }
  };

  // Tooltip content
  const getTooltipContent = () => {
    if (!subscriptionDetails) return 'Red Mark Verified';
    
    const { subscription_type, expires_soon, days_until_expiry } = subscriptionDetails;
    
    let tooltip = 'Red Mark Verified';
    if (subscription_type) {
      tooltip += ` (${subscription_type})`;
    }
    
    if (expires_soon && days_until_expiry !== null) {
      tooltip += ` - Expires in ${days_until_expiry} day${days_until_expiry !== 1 ? 's' : ''}`;
    }
    
    return tooltip;
  };

  const badge = (
    <div className="inline-flex items-center">
      {getIcon()}
    </div>
  );

  if (showTooltip) {
    return (
      <div 
        className="relative group cursor-help"
        title={getTooltipContent()}
      >
        {badge}
        
        {/* Custom tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
          {getTooltipContent()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return badge;
};

// Higher-order component for wrapping instructor names with badges
export const withVerifiedBadge = (WrappedComponent) => {
  return (props) => {
    const { instructorId, ...otherProps } = props;
    
    return (
      <div className="inline-flex items-center gap-2">
        <WrappedComponent {...otherProps} />
        <VerifiedBadge instructorId={instructorId} />
      </div>
    );
  };
};

// Pre-configured badge variants
export const VerifiedCheckBadge = (props) => (
  <VerifiedBadge {...props} variant="check" />
);

export const VerifiedShieldBadge = (props) => (
  <VerifiedBadge {...props} variant="shield" />
);

export const VerifiedCertificateBadge = (props) => (
  <VerifiedBadge {...props} variant="badge" />
);

export default VerifiedBadge; 