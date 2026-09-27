import { useQuery } from "@tanstack/vue-query";

// 根據你的需求定義內部結構
interface MenuData {
  items: any[]; // 建議日後把 any[] 換成真實的型別，例如 MenuItem[]
  menus: any[];
  categories: any[];
  modifier_groups: any[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  res_code: string;
  ts: string;
  res_body: T;
}

export function useApiQuery<T>(
  key: ComputedRef<string[]>,
  api: () => Promise<ApiResponse<T>>,
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const result = await api();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
  });
}
