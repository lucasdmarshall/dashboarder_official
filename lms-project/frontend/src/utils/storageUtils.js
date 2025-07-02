/**
 * Utility functions for safely interacting with localStorage and sessionStorage
 * with error handling for quota exceeded errors
 */

/**
 * Safely get an item from localStorage with error handling
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {any} The stored value or defaultValue
 */
export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.warn(`Error getting item from localStorage: ${error.message}`);
    return defaultValue;
  }
};

/**
 * Safely get and parse a JSON item from localStorage with error handling
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {any} The parsed value or defaultValue
 */
export const safeGetJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error getting/parsing JSON from localStorage: ${error.message}`);
    return defaultValue;
  }
};

/**
 * Safely set an item in localStorage with error handling
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 * @returns {boolean} True if successful, false if failed
 */
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error.message}`);
    
    // If quota exceeded, try to clear some space
    if (isQuotaExceededError(error)) {
      handleQuotaExceededError(key, value);
    }
    
    return false;
  }
};

/**
 * Safely set a JSON item in localStorage with error handling
 * @param {string} key - The key to set
 * @param {any} value - The value to stringify and store
 * @returns {boolean} True if successful, false if failed
 */
export const safeSetJSON = (key, value) => {
  try {
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);
    return true;
  } catch (error) {
    console.error(`Error setting JSON in localStorage: ${error.message}`);
    
    // If quota exceeded, try to clear some space
    if (isQuotaExceededError(error)) {
      handleQuotaExceededError(key, JSON.stringify(value));
    }
    
    return false;
  }
};

/**
 * Check if an error is a quota exceeded error
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a quota exceeded error
 */
const isQuotaExceededError = (error) => {
  return (
    error instanceof DOMException &&
    // everything except Firefox
    (error.code === 22 ||
      // Firefox
      error.code === 1014 ||
      // test name field too, because code might not be present
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
};

/**
 * Handle quota exceeded error by clearing less important data
 * @param {string} key - The key that was being set
 * @param {string} value - The value that was being stored
 */
const handleQuotaExceededError = (key, value) => {
  // Priority list of items to remove (least important first)
  const lowPriorityKeys = [
    'forumPosts',
    'instructorForumPosts',
    'studentApplicants',
    'checkedStudents'
  ];
  
  // First try to clear boardwalk interactions as they tend to be large
  if (clearBoardwalkInteractions()) {
    // Try to set the original item again
    try {
      localStorage.setItem(key, value);
      console.log(`Successfully set ${key} after clearing boardwalk interactions`);
      return true;
    } catch (e) {
      // Continue to other cleanup methods if still not enough space
    }
  }
  
  // Try to remove low priority items next
  for (const lowPriorityKey of lowPriorityKeys) {
    if (lowPriorityKey !== key) { // Don't remove the key we're trying to set
      try {
        localStorage.removeItem(lowPriorityKey);
        console.log(`Removed ${lowPriorityKey} to free up space`);
        
        // Try to set the original item again
        try {
          localStorage.setItem(key, value);
          console.log(`Successfully set ${key} after clearing space`);
          return true;
        } catch (e) {
          // Continue to next item if still not enough space
          continue;
        }
      } catch (e) {
        console.error(`Failed to remove ${lowPriorityKey}: ${e.message}`);
      }
    }
  }
  
  // If we still can't set the item, try clearing all except essential items
  const essentialKeys = ['authToken', 'userRole', 'userName', 'userId', 'institutionId'];
  
  if (!essentialKeys.includes(key)) {
    try {
      // Get all keys
      const allKeys = Object.keys(localStorage);
      
      // Remove non-essential keys
      for (const storageKey of allKeys) {
        if (!essentialKeys.includes(storageKey) && storageKey !== key) {
          localStorage.removeItem(storageKey);
        }
      }
      
      // Try to set the original item again
      try {
        localStorage.setItem(key, value);
        console.log(`Successfully set ${key} after clearing all non-essential data`);
        return true;
      } catch (e) {
        console.error(`Still unable to set ${key} after clearing space: ${e.message}`);
        return false;
      }
    } catch (e) {
      console.error(`Error while trying to clear localStorage: ${e.message}`);
      return false;
    }
  }
  
  return false;
};

/**
 * Clear all boardwalk interaction data from localStorage
 * @returns {boolean} True if successful, false if failed
 */
export const clearBoardwalkInteractions = () => {
  try {
    // Get list of all keys
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      allKeys.push(localStorage.key(i));
    }
    
    // Remove all boardwalk interaction data
    let clearedItems = 0;
    allKeys.forEach(key => {
      if (key.startsWith('boardwalk_interactions_')) {
        localStorage.removeItem(key);
        clearedItems++;
      }
    });
    
    console.log(`Cleared ${clearedItems} boardwalk interaction items from localStorage`);
    return clearedItems > 0;
  } catch (error) {
    console.error('Error clearing boardwalk interactions:', error);
    return false;
  }
};

/**
 * Check if localStorage is near capacity and clear space if needed
 * @returns {boolean} True if storage is available, false if there are persistent issues
 */
export const checkStorageQuota = () => {
  try {
    // Try to detect if localStorage is near capacity
    const testKey = 'quota_test_' + Date.now();
    const testData = new Array(1024).join('x'); // 1KB of data
    
    try {
      // Try to store 1KB of test data
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      return true; // We have space
    } catch (e) {
      if (isQuotaExceededError(e)) {
        console.warn('localStorage quota nearly exceeded, clearing non-essential data');
        
        // First try clearing boardwalk interactions
        if (clearBoardwalkInteractions()) {
          try {
            localStorage.setItem(testKey, testData);
            localStorage.removeItem(testKey);
            return true;
          } catch (secondError) {
            // If still failing, try more aggressive cleanup
          }
        }
        
        // Get critical authentication data
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');
        const institutionId = localStorage.getItem('institutionId');
        
        // Clear everything
        localStorage.clear();
        
        // Restore critical items
        if (authToken) localStorage.setItem('authToken', authToken);
        if (userId) localStorage.setItem('userId', userId);
        if (userName) localStorage.setItem('userName', userName);
        if (userRole) localStorage.setItem('userRole', userRole);
        if (institutionId) localStorage.setItem('institutionId', institutionId);
        
        console.log('Cleared all localStorage data except authentication');
        
        // Test again
        try {
          localStorage.setItem(testKey, testData);
          localStorage.removeItem(testKey);
          return true;
        } catch (thirdError) {
          console.error('Still unable to use localStorage after clearing everything');
          return false;
        }
      }
      return false;
    }
  } catch (error) {
    console.error('Error checking localStorage quota:', error);
    return false;
  }
};

/**
 * Get an estimate of localStorage usage in percentage
 * @returns {number} Estimated percentage of localStorage used (0-100)
 */
export const getStorageUsage = () => {
  try {
    // Get current usage
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      totalSize += key.length + value.length;
    }
    
    // Estimate total capacity (varies by browser, but 5MB is common)
    const estimatedCapacity = 5 * 1024 * 1024;
    
    // Calculate percentage
    const usagePercentage = (totalSize / estimatedCapacity) * 100;
    return Math.min(100, Math.round(usagePercentage));
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
};
