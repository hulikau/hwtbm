import { PlayerResult } from '../types';

const RESULTS_STORAGE_KEY = 'math_quiz_results';

/**
 * Saves a player's result to local storage
 */
export const saveResult = (result: PlayerResult): void => {
  try {
    // Get existing results
    const existingResults = getResults();
    
    // Add new result
    const updatedResults = [...existingResults, result];
    
    // Save to local storage
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Error saving result to local storage:', error);
  }
};

/**
 * Gets all player results from local storage
 */
export const getResults = (): PlayerResult[] => {
  try {
    const resultsJson = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (!resultsJson) {
      return [];
    }
    
    return JSON.parse(resultsJson) as PlayerResult[];
  } catch (error) {
    console.error('Error retrieving results from local storage:', error);
    return [];
  }
};

/**
 * Gets sorted results (by score descending, then by time ascending)
 */
export const getSortedResults = (): PlayerResult[] => {
  const results = getResults();
  
  return results.sort((a, b) => {
    // First compare by score (descending)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    // If scores are equal, compare by time (ascending)
    return a.timeInSeconds - b.timeInSeconds;
  });
};

/**
 * Clears all results from local storage
 */
export const clearResults = (): void => {
  try {
    localStorage.removeItem(RESULTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing results from local storage:', error);
  }
}; 