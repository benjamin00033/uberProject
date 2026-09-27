import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { IonModal } from '@ionic/vue';
import BaseDrawer from './BaseDrawer.vue';

describe('BaseDrawer.vue', () => {
  it('renders modal and handles close', () => {
    const wrapper = mount(BaseDrawer, {
      props: { isOpen: true },
      global: {
        stubs: {
          IonModal: true,
          IonContent: true
        }
      }
    });

    const modal = wrapper.findComponent(IonModal);
    expect(modal.exists()).toBe(true);
    expect(modal.attributes('is-open')).toBe('true');

    // test dismiss emit
    modal.vm.$emit('didDismiss');
    expect(wrapper.emitted('update:isOpen')).toBeTruthy();
    expect(wrapper.emitted('update:isOpen')?.[0]).toEqual([false]);
  });
});
