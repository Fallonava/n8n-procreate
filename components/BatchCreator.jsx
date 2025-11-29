import { useState, useEffect } from 'react';
import { exportBatchData } from '../lib/export-utils';
import { TemplateManager } from './TemplateManager';
import { useTemplates } from '../contexts/TemplatesContext';
import { Toggle } from './Toggle';
import { N8NClient } from '../lib/n8n-client';

export function BatchCreator({ onBatchStart, onImageGenerated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBatchData, setLastBatchData] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { saveTemplate } = useTemplates();
  const n8nClient = new N8NClient();

  const [settings, setSettings] = useState({
    niche: 'technology',
    count: 5,
    style: 'photorealistic',
    aspectRatio: '16:9',
    sampler: 'DPM++ 2M Karras',
    steps: 30,
    cfg: 7,
    autoUpscale: true,
    commercialFocus: true
  });

  const [previewPrompt, setPreviewPrompt] = useState('');

  const niches = ['technology', 'nature', 'business', 'lifestyle', 'abstract', 'food', 'travel', 'health', 'education'];
  const styles = ['photorealistic', 'cinematic', 'minimalist', 'vintage', 'cyberpunk', '3d-render', 'watercolor', 'oil painting'];
  const ratios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  const samplers = ['DPM++ 2M Karras', 'Euler a', 'DDIM', 'UniPC'];

  useEffect(() => {
    const prompt = `Create a professional stock photo for ${settings.niche} niche, style: ${settings.style}. ${settings.commercialFocus ? 'Commercial focus, high quality, 8k, highly detailed.' : ''} --ar ${settings.aspectRatio} --v 6.0`;
    setPreviewPrompt(prompt);
  }, [settings]);

  const handleCreateBatch = async () => {
    setIsLoading(true);
    const total = settings.count;
    const results = [];
    const errors = [];
    const batchId = Date.now().toString();

    if (onBatchStart) {
      onBatchStart({
        id: batchId,
        progress: 0,
        currentStep: `Initializing batch of ${total} images...`,
        status: 'processing'
      });
    }

    try {
      for (let i = 0; i < total; i++) {
        const progress = Math.round(((i) / total) * 100);
        if (onBatchStart) {
          onBatchStart({
            id: batchId,
            progress,
            currentStep: `Generating image ${i + 1} of ${total} (${settings.niche})...`,
            status: 'processing'
          });
        }

        try {
          // Construct a prompt based on settings
          const prompt = `Create a professional stock photo for ${settings.niche} niche, style: ${settings.style}. ${settings.commercialFocus ? 'Commercial focus, high quality.' : ''}`;

          // Call n8n workflow
          const result = await n8nClient.triggerWorkflow('trend-research', {
            prompt,
            niche: settings.niche,
            style: settings.style,
            aspectRatio: settings.aspectRatio,
            sampler: settings.sampler,
            steps: settings.steps,
            cfg: settings.cfg,
            batchIndex: i,
            totalBatch: total,
            timestamp: new Date().toISOString()
          });

          // Normalize result for UI
          const imageResult = {
            ...result,
            url: result.outputUrl || result.url || result.image, // Adapt to n8n output
            prompt: prompt,
            niche: settings.niche,
            style: settings.style,
            ratio: settings.aspectRatio,
            steps: settings.steps,
            cfg: settings.cfg,
            sampler: settings.sampler,
            timestamp: new Date().toISOString()
          };

          results.push(imageResult);

          if (onImageGenerated) {
            onImageGenerated(imageResult);
          }

        } catch (err) {
          console.error(`Failed to generate image ${i + 1}:`, err);
          errors.push({ index: i, error: err.message });
        }
      }

      // Simpan data batch untuk export
      const batchData = {
        id: batchId,
        results,
        errors,
        settings: settings,
        exportedAt: new Date().toISOString()
      };
      setLastBatchData(batchData);

      // Save to History (LocalStorage)
      try {
        const history = JSON.parse(localStorage.getItem('batch_history') || '[]');
        history.unshift({
          id: batchId,
          date: new Date().toISOString(),
          settings: settings,
          successCount: results.length,
          errorCount: errors.length,
          thumbnail: results[0]?.url
        });
        localStorage.setItem('batch_history', JSON.stringify(history.slice(0, 50))); // Keep last 50
      } catch (e) {
        console.error("Failed to save history", e);
      }

      if (onBatchStart) {
        onBatchStart({
          id: batchId,
          progress: 100,
          currentStep: `Batch completed! ${results.length} success, ${errors.length} failed.`,
          status: 'completed'
        });
      }

      if (results.length === 0) {
        throw new Error('All batch items failed.');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Batch creation failed: ' + error.message);

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
      alert('No batch data available for export. Please create a batch first.');
      return;
    }

    exportBatchData(lastBatchData, format);
    alert(`Batch data exported as ${format.toUpperCase()}!`);
  };

  const handleTemplateSelect = (templateSettings) => {
    setSettings(templateSettings);
    setShowTemplates(false);
    alert('Template loaded! Settings updated.');
  };

  return (
    <div className="glass-card rounded-2xl p-8 smooth-transition">
      {/* Template Toggle Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create Content Batch</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg smooth-transition"
          >
            {showTemplates ? '← Back' : 'Templates'}
          </button>

          {lastBatchData && (
            <>
              <button
                onClick={() => handleExport('json')}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium smooth-transition"
                title="Export as JSON"
              >
                JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium smooth-transition"
                title="Export as CSV"
              >
                CSV
              </button>
            </>
          )}
        </div>
      </div>

      {showTemplates ? (
        <TemplateManager
          onTemplateSelect={handleTemplateSelect}
          currentSettings={settings}
        />
      ) : (
        <>
          {/* Batch Creation Form */}
          <div className="space-y-6">

            {/* Main Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niche</label>
                <select
                  value={settings.niche}
                  onChange={(e) => setSettings({ ...settings, niche: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  {niches.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style</label>
                <select
                  value={settings.style}
                  onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  {styles.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>

            {/* Aspect Ratio & Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-2">
                  {ratios.map(r => (
                    <button
                      key={r}
                      onClick={() => setSettings({ ...settings, aspectRatio: r })}
                      className={`p-2 text-xs font-medium rounded-lg border transition-all ${settings.aspectRatio === r ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Batch Count ({settings.count})</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={settings.count}
                  onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center hover:underline"
              >
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                <svg className={`w-4 h-4 ml-1 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>

            {/* Advanced Options Panel */}
            {showAdvanced && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Sampler</label>
                    <select
                      value={settings.sampler}
                      onChange={(e) => setSettings({ ...settings, sampler: e.target.value })}
                      className="w-full p-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      {samplers.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Steps ({settings.steps})</label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="1"
                      value={settings.steps}
                      onChange={(e) => setSettings({ ...settings, steps: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">CFG Scale ({settings.cfg})</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={settings.cfg}
                      onChange={(e) => setSettings({ ...settings, cfg: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Preview */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Prompt Preview</label>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-words">
                {previewPrompt}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Commercial Focus</span>
              <Toggle
                enabled={settings.commercialFocus}
                onChange={(val) => setSettings({ ...settings, commercialFocus: val })}
              />
            </div>

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
                'Generate Content Batch'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}