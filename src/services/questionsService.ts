import { Question } from '../types';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import { questions as localQuestions } from '../data/questions'; // Import local questions as fallback

// Fallback implementation for db using localStorage
const localDb = {
  collection: (path: string) => ({
    path
  })
};

// Try to import Firebase, but fallback to localStorage implementation if it fails
let db: any;
try {
  // This must be dynamically imported to prevent build errors
  const { db: firebaseDb } = require('../lib/firebase');
  db = firebaseDb;
} catch (error) {
  console.warn('Firebase not available, using localStorage fallback');
  db = localDb;
}

const QUESTIONS_COLLECTION = 'quizQuestions';

/**
 * Fetches all questions from Firestore
 */
export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, QUESTIONS_COLLECTION));
    const questions: Question[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        category: data.category,
        text: data.text,
        options: data.options,
        correctAnswerIndex: data.correctAnswerIndex
      });
    });
    
    // If no questions in Firestore yet, seed with local questions
    if (questions.length === 0) {
      await seedQuestionsToFirestore();
      return localQuestions;
    }
    
    return questions;
  } catch (error) {
    console.error('Error fetching questions from Firestore:', error);
    return localQuestions; // Fallback to local questions
  }
};

/**
 * Gets questions by category from Firestore
 */
export const getQuestionsByCategory = async (category: string): Promise<Question[]> => {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    const questions: Question[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        category: data.category,
        text: data.text,
        options: data.options,
        correctAnswerIndex: data.correctAnswerIndex
      });
    });
    
    return questions;
  } catch (error) {
    console.error('Error fetching questions by category from Firestore:', error);
    // Fallback to local questions filtered by category
    return localQuestions.filter(q => q.category === category);
  }
};

/**
 * Gets random questions from the available pool
 */
export const getRandomQuestions = async (count: number = 20): Promise<Question[]> => {
  try {
    // Get all questions from Firestore
    const allQuestions = await getAllQuestions();
    
    // Ensure we have at least the requested number of questions
    if (allQuestions.length < count) {
      return allQuestions;
    }
    
    // Create a copy to avoid modifying the original array
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // Return the first {count} questions
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error getting random questions:', error);
    
    // Fallback to local implementation
    const shuffled = [...localQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
};

/**
 * Adds a new question to Firestore
 */
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), question);
    return docRef.id;
  } catch (error) {
    console.error('Error adding question to Firestore:', error);
    throw error;
  }
};

/**
 * Updates an existing question in Firestore
 */
export const updateQuestion = async (id: string, question: Partial<Question>): Promise<void> => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await updateDoc(questionRef, question);
  } catch (error) {
    console.error('Error updating question in Firestore:', error);
    throw error;
  }
};

/**
 * Deletes a question from Firestore
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await deleteDoc(questionRef);
  } catch (error) {
    console.error('Error deleting question from Firestore:', error);
    throw error;
  }
};

/**
 * Seeds the Firestore database with initial questions from local data
 * This is run once when the app first connects to Firestore
 */
export const seedQuestionsToFirestore = async (): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const collectionRef = collection(db, QUESTIONS_COLLECTION);
    
    // Check if questions already exist
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
      console.log('Questions already exist in Firestore, skipping seed');
      return;
    }
    
    // Add each question to the batch
    for (const question of localQuestions) {
      const newDocRef = doc(collectionRef);
      // Omit the id as Firestore will generate one
      const { id: _id, ...questionData } = question;
      batch.set(newDocRef, questionData);
    }
    
    // Commit the batch
    await batch.commit();
    console.log('Successfully seeded questions to Firestore');
  } catch (error) {
    console.error('Error seeding questions to Firestore:', error);
  }
}; 