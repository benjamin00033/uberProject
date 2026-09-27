import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiQuery } from '@/composables/useApiQuery';
import { UserService } from '../services/MenuService';

export const useMenuStore = defineStore('menu', () => {
  const scenario = ref('coco');

  const { data, isPending } = useApiQuery(
    computed(() => ['menu', scenario.value]),
    () => UserService.getMenu({ scenario: scenario.value })
  );

  const menuItems = computed(() => data.value?.res_body?.items || []);
  const menus = computed(() => data.value?.res_body?.menus);
  const modifierGroups = computed(() => data.value?.res_body?.modifier_groups || []);
  const menusCategory = computed(() => data.value?.res_body?.categories || []);

  const groupedMenuItems = computed(() => {
    const categories = menusCategory.value;
    const items = menuItems.value;

    const itemsMap = Array.isArray(items)
      ? Object.fromEntries(items.map((item: any) => [item.id, item]))
      : items;

    return categories.map((category: any) => {
      const title =
        category.title?.translations?.zh ||
        category.title?.translations?.en ||
        category.id;

      const categoryItems = (category.entities || [])
        .filter((entity: any) => entity.type === 'ITEM')
        .map((entity: any) => itemsMap[entity.id])
        .filter((item: any) => item !== undefined);

      return {
        id: category.id,
        title,
        items: categoryItems,
      };
    });
  });

  return {
    scenario,
    data,
    isPending,
    menuItems,
    menus,
    modifierGroups,
    menusCategory,
    groupedMenuItems,
  };
});
