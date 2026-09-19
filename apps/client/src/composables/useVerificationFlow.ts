import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import type { VerificationCodeType } from '@memoro/shared';
import { authService } from '@/services';
import { useDomainError } from './useDomainError';
import { useToast } from './useToast';

interface UseVerificationFlowParams {
  type: VerificationCodeType;
  onSendSuccess?: () => void;
  onVerifySuccess?: () => void;
}

export function useVerificationFlow({
  type,
  onSendSuccess,
  onVerifySuccess,
}: UseVerificationFlowParams) {
  const { t } = useI18n();
  const { showError } = useToast();
  const { translateApiError } = useDomainError();

  const verifyApiError = ref<string | undefined>(undefined);

  const { mutate: sendCode, isPending: isSendingCode } = useMutation({
    mutationFn: async (email: string) => {
      return authService.sendCode({ email, type });
    },
    onSuccess: (response) => {
      if (!response.success) {
        showError(translateApiError(response));
        return;
      }
      onSendSuccess?.();
    },
    onError: () => {
      showError(t('errors.unknown'));
    },
  });

  const { mutate: verifyCode, isPending: isVerifyingCode } = useMutation({
    mutationFn: async (payload: { email: string; code: string }) => {
      verifyApiError.value = undefined;
      return authService.verifyCode({
        email: payload.email,
        code: payload.code,
        type,
      });
    },
    onSuccess: (response) => {
      if (!response.success) {
        verifyApiError.value = translateApiError(response);
        return;
      }
      onVerifySuccess?.();
    },
    onError: () => {
      verifyApiError.value = t('errors.unknown');
    },
  });

  return {
    sendCode,
    isSendingCode,
    verifyCode,
    isVerifyingCode,
    verifyApiError,
  };
}
