'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizCard from '@/components/QuizCard';
import { getRandomQuestions } from '@/services/questionsService';
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
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameOver, setGameOver] = useState<boolean>(false);
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
    const loadQuestions = async () => {
      try {
        const randomQuestions = await getRandomQuestions(20);
        setQuestions(randomQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    
    loadQuestions();
    
    // Record the start time
    setStartTime(Date.now());
  }, [router]);
  
  // Handle answering a question
  const handleAnswer = (optionIndex: number) => {
    // Set the selected option
    setSelectedOption(optionIndex);
    
    // Check if the answer is correct
    const correct = optionIndex === questions[currentQuestionIndex].correctAnswerIndex;
    
    // Update answer results array immediately
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
    
    // Calculate the final score - make sure it's correct by counting correct answers
    const correctAnswersCount = answerResults.filter(result => result).length;
    const finalScore = correctAnswersCount * 5;
    setScore(finalScore); // Update score to ensure it matches correct answers
    
    // Calculate the elapsed time in seconds
    const endTime = Date.now();
    const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
    
    // Create a result object
    const result: PlayerResult = {
      name: playerName,
      score: finalScore, // Use the final calculated score
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
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <div className="min-h-screen py-12 px-4 bg-background">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Игра завершена!</h2>
          
          <div className="mb-8 p-6 bg-accent/20 rounded-xl">
            <p className="text-xl mb-2">Участник: <span className="font-bold">{playerName}</span></p>
            <p className="text-4xl font-bold text-primary mb-2">{score} из 100 баллов</p>
            <p className="text-gray-600 mb-2">Вы ответили правильно на {score / 5} из {questions.length} вопросов</p>
            <div className="flex justify-center items-center gap-6 mt-4 text-gray-700">
              <div className="flex flex-col items-center">
                <span className="text-sm uppercase font-medium">Время</span>
                <span className="font-bold">{Math.floor((Date.now() - startTime) / 60000)}м {Math.floor(((Date.now() - startTime) % 60000) / 1000)}с</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm uppercase font-medium">Дата</span>
                <span className="font-bold">{new Date().toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSaveResult}
            className="bg-primary/90 hover:bg-primary text-black font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-md hover:shadow-lg"
          >
            СОХРАНИТЬ РЕЗУЛЬТАТ
          </button>
        </div>
      </div>
    );
  }
  
  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header with progress and score */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow border border-white/50">
            <span className="font-bold">Участник:</span> {playerName}
          </div>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow border border-white/50 flex items-center">
            <span className="text-gray-700 font-bold mr-2">Баллы:</span>
            <span className="bg-primary/90 text-black font-bold px-3 py-1 rounded-xl">{score}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200/70 w-full rounded-full overflow-hidden mb-4">
          <div className="absolute left-0 top-0 h-full bg-primary/90 transition-width duration-300" 
            style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
          />
          <div className="absolute left-0 top-0 h-full flex w-full">
            {answerResults.map((result, index) => (
              <div 
                key={index}
                className={`h-full transition-width duration-300 ${result ? 'bg-green-500/90' : 'bg-red-500/90'}`}
                style={{ width: `${100 / questions.length}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Question counter */}
        <div className="text-center mb-8">
          <span className="inline-block px-6 py-2 bg-primary/90 text-black rounded-xl text-lg font-bold shadow-md backdrop-blur-sm">
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