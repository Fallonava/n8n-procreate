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
    const { workflowId, data, test } = req.body;

    console.log('📨 Received request:', { workflowId, test, dataKeys: Object.keys(data || {}) });

    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }

    const baseURL = process.env.N8N_BASE_URL || 'https://n8n.fallonava.my.id';
    const apiKey = process.env.N8N_API_KEY;

    // Determine webhook path based on test mode
    const webhookPath = test ? 'webhook-test' : 'webhook';
    const webhookUrl = `${baseURL}/${webhookPath}/${workflowId}`;

    console.log(`🔄 Proxying to n8n (${test ? 'TEST' : 'PROD'}):`, webhookUrl);
    console.log('🔑 API Key present:', !!apiKey);
    console.log('📦 Payload:', JSON.stringify(data, null, 2));

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
    console.log('📥 n8n response status:', response.status);
    console.log('📥 n8n response body:', responseText);

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

    console.log('✅ Success! Returning result to frontend');
    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
}