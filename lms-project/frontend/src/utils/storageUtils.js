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
  
  // Try to remove low priority items first
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
  const essentialKeys = ['authToken', 'userRole'];
  
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
