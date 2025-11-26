import { useState } from 'react';

export function BatchCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    niche: 'technology',
    count: 5,
    style: 'photorealistic',
    autoUpscale: true
  });

  const handleCreateBatch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/n8n/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId: 'midjourney-batch',
          data: settings
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Batch created! Execution ID: ${result.executionId}`);
      } else {
        alert('Failed to create batch: ' + result.error);
      }
    } catch (error) {
      alert('Failed to create batch: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Batch</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niche
          </label>
          <select 
            value={settings.niche}
            onChange={(e) => setSettings({...settings, niche: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="business">Business</option>
            <option value="nature">Nature</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Count ({settings.count})
          </label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={settings.count}
            onChange={(e) => setSettings({...settings, count: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>

        <button 
          onClick={handleCreateBatch}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating Batch...' : 'Generate Batch via n8n'}
        </button>
      </div>
    </div>
  );
}