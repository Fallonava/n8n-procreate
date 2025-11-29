import { useState } from 'react';
import { N8NClient } from '../lib/n8n-client';

export function QuickActions({ onActionStart }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [successAction, setSuccessAction] = useState(null);
  const n8nClient = new N8NClient();

  const actions = [
    {
      id: 'trend-research',
      name: 'Trend Research',
      description: 'Analyze current AdobeStock trends',
      icon: '📈',
      buttonText: 'Research Trends',
      color: 'from-purple-500 to-pink-500',
      workflowId: 'trend-research'
    },
    {
      id: 'portfolio-cleanup',
      name: 'Portfolio Cleanup',
      description: 'Remove underperforming images',
      icon: '🧹',
      buttonText: 'Clean Portfolio',
      color: 'from-orange-500 to-red-500',
      workflowId: 'portfolio-cleanup'
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      description: 'Deep dive into competitor performance',
      icon: '📊',
      buttonText: 'Analyze Market',
      color: 'from-green-500 to-teal-500',
      workflowId: 'market-analysis'
    }
  ];

  const handleAction = async (action) => {
    setLoadingAction(action.id);
    setSuccessAction(null);

    if (onActionStart) {
      onActionStart({
        progress: 0,
        currentStep: `Starting ${action.name}...`,
        status: 'processing'
      });
    }

    try {
      // Trigger n8n workflow
      if (onActionStart) {
        onActionStart({
          progress: 20,
          currentStep: `Connecting to n8n for ${action.name}...`,
          status: 'processing'
        });
      }

      const result = await n8nClient.triggerWorkflow(action.workflowId, {
        action: action.id,
        timestamp: new Date().toISOString()
      });

      if (onActionStart) {
        onActionStart({
          progress: 100,
          currentStep: `${action.name} completed!`,
          status: 'completed'
        });
      }

      // Show success animation
      setSuccessAction(action.id);
      setTimeout(() => setSuccessAction(null), 2000);

      const meta = result.metadata || {};
      const msg = `Success: ${action.name} completed!\n\nTitle: ${meta.title || 'N/A'}\nDesc: ${meta.description || 'N/A'}\nLink: ${result.webViewLink || 'Check Google Drive'}`;
      alert(msg);

    } catch (error) {
      console.error(`Error triggering ${action.name}:`, error);

      if (onActionStart) {
        onActionStart({
          progress: 0,
          currentStep: `Failed to start ${action.name}`,
          status: 'error'
        });
      }

      alert(`Failed to start ${action.name}: ${error.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 animate-slide-in-up">
      <div className="flex items-center mb-6">
        <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            disabled={loadingAction}
            className={`relative p-6 rounded-xl bg-gradient-to-r ${action.color} hover:shadow-2xl smooth-transition transform hover:scale-105 active:scale-95 text-white text-left disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group`}
          >
            {/* Shimmer effect when loading */}
            {loadingAction === action.id && (
              <div className="absolute inset-0 animate-shimmer opacity-30"></div>
            )}

            {/* Success overlay */}
            {successAction === action.id && (
              <div className="absolute inset-0 bg-white/20 animate-fade-in flex items-center justify-center">
                <span className="text-4xl animate-float">✓</span>
              </div>
            )}

            <div className="relative z-10">
              <div className="text-2xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <h4 className="font-semibold mb-2">{action.name}</h4>
              <p className="text-sm opacity-90 mb-3">{action.description}</p>
              <div className="text-sm font-medium">
                {loadingAction === action.id ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : successAction === action.id ? (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    Completed!
                  </div>
                ) : (
                  action.buttonText
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}