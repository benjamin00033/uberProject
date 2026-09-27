import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TestLayoutPage from './TestLayoutPage.vue';

// 模擬 vue-router
const mockRouter = {
  back: () => {}
};

describe('TestLayoutPage.vue', () => {
  it('renders correctly and has a layout selector', () => {
    const wrapper = mount(TestLayoutPage, {
      global: {
        mocks: {
          $router: mockRouter
        },
        stubs: {
          DynamicLayout: true,
          IonCard: true,
          IonCardHeader: true,
          IonCardTitle: true,
          IonCardContent: true,
          IonSelect: true,
          IonSelectOption: true,
          IonButton: true,
          IonIcon: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    // 檢查是否有選單綁定了 v-model 到 layoutType
    expect(wrapper.findComponent({ name: 'IonSelect' }).exists()).toBe(true);
  });
});
