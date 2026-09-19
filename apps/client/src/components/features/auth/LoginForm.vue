<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { useAuth } from '@/composables/useAuth';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';
import { RoutePaths } from '@/router/routes';
import AuthForm from './AuthForm.vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';

const router = useRouter();
const { t } = useI18n();
const { login } = useAuth();
const { showError, showSuccess } = useToast();
const { translateApiError } = useDomainError();

const isForgotPassword = ref(false);

const { mutate: handleLogin, isPending } = useMutation({
  mutationFn: login,
  onSuccess: (response) => {
    if (!response.success) {
      const errorMsg = translateApiError(response);
      showError(errorMsg);
      return;
    }

    showSuccess(t('auth.loginSuccess'));
    void router.push({ name: RoutePaths.map.name });
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});
</script>

<template>
  <ForgotPasswordForm
    v-if="isForgotPassword"
    @back="isForgotPassword = false"
    @success="isForgotPassword = false"
  />
  <AuthForm
    v-else
    mode="login"
    :is-pending="isPending"
    @submit="handleLogin"
    @forgot-password="isForgotPassword = true"
  />
</template>
