import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SubscriptionContext = createContext();

// Backend API base URL
const API_BASE_URL = 'http://localhost:5001/api';

// Subscription provider component
export const SubscriptionProvider = ({ children }) => {
  const [subscriptionCache, setSubscriptionCache] = useState({});

  // Get instructor's Red Mark subscription status from backend
  const hasActiveRedMark = async (instructorId) => {
    if (!instructorId) return false;
    
    try {
      // Check cache first
      if (subscriptionCache[instructorId]) {
        const cached = subscriptionCache[instructorId];
        // Check if cache is still valid (cache for 5 minutes)
        if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
          return cached.hasRedMark;
        }
      }

      const response = await fetch(`${API_BASE_URL}/instructors/${instructorId}/subscription/red-mark`);
      if (response.ok) {
        const data = await response.json();
        
        // Update cache
        setSubscriptionCache(prev => ({
          ...prev,
          [instructorId]: {
            hasRedMark: data.has_red_mark && data.is_active,
            timestamp: Date.now(),
            data: data
          }
        }));
        
        return data.has_red_mark && data.is_active;
      }
      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  };

  // Get detailed subscription information
  const getSubscriptionDetails = async (instructorId) => {
    if (!instructorId) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/instructors/${instructorId}/subscription/red-mark`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  };

  // Subscribe to Red Mark (purchase subscription)
  const subscribeToRedMark = async (instructorId, paymentData) => {
    try {
      // This would typically require authentication
      // For now, we'll use the test endpoint to simulate purchase
      const subscriptionData = {
        subscription_type: "monthly",
        price_paid: 10.00,
        currency: "USD",
        payment_method: "credit_card",
        payment_reference: `payment_${Date.now()}`,
        auto_renew: true
      };

      const response = await fetch(`${API_BASE_URL}/instructors/me/subscription/red-mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Add when auth is implemented
        },
        body: JSON.stringify(subscriptionData)
      });

      if (response.ok) {
        // Clear cache for this instructor
        setSubscriptionCache(prev => {
          const newCache = { ...prev };
          delete newCache[instructorId];
          return newCache;
        });
        
        return await response.json();
      }
      throw new Error('Failed to subscribe');
    } catch (error) {
      console.error('Error subscribing to Red Mark:', error);
      throw error;
    }
  };

  // Check if subscription is expiring soon
  const isExpiringSoon = async (instructorId) => {
    const details = await getSubscriptionDetails(instructorId);
    return details?.expires_soon || false;
  };

  // Get days until expiry
  const getDaysUntilExpiry = async (instructorId) => {
    const details = await getSubscriptionDetails(instructorId);
    return details?.days_until_expiry || null;
  };

  // Bulk check subscription status for multiple instructors
  const bulkCheckSubscriptions = async (instructorIds) => {
    if (!instructorIds || instructorIds.length === 0) return {};
    
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/bulk-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructorIds)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update cache with bulk results
        const cacheUpdates = {};
        for (const [instructorId, status] of Object.entries(data)) {
          cacheUpdates[instructorId] = {
            hasRedMark: status.has_red_mark && status.is_active,
            timestamp: Date.now(),
            data: status
          };
        }
        
        setSubscriptionCache(prev => ({ ...prev, ...cacheUpdates }));
        
        return data;
      }
      return {};
    } catch (error) {
      console.error('Error in bulk subscription check:', error);
      return {};
    }
  };

  // Get current user ID (this should be replaced with real auth context)
  const getCurrentUserId = () => {
    // This should come from your auth context/localStorage when implemented
    // For now, return null to indicate no current user
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        return profile.id || profile.instructorId || profile.userId;
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
    return null;
  };

  const value = {
    hasActiveRedMark,
    getSubscriptionDetails,
    subscribeToRedMark,
    isExpiringSoon,
    getDaysUntilExpiry,
    bulkCheckSubscriptions,
    getCurrentUserId
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook to use the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 