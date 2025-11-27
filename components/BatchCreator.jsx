import { useState } from 'react';

export function BatchCreator({ onBatchStart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    niche: 'technology',
    count: 5,
    style: 'photorealistic',
    autoUpscale: true,
    commercialFocus: true
  });

  const niches = [
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'lifestyle', label: 'Lifestyle', emoji: '🌅' },
    { value: 'business', label: 'Business', emoji: '💼' },
    { value: 'nature', label: 'Nature', emoji: '🌿' },
    { value: 'health', label: 'Health', emoji: '🏥' },
    { value: 'education', label: 'Education', emoji: '🎓' }
  ];

  const styles = [
    { value: 'photorealistic', label: 'Photorealistic' },
    { value: '3d-render', label: '3D Render' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'painting', label: 'Painting' }
  ];

  const Toggle = ({ label, description, checked, onChange }) => {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 smooth-transition">
        <div className="flex-1">
          <div className="font-medium text-gray-900">{label}</div>
          <div className="text-sm text-gray-500 mt-1">{description}</div>
        </div>
        <button
          type="button"
          className={`${
            checked ? 'bg-blue-500' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          onClick={() => onChange(!checked)}
        >
          <span
            className={`${
              checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
    );
  };

  const handleCreateBatch = async () => {
    setIsLoading(true);
    
    // Start progress tracking
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
      
      updateProgress(90, 'Finalizing batch...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProgress(100, 'Batch completed successfully!');
      
      if (result.status === 'success') {
        alert(`🎉 ${result.message}\n📝 ${result.prompts_generated || 'Multiple'} prompts generated!\n🎯 Niche: ${result.niche || settings.niche}`);
        
        // Complete progress
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

  return (
    <div className="glass-card rounded-2xl p-8 smooth-transition">
      <div className="flex items-center mb-6">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        <h2 className="text-2xl font-semibold text-gray-900">Create Content Batch</h2>
      </div>
      
      <div className="space-y-6">
        {/* Niche Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🎯 Content Niche
          </label>
          <select 
            value={settings.niche}
            onChange={(e) => setSettings({...settings, niche: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent smooth-transition"
          >
            {niches.map((niche) => (
              <option key={niche.value} value={niche.value}>
                {niche.emoji} {niche.label}
              </option>
            ))}
          </select>
        </div>

        {/* Image Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🖼️ Image Count: <span className="text-blue-600 font-semibold">{settings.count}</span>
          </label>
          <div className="flex items-center space-x-4">
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={settings.count}
              onChange={(e) => setSettings({...settings, count: parseInt(e.target.value)})}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-sm text-gray-500 min-w-12 text-right">
              {settings.count} images
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🎨 Art Style
          </label>
          <select 
            value={settings.style}
            onChange={(e) => setSettings({...settings, style: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent smooth-transition"
          >
            {styles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <Toggle 
            label="🚀 Auto Upscale via AI"
            description="Enhance image quality automatically"
            checked={settings.autoUpscale}
            onChange={(checked) => setSettings({...settings, autoUpscale: checked})}
          />
          <Toggle 
            label="💰 Commercial Focus"
            description="Optimize for stock market appeal"
            checked={settings.commercialFocus}
            onChange={(checked) => setSettings({...settings, commercialFocus: checked})}
          />
        </div>

        {/* Create Button */}
        <button 
          onClick={handleCreateBatch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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