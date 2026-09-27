// import { onUnmounted } from "vue";

type EventHandler<T = any> = (payload: T) => void;

interface EventBus {
  on: <T = any>(event: string, handler: EventHandler<T>) => void;
  off: <T = any>(event: string, handler: EventHandler<T>) => void;
  emit: <T = any>(event: string, payload?: T) => void;
  clear: (event?: string) => void;
}

// Global bus map
const bus = new Map<string, Set<EventHandler>>();

/**
 * useEventBus composable
 * Provides a lightweight pub/sub event bus mechanism for Vue components.
 */
export function useEventBus(): EventBus {
  /**
   * Register an event listener
   * @param event The name of the event
   * @param handler The callback function
   */
  const on = <T = any>(event: string, handler: EventHandler<T>) => {
    if (!bus.has(event)) {
      bus.set(event, new Set());
    }
    bus.get(event)!.add(handler as EventHandler);
  };

  /**
   * Unregister an event listener
   * @param event The name of the event
   * @param handler The callback function to remove
   */
  const off = <T = any>(event: string, handler: EventHandler<T>) => {
    if (bus.has(event)) {
      const handlers = bus.get(event)!;
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        bus.delete(event);
      }
    }
  };

  /**
   * Emit an event to all registered listeners
   * @param event The name of the event
   * @param payload The data to pass to the listeners
   */
  const emit = <T = any>(event: string, payload?: T) => {
    if (bus.has(event)) {
      // Create a shallow copy to prevent issues if handlers modify the set during iteration
      const handlers = Array.from(bus.get(event)!);
      handlers.forEach((handler) => handler(payload));
    }
  };

  /**
   * Clear all listeners for a specific event, or clear all events if no event specified
   * @param event The name of the event (optional)
   */
  const clear = (event?: string) => {
    if (event) {
      bus.delete(event);
    } else {
      bus.clear();
    }
  };

  return {
    on,
    off,
    emit,
    clear,
  };
}
