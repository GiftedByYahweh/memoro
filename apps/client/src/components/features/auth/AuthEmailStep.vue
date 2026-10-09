<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { emailSchema } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useField } from '@/composables/useField';
import type { StepProgress } from '@/composables/useStepFlow';
import AuthStepLayout from './AuthStepLayout.vue';

interface Props {
  title: string;
  progress: StepProgress;
  initialEmail?: string;
  isPending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialEmail: '',
  isPending: false,
});

const emit = defineEmits<{
  next: [email: string];
}>();

const { t } = useI18n();
const email = useField(emailSchema, props.initialEmail);

function handleSubmit(): void {
  if (props.isPending) return;
  const validEmail = email.validate();
  if (validEmail) emit('next', validEmail);
}
</script>

<template>
  <AuthStepLayout :title="title" :progress="progress" @submit="handleSubmit">
    <AppInput
      id="restore-email"
      v-model="email.value"
      type="email"
      name="email"
      autocomplete="email"
      icon="mail"
      :placeholder="t('auth.emailPlaceholder')"
      :error="email.error"
    />

    <template #actions>
      <AppButton type="submit" size="lg" block :loading="isPending" :disabled="!email.value">
        {{ t('auth.sendCode') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>
