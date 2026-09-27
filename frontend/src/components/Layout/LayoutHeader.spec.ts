/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LayoutHeader from './LayoutHeader.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: ref('zh'),
    t: (key: string) => key,
  }),
}));

vi.mock('@vueuse/core', () => ({
  useBreakpoints: () => ({
    smaller: () => ref(false), // mock isMobile to false
  }),
}));

describe('新增 Web Worker 來處理 API 請求與計時器 (Acceptance)', () => {
  let mockWorker: {
    onmessage: ((e: MessageEvent) => void) | null;
    postMessage: ReturnType<typeof vi.fn>;
    terminate: ReturnType<typeof vi.fn>;
  };
  
  let WorkerOriginal: typeof global.Worker;

  beforeEach(() => {
    // Save original Worker
    WorkerOriginal = global.Worker;

    // Create a mock worker instance
    mockWorker = {
      onmessage: null,
      postMessage: vi.fn(),
      terminate: vi.fn(),
    };

    // Mock the global Worker constructor
    global.Worker = vi.fn().mockImplementation(function() { return mockWorker; }) as unknown as typeof global.Worker;

    const pushMock = vi.fn();
    (useRouter as any).mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    // Restore original Worker
    global.Worker = WorkerOriginal;
    vi.restoreAllMocks();
  });

  it('LayoutHeader.vue 成功接收 Timer Worker 傳來的時間，並顯示在 Logout 按鈕旁邊', async () => {
    const wrapper = mount(LayoutHeader, {
      global: {
        stubs: ['ion-header', 'ion-toolbar', 'ion-title', 'ion-buttons', 'ion-button', 'ion-menu-button', 'ion-toggle', 'ion-icon'],
      },
    });

    // Worker should be instantiated
    expect(global.Worker).toHaveBeenCalledTimes(1);

    // Should have sent the 'start' command
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: 'start' });

    // Simulate worker sending a message with time
    const fakeTime = '2026-07-17T17:15:00.000Z';
    if (mockWorker.onmessage) {
      mockWorker.onmessage({
        data: { time: fakeTime },
      } as MessageEvent);
    }

    // Await next tick to let Vue update the DOM
    await wrapper.vm.$nextTick();

    // The component should format the time: year-month-day hours:minutes
    // In local time, this depends on the local timezone.
    // To avoid timezone issues in testing, we just check if the text exists or we can check the vm state directly.
    // However, the test checks the DOM.
    const timeDisplay = wrapper.find('div');
    // Because the component uses new Date() which converts to local time, 
    // let's just check if it's not empty, since formatting is done in the component.
    expect(wrapper.vm.currentTime).not.toBe('');
    expect(timeDisplay.text()).not.toBe('');
    
    // We can simulate an exact mock Date but since new Date(e.data.time) is used, we can just verify the vm property.
    const d = new Date(fakeTime);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const expectedTimeStr = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    expect(wrapper.vm.currentTime).toBe(expectedTimeStr);
    expect(timeDisplay.text()).toBe(expectedTimeStr);
  });

  it('組件卸載時，正確結束 Worker (terminate) 的生命週期', () => {
    const wrapper = mount(LayoutHeader, {
      global: {
        stubs: ['ion-header', 'ion-toolbar', 'ion-title', 'ion-buttons', 'ion-button'],
      },
    });

    wrapper.unmount();

    // The unmount should send 'stop' and terminate the worker
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: 'stop' });
    expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
  });
});
