import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { ModifierGroupService } from "../services/ModifierGroupService";
import type { ModifierGroup } from "../types";

export function useModifierGroups() {
  return useQuery({
    queryKey: ["modifierGroups"],
    queryFn: () => ModifierGroupService.getModifierGroups().then(res => res.res_body)
  });
}

export function useModifierGroup(id: string) {
  return useQuery({
    queryKey: ["modifierGroup", id],
    queryFn: () => ModifierGroupService.getModifierGroup(id).then(res => res.res_body),
    enabled: !!id,
  });
}

export function useModifierGroupMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<ModifierGroup>) => ModifierGroupService.createModifierGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifierGroups"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ModifierGroup> }) => 
      ModifierGroupService.updateModifierGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifierGroups"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ModifierGroupService.deleteModifierGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifierGroups"] });
    }
  });

  return { createMutation, updateMutation, deleteMutation };
}
