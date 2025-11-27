import { useState } from 'react';
import { useTemplates } from '../contexts/TemplatesContext';

export function TemplateManager({ onTemplateSelect, currentSettings }) {
  const { templates, saveTemplate, deleteTemplate, loadTemplate, getPopularTemplates } = useTemplates();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const popularTemplates = getPopularTemplates();

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    saveTemplate({
      name: templateName,
      settings: currentSettings,
      niche: currentSettings.niche,
      style: currentSettings.style
    });

    setTemplateName('');
    setShowSaveDialog(false);
    alert('✅ Template saved successfully!');
  };

  const handleLoadTemplate = (template) => {
    const settings = loadTemplate(template);
    onTemplateSelect(settings);
  };

  const defaultTemplates = [
    {
      id: 'default-tech',
      name: '🚀 Tech Products',
      settings: {
        niche: 'technology',
        count: 8,
        style: 'photorealistic',
        autoUpscale: true,
        commercialFocus: true
      },
      isDefault: true
    },
    {
      id: 'default-lifestyle',
      name: '🌅 Lifestyle',
      settings: {
        niche: 'lifestyle', 
        count: 6,
        style: 'photorealistic',
        autoUpscale: true,
        commercialFocus: true
      },
      isDefault: true
    },
    {
      id: 'default-business',
      name: '💼 Business',
      settings: {
        niche: 'business',
        count: 10,
        style: '3d-render',
        autoUpscale: false,
        commercialFocus: true
      },
      isDefault: true
    }
  ];

  const allTemplates = [...defaultTemplates, ...templates];

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Batch Templates</h3>
        </div>
        
        <button
          onClick={() => setShowSaveDialog(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg smooth-transition"
        >
          💾 Save Current
        </button>
      </div>

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">Save Current Settings as Template</h4>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSaveTemplate}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium smooth-transition"
              >
                Save Template
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium smooth-transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🔥 Most Used</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularTemplates.slice(0, 3).map((template) => (
              <button
                key={template.id}
                onClick={() => handleLoadTemplate(template)}
                className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-left hover:shadow-lg smooth-transition"
              >
                <div className="font-medium text-sm mb-1">{template.name}</div>
                <div className="text-xs opacity-80">
                  {template.niche} • {template.settings.count} images
                </div>
                <div className="text-xs mt-1">Used {template.usedCount} times</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTemplates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 smooth-transition group"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {template.name}
                </div>
                {template.isDefault && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {template.settings.niche} • {template.settings.count} images • {template.settings.style}
              </div>
              {template.usedCount > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Used {template.usedCount} times
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 smooth-transition">
              <button
                onClick={() => handleLoadTemplate(template)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg smooth-transition"
                title="Load template"
              >
                📁
              </button>
              {!template.isDefault && (
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg smooth-transition"
                  title="Delete template"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {allTemplates.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📂</div>
          <p className="text-gray-500 dark:text-gray-400">No templates yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Save your current settings to create templates
          </p>
        </div>
      )}
    </div>
  );
}