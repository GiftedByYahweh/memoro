<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AUTH_CONSTRAINTS } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import AppBackButton from '@/components/shared/AppBackButton.vue';

interface Props {
  isPending?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  submit: [password: string];
  back: [];
}>();

const { t } = useI18n();

const password = ref('');
const confirmPassword = ref('');

const passwordError = ref<string | undefined>(undefined);
const confirmPasswordError = ref<string | undefined>(undefined);

function onSubmit(): void {
  passwordError.value = undefined;
  confirmPasswordError.value = undefined;

  let hasError = false;

  if (password.value.length < AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH) {
    passwordError.value = t('validation.tooShort', { min: AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH });
    hasError = true;
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = t('validation.passwordsNotMatch');
    hasError = true;
  }

  if (hasError) return;
  emit('submit', password.value);
}
</script>

<template>
  <div class="step-container">
    <div class="step-header">
      <AppBackButton @click="emit('back')" />
      <AppText variant="h3" color="primary">{{ t('auth.stepPassword') }}</AppText>
      <AppText variant="body-sm" color="secondary">{{ t('auth.stepPasswordDesc') }}</AppText>
    </div>

    <form class="password-form" novalidate @submit.prevent="onSubmit">
      <AppInput
        id="reg-pass"
        v-model="password"
        type="password"
        name="password"
        autocomplete="new-password"
        :label="t('auth.passwordLabel')"
        :placeholder="t('auth.passwordPlaceholder')"
        :error="passwordError"
      >
        <template #icon-left>
          <AppIcon name="lock" :size="18" color="secondary" />
        </template>
      </AppInput>

      <AppInput
        id="reg-pass-confirm"
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        autocomplete="new-password"
        :label="t('auth.passwordRepeatLabel')"
        :placeholder="t('auth.passwordRepeatPlaceholder')"
        :error="confirmPasswordError"
      >
        <template #icon-left>
          <AppIcon name="shield" :size="18" color="secondary" />
        </template>
      </AppInput>

      <div class="step-actions">
        <AppButton type="submit" variant="primary" size="lg" block :loading="isPending">
          {{ t('auth.finishRegister') }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  width: 100%;
}

.step-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  text-align: center;
  margin-bottom: var(--space-xs);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.step-actions {
  margin-top: var(--space-xs);
}
</style>
