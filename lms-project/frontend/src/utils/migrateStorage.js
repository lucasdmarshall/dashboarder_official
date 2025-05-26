/**
 * Utility to migrate existing localStorage usage to safe storage utilities
 */
import { safeSetJSON, safeGetJSON } from './storageUtils';

/**
 * Migrates existing localStorage data to use the safe storage utilities
 * This helps prevent quota exceeded errors by cleaning up and optimizing storage
 */
export const migrateLocalStorage = () => {
  try {
    console.log('Starting localStorage migration...');
    
    // Get all keys in localStorage
    const keys = Object.keys(localStorage);
    console.log(`Found ${keys.length} keys in localStorage`);
    
    // Track storage usage before and after
    const beforeSize = calculateStorageSize();
    
    // List of keys to optimize (large data that can be compressed or cleaned)
    const keysToOptimize = [
      'forumPosts',
      'instructorForumPosts',
      'studentApplicants',
      'checkedStudents',
      'institutions',
      'instructorCourses'
    ];
    
    // Process each key to optimize
    keysToOptimize.forEach(key => {
      try {
        if (localStorage.getItem(key)) {
          const data = JSON.parse(localStorage.getItem(key));
          
          // Remove the original item
          localStorage.removeItem(key);
          
          // Store it back using the safe utility
          safeSetJSON(key, data);
          
          console.log(`Migrated and optimized: ${key}`);
        }
      } catch (err) {
        console.warn(`Error migrating key ${key}: ${err.message}`);
      }
    });
    
    // Calculate storage after optimization
    const afterSize = calculateStorageSize();
    console.log(`Storage optimization complete. Before: ${beforeSize}KB, After: ${afterSize}KB, Saved: ${beforeSize - afterSize}KB`);
    
    return true;
  } catch (error) {
    console.error(`Error during localStorage migration: ${error.message}`);
    return false;
  }
};

/**
 * Calculate approximate size of localStorage in KB
 * @returns {number} Size in KB
 */
const calculateStorageSize = () => {
  let totalSize = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    totalSize += (key.length + value.length) * 2; // Unicode characters are 2 bytes
  }
  
  return Math.round(totalSize / 1024); // Convert to KB
};

/**
 * Cleans up localStorage by removing unnecessary or duplicate data
 * @returns {boolean} Success status
 */
export const cleanupStorage = () => {
  try {
    // List of keys that might contain duplicate or unnecessary data
    const keysToClean = [
      'forumPosts',
      'instructorForumPosts'
    ];
    
    keysToClean.forEach(key => {
      try {
        if (localStorage.getItem(key)) {
          const data = JSON.parse(localStorage.getItem(key));
          
          // If it's an array, limit to most recent 20 items
          if (Array.isArray(data) && data.length > 20) {
            const trimmedData = data.slice(-20); // Keep only the most recent 20 items
            localStorage.removeItem(key);
            safeSetJSON(key, trimmedData);
            console.log(`Cleaned up ${key}: reduced from ${data.length} to ${trimmedData.length} items`);
          }
        }
      } catch (err) {
        console.warn(`Error cleaning key ${key}: ${err.message}`);
      }
    });
    
    return true;
  } catch (error) {
    console.error(`Error during storage cleanup: ${error.message}`);
    return false;
  }
};
