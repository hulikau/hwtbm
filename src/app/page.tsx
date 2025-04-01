'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RotatingCube from '@/components/RotatingCube';

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  
  // Check if there's a name in localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);
  
  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
    if (nameError) {
      setNameError(false);
    }
  };
  
  // Handle game start
  const handleStartGame = () => {
    if (!playerName.trim()) {
      setNameError(true);
      return;
    }
    
    // Save the player name to localStorage
    localStorage.setItem('playerName', playerName.trim());
    
    // Navigate to the quiz page
    router.push('/quiz');
  };
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background math-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6">
            «Я знаю математику!»
          </h1>
          
          <RotatingCube />
          
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
            <p className="text-lg mb-6">
              Мы приглашаем Вас принять участие в квизе «Я знаю математику!».
              Проверьте свои знания по истории и терминологии математики в разделах: арифметика, алгебра, геометрия, тригонометрия. Удачи в игре!
            </p>
            
            <div className="mb-8 text-center">
              <label htmlFor="playerName" className="block text-lg font-medium text-gray-700 mb-2">
                Ваше имя
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={handleNameChange}
                className={`w-full px-4 py-3 text-lg border-2 rounded-md focus:outline-none focus:ring-2 text-center ${
                  nameError 
                    ? 'border-secondary focus:ring-secondary' 
                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                }`}
                placeholder="Введите ваше имя"
              />
              {nameError && (
                <p className="mt-2 text-secondary">Пожалуйста, введите ваше имя</p>
              )}
            </div>
            
            <button
              onClick={handleStartGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 px-4 rounded-full text-xl transition-colors shadow-md border-2 border-blue-600"
            >
              Начать игру
            </button>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link 
                href="/leaderboard" 
                className="text-primary hover:underline font-medium py-2 px-4 rounded-full border border-primary"
              >
                Посмотреть таблицу лидеров
              </Link>
              
              <Link 
                href="/admin" 
                className="text-gray-700 hover:underline py-2 px-4 rounded-full border border-gray-300 font-medium"
              >
                Администрирование
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
