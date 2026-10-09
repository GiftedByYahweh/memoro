import { ref } from 'vue';
import type { VerificationCodeType } from '@memoro/shared';
import { authService } from '@/services';
import { useApiMutation } from './useApiMutation';

interface UseVerificationFlowParams {
  type: VerificationCodeType;
  onSendSuccess: () => void;
  onVerifySuccess: () => void;
}

export function useVerificationFlow({
  type,
  onSendSuccess,
  onVerifySuccess,
}: UseVerificationFlowParams) {
  const verifyApiError = ref<string | undefined>(undefined);

  const { mutate: sendCode, isPending: isSendingCode } = useApiMutation({
    mutationFn: (email: string) => authService.sendCode({ email, type }),
    onSuccess: onSendSuccess,
  });

  const { mutate: verifyCode, isPending: isVerifyingCode } = useApiMutation({
    mutationFn: (payload: { email: string; code: string }) => {
      verifyApiError.value = undefined;
      return authService.verifyCode({ ...payload, type });
    },
    onSuccess: onVerifySuccess,
    onApiError: (message) => {
      verifyApiError.value = message;
    },
  });

  return { sendCode, isSendingCode, verifyCode, isVerifyingCode, verifyApiError };
}
