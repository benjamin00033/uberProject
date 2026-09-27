import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleTimerMessage } from './timerWorker';

describe('timerWorker', () => {
  let env: any;
  let postMessage: any;

  beforeEach(() => {
    vi.useFakeTimers();
    env = {
      setInterval: vi.fn((cb) => setInterval(cb, 60000)),
      clearInterval: vi.fn((id) => clearInterval(id)),
    };
    postMessage = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should post initial time and set interval on start', () => {
    const event = { data: { command: 'start' } } as MessageEvent;
    
    handleTimerMessage(event, postMessage, env);
    
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage.mock.calls[0][0]).toHaveProperty('time');
    expect(env.setInterval).toHaveBeenCalledTimes(1);
  });

  it('should clear interval on stop', () => {
    const startEvent = { data: { command: 'start' } } as MessageEvent;
    handleTimerMessage(startEvent, postMessage, env);
    
    const stopEvent = { data: { command: 'stop' } } as MessageEvent;
    handleTimerMessage(stopEvent, postMessage, env);
    
    expect(env.clearInterval).toHaveBeenCalledTimes(1);
  });
  
  it('should not start multiple intervals on multiple start commands', () => {
    const event = { data: { command: 'start' } } as MessageEvent;
    
    handleTimerMessage(event, postMessage, env);
    handleTimerMessage(event, postMessage, env);
    
    expect(env.setInterval).toHaveBeenCalledTimes(1); // Should only be called once
  });
});
