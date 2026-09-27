import type { DirectiveBinding, ObjectDirective } from 'vue';
import { useUserStore } from '@/stores/userstore';

/**
 * v-permission
 * 檢查是否擁有限制權限中的任意一項 (OR)
 */
export const permissionDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding;
    if (!value) return;

    const userStore = useUserStore();
    if (!userStore.hasAnyPermission(value)) {
      el.parentNode?.removeChild(el);
    }
  },
};

/**
 * v-role
 * 檢查是否擁有限制角色中的任意一項 (OR)
 */
export const roleDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding;
    if (!value) return;

    const userStore = useUserStore();
    if (!userStore.hasRole(value)) {
      el.parentNode?.removeChild(el);
    }
  },
};
