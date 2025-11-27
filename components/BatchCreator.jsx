import { useState } from 'react';
import { exportBatchData } from '../lib/export-utils';
import { TemplateManager } from './TemplateManager';
import { useTemplates } from '../contexts/TemplatesContext';
import { Toggle } from './Toggle';
import { N8NClient } from '../lib/n8n-client';

export function BatchCreator({ onBatchStart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBatchData, setLastBatchData] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const { saveTemplate } = useTemplates();
  const n8nClient = new N8NClient();

  const [settings, setSettings] = useState({
    niche: 'technology',
    count: 5,
    style: 'photorealistic',
    autoUpscale: true,
    commercialFocus: true
  });

  const niches = ['technology', 'nature', 'business', 'lifestyle', 'abstract', 'food', 'travel'];
  const styles = ['photorealistic', 'cinematic', 'minimalist', 'vintage', 'cyberpunk', '3d-render'];

  const handleCreateBatch = async () => {
    setIsLoading(true);
    const total = settings.count;
    const results = [];
    const errors = [];

    if (onBatchStart) {
      onBatchStart({
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
            progress,
            currentStep: `Generating image ${i + 1} of ${total} (${settings.niche})...`,
            status: 'processing'
          });
        }

        try {
          // Construct a prompt based on settings
          const prompt = `Create a professional stock photo for ${settings.niche} niche, style: ${settings.style}. ${settings.commercialFocus ? 'Commercial focus, high quality.' : ''}`;

          // Call n8n workflow (using trend-research as default for batch creation)
          const result = await n8nClient.triggerWorkflow('trend-research', {
            prompt,
            niche: settings.niche,
            style: settings.style,
            batchIndex: i,
            totalBatch: total
          });

          results.push(result);
        } catch (err) {
          console.error(`Failed to generate image ${i + 1}:`, err);
          errors.push({ index: i, error: err.message });
        }
      }

      // Simpan data batch untuk export
      const batchData = {
        results,
        errors,
        settings: settings,
        exportedAt: new Date().toISOString()
      };
      setLastBatchData(batchData);

      if (onBatchStart) {
        onBatchStart({
          progress: 100,
          currentStep: `Batch completed! ${results.length} success, ${errors.length} failed.`,
          status: 'completed'
        });
      }

      if (results.length > 0) {
        alert(`Success: ${results.length} images generated!\nCheck Google Drive for files.\n${errors.length > 0 ? `${errors.length} failed.` : ''}`);
      } else {
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Batch Count ({settings.count})</label>
              <input
                type="range"
                min="1"
                max="20"
                value={settings.count}
                onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Commercial Focus</span>
              <Toggle
                enabled={settings.commercialFocus}
                onChange={(val) => setSettings({ ...settings, commercialFocus: val })}
              />
            </div>

            {/* Export Section */}
            {lastBatchData && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Export Options</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExport('json')}
                    className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg smooth-transition text-center"
                  >
                    <div className="text-lg mb-1"></div>
                    <div>JSON Export</div>
                    <div className="text-xs opacity-80">Structured data</div>
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg smooth-transition text-center"
                  >
                    <div className="text-lg mb-1"></div>
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
                'Generate Content Batch'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}