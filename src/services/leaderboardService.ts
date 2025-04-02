import { getDatabase, ref, push, query, orderByChild, limitToLast, get } from 'firebase/database';
import { app } from './firebaseConfig';
import { LeaderboardEntry } from '@/types';

const LEADERBOARD_PATH = 'leaderboard';
const db = getDatabase(app);

export const saveScore = async (entry: LeaderboardEntry): Promise<string> => {
  try {
    // Add timestamp to the entry
    const entryWithTimestamp = {
      ...entry,
      timestamp: new Date().toISOString()
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

export const getLeaderboard = async (limitCount = 10): Promise<LeaderboardEntry[]> => {
  try {
    // Query leaderboard entries, ordered by score (descending)
    // But since Firebase can only do ascending order, we get the last N entries
    const leaderboardRef = ref(db, LEADERBOARD_PATH);
    
    // Get all entries since we need to sort them ourselves
    const snapshot = await get(ref(db, LEADERBOARD_PATH));
    const entries: LeaderboardEntry[] = [];
    
    if (snapshot.exists()) {
      // Convert the snapshot to array
      snapshot.forEach((childSnapshot) => {
        const entry = {
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        };
        entries.push(entry as LeaderboardEntry);
      });
      
      // Sort in descending order by score
      entries.sort((a, b) => {
        // First sort by score (descending)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // If scores are equal, sort by time (ascending)
        return a.timeInSeconds - b.timeInSeconds;
      });
      
      // Return only the top N entries
      return entries.slice(0, limitCount);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching leaderboard from Firebase:', error);
    return [];
  }
}; 