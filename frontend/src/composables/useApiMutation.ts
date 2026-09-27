import { useQueryClient, useMutation } from "@tanstack/vue-query";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  res_code: string;
  ts: string;
  res_body: T;
}

export function useApiMutation<TData, TVariables>(
  api: (variables: TVariables) => Promise<ApiResponse<TData>>,
  invalidateKeys: unknown[][] = [],
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TVariables) => {
      const result = await api(payload);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.res_body;
    },

    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: key,
        });
      });
    },
  });
}
