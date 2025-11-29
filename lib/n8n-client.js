export class N8NClient {
  constructor(config = {}) {
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000; // 30s default
  }

  async triggerWorkflow(workflowId, data = {}) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await this._makeRequest(workflowId, data);
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed: ${error.message}`);

        if (attempt < this.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Workflow trigger failed after ${this.maxRetries + 1} attempts. Last error: ${lastError.message}`);
  }

  async _makeRequest(workflowId, data) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch('/api/n8n/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          data
        }),
        signal: controller.signal
      });

      clearTimeout(id);

      const responseText = await response.text();

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 504) throw new Error('Gateway Timeout');
        if (response.status === 502) throw new Error('Bad Gateway');
        if (response.status === 429) throw new Error('Rate Limit Exceeded');
        throw new Error(`Proxy error: ${response.status} - ${responseText}`);
      }

      if (!responseText) {
        throw new Error('Empty response from proxy');
      }

      try {
        const json = JSON.parse(responseText);
        // Check for application-level errors in JSON
        if (json.success === false || json.error) {
          throw new Error(json.error || json.message || 'Unknown application error');
        }
        return json;
      } catch (e) {
        if (e.message.includes('application error')) throw e;
        console.warn('Response was not JSON:', responseText);
        return { message: responseText };
      }
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.timeout}ms`);
      }
      throw error;
    }
  }
}