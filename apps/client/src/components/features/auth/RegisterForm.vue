<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { registerSchema, toValidationIssues } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useAuth } from '@/composables/useAuth';
import { useDomainError } from '@/composables/useDomainError';
import { useToast } from '@/composables/useToast';
import { useValidation } from '@/composables/useValidation';

const ICON_SIZE_FIELD = 18;
const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

const emit = defineEmits<{
  success: [];
}>();

const { t } = useI18n();
const { register } = useAuth();
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

  const result = registerSchema.safeParse({
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

const { mutate: handleRegister, isPending } = useMutation({
  mutationFn: async () => {
    return register({
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

    showSuccess(t('auth.registeredSuccess'));
    emit('success');
  },
  onError: () => {
    showError(t('errors.unknown'));
  },
});

function onSubmit(): void {
  if (isPending.value) return;
  if (!validateForm()) return;
  handleRegister();
}
</script>

<template>
  <form class="register-form" novalidate @submit.prevent="onSubmit">
    <div class="form-field">
      <label for="register-email" class="field-label">
        {{ t('auth.emailLabel') }}
      </label>
      <AppInput
        id="register-email"
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
      <label for="register-password" class="field-label">
        {{ t('auth.passwordLabel') }}
      </label>
      <AppInput
        id="register-password"
        v-model="password"
        type="password"
        name="password"
        autocomplete="new-password"
        :placeholder="t('auth.passwordPlaceholder')"
        :error="passwordError"
      >
        <template #icon-left>
          <AppIcon name="lock" :size="ICON_SIZE_FIELD" color="secondary" />
        </template>
      </AppInput>
    </div>

    <div class="form-aux-spacer" aria-hidden="true" />

    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      block
      :loading="isPending"
      class="submit-btn"
      @click="onSubmit"
    >
      {{ t('auth.createAccount') }}
    </AppButton>
  </form>
</template>

<style scoped>
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-aux-spacer {
  height: var(--space-lg);
  margin-top: -2px;
  margin-bottom: var(--space-xs);
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

.submit-btn {
  margin-top: var(--space-xs);
}
</style>
