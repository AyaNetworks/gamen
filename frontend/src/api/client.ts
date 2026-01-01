export class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(message) {
    const response = await fetch(`${this.baseUrl}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    return response.json();
  }

  connectToStream(onMessage) {
    const eventSource = new EventSource(`${this.baseUrl}/chat/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error('Failed to parse SSE message', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
      // Reconnect logic could be added here
    };

    return () => {
      eventSource.close();
    };
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL || 'http://localhost:8000/api');
