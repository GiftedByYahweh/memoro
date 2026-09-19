<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AUTH_CONSTRAINTS } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppPinInput from '@/components/shared/AppPinInput.vue';
import AppText from '@/components/shared/AppText.vue';
import AuthStepLayout from './AuthStepLayout.vue';

interface Props {
  email: string;
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
  next: [code: string];
  back: [];
}>();

const { t } = useI18n();

const code = ref('');
const codeError = ref<string | undefined>(undefined);

function onNext(): void {
  if (code.value.length < AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH) {
    codeError.value = t('validation.codeLength');
    return;
  }
  codeError.value = undefined;
  emit('next', code.value);
}

function onCodeComplete(completedCode: string): void {
  code.value = completedCode;
  onNext();
}
</script>

<template>
  <AuthStepLayout :title="title ?? t('auth.stepVerify')" @back="emit('back')">
    <template #description>
      <AppText variant="body-sm" color="secondary">
        {{ t('auth.codeSentTo') }} <span class="highlight">{{ email }}</span>
      </AppText>
    </template>

    <div class="verify-input-section">
      <AppPinInput
        v-model="code"
        :error="codeError"
        :disabled="isPending"
        autofocus
        @complete="onCodeComplete"
      />
    </div>

    <template #actions>
      <AppButton variant="primary" size="lg" block :loading="isPending" @click="onNext">
        {{ submitText ?? t('auth.verifyBtn') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>

<style scoped>
.verify-input-section {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: var(--space-md) 0;
}

.highlight {
  color: var(--color-text-primary);
  font-weight: 600;
}
</style>
