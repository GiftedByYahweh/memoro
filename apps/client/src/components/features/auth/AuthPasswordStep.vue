<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { AUTH_CONSTRAINTS, passwordSchema } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useField } from '@/composables/useField';
import type { StepProgress } from '@/composables/useStepFlow';
import AuthStepLayout from './AuthStepLayout.vue';

interface Props {
  title: string;
  progress: StepProgress;
  submitText: string;
  isPending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isPending: false,
});

const emit = defineEmits<{
  submit: [password: string];
  back: [];
}>();

const { t } = useI18n();

const password = useField(passwordSchema);
const confirmPassword = ref('');
const confirmPasswordError = ref<string | undefined>(undefined);

const isFilled = computed(() => password.value.length > 0 && confirmPassword.value.length > 0);

watch(confirmPassword, () => {
  confirmPasswordError.value = undefined;
});

function handleSubmit(): void {
  if (props.isPending) return;
  const validPassword = password.validate();
  const isConfirmed = password.value === confirmPassword.value;
  confirmPasswordError.value = isConfirmed ? undefined : t('validation.passwordsNotMatch');

  if (validPassword && isConfirmed) emit('submit', validPassword);
}
</script>

<template>
  <AuthStepLayout
    :title="title"
    :progress="progress"
    show-back
    @submit="handleSubmit"
    @back="emit('back')"
  >
    <AppInput
      id="new-password"
      v-model="password.value"
      type="password"
      name="password"
      autocomplete="new-password"
      icon="lock"
      :placeholder="t('auth.newPasswordPlaceholder', { min: AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH })"
      :maxlength="AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH"
      :error="password.error"
    />
    <AppInput
      id="new-password-confirm"
      v-model="confirmPassword"
      type="password"
      name="confirmPassword"
      autocomplete="new-password"
      icon="shield"
      :placeholder="t('auth.passwordRepeatPlaceholder')"
      :maxlength="AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH"
      :error="confirmPasswordError"
    />

    <template #actions>
      <AppButton type="submit" size="lg" block :loading="isPending" :disabled="!isFilled">
        {{ submitText }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>
