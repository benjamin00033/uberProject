import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseRadio from './BaseRadio.vue';

describe('BaseRadio', () => {
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 }
  ];

  it('renders correctly with options', () => {
    const wrapper = mount(BaseRadio, {
      props: {
        modelValue: 1,
        options,
        label: 'Choose one'
      }
    });
    expect(wrapper.text()).toContain('Choose one');
    expect(wrapper.text()).toContain('Option 1');
    expect(wrapper.text()).toContain('Option 2');
  });

  it('emits update:modelValue when changed', async () => {
    const wrapper = mount(BaseRadio, {
      props: {
        modelValue: 1,
        options
      }
    });
    
    wrapper.findComponent({ name: 'IonRadioGroup' }).vm.$emit('ionChange', { detail: { value: 2 } });
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([2]);
  });
});
