<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AUTH_CONSTRAINTS } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AuthStepLayout from './AuthStepLayout.vue';

const ICON_SIZE_FIELD = 18;

interface Props {
  isPending?: boolean;
  title?: string;
  submitText?: string;
}

withDefaults(defineProps<Props>(), {
  isPending: false,
  title: undefined,
  submitText: undefined,
});

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
  <AuthStepLayout :title="title ?? t('auth.stepPassword')" @back="emit('back')">
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
          <AppIcon name="lock" :size="ICON_SIZE_FIELD" color="secondary" />
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
          <AppIcon name="shield" :size="ICON_SIZE_FIELD" color="secondary" />
        </template>
      </AppInput>

      <AppButton type="submit" variant="primary" size="lg" block :loading="isPending">
        {{ submitText ?? t('auth.finishRegister') }}
      </AppButton>
    </form>
  </AuthStepLayout>
</template>

<style scoped>
.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>
