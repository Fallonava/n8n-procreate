export function AppleStats() {
  const stats = [
    {
      label: 'Total Uploads',
      value: '1,247',
      trend: '+12%',
      icon: '📊',
      color: 'text-blue-500'
    },
    {
      label: 'Monthly Sales',
      value: '$3,428',
      trend: '+8%',
      icon: '💸',
      color: 'text-green-500'
    },
    {
      label: 'Approval Rate',
      value: '94.2%',
      trend: '+2.1%',
      icon: '✅',
      color: 'text-purple-500'
    },
    {
      label: 'Active Batches',
      value: '3',
      trend: 'In Progress',
      icon: '⚡',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card rounded-2xl p-6 smooth-transition hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
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