import { getDatabase, ref, push, get, update, remove, child, set } from 'firebase/database';
import { app } from './firebaseConfig';
import { Question } from '@/types';

const QUESTIONS_PATH = 'questions';
const db = getDatabase(app);

// Get all questions from Firebase Realtime Database
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const questionsRef = ref(db, QUESTIONS_PATH);
    const snapshot = await get(questionsRef);
    
    const questions: Question[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const question = {
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        };
        questions.push(question as Question);
      });
    }
    
    return questions;
  } catch (error) {
    console.error('Error fetching questions from Firebase:', error);
    return [];
  }
};

// Add a new question to Firebase
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<string> => {
  try {
    const questionsRef = ref(db, QUESTIONS_PATH);
    const newQuestionRef = push(questionsRef);
    await set(newQuestionRef, question);
    return newQuestionRef.key || '';
  } catch (error) {
    console.error('Error adding question to Firebase:', error);
    throw error;
  }
};

// Update an existing question
export const updateQuestion = async (id: string, questionData: Partial<Omit<Question, 'id'>>): Promise<void> => {
  try {
    const questionRef = ref(db, `${QUESTIONS_PATH}/${id}`);
    await update(questionRef, questionData);
  } catch (error) {
    console.error('Error updating question in Firebase:', error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    const questionRef = ref(db, `${QUESTIONS_PATH}/${id}`);
    await remove(questionRef);
  } catch (error) {
    console.error('Error deleting question from Firebase:', error);
    throw error;
  }
};

// Import multiple questions at once
export const importQuestions = async (questions: Omit<Question, 'id'>[]): Promise<void> => {
  try {
    const updates: Record<string, any> = {};
    const questionsRef = ref(db, QUESTIONS_PATH);
    
    questions.forEach(question => {
      const newQuestionRef = push(questionsRef);
      updates[`${QUESTIONS_PATH}/${newQuestionRef.key}`] = question;
    });
    
    // Update multiple locations at once
    const dbRef = ref(db);
    await update(dbRef, updates);
  } catch (error) {
    console.error('Error batch importing questions to Firebase:', error);
    throw error;
  }
}; 