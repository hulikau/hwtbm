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
    const fetchResults = async () => {
      try {
        const sortedResults = await getSortedResults();
        setResults(sortedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        // Fallback to empty array if error occurs
        setResults([]);
      }
    };
    
    fetchResults();
  }, []);
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Таблица лидеров</h1>
          <p className="text-lg text-gray-700">Лучшие результаты квиза «Я знаю математику!»</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">Пока нет результатов</p>
              <p className="mt-4 text-gray-500">Будьте первым, кто пройдет квиз!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100/70 text-left text-gray-700">
                    <th className="px-6 py-3 rounded-tl-xl font-bold tracking-wider">#</th>
                    <th className="px-6 py-3 font-bold tracking-wider">Имя</th>
                    <th className="px-6 py-3 font-bold tracking-wider">Баллы</th>
                    <th className="px-6 py-3 font-bold tracking-wider">Время</th>
                    <th className="px-6 py-3 rounded-tr-xl font-bold tracking-wider">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/70">
                  {results.map((entry, index) => (
                    <tr 
                      key={index} 
                      className={index === 0 ? "bg-accent/10" : index === 1 ? "bg-primary/5" : index === 2 ? "bg-secondary/5" : "hover:bg-gray-50/50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full
                          ${index === 0 ? 'bg-accent/30 text-primary' : 
                            index === 1 ? 'bg-primary/30 text-primary' : 
                            index === 2 ? 'bg-secondary/30 text-secondary' : 'bg-gray-200 text-gray-700'}
                          font-bold text-sm
                        `}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{entry.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg font-bold">
                          {entry.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {Math.floor(entry.timeInSeconds / 60)}м {entry.timeInSeconds % 60}с
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/" 
              className="bg-primary/90 hover:bg-primary text-black py-2 px-6 rounded-xl transition-all shadow-md backdrop-blur-sm hover:shadow-lg font-medium"
            >
              На главную
            </Link>
            <Link 
              href="/quiz" 
              className="bg-accent/20 hover:bg-accent/30 text-primary py-2 px-6 rounded-xl border border-accent/50 transition-all hover:shadow-md font-medium"
            >
              Играть снова
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 