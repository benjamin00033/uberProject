import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { IonAccordionGroup, IonAccordion } from '@ionic/vue';
import BaseAccordion from './BaseAccordion.vue';

describe('BaseAccordion.vue', () => {
  it('renders accordion items correctly', () => {
    const items = [
      { value: 'first', title: 'First Item', content: 'Content 1' },
      { value: 'second', title: 'Second Item', content: 'Content 2' }
    ];
    const wrapper = mount(BaseAccordion, {
      props: { items },
      global: {
        stubs: {
          IonAccordionGroup: true,
          IonAccordion: true,
          IonItem: true,
          IonLabel: true
        }
      }
    });

    const accordions = wrapper.findAllComponents(IonAccordion);
    expect(accordions.length).toBe(2);
    expect(accordions[0].attributes('value')).toBe('first');
    expect(accordions[1].attributes('value')).toBe('second');
  });
});
