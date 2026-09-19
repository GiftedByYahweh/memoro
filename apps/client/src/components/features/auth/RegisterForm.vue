<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { VerificationCodeType, type UserSex } from '@memoro/shared';
import { authService } from '@/services';
import { useAuth } from '@/composables/useAuth';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';

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
  password: string;
}>({
  username: '',
  gender: '',
  email: '',
  password: '',
});

function handleProfileNext(payload: { username: string; gender: UserSex }): void {
  formData.value.username = payload.username;
  formData.value.gender = payload.gender;
  currentStep.value = 'email';
}

const { mutate: handleSendCode, isPending: isSendingCode } = useMutation({
  mutationFn: async (email: string) => {
    return authService.sendCode({
      email,
      type: VerificationCodeType.REGISTRATION,
    });
  },
  onSuccess: (response) => {
    if (!response.success) {
      const errorMsg = translateApiError(response);
      showError(errorMsg);
      return;
    }
    currentStep.value = 'verify';
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});

function handleEmailNext(email: string): void {
  formData.value.email = email;
  handleSendCode(email);
}

const { mutate: handleVerifyCode, isPending: isVerifyingCode } = useMutation({
  mutationFn: async (code: string) => {
    return authService.verifyCode({
      email: formData.value.email,
      code,
      type: VerificationCodeType.REGISTRATION,
    });
  },
  onSuccess: (response) => {
    if (!response.success) {
      showError(translateApiError(response));
      return;
    }
    currentStep.value = 'password';
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});

function handleVerifyNext(code: string): void {
  handleVerifyCode(code);
}

const { mutate: handleRegister, isPending } = useMutation({
  mutationFn: async (password: string) => {
    if (!formData.value.gender) {
      throw new Error('Gender is required');
    }

    formData.value.password = password;
    return register({
      email: formData.value.email,
      password: formData.value.password,
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
</script>

<template>
  <div class="register-flow">
    <Transition name="step-fade" mode="out-in">
      <AuthProfileStep v-if="currentStep === 'profile'" @next="handleProfileNext" />

      <AuthEmailStep
        v-else-if="currentStep === 'email'"
        :is-pending="isSendingCode"
        @next="handleEmailNext"
        @back="currentStep = 'profile'"
      />

      <AuthVerifyStep
        v-else-if="currentStep === 'verify'"
        :email="formData.email"
        :is-pending="isVerifyingCode"
        @next="handleVerifyNext"
        @back="currentStep = 'email'"
      />

      <SetPasswordForm
        v-else-if="currentStep === 'password'"
        :is-pending="isPending"
        @submit="handleRegister"
        @back="currentStep = 'verify'"
      />
    </Transition>
  </div>
</template>

<style scoped>
.register-flow {
  width: 100%;
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
