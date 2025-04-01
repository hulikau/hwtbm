'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Leaderboard from '@/components/Leaderboard';
import { getSortedResults } from '@/services/storageService';
import { PlayerResult } from '@/types';

const LeaderboardPage: React.FC = () => {
  const [results, setResults] = useState<PlayerResult[]>([]);
  
  useEffect(() => {
    // Get sorted results from storage
    const sortedResults = getSortedResults();
    setResults(sortedResults);
  }, []);
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background math-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            «Я знаю математику!»
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Таблица результатов участников
          </p>
        </div>
        
        <Leaderboard results={results} />
        
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-block bg-primary hover:bg-blue-700 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-md border-2 border-primary"
          >
            На главную
          </Link>
          
          <Link 
            href="/quiz"
            className="inline-block bg-secondary hover:bg-red-600 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors ml-4 shadow-md border-2 border-secondary"
          >
            Играть снова
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 