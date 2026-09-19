<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
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
  apiError?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isPending: false,
  title: undefined,
  submitText: undefined,
  apiError: undefined,
});

const emit = defineEmits<{
  next: [code: string];
  back: [];
  resend: [];
}>();

const { t } = useI18n();

const code = ref('');
const codeError = ref<string | undefined>(undefined);

const timer = ref(60);
let interval: number | undefined;

function startTimer(): void {
  timer.value = 60;
  clearInterval(interval);
  interval = window.setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(interval);
});

watch(
  () => props.apiError,
  (newErr) => {
    if (newErr) {
      codeError.value = newErr;
      code.value = '';
    }
  },
);

watch(code, (newCode) => {
  if (newCode.length > 0 && codeError.value) {
    codeError.value = undefined;
  }
});

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

function onResend(): void {
  code.value = '';
  codeError.value = undefined;
  emit('resend');
  startTimer();
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

      <div class="resend-action">
        <AppButton v-if="timer > 0" variant="secondary" size="lg" block disabled>
          {{ t('auth.resendCodeIn', { seconds: timer }) }}
        </AppButton>
        <AppButton v-else variant="secondary" size="lg" block @click="onResend">
          {{ t('auth.resendCodeAction') }}
        </AppButton>
      </div>
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

.resend-action {
  margin-top: var(--space-sm);
  width: 100%;
}

.highlight {
  color: var(--color-text-primary);
  font-weight: 600;
}
</style>
