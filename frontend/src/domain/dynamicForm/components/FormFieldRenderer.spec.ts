// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import FormFieldRenderer from './FormFieldRenderer.vue';
import BaseInput from '@/components/UI/BaseInput.vue';
import { IonCardTitle, IonButton } from '@ionic/vue';
import type { FormField } from '../types';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'zh' },
    t: (key: string) => key,
  })
}));

describe('FormFieldRenderer (Acceptance Tests)', () => {
  it('能夠接受 JSON Schema 陣列並正確渲染出對應的 Base 欄位', () => {
    const fields: FormField[] = [
      { id: 'username', label: '使用者名稱', type: 'text' },
      { id: 'age', label: '年齡', type: 'number' },
    ];
    
    const wrapper = mount(FormFieldRenderer, {
      props: { fields, modelValue: {} }
    });
    
    const inputs = wrapper.findAllComponents(BaseInput);
    expect(inputs.length).toBe(2);
    expect(inputs[0].props('label')).toBe('使用者名稱');
    expect(inputs[1].props('label')).toBe('年齡');
  });

  it('欄位可正確觸發 v-model 更新資料', async () => {
    const fields: FormField[] = [
      { id: 'username', label: '使用者名稱', type: 'text' },
    ];
    
    const wrapper = mount(FormFieldRenderer, {
      props: { fields, modelValue: { username: 'old_value' } }
    });
    
    const input = wrapper.findComponent(BaseInput);
    // 模擬輸入更新
    await input.vm.$emit('update:modelValue', 'new_value');
    
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toEqual({ username: 'new_value' });
  });

  it('支援巢狀可以動態擴充的格式 (Tree Structure)，能夠遞迴渲染子欄位', () => {
    const fields: FormField[] = [
      {
        id: 'userGroup',
        label: '使用者群組',
        type: 'group',
        children: [
          { id: 'firstName', label: '名字', type: 'text' }
        ]
      }
    ];
    
    const wrapper = mount(FormFieldRenderer, {
      props: { fields, modelValue: { userGroup: { firstName: 'Ben' } } }
    });
    
    // 驗證群組標題
    expect(wrapper.findComponent(IonCardTitle).text()).toBe('使用者群組');
    
    // 驗證遞迴渲染出來的子欄位
    const input = wrapper.findComponent(BaseInput);
    expect(input.exists()).toBe(true);
    expect(input.props('label')).toBe('名字');
    expect(input.props('modelValue')).toBe('Ben');
  });

  it('支援多任務動態陣列表單 (Array Structure)，能夠新增與移除子項目', async () => {
    const fields: FormField[] = [
      {
        id: 'tasks',
        label: '任務列表',
        type: 'array',
        itemSchema: { id: 'taskName', label: '任務名稱', type: 'text' }
      }
    ];
    
    const wrapper = mount(FormFieldRenderer, {
      props: { 
        fields, 
        modelValue: { tasks: [{ taskName: 'Task 1' }] } 
      }
    });
    
    // 初始化時應該有一個 BaseInput
    expect(wrapper.findAllComponents(BaseInput).length).toBe(1);
    
    const buttons = wrapper.findAllComponents(IonButton);
    
    // 找到「新增」按鈕並觸發點擊
    const addButton = buttons.find(b => b.text().includes('dynamicForm.renderer.add'));
    expect(addButton).toBeDefined();
    await addButton!.trigger('click');
    
    // 驗證是否有發出更新事件，且陣列多了一項（空物件）
    let emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    let latestUpdate = emitted![0][0] as any;
    expect(latestUpdate.tasks.length).toBe(2);
    
    // 找到「移除」按鈕並觸發點擊 (應該有針對第一項的移除按鈕)
    const removeButton = buttons.find(b => b.text().includes('dynamicForm.renderer.remove'));
    expect(removeButton).toBeDefined();
    await removeButton!.trigger('click');
    
    emitted = wrapper.emitted('update:modelValue');
    latestUpdate = emitted![1][0] as any;
    expect(latestUpdate.tasks.length).toBe(0); // 原本有一項，移除後變 0
  });
});
