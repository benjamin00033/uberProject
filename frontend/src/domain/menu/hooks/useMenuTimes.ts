import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { MenuService } from "../services/MenuService";
import type { Menu } from "../types";

export function useMenus() {
  return useQuery({
    queryKey: ["menus"],
    queryFn: () => MenuService.getMenus().then(res => res.res_body)
  });
}

export function useMenu(id: string) {
  return useQuery({
    queryKey: ["menu", id],
    queryFn: () => MenuService.getMenu(id).then(res => res.res_body),
    enabled: !!id
  });
}

export function useMenuMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Menu>) => MenuService.createMenu(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Menu> }) => 
      MenuService.updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => MenuService.deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    }
  });

  return { createMutation, updateMutation, deleteMutation };
}
