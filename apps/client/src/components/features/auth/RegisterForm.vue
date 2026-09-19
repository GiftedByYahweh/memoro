<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { VerificationCodeType, type UserSex } from '@memoro/shared';
import { useAuth } from '@/composables/useAuth';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';
import { useVerificationFlow } from '@/composables/useVerificationFlow';

import AuthProfileStep from './AuthProfileStep.vue';
import AuthEmailStep from './AuthEmailStep.vue';
import AuthVerifyStep from './AuthVerifyStep.vue';
import SetPasswordForm from './SetPasswordForm.vue';

const emit = defineEmits<{
  success: [];
}>();

const { t } = useI18n();
const { register } = useAuth();
const { showError, showSuccess } = useToast();
const { translateApiError } = useDomainError();

type Step = 'profile' | 'email' | 'verify' | 'password';
const currentStep = ref<Step>('profile');

const formData = ref<{
  username: string;
  gender: UserSex | '';
  email: string;
}>({
  username: '',
  gender: '',
  email: '',
});

const { sendCode, isSendingCode, verifyCode, isVerifyingCode, verifyApiError } =
  useVerificationFlow({
    type: VerificationCodeType.REGISTRATION,
    onSendSuccess: () => {
      currentStep.value = 'verify';
    },
    onVerifySuccess: () => {
      currentStep.value = 'password';
    },
  });

function handleProfileNext(payload: { username: string; gender: UserSex }): void {
  formData.value.username = payload.username;
  formData.value.gender = payload.gender;
  currentStep.value = 'email';
}

function handleEmailNext(email: string): void {
  formData.value.email = email;
  sendCode(email);
}

function handleVerifyNext(code: string): void {
  verifyCode({ email: formData.value.email, code });
}

const { mutate: handleRegister, isPending } = useMutation({
  mutationFn: async (password: string) => {
    if (!formData.value.gender) {
      throw new Error('Gender is required');
    }

    return register({
      email: formData.value.email,
      password,
      username: formData.value.username,
      gender: formData.value.gender,
    });
  },
  onSuccess: (response) => {
    if (!response.success) {
      const errorMsg = translateApiError(response);
      showError(errorMsg);
      return;
    }

    showSuccess(t('auth.registeredSuccess'));
    emit('success');
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});

function handlePasswordSubmit(password: string): void {
  handleRegister(password);
}
</script>

<template>
  <div class="register-flow">
    <Transition name="step-fade" mode="out-in">
      <AuthProfileStep v-if="currentStep === 'profile'" @next="handleProfileNext" />

      <AuthEmailStep
        v-else-if="currentStep === 'email'"
        :initial-email="formData.email"
        :is-pending="isSendingCode"
        @next="handleEmailNext"
        @back="currentStep = 'profile'"
      />

      <AuthVerifyStep
        v-else-if="currentStep === 'verify'"
        :email="formData.email"
        :is-pending="isVerifyingCode"
        :api-error="verifyApiError"
        @next="handleVerifyNext"
        @back="currentStep = 'email'"
        @resend="() => sendCode(formData.email)"
      />

      <SetPasswordForm
        v-else-if="currentStep === 'password'"
        :is-pending="isPending"
        @submit="handlePasswordSubmit"
        @back="currentStep = 'verify'"
      />
    </Transition>
  </div>
</template>

<style scoped>
.register-flow {
  width: 100%;
}
</style>
