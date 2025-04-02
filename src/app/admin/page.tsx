'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Question, QuestionCategory } from '@/types';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '@/services/questionService';

const ADMIN_PASSWORD = 'amabru69';

const AdminPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('arithmetic');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  
  // Password protection
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  
  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        alert('Ошибка при загрузке вопросов. Пожалуйста, попробуйте еще раз.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [isAuthenticated]);
  
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
  const handleSaveQuestion = async () => {
    // Validate inputs
    if (!questionText.trim() || options.some(opt => !opt.trim())) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setSaveLoading(true);
      
      if (selectedQuestion) {
        // Edit existing question
        await updateQuestion(selectedQuestion.id, {
          text: questionText,
          options,
          correctAnswerIndex
        });
        
        // Update local state
        setQuestions(questions.map(q => 
          q.id === selectedQuestion.id 
            ? { ...q, text: questionText, options, correctAnswerIndex } 
            : q
        ));
      } else {
        // Add new question
        const newQuestionData = {
          category: selectedCategory,
          text: questionText,
          options,
          correctAnswerIndex
        };
        
        // Add to Firebase
        const newId = await addQuestion(newQuestionData);
        
        // Update local state
        setQuestions([...questions, { id: newId, ...newQuestionData }]);
      }
      
      // Reset form
      handleNewQuestion();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Ошибка при сохранении вопроса. Пожалуйста, попробуйте еще раз.');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle deleting a question
  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      try {
        // Delete from Firebase
        await deleteQuestion(questionId);
        
        // Update local state
        setQuestions(questions.filter(q => q.id !== questionId));
        
        if (selectedQuestion?.id === questionId) {
          handleNewQuestion();
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Ошибка при удалении вопроса. Пожалуйста, попробуйте еще раз.');
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
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Панель администратора</h1>
          
          <div className="flex gap-4">
            <Link 
              href="/" 
              className="bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 py-2 px-4 rounded-xl border border-gray-300/50 transition-all hover:shadow-md font-medium"
            >
              На главную
            </Link>
            <button
              onClick={handleLogout}
              className="bg-secondary/10 hover:bg-secondary/20 text-secondary py-2 px-4 rounded-xl border border-secondary/30 transition-all hover:shadow-md font-medium"
            >
              Выйти
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-t-4 border-primary rounded-full mx-auto mb-4"></div>
            <p className="text-lg">Загрузка вопросов...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Questions list */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Категория
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {categoryNames[category]}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Вопросы ({filteredQuestions.length})</h3>
                  <button
                    onClick={handleNewQuestion}
                    className="bg-accent/20 hover:bg-accent/30 text-primary py-1 px-3 rounded-lg border border-accent/50 transition-all hover:shadow-sm font-medium text-sm"
                  >
                    + Новый вопрос
                  </button>
                </div>
                
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Нет вопросов в этой категории
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    {filteredQuestions.map(question => (
                      <div 
                        key={question.id}
                        className={`mb-3 p-3 rounded-xl cursor-pointer border transition-colors ${
                          selectedQuestion?.id === question.id
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-white/70 hover:bg-gray-100/70 border-gray-100'
                        }`}
                        onClick={() => handleSelectQuestion(question)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium line-clamp-2 flex-1">{question.text}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                            className="ml-2 text-secondary/70 hover:text-secondary transition-colors"
                          >
                            <span>×</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Question form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
                <h2 className="text-xl font-bold mb-6">
                  {selectedQuestion ? 'Редактировать вопрос' : 'Новый вопрос'}
                </h2>
                
                <div className="mb-6">
                  <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">
                    Текст вопроса
                  </label>
                  <textarea
                    id="questionText"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={3}
                    placeholder="Введите текст вопроса"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Варианты ответов
                  </label>
                  
                  {options.map((option, index) => (
                    <div key={index} className="mb-3 flex items-center">
                      <div className="mr-3">
                        <input
                          type="radio"
                          id={`option${index}`}
                          name="correctAnswer"
                          checked={correctAnswerIndex === index}
                          onChange={() => setCorrectAnswerIndex(index)}
                          className="cursor-pointer h-5 w-5 text-primary focus:ring-primary/50"
                        />
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder={`Вариант ${index + 1}`}
                      />
                    </div>
                  ))}
                  
                  <div className="mt-3 text-sm text-gray-500">
                    Выберите правильный ответ, отметив соответствующий вариант
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveQuestion}
                    disabled={saveLoading}
                    className="bg-primary/90 hover:bg-primary text-black font-bold py-2 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {saveLoading ? 'Сохранение...' : 'Сохранить вопрос'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 