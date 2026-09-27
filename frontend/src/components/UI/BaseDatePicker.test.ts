import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseDatePicker from './BaseDatePicker.vue';

describe('BaseDatePicker', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseDatePicker, {
      props: {
        modelValue: '2023-01-01',
        label: 'Select Date'
      }
    });
    expect(wrapper.text()).toContain('Select Date');
  });

  it('emits update:modelValue when changed', async () => {
    const wrapper = mount(BaseDatePicker, {
      props: {
        modelValue: '2023-01-01',
      }
    });
    
    wrapper.findComponent({ name: 'IonDatetime' }).vm.$emit('ionChange', { detail: { value: '2023-02-01' } });
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2023-02-01']);
  });
});
