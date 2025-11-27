import { BatchCreator } from '../components/BatchCreator';
import { AppleStats } from '../components/AppleStats';
import { BatchHistory } from '../components/BatchHistory';
import { ProgressTracker } from '../components/ProgressTracker';
import { QuickActions } from '../components/QuickActions';
import { ThemeToggle } from '../components/ThemeToggle';
import { useState } from 'react';

export default function Home() {
  const [activeBatch, setActiveBatch] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan Theme Toggle */}
        <div className="mb-8 text-center relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent mb-4">
            Stock Automation Studio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Connected to: <span className="font-mono text-blue-600 dark:text-blue-400 ml-1">n8n.fallonava.my.id</span>
          </p>
        </div>

        {/* Stats Grid */}
        <AppleStats />

        {/* Progress Tracker for Active Batch */}
        {activeBatch && (
          <ProgressTracker 
            progress={activeBatch.progress} 
            currentStep={activeBatch.currentStep}
            status={activeBatch.status}
          />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Activity */}
          <div className="xl:col-span-2 space-y-8">
            <QuickActions onActionStart={setActiveBatch} />
            <BatchHistory />
          </div>

          {/* Right Column - Batch Creator */}
          <div>
            <BatchCreator onBatchStart={setActiveBatch} />
          </div>
        </div>
      </div>
    </div>
  );
}