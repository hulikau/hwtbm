'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizCard from '@/components/QuizCard';
import { getQuestions } from '@/services/questionService';
import { saveScore } from '@/services/leaderboardService';
import { Question, LeaderboardEntry } from '@/types';

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
  const [loading, setLoading] = useState<boolean>(true);
  // Track correct/incorrect answers
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  
  // Initialize the quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      // Get player name from localStorage
      const name = localStorage.getItem('playerName') || '';
      if (!name) {
        // If no name is provided, redirect to the home page
        router.push('/');
        return;
      }
      
      setPlayerName(name);
      
      try {
        // Get questions from Firebase
        setLoading(true);
        const allQuestions = await getQuestions();
        
        // Shuffle and limit to 20 questions or all available ones if less than 20
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        const randomQuestions = shuffled.slice(0, Math.min(20, shuffled.length));
        
        setQuestions(randomQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
      
      // Record the start time
      setStartTime(Date.now());
    };
    
    initializeQuiz();
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
    const result: LeaderboardEntry = {
      name: playerName,
      score: finalScore,
      timeInSeconds: elapsedTimeInSeconds
    };
    
    // Save the result in local storage temporarily
    localStorage.setItem('lastResult', JSON.stringify(result));
  };
  
  // Save the result and go to the leaderboard
  const handleSaveResult = async () => {
    // Get the result from localStorage
    const resultJson = localStorage.getItem('lastResult');
    if (resultJson) {
      try {
        const entry = JSON.parse(resultJson) as LeaderboardEntry;
        
        // Save the score to Firebase
        await saveScore(entry);
        
        // Clean up
        localStorage.removeItem('lastResult');
        
        // Navigate to the leaderboard
        router.push('/leaderboard');
      } catch (error) {
        console.error('Error saving score:', error);
        alert('Произошла ошибка при сохранении результата. Пожалуйста, попробуйте еще раз.');
      }
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Загрузка вопросов...</p>
        </div>
      </div>
    );
  }
  
  // No questions available
  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-primary mb-4">Нет доступных вопросов</h2>
          <p className="mb-6">К сожалению, не удалось загрузить вопросы для квиза. Пожалуйста, попробуйте позже.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary/90 hover:bg-primary text-black font-bold py-2 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Вернуться на главную
          </button>
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
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Calculate progress percentage
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;
  const questionsLeft = questions.length - currentQuestionIndex;
  
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
        
        {/* Enhanced Progress bar with color segments */}
        <div className="mb-8">
          {/* Container for progress bar */}
          <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-4 mb-1 overflow-hidden shadow border border-white/40">
            {/* Colored segments for answered questions */}
            <div className="flex h-full">
              {answerResults.map((result, index) => (
                <div 
                  key={index}
                  className={`h-full transition-width duration-300 ${result ? 'bg-green-500/90' : 'bg-red-500/90'}`}
                  style={{ width: `${100 / questions.length}%` }}
                />
              ))}
              
              {/* Remaining segment for current question (blue) */}
              {currentQuestionIndex < questions.length && (
                <div 
                  className="bg-primary/90 h-full transition-width duration-300"
                  style={{ width: `${100 / questions.length}%` }}
                />
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow border border-white/50">
            <span className="font-medium">Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
            <span className="font-medium">Осталось: {questionsLeft} вопр.</span>
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