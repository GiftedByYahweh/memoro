<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { AUTH_CONSTRAINTS, VerificationCodeType, emailSchema } from '@memoro/shared';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';
import { authService } from '@/services';
import AuthEmailStep from './AuthEmailStep.vue';
import AuthVerifyStep from './AuthVerifyStep.vue';
import SetPasswordForm from './SetPasswordForm.vue';

const emit = defineEmits<{ back: []; success: [] }>();

const { t } = useI18n();
const { showError, showSuccess } = useToast();
const { translateApiError } = useDomainError();

const step = ref<'email' | 'code' | 'password'>('email');
const verifyApiError = ref<string | undefined>(undefined);

const email = ref('');
const code = ref('');
const password = ref('');
const confirmPassword = ref('');

const emailError = ref<string | undefined>(undefined);
const codeError = ref<string | undefined>(undefined);
const passwordError = ref<string | undefined>(undefined);
const confirmPasswordError = ref<string | undefined>(undefined);

const { mutate: handleSendCode, isPending: isSendingCode } = useMutation({
  mutationFn: async (targetEmail: string) => {
    return authService.sendCode({ email: targetEmail, type: VerificationCodeType.PASSWORD_RESET });
  },
  onSuccess: (response) => {
    if (!response.success) {
      showError(translateApiError(response));
      return;
    }
    step.value = 'code';
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});

function onSendCode(): void {
  const result = emailSchema.safeParse(email.value);
  if (!result.success) {
    emailError.value = t('validation.invalidEmailFormat');
    return;
  }
  emailError.value = undefined;
  handleSendCode(email.value);
}

const { mutate: handleVerifyCode, isPending: isVerifyingCode } = useMutation({
  mutationFn: async (inputCode: string) => {
    verifyApiError.value = undefined;
    return authService.verifyCode({
      email: email.value,
      code: inputCode,
      type: VerificationCodeType.PASSWORD_RESET,
    });
  },
  onSuccess: (response) => {
    if (!response.success) {
      verifyApiError.value = translateApiError(response);
      return;
    }
    step.value = 'password';
  },
  onError: () => {
    verifyApiError.value = t('errors.unknown');
  },
});

function onVerifyCode(): void {
  if (code.value.length < AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH) {
    codeError.value = t('validation.codeLength');
    return;
  }
  codeError.value = undefined;
  handleVerifyCode(code.value);
}

const { mutate: handleResetPassword, isPending: isResetting } = useMutation({
  mutationFn: async () => {
    return authService.resetPassword({ email: email.value, password: password.value });
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

function onResetSubmit(): void {
  passwordError.value = undefined;
  confirmPasswordError.value = undefined;
  let hasError = false;
  if (password.value.length < AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH) {
    passwordError.value = t('validation.tooShort', { min: AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH });
    hasError = true;
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = t('validation.passwordsNotMatch');
    hasError = true;
  }
  if (hasError) return;
  handleResetPassword();
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
        @next="onSendCode"
        @back="emit('back')"
      />
      <AuthVerifyStep
        v-else-if="step === 'code'"
        :email="email"
        :is-pending="isVerifyingCode"
        :api-error="verifyApiError"
        :title="t('auth.stepVerify')"
        :submit-text="t('auth.verifyBtn')"
        @next="onVerifyCode"
        @back="step = 'email'"
        @resend="() => handleSendCode(email)"
      />
      <SetPasswordForm
        v-else
        :is-pending="isResetting"
        :title="t('auth.resetPasswordTitle')"
        :submit-text="t('auth.resetPasswordBtn')"
        @submit="onResetSubmit"
        @back="step = 'code'"
      />
    </Transition>
  </div>
</template>
