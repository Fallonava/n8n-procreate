export function BatchHistory() {
  const batches = [
    {
      id: 1,
      date: '2024-01-15 14:30',
      niche: 'technology',
      count: 8,
      status: 'completed',
      results: '8/8 successful'
    },
    {
      id: 2, 
      date: '2024-01-15 10:15',
      niche: 'lifestyle',
      count: 5,
      status: 'processing',
      results: '3/5 completed'
    },
    {
      id: 3,
      date: '2024-01-14 16:45',
      niche: 'business',
      count: 12,
      status: 'completed',
      results: '12/12 successful'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
        <h3 className="text-xl font-semibold text-gray-900">Recent Batches</h3>
      </div>
      
      <div className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 smooth-transition">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                batch.status === 'completed' ? 'bg-green-500' : 
                batch.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <div>
                <div className="font-medium text-gray-900 capitalize">{batch.niche} Batch</div>
                <div className="text-sm text-gray-500">{batch.date} • {batch.count} images</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor(batch.status)} px-2 py-1 rounded-full`}>
                {batch.results}
              </div>
              <div className="text-xs text-gray-500 capitalize mt-1">{batch.status}</div>
            </div>
          </div>
        ))}
        
        {batches.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <p className="text-gray-500">No batches yet</p>
            <p className="text-sm text-gray-400">Create your first batch to see history here</p>
          </div>
        )}
      </div>
    </div>
  );
}