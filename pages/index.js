import { BatchCreator } from '../components/BatchCreator';
import { AppleStats } from '../components/AppleStats';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Stock Automation Studio
          </h1>
          <p className="text-lg text-gray-600 flex items-center justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Connected to: <span className="font-mono text-blue-600 ml-1">n8n.fallonava.my.id</span>
          </p>
        </div>

        {/* Stats Grid */}
        <AppleStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Activity */}
          <div className="xl:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '📈', label: 'Trend Research', color: 'from-purple-500 to-pink-500' },
                  { icon: '⚡', label: 'Process Queue', color: 'from-orange-500 to-red-500' },
                  { icon: '📊', label: 'View Analytics', color: 'from-green-500 to-teal-500' }
                ].map((action, index) => (
                  <button key={index} className="p-4 rounded-xl bg-gradient-to-r hover:shadow-lg smooth-transition transform hover:scale-105">
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="text-sm font-medium text-white">{action.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'Batch created', status: 'Processing', color: 'text-blue-500' },
                  { time: '5 min ago', action: '10 images uploaded', status: 'Completed', color: 'text-green-500' },
                  { time: '1 hour ago', action: 'Trend analysis', status: 'Completed', color: 'text-green-500' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                    <div>
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                    <span className={`text-sm font-medium ${activity.color}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Batch Creator */}
          <div>
            <BatchCreator />
          </div>
        </div>
      </div>
    </div>
  );
}