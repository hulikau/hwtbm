import { app } from './firebaseConfig';
import { LeaderboardEntry } from '@/types';
import { getDatabase, ref, get, push } from 'firebase/database';

const LEADERBOARD_PATH = 'leaderboard';
const db = getDatabase(app);

export const saveScore = async (entry: LeaderboardEntry): Promise<string> => {
  try {
    // Add timestamp to the entry
    const entryWithTimestamp = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    
    // Save to Firebase Realtime Database
    const leaderboardRef = ref(db, LEADERBOARD_PATH);
    const newEntryRef = await push(leaderboardRef, entryWithTimestamp);
    
    return newEntryRef.key || '';
  } catch (error) {
    console.error('Error saving score to Firebase:', error);
    throw error;
  }
};

export const getLeaderboard = async (page = 1, pageSize = 10): Promise<{ entries: LeaderboardEntry[], total: number }> => {
  try {
    // Get all entries from the leaderboard
    const leaderboardRef = ref(db, LEADERBOARD_PATH);
    const snapshot = await get(leaderboardRef);
    
    if (!snapshot.exists()) {
      return { entries: [], total: 0 };
    }
    
    // Convert the snapshot to array
    const allEntries: LeaderboardEntry[] = [];
    snapshot.forEach((childSnapshot) => {
      const entry = {
        id: childSnapshot.key || '',
        ...childSnapshot.val()
      };
      allEntries.push(entry as LeaderboardEntry);
    });
    
    // Sort in descending order by score
    allEntries.sort((a, b) => {
      // First sort by score (descending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by time (ascending)
      return a.timeInSeconds - b.timeInSeconds;
    });
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Return paginated entries and total count
    return {
      entries: allEntries.slice(startIndex, endIndex),
      total: allEntries.length
    };
  } catch (error) {
    console.error('Error fetching leaderboard from Firebase:', error);
    return { entries: [], total: 0 };
  }
}; 