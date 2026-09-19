<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { VerificationCodeType } from '@memoro/shared';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';
import { useVerificationFlow } from '@/composables/useVerificationFlow';
import { authService } from '@/services';
import AuthEmailStep from './AuthEmailStep.vue';
import AuthVerifyStep from './AuthVerifyStep.vue';
import SetPasswordForm from './SetPasswordForm.vue';

const emit = defineEmits<{ back: []; success: [] }>();

const { t } = useI18n();
const { showError, showSuccess } = useToast();
const { translateApiError } = useDomainError();

const step = ref<'email' | 'code' | 'password'>('email');

const email = ref('');
const code = ref('');

const { sendCode, isSendingCode, verifyCode, isVerifyingCode, verifyApiError } =
  useVerificationFlow({
    type: VerificationCodeType.PASSWORD_RESET,
    onSendSuccess: () => {
      step.value = 'code';
    },
    onVerifySuccess: () => {
      step.value = 'password';
    },
  });

function onEmailNext(emittedEmail: string): void {
  email.value = emittedEmail;
  sendCode(email.value);
}

function onVerifyNext(emittedCode: string): void {
  code.value = emittedCode;
  verifyCode({ email: email.value, code: code.value });
}

const { mutate: handleResetPassword, isPending: isResetting } = useMutation({
  mutationFn: async (password: string) => {
    return authService.resetPassword({ email: email.value, password });
  },
  onSuccess: (response) => {
    if (!response.success) {
      showError(translateApiError(response));
      return;
    }
    showSuccess(t('auth.passwordResetSuccess'));
    emit('success');
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});

function onPasswordSubmit(emittedPassword: string): void {
  handleResetPassword(emittedPassword);
}
</script>

<template>
  <div class="recovery-flow">
    <Transition name="step-fade" mode="out-in">
      <AuthEmailStep
        v-if="step === 'email'"
        :initial-email="email"
        :is-pending="isSendingCode"
        :title="t('auth.resetPasswordTitle')"
        :submit-text="t('auth.sendCode')"
        @next="onEmailNext"
        @back="emit('back')"
      />

      <AuthVerifyStep
        v-else-if="step === 'code'"
        :email="email"
        :is-pending="isVerifyingCode"
        :api-error="verifyApiError"
        :title="t('auth.stepVerify')"
        :submit-text="t('auth.verifyBtn')"
        @next="onVerifyNext"
        @back="step = 'email'"
        @resend="() => sendCode(email)"
      />

      <SetPasswordForm
        v-else
        :is-pending="isResetting"
        :title="t('auth.resetPasswordTitle')"
        :submit-text="t('auth.resetPasswordBtn')"
        @submit="onPasswordSubmit"
        @back="step = 'code'"
      />
    </Transition>
  </div>
</template>
