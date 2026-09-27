import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseSlider from './BaseSlider.vue';

describe('BaseSlider', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseSlider, {
      props: {
        modelValue: 50,
        label: 'Volume',
        startLabel: '0',
        endLabel: '100'
      }
    });
    expect(wrapper.text()).toContain('Volume');
    expect(wrapper.text()).toContain('0');
    expect(wrapper.text()).toContain('100');
  });

  it('emits update:modelValue when changed', async () => {
    const wrapper = mount(BaseSlider, {
      props: {
        modelValue: 50,
      }
    });
    
    wrapper.findComponent({ name: 'IonRange' }).vm.$emit('ionChange', { detail: { value: 75 } });
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([75]);
  });
});
