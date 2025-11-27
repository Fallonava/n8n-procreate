import { exportBatchData } from '../lib/export-utils';

export function BatchHistory() {
  const batches = [
    {
      id: 1,
      date: '2024-01-15 14:30',
      niche: 'technology',
      count: 8,
      status: 'completed',
      results: '8/8 successful',
      data: {
        prompts: [
          { prompt: "minimalist photorealistic technology product shot...", niche: "technology" },
          { prompt: "modern tech gadget professional photography...", niche: "technology" }
        ],
        settings: { niche: 'technology', count: 8, style: 'photorealistic' }
      }
    },
    // ... other batches with data
  ];

  const handleExportBatch = (batch) => {
    exportBatchData(batch.data, 'json');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Batches</h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{batches.length} batches</span>
      </div>
      
      <div className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 smooth-transition">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                batch.status === 'completed' ? 'bg-green-500' : 
                batch.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">{batch.niche} Batch</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{batch.date} • {batch.count} images</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(batch.status)} px-2 py-1 rounded-full`}>
                  {batch.results}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{batch.status}</div>
              </div>
              
              {batch.status === 'completed' && (
                <button
                  onClick={() => handleExportBatch(batch)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg smooth-transition"
                  title="Export batch data"
                >
                  📥
                </button>
              )}
            </div>
          </div>
        ))}
        
        {batches.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📝</div>
            <p className="text-gray-500 dark:text-gray-400">No batches yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Create your first batch to see history here</p>
          </div>
        )}
      </div>
    </div>
  );
}