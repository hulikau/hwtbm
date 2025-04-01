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
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6">
            «Я знаю математику!»
          </h1>
          
          <RotatingCube />
          
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl mx-auto mt-8 border border-white/50">
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
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 text-center ${
                  nameError 
                    ? 'border-secondary focus:ring-secondary/50' 
                    : 'border-primary/30 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="Введите ваше имя"
              />
              {nameError && (
                <p className="mt-2 text-secondary">Пожалуйста, введите ваше имя</p>
              )}
            </div>
            
            <button
              onClick={handleStartGame}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 px-4 rounded-xl text-xl transition-all shadow-md border border-primary/50 hover:shadow-lg"
            >
              Начать игру
            </button>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link 
                href="/leaderboard" 
                className="bg-accent/20 hover:bg-accent/30 text-primary py-2 px-6 rounded-xl border border-accent/50 transition-all hover:shadow-md font-medium"
              >
                Посмотреть таблицу лидеров
              </Link>
              
              <Link 
                href="/admin" 
                className="bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 py-2 px-6 rounded-xl border border-gray-300/50 transition-all hover:shadow-md font-medium"
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
