import { N8NClient } from '../../../lib/n8n-client';

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflowId, data } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }

    console.log('🔄 Triggering n8n workflow:', workflowId);
    
    const n8n = new N8NClient();
    const result = await n8n.triggerWorkflow(workflowId, data);

    console.log('✅ n8n response:', result);
    
    res.status(200).json({
      success: true,
      executionId: result.executionId || 'manual-execution',
      message: 'Workflow triggered successfully',
      n8nResponse: result
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}