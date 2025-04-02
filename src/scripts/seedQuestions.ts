// Note: Using require syntax for compatibility
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push, update } = require('firebase/database');
const fs = require('fs');
const pathModule = require('path');

// Define Question interface for TypeScript
interface Question {
  category: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

// Define interface for environment variables
interface EnvVars {
  [key: string]: string;
}

// Read environment variables from .env.local file
function loadEnvVariables(): EnvVars {
  try {
    const envPath = pathModule.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: EnvVars = {};
    
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

const envVars = loadEnvVariables();

// Get Firebase config from environment
const firebaseConfig = {
  apiKey: envVars['NEXT_PUBLIC_FIREBASE_API_KEY'] || '',
  authDomain: envVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || '',
  databaseURL: envVars['NEXT_PUBLIC_FIREBASE_DATABASE_URL'] || '',
  projectId: envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || '',
  storageBucket: envVars['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || '',
  messagingSenderId: envVars['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || '',
  appId: envVars['NEXT_PUBLIC_FIREBASE_APP_ID'] || '',
  measurementId: envVars['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'] || ''
};

// Directly define sample questions to avoid parsing issues
const sampleQuestions: Question[] = [
  {
    category: 'arithmetic',
    text: 'Кто считается "отцом арифметики"?',
    options: ['Пифагор', 'Диофант', 'Евклид', 'Архимед'],
    correctAnswerIndex: 1
  },
  {
    category: 'arithmetic',
    text: 'Какое число является наименьшим простым числом?',
    options: ['0', '1', '2', '3'],
    correctAnswerIndex: 2
  },
  {
    category: 'algebra',
    text: 'Кто из перечисленных математиков внес значительный вклад в развитие алгебры?',
    options: ['Аль-Хорезми', 'Евклид', 'Архимед', 'Фалес'],
    correctAnswerIndex: 0
  },
  {
    category: 'geometry',
    text: 'Чему равна сумма внутренних углов треугольника?',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswerIndex: 1
  },
  {
    category: 'trigonometry',
    text: 'Чему равен синус 90 градусов?',
    options: ['0', '1', '-1', '1/2'],
    correctAnswerIndex: 1
  }
];

console.log('Firebase config:', firebaseConfig);

// Initialize Firebase directly in this script
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// This script will import sample questions into Firebase Realtime Database
// Run this script once to populate the database
const seedQuestions = async () => {
  try {
    console.log(`Starting to seed ${sampleQuestions.length} questions to Firebase Realtime Database...`);
    
    // Approach 1: Set all questions at once with a custom ID
    const questionsRef = ref(db, 'questions');
    const updates: Record<string, any> = {};
    
    sampleQuestions.forEach((question, index) => {
      // Generate a key for each question (q1, q2, etc.)
      const key = `q${index + 1}`;
      updates[key] = question;
    });
    
    // Update multiple paths at once
    await update(questionsRef, updates);
    
    console.log('Successfully seeded questions to Firebase Realtime Database!');
  } catch (error) {
    console.error('Error seeding questions to Firebase:', error);
  }
};

// Call the function
seedQuestions(); 