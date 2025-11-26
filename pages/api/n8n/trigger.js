import { N8NClient } from '../../../lib/n8n-client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflowId, data } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }

    const n8n = new N8NClient();
    const result = await n8n.triggerWorkflow(workflowId, data);

    res.status(200).json({
      success: true,
      executionId: result.executionId,
      message: 'Workflow triggered successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}