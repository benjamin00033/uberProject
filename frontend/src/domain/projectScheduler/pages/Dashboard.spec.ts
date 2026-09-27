// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import Dashboard from './Dashboard.vue';

describe('projectScheduler/Dashboard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders project scheduler layout with all boards', () => {
    const wrapper = mount(Dashboard, {
      global: {
        mocks: {
          $t: (msg: string) => msg
        },
        stubs: {
          'TaskModal': true,
          'ProjectManagerModal': true,
          'CalendarView': true,
          'FlexBoardLayout': { template: '<div><slot name="header" /><slot /></div>' },
          'ion-header': { template: '<header><slot /></header>' },
          'ion-toolbar': { template: '<div><slot /></div>' },
          'ion-buttons': { template: '<div><slot /></div>' },
          'ion-button': { template: '<button><slot /></button>' },
          'ion-title': { template: '<div><slot /></div>' },
          'ion-icon': true,
          'ion-card': { template: '<div><slot /></div>' },
          'ion-card-header': { template: '<div><slot /></div>' },
          'ion-card-title': { template: '<div><slot /></div>' },
          'ion-card-content': { template: '<div><slot /></div>' },
          'ion-grid': { template: '<div><slot /></div>' },
          'ion-row': { template: '<div><slot /></div>' },
          'ion-col': { template: '<div><slot /></div>' },
          'ion-progress-bar': true,
          'ion-badge': { template: '<div><slot /></div>' },
          'ion-list': { template: '<div><slot /></div>' },
          'ion-item': { template: '<div><slot /></div>' },
          'ion-label': { template: '<div><slot /></div>' }
        }
      }
    });
    
    // Check if the 3 main boards exist
    const text = wrapper.text();
    expect(text).toContain('projectScheduler.page.title');
    expect(text).toContain('projectScheduler.page.projectOverview');
    expect(text).toContain('projectScheduler.page.timelineTitle');
    expect(text).toContain('projectScheduler.page.todaysFocus');
  });
});
