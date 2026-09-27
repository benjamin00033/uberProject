import { ref } from 'vue';

export function useMenuPage() {
  const isOpen = ref(false);
  const modifierIds = ref<string[]>([]);

  function receiveModifierIds(ids: string[]) {
    modifierIds.value = ids;
    isOpen.value = true;
  }

  function handleModalUpdate(newIsOpen: boolean) {
    isOpen.value = newIsOpen;
    // We will let Menu.vue clear modifier_groups if needed, 
    // or we can just manage isOpen state here.
  }

  return {
    isOpen,
    modifierIds,
    receiveModifierIds,
    handleModalUpdate,
  };
}
