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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      throw error;
    }
  }
}