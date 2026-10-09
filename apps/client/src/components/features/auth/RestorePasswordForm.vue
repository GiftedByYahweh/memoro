<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { VerificationCodeType } from '@memoro/shared';
import { useApiMutation } from '@/composables/useApiMutation';
import { useStepFlow } from '@/composables/useStepFlow';
import { useToast } from '@/composables/useToast';
import { useVerificationFlow } from '@/composables/useVerificationFlow';
import { RESTORE_STEPS } from '@/constants/auth.constants';
import { RoutePaths } from '@/router/routes';
import { authService } from '@/services';
import AuthEmailStep from './AuthEmailStep.vue';
import AuthPasswordStep from './AuthPasswordStep.vue';
import AuthVerifyStep from './AuthVerifyStep.vue';

const router = useRouter();
const { t } = useI18n();
const { showSuccess } = useToast();
const { currentStep, progress, goTo } = useStepFlow(RESTORE_STEPS);

const email = ref('');

const { sendCode, isSendingCode, verifyCode, isVerifyingCode, verifyApiError } =
  useVerificationFlow({
    type: VerificationCodeType.PASSWORD_RESET,
    onSendSuccess: () => {
      goTo('verify');
    },
    onVerifySuccess: () => {
      goTo('password');
    },
  });

const { mutate: submitReset, isPending: isResetting } = useApiMutation({
  mutationFn: (password: string) => authService.resetPassword({ email: email.value, password }),
  onSuccess: () => {
    showSuccess(t('auth.passwordResetSuccess'));
    void router.push({ name: RoutePaths.login.name });
  },
});

function handleEmailNext(value: string): void {
  email.value = value;
  sendCode(value);
}

function handleVerifyNext(code: string): void {
  verifyCode({ email: email.value, code });
}
</script>

<template>
  <Transition name="step-fade" mode="out-in">
    <AuthEmailStep
      v-if="currentStep === 'email'"
      :progress="progress"
      :title="t('auth.restoreTitle')"
      :initial-email="email"
      :is-pending="isSendingCode"
      @next="handleEmailNext"
    />

    <AuthVerifyStep
      v-else-if="currentStep === 'verify'"
      :progress="progress"
      :email="email"
      :is-pending="isVerifyingCode"
      :is-resending="isSendingCode"
      :api-error="verifyApiError"
      @next="handleVerifyNext"
      @resend="sendCode(email)"
      @back="goTo('email')"
    />

    <AuthPasswordStep
      v-else
      :progress="progress"
      :title="t('auth.newPasswordTitle')"
      :submit-text="t('auth.resetPasswordBtn')"
      :is-pending="isResetting"
      @submit="submitReset"
      @back="goTo('verify')"
    />
  </Transition>
</template>
