import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseCheckbox from './BaseCheckbox.vue';

describe('BaseCheckbox', () => {
  it('renders correctly with label', () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        modelValue: false,
        label: 'Agree to terms',
      }
    });
    expect(wrapper.text()).toContain('Agree to terms');
  });

  it('emits update:modelValue when changed', async () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        modelValue: false,
      }
    });
    
    // Simulate ionChange event
    wrapper.findComponent({ name: 'IonCheckbox' }).vm.$emit('ionChange', { detail: { checked: true } });
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
  });

  it('validates required prop', async () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        modelValue: true,
        required: true,
      }
    });
    
    wrapper.findComponent({ name: 'IonCheckbox' }).vm.$emit('ionChange', { detail: { checked: false } });
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('此欄位為必填');
  });
});
