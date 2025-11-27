import { createContext, useContext, useEffect, useState } from 'react';

const TemplatesContext = createContext();

export function TemplatesProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Load templates dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('batch-templates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  // Save templates ke localStorage
  useEffect(() => {
    localStorage.setItem('batch-templates', JSON.stringify(templates));
  }, [templates]);

  const saveTemplate = (templateData) => {
    const newTemplate = {
      id: Date.now().toString(),
      name: templateData.name || `Template-${templates.length + 1}`,
      ...templateData,
      createdAt: new Date().toISOString(),
      usedCount: 0
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (id, updates) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, ...updates, usedCount: template.usedCount + 1 }
          : template
      )
    );
  };

  const deleteTemplate = (id) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const loadTemplate = (template) => {
    setSelectedTemplate(template);
    return template.settings;
  };

  const getPopularTemplates = () => {
    return [...templates]
      .sort((a, b) => b.usedCount - a.usedCount)
      .slice(0, 5);
  };

  return (
    <TemplatesContext.Provider value={{
      templates,
      selectedTemplate,
      saveTemplate,
      updateTemplate,
      deleteTemplate,
      loadTemplate,
      getPopularTemplates
    }}>
      {children}
    </TemplatesContext.Provider>
  );
}

export const useTemplates = () => useContext(TemplatesContext);