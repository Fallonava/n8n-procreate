export function ProgressTracker({ progress, currentStep, status = 'processing' }) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-400 to-green-500';
      case 'error': return 'bg-gradient-to-r from-red-400 to-red-500';
      case 'processing': return 'bg-gradient-to-r from-blue-400 to-purple-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Active Batch Progress</h3>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current Step:</span>
          <span className="font-medium text-gray-900">{currentStep}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className="font-medium">{progress}%</span>
          <span>100%</span>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {['Planning', 'Generating', 'Processing', 'Upscaling', 'Complete'].map((step, index) => (
            <div key={step} className="text-center">
              <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                progress >= (index + 1) * 20 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className="text-xs text-gray-500">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}