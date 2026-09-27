import { computed } from "vue";
import { useApiQuery } from "@/composables/useApiQuery";
import { useApiMutation } from "@/composables/useApiMutation";
import { DynamicFormService } from "../services/DynamicFormService";
import type { DynamicFormSchema } from "../types";

export function useDynamicFormBuilder(formId?: string) {
  const queryKey = computed(() => ["dynamicFormSchema", formId]);

  // 取得單一表單資料 (若有 formId)
  // TODO: 原本 useApiQuery 如果 api 函式 throw 或 return null 會怎樣，需要確認
  // 在這裡如果 formId 是空字串或 undefined，不要去呼叫 API
  const { data, isPending, error, refetch } = useApiQuery<DynamicFormSchema>(
    queryKey,
    () => {
      if (!formId) return Promise.reject(new Error("No formId provided"));
      return DynamicFormService.getForm(formId);
    }
  );

  const schema = computed(() => formId ? data.value?.res_body : null);

  // 新增表單 Mutation
  const { mutateAsync: createForm, isPending: isCreating } = useApiMutation<DynamicFormSchema, Partial<DynamicFormSchema>>(
    DynamicFormService.createForm,
    [["dynamicFormSchema"]]
  );

  // 更新表單 Mutation
  const { mutateAsync: updateForm, isPending: isUpdating } = useApiMutation<DynamicFormSchema, { id: string; data: Partial<DynamicFormSchema> }>(
    ({ id, data }) => DynamicFormService.updateForm(id, data),
    [["dynamicFormSchema"]]
  );

  return {
    schema,
    isLoading: formId ? isPending : false,
    error,
    refetch,
    createForm,
    updateForm,
    isCreating,
    isUpdating
  };
}
