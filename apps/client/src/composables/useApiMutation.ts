import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import type { ApiResponse } from '@memoro/shared';
import { useDomainError } from './useDomainError';
import { useToast } from './useToast';

interface ApiMutationOptions<TVariables, TData> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  onSuccess?: (data: TData) => void;
  onApiError?: (message: string) => void;
}

export function useApiMutation<TVariables, TData>(options: ApiMutationOptions<TVariables, TData>) {
  const { t } = useI18n();
  const { showError } = useToast();
  const { translateApiError } = useDomainError();
  const reportError = options.onApiError ?? showError;

  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: (response) => {
      if (!response.success) {
        reportError(translateApiError(response));
        return;
      }
      options.onSuccess?.(response.data);
    },
    onError: () => {
      reportError(t('errors.unknown'));
    },
  });
}
