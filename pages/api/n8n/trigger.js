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

    const baseURL = process.env.N8N_BASE_URL || 'https://n8n.fallonava.my.id';
    const apiKey = process.env.N8N_API_KEY;
    const webhookUrl = `${baseURL}/webhook/${workflowId}`;

    console.log('🔄 Proxying to n8n:', webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey || ''
      },
      body: JSON.stringify({
        source: 'frontend-proxy',
        timestamp: new Date().toISOString(),
        ...data
      })
    });

    const responseText = await response.text();
    console.log('📥 Raw n8n response (proxy):', responseText);

    if (!response.ok) {
      throw new Error(`n8n error: ${response.status} - ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, return as text wrapped in object
      result = { message: responseText };
    }

    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
}