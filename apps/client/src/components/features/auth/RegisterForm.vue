<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
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

const formData = ref({
  username: '',
  gender: '',
  email: '',
  code: '',
  password: '',
});

function handleProfileNext(payload: { username: string; gender: string }): void {
  formData.value.username = payload.username;
  formData.value.gender = payload.gender;
  currentStep.value = 'email';
}

function handleEmailNext(email: string): void {
  formData.value.email = email;
  currentStep.value = 'verify';
}

function handleVerifyNext(code: string): void {
  formData.value.code = code;
  currentStep.value = 'password';
}

const { mutate: handleRegister, isPending } = useMutation({
  mutationFn: async (password: string) => {
    formData.value.password = password;
    return register({
      email: formData.value.email,
      password: formData.value.password,
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
        @next="handleEmailNext"
        @back="currentStep = 'profile'"
      />

      <AuthVerifyStep
        v-else-if="currentStep === 'verify'"
        :email="formData.email"
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
