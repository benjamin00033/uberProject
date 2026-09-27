import { apiClient } from "@/services/apiClient";
import type { ModifierGroup } from "../types";
import type { ApiResponse } from "./MenuService";

export const ModifierGroupService = {
  getModifierGroups() {
    return apiClient.get<any, ApiResponse<ModifierGroup[]>>("/modifier-groups");
  },
  getModifierGroup(id: string) {
    return apiClient.get<any, ApiResponse<ModifierGroup>>(`/modifier-groups/${id}`);
  },
  createModifierGroup(data: Partial<ModifierGroup>) {
    return apiClient.post<any, ApiResponse<ModifierGroup>>("/modifier-groups", data);
  },
  updateModifierGroup(id: string, data: Partial<ModifierGroup>) {
    return apiClient.put<any, ApiResponse<ModifierGroup>>(`/modifier-groups/${id}`, data);
  },
  deleteModifierGroup(id: string) {
    return apiClient.delete<any, ApiResponse<void>>(`/modifier-groups/${id}`);
  }
};
