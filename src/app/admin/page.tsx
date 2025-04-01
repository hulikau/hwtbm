'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Question, QuestionCategory } from '@/types';
import { questions as initialQuestions } from '@/data/questions';

const QUESTIONS_STORAGE_KEY = 'math_quiz_questions';
const ADMIN_PASSWORD = 'amabru69';

const AdminPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('arithmetic');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  
  // Password protection
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  
  // Load questions on component mount
  useEffect(() => {
    try {
      const savedQuestionsJson = localStorage.getItem(QUESTIONS_STORAGE_KEY);
      if (savedQuestionsJson) {
        const savedQuestions = JSON.parse(savedQuestionsJson) as Question[];
        setQuestions(savedQuestions);
      } else {
        // If no questions in localStorage, use the initial questions
        setQuestions(initialQuestions);
        // Save initial questions to localStorage
        localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(initialQuestions));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions(initialQuestions);
    }
  }, []);
  
  // Check if admin is already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      // Store authentication in localStorage (this is only for convenience, not secure)
      localStorage.setItem('admin_auth', 'true');
    } else {
      setPasswordError(true);
    }
  };
  
  // Filter questions by selected category
  const filteredQuestions = questions.filter(q => q.category === selectedCategory);
  
  // Handle selecting a question for editing
  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setQuestionText(question.text);
    setOptions([...question.options]);
    setCorrectAnswerIndex(question.correctAnswerIndex);
  };
  
  // Handle creating a new question
  const handleNewQuestion = () => {
    setSelectedQuestion(null);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
  };
  
  // Handle saving a question (new or edited)
  const handleSaveQuestion = () => {
    // Validate inputs
    if (!questionText.trim() || options.some(opt => !opt.trim())) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    if (selectedQuestion) {
      // Edit existing question
      const updatedQuestions = questions.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, text: questionText, options, correctAnswerIndex } 
          : q
      );
      
      setQuestions(updatedQuestions);
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQuestions));
    } else {
      // Add new question
      const newQuestion: Question = {
        id: `${selectedCategory[0]}${questions.length + 1}`,
        category: selectedCategory,
        text: questionText,
        options,
        correctAnswerIndex
      };
      
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQuestions));
    }
    
    // Reset form
    handleNewQuestion();
  };
  
  // Handle deleting a question
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(updatedQuestions);
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQuestions));
      
      if (selectedQuestion?.id === questionId) {
        handleNewQuestion();
      }
    }
  };
  
  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  // Handle logging out
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };
  
  // Categories for the dropdown
  const categories: QuestionCategory[] = ['arithmetic', 'algebra', 'geometry', 'trigonometry'];
  
  // Category names in Russian
  const categoryNames: Record<QuestionCategory, string> = {
    'arithmetic': 'Арифметика',
    'algebra': 'Алгебра',
    'geometry': 'Геометрия',
    'trigonometry': 'Тригонометрия'
  };
  
  // Password protection view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Панель администратора</h1>
            <p className="text-gray-600">Пожалуйста, введите пароль для доступа</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите пароль"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">Неверный пароль</p>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <Link 
                href="/"
                className="text-primary hover:underline"
              >
                Вернуться на главную
              </Link>
              
              <button
                type="submit"
                className="bg-primary hover:bg-blue-700 text-black font-bold py-2 px-6 rounded-md transition-colors"
              >
                Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Admin panel view (shown only after authentication)
  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Управление вопросами</h1>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            >
              Выйти
            </button>
            <Link 
              href="/"
              className="bg-primary hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
            >
              На главную
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Question list */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Список вопросов</h2>
              <button 
                onClick={handleNewQuestion}
                className="bg-secondary hover:bg-red-600 text-black py-1 px-3 rounded-full text-sm"
              >
                + Новый вопрос
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory)}
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryNames[category]}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {filteredQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Нет вопросов в этой категории</p>
              ) : (
                <ul className="space-y-2">
                  {filteredQuestions.map(question => (
                    <li 
                      key={question.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                        selectedQuestion?.id === question.id ? 'border-primary bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleSelectQuestion(question)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-sm truncate flex-1 pr-2">{question.text}</div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(question.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Right column - Question editor */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">
              {selectedQuestion ? 'Редактирование вопроса' : 'Новый вопрос'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select 
                  value={selectedQuestion?.category || selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory)}
                  disabled={!!selectedQuestion}
                  className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryNames[category]}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Текст вопроса</label>
                <textarea 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Введите текст вопроса"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Варианты ответов</label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input 
                      type="radio" 
                      id={`option-${index}`}
                      name="correctAnswer"
                      checked={correctAnswerIndex === index}
                      onChange={() => setCorrectAnswerIndex(index)}
                      className="mr-2"
                    />
                    <input 
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Вариант ${index + 1}`}
                      className="flex-1 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-1">Выберите правильный ответ, отметив соответствующий переключатель</p>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveQuestion}
                  className="bg-primary hover:bg-blue-700 text-black font-bold py-2 px-6 rounded"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 