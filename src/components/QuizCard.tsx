import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  disabled?: boolean;
  selectedOption?: number;
  showCorrectAnswer?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  disabled = false,
  selectedOption,
  showCorrectAnswer = false
}) => {
  // Array of option labels (A, B, C, D)
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto border border-gray-200">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-primary">{question.text}</h3>
      </div>
      
      <div className="space-y-4 flex flex-col items-center w-full">
        {question.options.map((option, index) => {
          // Determine the appropriate style for each option
          let optionStyle = "flex items-center p-4 border-2 rounded-md cursor-pointer transition-colors w-full max-w-xl shadow-sm hover:shadow";
          
          if (disabled) {
            optionStyle += " cursor-default";
          }
          
          if (selectedOption === index) {
            if (showCorrectAnswer && index !== question.correctAnswerIndex) {
              // Incorrect answer selected
              optionStyle += " border-secondary bg-red-100 shadow";
            } else {
              // Selected answer
              optionStyle += " border-primary bg-blue-100 shadow";
            }
          } else if (showCorrectAnswer && index === question.correctAnswerIndex) {
            // Correct answer when showing answers
            optionStyle += " border-green-500 bg-green-100 shadow";
          } else {
            // Normal state
            optionStyle += " border-gray-300 hover:border-primary";
          }
          
          return (
            <button 
              key={index}
              className={optionStyle}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black mr-3 flex-shrink-0 border border-primary">
                {optionLabels[index]}
              </span>
              <span className="flex-1 text-center font-medium">{option}</span>
            </button>
          );
        })}
      </div>
      
      {showCorrectAnswer && selectedOption !== question.correctAnswerIndex && (
        <div className="mt-4 p-3 bg-red-100 text-secondary rounded text-center max-w-xl mx-auto border-2 border-secondary shadow">
          <p className="font-bold">Правильный ответ: {question.options[question.correctAnswerIndex]}</p>
        </div>
      )}
    </div>
  );
};

export default QuizCard; 