<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { AUTH_CONSTRAINTS } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppPinInput from '@/components/shared/AppPinInput.vue';
import type { StepProgress } from '@/composables/useStepFlow';
import { COUNTDOWN_TICK_MS, RESEND_COOLDOWN_SECONDS } from '@/constants/auth.constants';
import AuthStepLayout from './AuthStepLayout.vue';

interface Props {
  email: string;
  progress: StepProgress;
  isPending?: boolean;
  isResending?: boolean;
  apiError?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isPending: false,
  isResending: false,
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
const secondsLeft = ref(RESEND_COOLDOWN_SECONDS);
let countdownId: number | undefined;

function tick(): void {
  if (secondsLeft.value > 0) {
    secondsLeft.value -= 1;
    return;
  }
  window.clearInterval(countdownId);
}

function startCountdown(): void {
  secondsLeft.value = RESEND_COOLDOWN_SECONDS;
  window.clearInterval(countdownId);
  countdownId = window.setInterval(tick, COUNTDOWN_TICK_MS);
}

watch(
  () => props.apiError,
  (error) => {
    if (!error) return;
    codeError.value = error;
    code.value = '';
  },
);

watch(code, (value) => {
  if (value.length > 0) codeError.value = undefined;
});

function handleSubmit(): void {
  if (props.isPending) return;
  if (code.value.length < AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH) {
    codeError.value = t('validation.codeLength');
    return;
  }
  emit('next', code.value);
}

function handleComplete(completedCode: string): void {
  code.value = completedCode;
  handleSubmit();
}

function handleResend(): void {
  code.value = '';
  codeError.value = undefined;
  emit('resend');
  startCountdown();
}

onMounted(startCountdown);
onUnmounted(() => {
  window.clearInterval(countdownId);
});
</script>

<template>
  <AuthStepLayout
    :title="t('auth.verifyTitle')"
    :progress="progress"
    show-back
    @submit="handleSubmit"
    @back="emit('back')"
  >
    <template #description>
      {{ t('auth.codeSentTo') }} <strong class="email-highlight">{{ email }}</strong>
    </template>

    <AppPinInput
      v-model="code"
      :error="codeError"
      :disabled="isPending"
      autofocus
      @complete="handleComplete"
    />

    <AppButton
      variant="ghost"
      size="sm"
      class="resend-btn"
      :disabled="secondsLeft > 0"
      :loading="isResending"
      @click="handleResend"
    >
      {{
        secondsLeft > 0
          ? t('auth.resendCodeIn', { seconds: secondsLeft })
          : t('auth.resendCodeAction')
      }}
    </AppButton>

    <template #actions>
      <AppButton type="submit" size="lg" block :loading="isPending">
        {{ t('auth.verifyBtn') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>

<style scoped>
.email-highlight {
  font-weight: 500;
  color: var(--color-text-primary);
}

.resend-btn {
  align-self: center;
}
</style>
