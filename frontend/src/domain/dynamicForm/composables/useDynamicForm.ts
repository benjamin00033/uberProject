import { computed } from "vue";
import { useApiQuery } from "@/composables/useApiQuery";
import type { DynamicFormSchema, ApiResponse } from "../types";
import { apiClient } from "@/services/apiClient";

// 呼叫後端 API，回傳的 data 會符合 ApiResponse<DynamicFormSchema>
const getFormSchemaApi = () => {
  return apiClient.get<any, ApiResponse<DynamicFormSchema>>("/form/schema");
};

export function useDynamicForm() {
  const queryKey = computed(() => ["dynamicFormSchema"]);

  // 利用共用的 useApiQuery 進行資料獲取與狀態管理
  const { data, isPending, error, refetch } = useApiQuery<DynamicFormSchema>(
    queryKey,
    getFormSchemaApi,
  );

  // useApiQuery 取出的 data 是完整的 ApiResponse，我們只需要解構出裡面的 res_body
  const schema = computed(() => data.value?.res_body || null);

  // 將 Vue Query 的 error 轉化為錯誤訊息字串
  const errorMessage = computed(() =>
    error.value ? error.value.message : null,
  );

  return {
    schema,
    isLoading: isPending,
    error: errorMessage,
    fetchSchema: refetch,
  };
}
