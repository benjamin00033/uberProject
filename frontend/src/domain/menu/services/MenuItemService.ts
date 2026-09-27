import { apiClient } from "@/services/apiClient";
import type { Item } from "../types";
import type { ApiResponse } from "./MenuService";

export const MenuItemService = {
  getMenuItems() {
    return apiClient.get<any, ApiResponse<Item[]>>("/menu-items");
  },
  getMenuItem(id: string) {
    return apiClient.get<any, ApiResponse<Item>>(`/menu-items/${id}`);
  },
  createMenuItem(data: Partial<Item>) {
    return apiClient.post<any, ApiResponse<Item>>("/menu-items", data);
  },
  updateMenuItem(id: string, data: Partial<Item>) {
    return apiClient.put<any, ApiResponse<Item>>(`/menu-items/${id}`, data);
  },
  deleteMenuItem(id: string) {
    return apiClient.delete<any, ApiResponse<void>>(`/menu-items/${id}`);
  }
};
