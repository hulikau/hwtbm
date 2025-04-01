'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizCard from '@/components/QuizCard';
import { getRandomQuestions } from '@/data/questions';
import { Question, PlayerResult } from '@/types';
import { saveResult } from '@/services/storageService';

const QuizPage: React.FC = () => {
  const router = useRouter();
  
  // State for the quiz
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  // Track correct/incorrect answers
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  
  // Initialize the quiz
  useEffect(() => {
    // Get player name from localStorage or URL params
    const name = localStorage.getItem('playerName') || '';
    if (!name) {
      // If no name is provided, redirect to the home page
      router.push('/');
      return;
    }
    
    setPlayerName(name);
    
    // Get random questions for the quiz
    const randomQuestions = getRandomQuestions(20);
    setQuestions(randomQuestions);
    
    // Record the start time
    setStartTime(Date.now());
  }, [router]);
  
  // Handle answering a question
  const handleAnswer = (optionIndex: number) => {
    // Set the selected option
    setSelectedOption(optionIndex);
    
    // Check if the answer is correct
    const correct = optionIndex === questions[currentQuestionIndex].correctAnswerIndex;
    
    // Update answer results array
    const newAnswerResults = [...answerResults];
    newAnswerResults[currentQuestionIndex] = correct;
    setAnswerResults(newAnswerResults);
    
    if (correct) {
      // Increase the score by 5 points
      setScore(prevScore => prevScore + 5);
    }
    
    // Show the correct answer
    setShowCorrectAnswer(true);
    
    // Move to the next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        // Move to the next question
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(undefined);
        setShowCorrectAnswer(false);
      } else {
        // Game over
        finishGame();
      }
    }, 1500);
  };
  
  // Finish the game and save the result
  const finishGame = () => {
    setGameOver(true);
    
    // Calculate the elapsed time in seconds
    const endTime = Date.now();
    const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
    
    // Create a result object
    const result: PlayerResult = {
      name: playerName,
      score: score,
      timeInSeconds: elapsedTimeInSeconds,
      date: new Date().toLocaleDateString('ru-RU')
    };
    
    // Save the result in local storage
    localStorage.setItem('lastResult', JSON.stringify(result));
  };
  
  // Save the result and go to the leaderboard
  const handleSaveResult = () => {
    // Get the result from localStorage
    const resultJson = localStorage.getItem('lastResult');
    if (resultJson) {
      const result = JSON.parse(resultJson) as PlayerResult;
      
      // Save the result using the storage service
      saveResult(result);
      
      // Clean up
      localStorage.removeItem('lastResult');
      
      // Navigate to the leaderboard
      router.push('/leaderboard');
    }
  };
  
  // Loading state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background math-bg">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Загрузка вопросов...</p>
        </div>
      </div>
    );
  }
  
  // Game over state
  if (gameOver) {
    return (
      <div className="min-h-screen py-12 px-4 bg-background math-bg">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Игра завершена!</h2>
          
          <div className="mb-8 p-6 bg-accent bg-opacity-10 rounded-lg">
            <p className="text-xl mb-2">Участник: <span className="font-bold">{playerName}</span></p>
            <p className="text-4xl font-bold text-primary mb-2">{score} из 100 баллов</p>
            <p className="text-gray-600">Вы ответили правильно на {score / 5} из {questions.length} вопросов</p>
          </div>
          
          <button
            onClick={handleSaveResult}
            className="bg-primary hover:bg-blue-700 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-md border-2 border-primary"
          >
            СОХРАНИТЬ РЕЗУЛЬТАТ
          </button>
        </div>
      </div>
    );
  }
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Calculate progress percentage
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;
  const questionsLeft = questions.length - currentQuestionIndex;
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background math-bg">
      <div className="max-w-4xl mx-auto">
        {/* Header with progress and score */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm px-4 py-2 bg-white rounded-full shadow">
            <span className="font-bold">Участник:</span> {playerName}
          </div>
          <div className="px-4 py-2 bg-white rounded-full shadow flex items-center">
            <span className="text-black font-bold mr-2">Баллы:</span>
            <span className="bg-primary text-black font-bold px-3 py-1 rounded-full border border-primary">{score}</span>
          </div>
        </div>
        
        {/* Enhanced Progress bar with color segments */}
        <div className="mb-8">
          {/* Container for progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-1 overflow-hidden shadow">
            {/* Colored segments for answered questions */}
            <div className="flex h-full">
              {answerResults.map((result, index) => (
                <div 
                  key={index}
                  className={`h-full transition-width duration-300 ${result ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${100 / questions.length}%` }}
                />
              ))}
              
              {/* Remaining segment for current question (blue) */}
              {currentQuestionIndex < questions.length && (
                <div 
                  className="bg-primary h-full transition-width duration-300"
                  style={{ width: `${100 / questions.length}%` }}
                />
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm bg-white px-3 py-1 rounded-full shadow">
            <span className="font-medium">Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
            <span className="font-medium">Осталось: {questionsLeft} вопр.</span>
          </div>
        </div>
        
        {/* Question counter */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-primary text-black rounded-full text-lg font-bold shadow-md border-2 border-primary">
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </span>
        </div>
        
        {/* Question card */}
        <QuizCard 
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={selectedOption !== undefined}
          selectedOption={selectedOption}
          showCorrectAnswer={showCorrectAnswer}
        />
      </div>
    </div>
  );
};

export default QuizPage; 