// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import CalendarView from './CalendarView.vue';

describe('CalendarView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders calendar view with days and headers', () => {
    const wrapper = mount(CalendarView, {
      global: {
        stubs: {
          'ion-button': { template: '<button><slot /></button>' },
          'ion-icon': { template: '<span></span>' }
        }
      }
    });

    const text = wrapper.text();
    // Should have weekdays
    expect(text).toContain('一');
    expect(text).toContain('日');
    
    // Should have year and month
    expect(text).toContain('年');
    expect(text).toContain('月');
  });
});
