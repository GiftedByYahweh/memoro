<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { VerificationCodeType } from '@memoro/shared';
import { useApiMutation } from '@/composables/useApiMutation';
import { useAuth } from '@/composables/useAuth';
import { useStepFlow } from '@/composables/useStepFlow';
import { useToast } from '@/composables/useToast';
import { useVerificationFlow } from '@/composables/useVerificationFlow';
import { REGISTRATION_STEPS, type AuthDetails } from '@/constants/auth.constants';
import { RoutePaths } from '@/router/routes';
import AuthDetailsStep from './AuthDetailsStep.vue';
import AuthPasswordStep from './AuthPasswordStep.vue';
import AuthVerifyStep from './AuthVerifyStep.vue';

const router = useRouter();
const { t } = useI18n();
const { register } = useAuth();
const { showSuccess } = useToast();
const { currentStep, progress, goTo } = useStepFlow(REGISTRATION_STEPS);

const details = ref<AuthDetails | null>(null);

const { sendCode, isSendingCode, verifyCode, isVerifyingCode, verifyApiError } =
  useVerificationFlow({
    type: VerificationCodeType.REGISTRATION,
    onSendSuccess: () => {
      goTo('verify');
    },
    onVerifySuccess: () => {
      goTo('password');
    },
  });

const { mutate: submitRegistration, isPending: isRegistering } = useApiMutation({
  mutationFn: (payload: AuthDetails & { password: string }) => register(payload),
  onSuccess: () => {
    showSuccess(t('auth.registeredSuccess'));
    void router.push({ name: RoutePaths.login.name });
  },
});

function handleDetailsNext(value: AuthDetails): void {
  details.value = value;
  sendCode(value.email);
}

function handleResend(): void {
  if (details.value) sendCode(details.value.email);
}

function handleVerifyNext(code: string): void {
  if (details.value) verifyCode({ email: details.value.email, code });
}

function handlePasswordSubmit(password: string): void {
  if (details.value) submitRegistration({ ...details.value, password });
}
</script>

<template>
  <Transition name="step-fade" mode="out-in">
    <AuthDetailsStep
      v-if="currentStep === 'details'"
      :progress="progress"
      :initial-details="details"
      :is-pending="isSendingCode"
      @next="handleDetailsNext"
    />

    <AuthVerifyStep
      v-else-if="currentStep === 'verify' && details"
      :progress="progress"
      :email="details.email"
      :is-pending="isVerifyingCode"
      :is-resending="isSendingCode"
      :api-error="verifyApiError"
      @next="handleVerifyNext"
      @resend="handleResend"
      @back="goTo('details')"
    />

    <AuthPasswordStep
      v-else
      :progress="progress"
      :title="t('auth.passwordTitle')"
      :submit-text="t('auth.createAccountBtn')"
      :is-pending="isRegistering"
      @submit="handlePasswordSubmit"
      @back="goTo('verify')"
    />
  </Transition>
</template>
