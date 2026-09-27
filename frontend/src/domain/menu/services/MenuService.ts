import { apiClient } from "@/services/apiClient";
import type { MenuData, Menu } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  res_code: string;
  ts: string;
  res_body: T;
}

export interface GetMenuParams {
  scenario?: string;
  [key: string]: any;
}

// 保留原有的 UserService 以免破壞現有邏輯
export const UserService = {
  getMenu(params?: GetMenuParams) {
    return apiClient.get<any, ApiResponse<MenuData>>("/menu", { params });
  },
};

// 新增 MenuService 負責 Menu 的 CRUD
export const MenuService = {
  getMenus() {
    return apiClient.get<any, ApiResponse<Menu[]>>("/menus");
  },
  getMenu(id: string) {
    return apiClient.get<any, ApiResponse<Menu>>(`/menus/${id}`);
  },
  createMenu(data: Partial<Menu>) {
    return apiClient.post<any, ApiResponse<Menu>>("/menus", data);
  },
  updateMenu(id: string, data: Partial<Menu>) {
    return apiClient.put<any, ApiResponse<Menu>>(`/menus/${id}`, data);
  },
  deleteMenu(id: string) {
    return apiClient.delete<any, ApiResponse<void>>(`/menus/${id}`);
  }
};
