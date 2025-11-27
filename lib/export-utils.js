export function exportToCSV(data, filename = 'export.csv') {
  const headers = Object.keys(data[0] || {}).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => 
      `"${String(value).replace(/"/g, '""')}"`
    ).join(',')
  ).join('\n');
  
  const csv = `${headers}\n${rows}`;
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(data, filename = 'export.json') {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

export function exportBatchData(batchData, format = 'json') {
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      source: 'Stock Automation Studio'
    },
    batch: batchData
  };

  const filename = `batch-export-${Date.now()}.${format}`;
  
  if (format === 'csv') {
    // Flatten untuk CSV
    const flatData = batchData.prompts ? batchData.prompts.map(prompt => ({
      prompt: prompt.prompt,
      niche: prompt.niche,
      style: prompt.style,
      batchId: prompt.batchId,
      imageNumber: prompt.imageNumber,
      timestamp: prompt.timestamp
    })) : [batchData];
    
    exportToCSV(flatData, filename);
  } else {
    exportToJSON(exportData, filename);
  }
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}