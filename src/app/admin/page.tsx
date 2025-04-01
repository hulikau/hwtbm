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
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50">
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
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  passwordError ? 'border-secondary/70 focus:ring-secondary/50' : 'border-gray-300 focus:ring-primary/50'
                }`}
                placeholder="Введите пароль"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-secondary">Неверный пароль</p>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <Link 
                href="/"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Вернуться на главную
              </Link>
              
              <button
                type="submit"
                className="bg-primary/90 hover:bg-primary text-black font-medium py-2 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
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
              className="bg-gray-200/70 hover:bg-gray-300/70 text-gray-800 py-2 px-4 rounded-xl transition-all"
            >
              Выйти
            </button>
            <Link 
              href="/"
              className="bg-primary/90 hover:bg-primary text-black font-medium py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              На главную
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Question list */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Список вопросов</h2>
              <button 
                onClick={handleNewQuestion}
                className="bg-secondary/90 hover:bg-secondary text-black py-1 px-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
              >
                + Новый вопрос
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory)}
                className="w-full border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white/90"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryNames[category]}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="overflow-y-auto max-h-96 pr-1">
              {filteredQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Нет вопросов в этой категории</p>
              ) : (
                <ul className="space-y-2">
                  {filteredQuestions.map(question => (
                    <li 
                      key={question.id}
                      className={`p-3 border rounded-xl cursor-pointer hover:bg-white/40 transition-all ${
                        selectedQuestion?.id === question.id ? 'border-primary/50 bg-primary/5 shadow-sm' : 'border-gray-200/70'
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
                          className="text-secondary hover:text-secondary/80 transition-colors"
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
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:col-span-2 border border-white/50">
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
                  className="w-full border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white/90 disabled:bg-gray-100/80 disabled:text-gray-500"
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
                  className="w-full border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white/90"
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
                      className="mr-2 text-primary focus:ring-primary/50"
                    />
                    <input 
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Вариант ${index + 1}`}
                      className="flex-1 border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white/90"
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-1">Выберите правильный ответ, отметив соответствующий переключатель</p>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveQuestion}
                  className="bg-primary/90 hover:bg-primary text-black font-medium py-2 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
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