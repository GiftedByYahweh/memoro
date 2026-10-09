<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { emailSchema, passwordSchema } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useApiMutation } from '@/composables/useApiMutation';
import { useAuth } from '@/composables/useAuth';
import { useField } from '@/composables/useField';
import { useToast } from '@/composables/useToast';
import { RoutePaths } from '@/router/routes';
import AuthStepLayout from './AuthStepLayout.vue';

const router = useRouter();
const { t } = useI18n();
const { login } = useAuth();
const { showSuccess } = useToast();

const email = useField(emailSchema);
const password = useField(passwordSchema);

const isFilled = computed(() => email.value.length > 0 && password.value.length > 0);

const { mutate: submitLogin, isPending } = useApiMutation({
  mutationFn: login,
  onSuccess: () => {
    showSuccess(t('auth.loginSuccess'));
    void router.push({ name: RoutePaths.map.name });
  },
});

function handleSubmit(): void {
  if (isPending.value) return;
  const validEmail = email.validate();
  const validPassword = password.validate();
  if (validEmail && validPassword) submitLogin({ email: validEmail, password: validPassword });
}
</script>

<template>
  <AuthStepLayout :title="t('auth.loginTitle')" @submit="handleSubmit">
    <AppInput
      id="login-email"
      v-model="email.value"
      type="email"
      name="email"
      autocomplete="email"
      icon="mail"
      :placeholder="t('auth.emailPlaceholder')"
      :error="email.error"
    />
    <AppInput
      id="login-password"
      v-model="password.value"
      type="password"
      name="password"
      autocomplete="current-password"
      icon="lock"
      :placeholder="t('auth.passwordPlaceholder')"
      :error="password.error"
    />

    <RouterLink :to="RoutePaths.restore.path" class="text-link forgot-link">
      {{ t('auth.forgotPassword') }}
    </RouterLink>

    <template #actions>
      <AppButton type="submit" size="lg" block :loading="isPending" :disabled="!isFilled">
        {{ t('auth.signIn') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>

<style scoped>
.forgot-link {
  align-self: flex-start;
  font-size: var(--text-sm);
}
</style>
