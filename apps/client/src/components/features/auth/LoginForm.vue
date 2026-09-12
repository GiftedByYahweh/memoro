<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { loginSchema, toValidationIssues } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useAuth } from '@/composables/useAuth';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';
import { useValidation } from '@/composables/useValidation';
import { RoutePaths } from '@memoro/shared';

const ICON_SIZE_FIELD = 18;
const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

const router = useRouter();
const { t } = useI18n();
const { login } = useAuth();
const { showError, showSuccess } = useToast();
const { translateApiError } = useDomainError();
const { translateIssue } = useValidation();

const email = ref('');
const password = ref('');

const emailError = ref<string | undefined>(undefined);
const passwordError = ref<string | undefined>(undefined);

function validateForm(): boolean {
  emailError.value = undefined;
  passwordError.value = undefined;

  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  });

  if (result.success) return true;

  const issues = toValidationIssues(result.error.issues);
  for (const issue of issues) {
    const message = translateIssue(issue);
    if (issue.path === EMAIL_FIELD && !emailError.value) {
      emailError.value = message;
    } else if (issue.path === PASSWORD_FIELD && !passwordError.value) {
      passwordError.value = message;
    }
  }

  return false;
}

const { mutate: handleLogin, isPending } = useMutation({
  mutationFn: async () => {
    return login({
      email: email.value,
      password: password.value,
    });
  },
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

function onSubmit(): void {
  if (isPending.value) return;
  if (!validateForm()) return;
  handleLogin();
}
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="onSubmit">
    <div class="form-field">
      <label for="login-email" class="field-label">
        {{ t('auth.emailLabel') }}
      </label>
      <AppInput
        id="login-email"
        v-model="email"
        type="email"
        name="email"
        autocomplete="email"
        :placeholder="t('auth.emailPlaceholder')"
        :error="emailError"
      >
        <template #icon-left>
          <AppIcon name="mail" :size="ICON_SIZE_FIELD" color="secondary" />
        </template>
      </AppInput>
    </div>

    <div class="form-field">
      <label for="login-password" class="field-label">
        {{ t('auth.passwordLabel') }}
      </label>
      <AppInput
        id="login-password"
        v-model="password"
        type="password"
        name="password"
        autocomplete="current-password"
        :placeholder="t('auth.passwordPlaceholder')"
        :error="passwordError"
      >
        <template #icon-left>
          <AppIcon name="lock" :size="ICON_SIZE_FIELD" color="secondary" />
        </template>
      </AppInput>
    </div>

    <div class="form-aux">
      <a href="#" class="forgot-link" @click.prevent>
        {{ t('auth.forgotPassword') }}
      </a>
    </div>

    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      block
      :loading="isPending"
      class="submit-btn"
      @click="onSubmit"
    >
      {{ t('auth.enterArchive') }}
    </AppButton>
  </form>
</template>

<style scoped>
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  padding-left: 2px;
}

.form-aux {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.8125rem;
  margin-top: -2px;
  margin-bottom: var(--space-xs);
}

.forgot-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.forgot-link:hover {
  color: var(--color-text-primary);
}

.submit-btn {
  margin-top: var(--space-xs);
}
</style>
