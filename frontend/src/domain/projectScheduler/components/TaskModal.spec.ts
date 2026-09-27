// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import TaskModal from './TaskModal.vue';

describe('TaskModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders modal when isOpen is true', () => {
    const wrapper = mount(TaskModal, {
      props: {
        isOpen: true
      },
      global: {
        stubs: {
          'BaseModal': {
            template: '<div><slot /><slot name="footer" /></div>',
            props: ['isOpen', 'title']
          },
          'ion-item': { template: '<div><slot /></div>' },
          'ion-input': { template: '<input />' },
          'ion-select': { template: '<select><slot /></select>' },
          'ion-select-option': { template: '<option><slot /></option>' },
          'ion-button': { template: '<button><slot /></button>' },
        }
      }
    });

    // Contains the save button
    expect(wrapper.text()).toContain('儲存任務');
  });
});
