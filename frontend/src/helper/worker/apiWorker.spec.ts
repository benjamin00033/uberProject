import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { handleApiMessage } from './apiWorker';

// Mock axios
vi.mock('axios');

describe('apiWorker', () => {
  it('should return error if url or action is missing', async () => {
    const postMessage = vi.fn();
    const event = { data: { url: '', action: '' } } as MessageEvent;
    
    await handleApiMessage(event, postMessage);
    
    expect(postMessage).toHaveBeenCalledWith({ error: 'Missing url or action' });
  });

  it('should call axios and return data on success', async () => {
    const postMessage = vi.fn();
    const event = { data: { url: '/api/test', action: 'GET', payload: { id: 1 } } } as MessageEvent;
    
    const mockedAxios = vi.mocked(axios);
    mockedAxios.mockResolvedValueOnce({ data: { success: true }, status: 200 });

    await handleApiMessage(event, postMessage);
    
    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/test',
      data: { id: 1 }
    });
    expect(postMessage).toHaveBeenCalledWith({ data: { success: true }, status: 200 });
  });

  it('should return error message on failure', async () => {
    const postMessage = vi.fn();
    const event = { data: { url: '/api/test', action: 'POST' } } as MessageEvent;
    
    const mockedAxios = vi.mocked(axios);
    mockedAxios.mockRejectedValueOnce(new Error('Network Error'));

    await handleApiMessage(event, postMessage);
    
    expect(postMessage).toHaveBeenCalledWith({ error: 'Network Error' });
  });
});
