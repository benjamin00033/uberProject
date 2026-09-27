import { ref } from "vue";

export function useModalController(initialState = false) {
  const isOpen = ref(initialState);
  const data = ref<any>(null);

  const open = (payload?: any) => {
    data.value = payload;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    data.value = null;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  // 將狀態和方法暴露出去
  return { isOpen, data, open, close, toggle };
}
