// Question category types
export type QuestionCategory = 'arithmetic' | 'algebra' | 'geometry' | 'trigonometry';

// Question model
export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

// Player result
export interface PlayerResult {
  name: string;
  score: number;
  timeInSeconds: number;
  date: string;
}

// Quiz state
export interface QuizState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  startTime: number | null;
  endTime: number | null;
  playerName: string;
  isGameOver: boolean;
} 