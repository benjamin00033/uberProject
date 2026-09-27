import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { MenuItemService } from "../services/MenuItemService";
import type { Item } from "../types";

export function useMenuItems() {
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: () => MenuItemService.getMenuItems().then(res => res.res_body)
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => MenuItemService.getMenuItem(id).then(res => res.res_body),
    enabled: !!id,
  });
}

export function useMenuItemMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Item>) => MenuItemService.createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) => 
      MenuItemService.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => MenuItemService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });

  return { createMutation, updateMutation, deleteMutation };
}
