<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { loginSchema, registerSchema, toValidationIssues } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useValidation } from '@/composables/useValidation';

const ICON_SIZE_FIELD = 18;
const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

interface Props {
  mode: 'login' | 'register';
  isPending: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
  forgotPassword: [];
}>();

const { t } = useI18n();
const { translateIssue } = useValidation();

const email = ref('');
const password = ref('');

const emailError = ref<string | undefined>(undefined);
const passwordError = ref<string | undefined>(undefined);

function validateForm(): boolean {
  emailError.value = undefined;
  passwordError.value = undefined;

  const schema = props.mode === 'login' ? loginSchema : registerSchema;
  const result = schema.safeParse({
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

function onSubmit(): void {
  if (props.isPending) return;
  if (!validateForm()) return;
  emit('submit', { email: email.value, password: password.value });
}
</script>

<template>
  <form class="auth-form" novalidate @submit.prevent="onSubmit">
    <AppInput
      :id="`${mode}-email`"
      v-model="email"
      type="email"
      name="email"
      autocomplete="email"
      :label="t('auth.emailLabel')"
      :placeholder="t('auth.emailPlaceholder')"
      :error="emailError"
    >
      <template #icon-left>
        <AppIcon name="mail" :size="ICON_SIZE_FIELD" color="secondary" />
      </template>
    </AppInput>

    <AppInput
      :id="`${mode}-password`"
      v-model="password"
      type="password"
      name="password"
      :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
      :label="t('auth.passwordLabel')"
      :placeholder="t('auth.passwordPlaceholder')"
      :error="passwordError"
    >
      <template #icon-left>
        <AppIcon name="lock" :size="ICON_SIZE_FIELD" color="secondary" />
      </template>
    </AppInput>

    <div v-if="mode === 'login'" class="form-aux">
      <a href="#" class="forgot-link" @click.prevent="emit('forgotPassword')">
        {{ t('auth.forgotPassword') }}
      </a>
    </div>
    <div v-else class="form-aux-spacer" aria-hidden="true" />

    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      block
      :loading="isPending"
      @click="onSubmit"
    >
      {{ mode === 'login' ? t('auth.enterArchive') : t('auth.createAccount') }}
    </AppButton>
  </form>
</template>

<style scoped>
.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
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

.form-aux-spacer {
  height: var(--space-lg);
  margin-top: -2px;
  margin-bottom: var(--space-xs);
}
</style>
