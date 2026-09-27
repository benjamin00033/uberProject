/**
 * State variable to hold the interval ID.
 */
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Handles incoming messages for the Timer Worker.
 * Extracted for easy unit testing.
 *
 * @param event - The message event containing { command: 'start' | 'stop' }.
 * @param postMessage - Callback to send a message back.
 * @param env - The environment object containing setInterval/clearInterval.
 */
interface TimerMessageData {
  command: "start" | "stop";
}

export const handleTimerMessage = (
  event: MessageEvent,
  postMessage: (msg: any) => void,
  env: any,
) => {
  const { command } = event.data as TimerMessageData;

  if (command === "start") {
    if (intervalId) return; // Prevent multiple intervals

    // Initial post
    postMessage({ time: new Date().toISOString() });

    // Set interval for every minute (60000 ms)
    intervalId = env.setInterval(() => {
      postMessage({ time: new Date().toISOString() });
    }, 60000);
  } else if (command === "stop") {
    if (intervalId) {
      env.clearInterval(intervalId);
      intervalId = null;
    }
  }
};

// Bind to Web Worker self only if running inside a worker environment
if (typeof self !== "undefined" && "onmessage" in self) {
  (self as any).onmessage = (event: MessageEvent) => {
    handleTimerMessage(event, (self as any).postMessage.bind(self), self);
  };
}
