// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { IonSegmentButton } from '@ionic/vue';
import BaseTabs from './BaseTabs.vue';

describe('BaseTabs.vue', () => {
  it('renders tabs correctly', () => {
    const tabs = [
      { value: 'home', label: 'Home' },
      { value: 'settings', label: 'Settings' }
    ];
    const wrapper = mount(BaseTabs, {
      props: { tabs, modelValue: 'home' }
    });

    const buttons = wrapper.findAllComponents(IonSegmentButton);
    expect(buttons.length).toBe(2);
    expect(buttons[0].props('value')).toBe('home');
    expect(buttons[1].props('value')).toBe('settings');
  });

  it('emits update:modelValue when changed', async () => {
    const tabs = [
      { value: 'home', label: 'Home' },
      { value: 'settings', label: 'Settings' }
    ];
    const wrapper = mount(BaseTabs, {
      props: { tabs, modelValue: 'home' }
    });

    // Simulate ionChange event
    wrapper.findComponent({ name: 'IonSegment' }).vm.$emit('ionChange', { detail: { value: 'settings' } });
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['settings']);
  });
});
