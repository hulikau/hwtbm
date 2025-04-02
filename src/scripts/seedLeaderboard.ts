// Note: Using require syntax for compatibility
const firebaseAppLeaderboard = require('firebase/app');
const firebaseDbLeaderboard = require('firebase/database');
const fsLeaderboard = require('fs');
const pathLeaderboard = require('path');

// Define LeaderboardEntry interface for TypeScript
interface LeaderboardEntry {
  name: string;
  score: number;
  timeInSeconds: number;
  timestamp: string;
}

// Define interface for environment variables
interface EnvVarsLeaderboard {
  [key: string]: string;
}

// Read environment variables from .env.local file
function loadEnvVariablesLeaderboard(): EnvVarsLeaderboard {
  try {
    const envPath = pathLeaderboard.resolve(process.cwd(), '.env.local');
    const envContent = fsLeaderboard.readFileSync(envPath, 'utf8');
    const envVars: EnvVarsLeaderboard = {};
    
    envContent.split('\n').forEach((line: string) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        envVars[key] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    return {};
  }
}

const envVarsLeaderboard = loadEnvVariablesLeaderboard();

// Get Firebase config from environment
const firebaseConfigLeaderboard = {
  apiKey: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_API_KEY'] || '',
  authDomain: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || '',
  databaseURL: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_DATABASE_URL'] || '',
  projectId: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || '',
  storageBucket: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || '',
  messagingSenderId: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || '',
  appId: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_APP_ID'] || '',
  measurementId: envVarsLeaderboard['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'] || ''
};

// Create sample leaderboard entries
const sampleLeaderboardEntries: LeaderboardEntry[] = [
  {
    name: 'Мария',
    score: 85,
    timeInSeconds: 172,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    name: 'Александр',
    score: 95,
    timeInSeconds: 156,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    name: 'Елена',
    score: 75,
    timeInSeconds: 189,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    name: 'Дмитрий',
    score: 90,
    timeInSeconds: 164,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    name: 'Анна',
    score: 100,
    timeInSeconds: 143,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

console.log('Firebase config:', firebaseConfigLeaderboard);

// Initialize Firebase directly in this script
const appLeaderboard = firebaseAppLeaderboard.initializeApp(firebaseConfigLeaderboard);
const dbLeaderboard = firebaseDbLeaderboard.getDatabase(appLeaderboard);

// This script will import sample leaderboard entries into Firebase Realtime Database
// Run this script once to populate the database
const seedLeaderboard = async () => {
  try {
    console.log(`Starting to seed ${sampleLeaderboardEntries.length} leaderboard entries to Firebase Realtime Database...`);
    
    // Method 1: Using push to generate unique keys
    const leaderboardRef = firebaseDbLeaderboard.ref(dbLeaderboard, 'leaderboard');
    
    // Create an array of promises for each push operation
    const promises = sampleLeaderboardEntries.map(entry => 
      firebaseDbLeaderboard.push(leaderboardRef, entry)
    );
    
    // Wait for all push operations to complete
    await Promise.all(promises);
    
    console.log('Successfully seeded leaderboard entries to Firebase Realtime Database!');
  } catch (error) {
    console.error('Error seeding leaderboard entries to Firebase:', error);
  }
};

// Call the function
seedLeaderboard(); 