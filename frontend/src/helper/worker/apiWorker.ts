import axios, { Method } from 'axios';

/**
 * Handles incoming messages for the API Worker.
 * Extracted for easy unit testing.
 *
 * @param event - The message event.
 * @param postMessage - Callback to send a message back.
 */
interface ApiMessageData {
  url: string;
  payload?: any;
  action: string;
}

export const handleApiMessage = async (event: MessageEvent, postMessage: (msg: any) => void) => {
  const { url, payload, action } = event.data as ApiMessageData;
  
  if (!url || !action) {
    postMessage({ error: 'Missing url or action' });
    return;
  }

  try {
    const response = await axios({
      method: action as Method,
      url,
      data: payload,
    });
    
    postMessage({ data: response.data, status: response.status });
  } catch (error: any) {
    postMessage({ error: error.message || 'API Request failed' });
  }
};

// Bind to Web Worker self only if running inside a worker environment
if (typeof self !== 'undefined' && 'onmessage' in self) {
  (self as any).onmessage = (event: MessageEvent) => {
    handleApiMessage(event, (self as any).postMessage.bind(self));
  };
}
