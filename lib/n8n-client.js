export class N8NClient {
  constructor() {
    // No config needed for client-side, handled by API route
  }

  async triggerWorkflow(workflowId, data = {}) {
    try {
      // Call internal Next.js API route which acts as a proxy
      const response = await fetch('/api/n8n/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          data
        })
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status} - ${responseText}`);
      }

      if (!responseText) {
        throw new Error('Empty response from proxy');
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.warn('Response was not JSON:', responseText);
        return { message: responseText };
      }
    } catch (error) {
      console.error('Failed to trigger workflow via proxy:', error);
      throw error;
    }
  }
}