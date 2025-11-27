import { useState, useEffect } from 'react';

export function AppleStats() {
  const [stats, setStats] = useState({
    totalUploads: 0,
    monthlySales: 0,
    approvalRate: 0,
    activeBatches: 0
  });
  

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalUploads: 1247,
        monthlySales: 3428,
        approvalRate: 94.2,
        activeBatches: 3
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const statsData = [
    {
      label: 'Total Uploads',
      value: stats.totalUploads.toLocaleString(),
      trend: '+12%',
      icon: '📊',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Monthly Sales',
      value: `$${stats.monthlySales.toLocaleString()}`,
      trend: '+8%',
      icon: '💸',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Approval Rate',
      value: `${stats.approvalRate}%`,
      trend: '+2.1%',
      icon: '✅',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Active Batches',
      value: stats.activeBatches,
      trend: 'In Progress',
      icon: '⚡',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="glass-card rounded-2xl p-6 smooth-transition hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.bgColor} ${stat.color.replace('text', 'text')}`}>
              {stat.trend}
            </span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
