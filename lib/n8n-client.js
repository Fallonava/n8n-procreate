export class N8NClient {
  constructor() {
    this.baseURL = process.env.N8N_BASE_URL || 'https://n8n.fallonava.my.id';
    this.apiKey = process.env.N8N_API_KEY;
  }

  async triggerWorkflow(workflowId, data = {}) {
    try {
      const webhookUrl = `${this.baseURL}/webhook/${workflowId}`;
      console.log('🔄 Calling n8n webhook:', webhookUrl);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey || 'no-api-key'
        },
        body: JSON.stringify({
          source: 'frontend-dashboard',
          timestamp: new Date().toISOString(),
          ...data
        })
      });

      const responseText = await response.text();
      console.log('📥 Raw n8n response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${responseText}`);
      }

      if (!responseText) {
        throw new Error('Empty response from n8n workflow');
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      throw error;
    }
  }
}