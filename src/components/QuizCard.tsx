import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  onAnswer: (optionIndex: number) => void;
  disabled: boolean;
  selectedOption: number | undefined;
  showCorrectAnswer: boolean;
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
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-white/50">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-primary">{question.text}</h3>
      </div>
      
      <div className="space-y-4 flex flex-col items-center w-full">
        {question.options.map((option, index) => {
          // Determine the appropriate style for each option
          let optionStyle = "flex items-center p-4 border rounded-xl cursor-pointer transition-all w-full max-w-xl shadow-sm hover:shadow";
          
          if (disabled) {
            optionStyle += " cursor-default";
          }
          
          if (selectedOption === index) {
            if (showCorrectAnswer && index !== question.correctAnswerIndex) {
              // Incorrect answer selected
              optionStyle += " border-secondary bg-secondary/30 shadow-md";
            } else if (showCorrectAnswer && index === question.correctAnswerIndex) {
              // Correct answer selected
              optionStyle += " border-green-500 bg-green-100/70 shadow-md";
            } else {
              // Selected answer (before showing correct/incorrect)
              optionStyle += " border-primary/70 bg-primary/10 shadow-md";
            }
          } else if (showCorrectAnswer && index === question.correctAnswerIndex) {
            // Correct answer when showing answers (highlight even if not selected)
            optionStyle += " border-green-500 bg-green-100/70 shadow-md";
          } else {
            // Normal state
            optionStyle += " border-gray-300/70 hover:border-primary/70 bg-white/60";
          }
          
          return (
            <button 
              key={index}
              className={optionStyle}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 flex-shrink-0 border ${
                showCorrectAnswer && index === question.correctAnswerIndex 
                  ? "bg-green-500 text-white border-green-500" 
                  : showCorrectAnswer && selectedOption === index && index !== question.correctAnswerIndex
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-primary/90 text-black border-primary/30"
              }`}>
                {optionLabels[index]}
              </span>
              <span className="flex-1 text-center font-medium">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard; 