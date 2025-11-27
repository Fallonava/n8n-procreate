import { useState } from 'react';
import { exportBatchData } from '../lib/export-utils';

export function BatchCreator({ onBatchStart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBatchData, setLastBatchData] = useState(null);
  const [settings, setSettings] = useState({
    niche: 'technology',
    count: 5,
    style: 'photorealistic',
    autoUpscale: true,
    commercialFocus: true
  });

  // ... (niches, styles, Toggle component tetap sama)

  const handleCreateBatch = async () => {
    setIsLoading(true);
    
    if (onBatchStart) {
      onBatchStart({
        progress: 0,
        currentStep: 'Initializing batch creation...',
        status: 'processing'
      });
    }

    const updateProgress = (progress, step) => {
      if (onBatchStart) {
        onBatchStart({
          progress,
          currentStep: step,
          status: 'processing'
        });
      }
    };

    try {
      updateProgress(20, 'Generating AI prompts...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProgress(40, 'Connecting to n8n workflow...');
      
      const response = await fetch('https://n8n.fallonava.my.id/webhook/midjourney-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
      
      updateProgress(70, 'Processing with MidJourney...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Simpan data batch untuk export
      const batchData = {
        ...result,
        settings: settings,
        exportedAt: new Date().toISOString()
      };
      setLastBatchData(batchData);
      
      updateProgress(90, 'Finalizing batch...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProgress(100, 'Batch completed successfully!');
      
      if (result.status === 'success') {
        alert(`🎉 ${result.message}\n📝 ${result.prompts_generated || 'Multiple'} prompts generated!\n🎯 Niche: ${result.niche || settings.niche}\n💾 Data ready for export!`);
        
        if (onBatchStart) {
          setTimeout(() => {
            onBatchStart({
              progress: 100,
              currentStep: 'Batch ready for processing!',
              status: 'completed'
            });
          }, 2000);
        }
      } else {
        throw new Error(result.message || 'Workflow execution failed');
      }
      
    } catch (error) {
      console.error('💥 Error:', error);
      alert('💥 Failed to create batch: ' + error.message);
      
      if (onBatchStart) {
        onBatchStart({
          progress: 0,
          currentStep: 'Batch creation failed',
          status: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format) => {
    if (!lastBatchData) {
      alert('❌ No batch data available for export. Please create a batch first.');
      return;
    }
    
    exportBatchData(lastBatchData, format);
    
    // Notification
    alert(`✅ Batch data exported as ${format.toUpperCase()}!`);
  };

  return (
    <div className="glass-card rounded-2xl p-8 smooth-transition">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create Content Batch</h2>
        </div>
        
        {/* Export Buttons */}
        {lastBatchData && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium smooth-transition"
              title="Export as JSON"
            >
              📥 JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium smooth-transition"
              title="Export as CSV"
            >
              📥 CSV
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* ... (rest of the form remains exactly the same) */}

        {/* Export Section */}
        {lastBatchData && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">📦 Export Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleExport('json')}
                className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg smooth-transition text-center"
              >
                <div className="text-lg mb-1">📄</div>
                <div>JSON Export</div>
                <div className="text-xs opacity-80">Structured data</div>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg smooth-transition text-center"
              >
                <div className="text-lg mb-1">📊</div>
                <div>CSV Export</div>
                <div className="text-xs opacity-80">Spreadsheet format</div>
              </button>
            </div>
          </div>
        )}

        {/* Create Button */}
        <button 
          onClick={handleCreateBatch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition shadow-lg hover:shadow-xl transform hover:scale-[1.02] dark:from-blue-600 dark:to-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Batch...
            </div>
          ) : (
            '🚀 Generate Content Batch'
          )}
        </button>
      </div>
    </div>
  );
}