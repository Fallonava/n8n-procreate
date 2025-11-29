import { useState, useEffect } from 'react';
import { Toggle } from './Toggle';
import { N8NClient } from '../lib/n8n-client';
import { PROMPT_TEMPLATES, constructPrompt } from '../lib/prompt-templates';

export function BatchCreator({ onBatchStart, onImageGenerated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const n8nClient = new N8NClient();

  const [settings, setSettings] = useState({
    niche: 'technology',
    subject: '',
    count: 4,
    style: 'photorealistic',
    aspectRatio: '16:9',
    sampler: 'DPM++ 2M Karras',
    steps: 30,
    cfg: 7,
    commercialFocus: true
  });

  const [previewPrompt, setPreviewPrompt] = useState('');

  const niches = Object.keys(PROMPT_TEMPLATES);
  const styles = ['photorealistic', 'cinematic', 'minimalist', 'vintage', 'cyberpunk', '3d-render', 'watercolor', 'oil painting'];
  const ratios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  const samplers = ['DPM++ 2M Karras', 'Euler a', 'DDIM', 'UniPC'];

  useEffect(() => {
    const basePrompt = constructPrompt(settings.niche, settings.subject);
    const techSpecs = ` --ar ${settings.aspectRatio} --v 6.0`;
    setPreviewPrompt(basePrompt + techSpecs);
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
        currentStep: `Initializing batch...`,
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
            currentStep: `Generating ${i + 1}/${total}...`,
            status: 'processing'
          });
        }

        try {
          const prompt = `Create a professional stock photo for ${settings.niche} niche, style: ${settings.style}. ${settings.commercialFocus ? 'Commercial focus.' : ''}`;

          const result = await n8nClient.triggerWorkflow('generate-stock', {
            prompt: settings.subject || '',
            category: settings.niche,
            width: settings.aspectRatio === '16:9' ? 1280 : settings.aspectRatio === '1:1' ? 1024 : 720,
            height: settings.aspectRatio === '16:9' ? 720 : settings.aspectRatio === '1:1' ? 1024 : 1280,
            batch_size: 1,
            enhance_prompt: true,
            style: settings.style,
            sampler: settings.sampler,
            steps: settings.steps,
            cfg: settings.cfg,
            timestamp: new Date().toISOString()
          });

          const imageResult = {
            ...result,
            url: result.images?.[0]?.url || result.outputUrl,
            prompt: result.images?.[0]?.prompt || previewPrompt,
            niche: settings.niche,
            style: settings.style,
            ratio: settings.aspectRatio,
            timestamp: new Date().toISOString()
          };

          results.push(imageResult);
          if (onImageGenerated) onImageGenerated(imageResult);

        } catch (err) {
          console.error(`Failed to generate image ${i + 1}:`, err);
          errors.push({ index: i, error: err.message });
        }
      }

      // Save History
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
        localStorage.setItem('batch_history', JSON.stringify(history.slice(0, 50)));
      } catch (e) { console.error(e); }

      if (onBatchStart) {
        onBatchStart({
          id: batchId,
          progress: 100,
          currentStep: `Complete`,
          status: 'completed'
        });
      }

    } catch (error) {
      alert('Batch failed: ' + error.message);
      if (onBatchStart) onBatchStart({ progress: 0, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">New Batch</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configure your generation parameters</p>
      </div>

      <div className="space-y-5">

        {/* Niche & Style */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Category</label>
            <select
              value={settings.niche}
              onChange={(e) => setSettings({ ...settings, niche: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none capitalize text-sm"
            >
              {niches.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Style</label>
            <select
              value={settings.style}
              onChange={(e) => setSettings({ ...settings, style: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none capitalize text-sm"
            >
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Subject</label>
          <input
            type="text"
            value={settings.subject}
            onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
            placeholder={`e.g., ${PROMPT_TEMPLATES[settings.niche]?.defaults.SUBJECT || 'mountain landscape'}`}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Aspect Ratio</label>
          <div className="flex gap-2">
            {ratios.map(r => (
              <button
                key={r}
                onClick={() => setSettings({ ...settings, aspectRatio: r })}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${settings.aspectRatio === r ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Count Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-medium text-gray-500 uppercase">Batch Size</label>
            <span className="text-xs font-bold text-blue-600">{settings.count} images</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.count}
            onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
          />
        </div>

        {/* Advanced Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-gray-500 font-medium flex items-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <svg className={`w-3 h-3 mr-1 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            Advanced Settings
          </button>
        </div>

        {/* Advanced Panel */}
        {showAdvanced && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-1 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sampler</label>
                <select
                  value={settings.sampler}
                  onChange={(e) => setSettings({ ...settings, sampler: e.target.value })}
                  className="w-full p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                >
                  {samplers.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Steps ({settings.steps})</label>
                <input
                  type="range" min="10" max="50"
                  value={settings.steps}
                  onChange={(e) => setSettings({ ...settings, steps: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg accent-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Commercial License</span>
              <Toggle
                enabled={settings.commercialFocus}
                onChange={(val) => setSettings({ ...settings, commercialFocus: val })}
                size="sm"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleCreateBatch}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          {isLoading ? 'Processing...' : 'Generate Batch'}
        </button>

        {/* Preview Text */}
        <div className="text-[10px] text-gray-400 font-mono leading-tight break-words opacity-70">
          {previewPrompt}
        </div>
      </div>
    </div>
  );
}