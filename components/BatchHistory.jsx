import { useState, useEffect } from 'react';

export function BatchHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('batch_history');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    };

    loadHistory();

    // Listen for storage events (in case updated from another tab or component)
    window.addEventListener('storage', loadHistory);
    // Custom event for same-tab updates
    const handleLocalUpdate = () => loadHistory();
    window.addEventListener('batch_history_updated', handleLocalUpdate); // We might need to dispatch this

    // Poll for changes every few seconds as a fallback/simple way to update
    const interval = setInterval(loadHistory, 2000);

    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('batch_history_updated', handleLocalUpdate);
      clearInterval(interval);
    };
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('batch_history');
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Batches</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent batches found.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Batches</h3>
        <button
          onClick={clearHistory}
          className="text-xs text-red-500 hover:text-red-700 hover:underline"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((batch) => (
          <div key={batch.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              {batch.thumbnail ? (
                <img src={batch.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">{batch.settings?.niche || 'Unknown'}</h4>
                <span className="text-xs text-gray-500">{new Date(batch.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {batch.successCount} success, {batch.errorCount} failed
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                  {batch.settings?.style}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                  {batch.settings?.aspectRatio || '16:9'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}