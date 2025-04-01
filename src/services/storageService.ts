import { PlayerResult } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const RESULTS_COLLECTION = 'quizResults';

/**
 * Saves a player's result to Firestore
 */
export const saveResult = async (result: PlayerResult): Promise<void> => {
  try {
    // Add the result to Firestore with a server timestamp
    await addDoc(collection(db, RESULTS_COLLECTION), {
      ...result,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving result to Firestore:', error);
    
    // Fallback to local storage if Firestore fails (e.g., offline)
    const existingResults = getLocalResults();
    const updatedResults = [...existingResults, result];
    localStorage.setItem('math_quiz_results', JSON.stringify(updatedResults));
  }
};

/**
 * Gets all player results from Firestore
 */
export const getResults = async (): Promise<PlayerResult[]> => {
  try {
    // Query results ordered by score (desc) and time (asc)
    const q = query(
      collection(db, RESULTS_COLLECTION),
      orderBy('score', 'desc'),
      orderBy('timeInSeconds', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const results: PlayerResult[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        name: data.name,
        score: data.score,
        timeInSeconds: data.timeInSeconds,
        date: data.date,
      });
    });
    
    return results;
  } catch (error) {
    console.error('Error retrieving results from Firestore:', error);
    
    // Fallback to local storage if Firestore fails
    return getLocalResults();
  }
};

/**
 * Gets sorted results from Firestore (already sorted by the query)
 */
export const getSortedResults = async (): Promise<PlayerResult[]> => {
  return getResults();
};

/**
 * Fallback function to get results from local storage
 */
const getLocalResults = (): PlayerResult[] => {
  try {
    const resultsJson = localStorage.getItem('math_quiz_results');
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
 * For backward compatibility with components that expect synchronous results
 * This returns local results only and should be used during migration
 */
export const getSortedResultsSync = (): PlayerResult[] => {
  const results = getLocalResults();
  
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
    localStorage.removeItem('math_quiz_results');
  } catch (error) {
    console.error('Error clearing results from local storage:', error);
  }
}; 