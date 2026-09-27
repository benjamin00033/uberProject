import { apiClient } from "./apiClient";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  res_code: string;
  ts: string;
  res_body: T;
}

export const UserService = {
  getUsers() {
    return apiClient.get<any, ApiResponse<any[]>>("/users");
  },

  getUser(id: number) {
    return apiClient.get<any, ApiResponse<any>>(`/users/${id}`);
  },

  createUser(payload: Object) {
    return apiClient.post<any, ApiResponse<any>>("/users", payload);
  },

  updateUser({ id, payload }: { id: number; payload: Object }) {
    return apiClient.put<any, ApiResponse<any>>(`/users/${id}`, payload);
  },

  deleteUser(id: number) {
    return apiClient.delete<any, ApiResponse<any>>(`/users/${id}`);
  },
};
