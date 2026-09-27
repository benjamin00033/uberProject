import { apiClient } from "@/services/apiClient";
import type { DynamicFormSchema, ApiResponse } from "../types";

export const DynamicFormService = {
  getForms() {
    return apiClient.get<any, ApiResponse<DynamicFormSchema[]>>("/dynamic-forms");
  },
  getForm(id: string) {
    return apiClient.get<any, ApiResponse<DynamicFormSchema>>(`/dynamic-forms/${id}`);
  },
  createForm(data: Partial<DynamicFormSchema>) {
    return apiClient.post<any, ApiResponse<DynamicFormSchema>>("/dynamic-forms", data);
  },
  updateForm(id: string, data: Partial<DynamicFormSchema>) {
    return apiClient.put<any, ApiResponse<DynamicFormSchema>>(`/dynamic-forms/${id}`, data);
  },
  deleteForm(id: string) {
    return apiClient.delete<any, ApiResponse<void>>(`/dynamic-forms/${id}`);
  }
};
