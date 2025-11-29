import { useState, useEffect } from 'react';

export function BatchHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const data = JSON.parse(localStorage.getItem('batch_history') || '[]');
        setHistory(data);
      } catch (e) { console.error(e); }
    };

    loadHistory();
    window.addEventListener('storage', loadHistory);
    // Custom event listener if needed, or just rely on storage event for cross-tab
    const interval = setInterval(loadHistory, 2000); // Simple polling for same-tab updates

    return () => {
      window.removeEventListener('storage', loadHistory);
      clearInterval(interval);
    };
  }, []);

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      localStorage.removeItem('batch_history');
      setHistory([]);
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Batches</h3>
        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600">Clear</button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((batch) => (
          <div key={batch.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
              {batch.thumbnail ? (
                <img src={batch.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">?</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate capitalize">
                {batch.settings.niche}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {new Date(batch.date).toLocaleDateString()} • {batch.successCount} images
              </p>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              {batch.settings.aspectRatio}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}