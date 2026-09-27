// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import ProjectManagerModal from './ProjectManagerModal.vue';
import { useProjectSchedulerStore } from '../store/useProjectSchedulerStore';

describe('ProjectManagerModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders modal when isOpen is true', () => {
    const wrapper = mount(ProjectManagerModal, {
      props: {
        isOpen: true
      },
      global: {
        stubs: {
          'BaseModal': {
            template: '<div><slot /><slot name="footer" /></div>',
            props: ['isOpen', 'title']
          },
          'ion-list': { template: '<div><slot /></div>' },
          'ion-item': { template: '<div><slot /></div>' },
          'ion-label': { template: '<div><slot /></div>' },
          'ion-input': { template: '<input />' },
          'ion-button': { template: '<button><slot /></button>' },
        }
      }
    });

    // Contains the project list or add button
    expect(wrapper.text()).toContain('新增專案');
  });

  it('can switch to create mode', async () => {
    const wrapper = mount(ProjectManagerModal, {
      props: {
        isOpen: true
      },
      global: {
        stubs: {
          'BaseModal': {
            template: '<div><slot /><slot name="footer" /></div>',
            props: ['isOpen', 'title']
          },
          'ion-list': { template: '<div><slot /></div>' },
          'ion-item': { template: '<div><slot /></div>' },
          'ion-label': { template: '<div><slot /></div>' },
          'ion-input': { template: '<input />' },
          'ion-button': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
        }
      }
    });

    const buttons = wrapper.findAll('button');
    const addButton = buttons.find(b => b.text() === '新增專案');
    expect(addButton).toBeDefined();
    
    if (addButton) {
      await addButton.trigger('click');
      expect(wrapper.text()).toContain('儲存');
    }
  });
});
