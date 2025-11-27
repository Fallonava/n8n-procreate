import { useState } from 'react';

export function QuickActions({ onActionStart }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const actions = [
    {
      id: 'trend-research',
      name: 'Trend Research',
      description: 'Analyze current AdobeStock trends',
      icon: '📈',
      buttonText: 'Research Trends',
      color: 'from-purple-500 to-pink-500',
      duration: 3000
    },
    {
      id: 'portfolio-cleanup',
      name: 'Portfolio Cleanup', 
      description: 'Remove underperforming images',
      icon: '🧹',
      buttonText: 'Clean Portfolio',
      color: 'from-orange-500 to-red-500',
      duration: 2000
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      description: 'Deep dive into competitor performance',
      icon: '📊',
      buttonText: 'Analyze Market',
      color: 'from-green-500 to-teal-500',
      duration: 4000
    }
  ];

  const handleAction = async (action) => {
    setLoadingAction(action.id);
    
    if (onActionStart) {
      onActionStart({
        progress: 0,
        currentStep: `Starting ${action.name}...`,
        status: 'processing'
      });
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      
      if (onActionStart) {
        onActionStart({
          progress: Math.min(progress, 100),
          currentStep: `Processing ${action.name}... (${progress}%)`,
          status: progress >= 100 ? 'completed' : 'processing'
        });
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLoadingAction(null);
          alert(`✅ ${action.name} completed successfully!`);
        }, 500);
      }
    }, action.duration / 20);
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center mb-6">
        <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button 
            key={action.id}
            onClick={() => handleAction(action)}
            disabled={loadingAction}
            className={`p-6 rounded-xl bg-gradient-to-r ${action.color} hover:shadow-lg smooth-transition transform hover:scale-105 text-white text-left disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-2xl mb-3">{action.icon}</div>
            <h4 className="font-semibold mb-2">{action.name}</h4>
            <p className="text-sm opacity-90 mb-3">{action.description}</p>
            <div className="text-sm font-medium">
              {loadingAction === action.id ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                action.buttonText
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}