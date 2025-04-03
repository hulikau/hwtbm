'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@/types';

const LeaderboardPage: React.FC = () => {
  const [results, setResults] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const leaderboardData = await getLeaderboard(currentPage, pageSize);
        setResults(leaderboardData.entries);
        setTotalEntries(leaderboardData.total);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [currentPage, pageSize]);
  
  const totalPages = Math.ceil(totalEntries / pageSize);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  // Function to render medal icon based on position (only on first page)
  const renderMedal = (index: number) => {
    if (currentPage !== 1) return null;
    
    switch (index) {
      case 0:
        return (
          <span className="text-yellow-500 text-xl mr-1" title="Золото">
            🥇
          </span>
        );
      case 1:
        return (
          <span className="text-gray-400 text-xl mr-1" title="Серебро">
            🥈
          </span>
        );
      case 2:
        return (
          <span className="text-amber-700 text-xl mr-1" title="Бронза">
            🥉
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Таблица лидеров</h1>
          <p className="text-lg text-gray-700">Лучшие результаты квиза «Я знаю математику!»</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">Загрузка результатов...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">Пока нет результатов</p>
              <p className="mt-4 text-gray-500">Будьте первым, кто пройдет квиз!</p>
            </div>
          ) : (
            <>
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
                        key={entry.id || index} 
                        className="hover:bg-gray-50/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm
                          `}>
                            {(currentPage - 1) * pageSize + index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            {renderMedal(index)}
                            {entry.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg font-bold">
                            {entry.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {Math.floor(entry.timeInSeconds / 60)}м {entry.timeInSeconds % 60}с
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {entry.timestamp 
                            ? new Date(entry.timestamp).toLocaleDateString() 
                            : 'Н/Д'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Показать:</span>
                  <select 
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">записей</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    «
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    ‹
                  </button>
                  
                  <span className="px-3 py-1 text-sm">
                    Страница {currentPage} из {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    ›
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    »
                  </button>
                </div>
              </div>
            </>
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