// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FlexBoardLayout from './FlexBoardLayout.vue';

describe('FlexBoardLayout', () => {
  it('renders default slot correctly', () => {
    const wrapper = mount(FlexBoardLayout, {
      slots: {
        default: '<div class="test-child">Child Content</div>'
      },
      global: {
        stubs: {
          'ion-page': { template: '<div><slot /></div>' },
          'ion-content': { template: '<div><slot /></div>' },
          'LayoutHeader': true
        }
      }
    });
    expect(wrapper.find('.test-child').exists()).toBe(true);
    expect(wrapper.text()).toContain('Child Content');
  });

  it('renders header slot if provided', () => {
    const wrapper = mount(FlexBoardLayout, {
      slots: {
        header: '<div class="test-header">Custom Header</div>'
      },
      global: {
        stubs: {
          'ion-page': { template: '<div><slot name="header" /><slot /></div>' },
          'ion-content': { template: '<div><slot /></div>' },
          'LayoutHeader': true
        }
      }
    });
    expect(wrapper.find('.test-header').exists()).toBe(true);
    expect(wrapper.text()).toContain('Custom Header');
  });
});
