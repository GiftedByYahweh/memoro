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
  email: string;
}

defineProps<Props>();

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
</script>

<template>
  <div class="step-container">
    <div class="step-header">
      <AppBackButton @click="emit('back')" />
      <AppText variant="h3" color="primary">{{ t('auth.stepVerify') }}</AppText>
      <AppText variant="body-sm" color="secondary">
        {{ t('auth.codeSentTo') }} <span class="highlight">{{ email }}</span>
      </AppText>
    </div>

    <AppInput
      id="reg-code"
      v-model="code"
      type="text"
      :label="t('auth.codeLabel')"
      :placeholder="t('auth.codePlaceholder')"
      :maxlength="AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH"
      :error="codeError"
    >
      <template #icon-left>
        <AppIcon name="check" :size="18" color="secondary" />
      </template>
    </AppInput>

    <div class="step-actions">
      <AppButton variant="primary" size="lg" block @click="onNext">
        {{ t('auth.verifyBtn') }}
      </AppButton>
    </div>
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

.highlight {
  color: var(--color-text-primary);
  font-weight: 500;
}

.step-actions {
  margin-top: var(--space-md);
}
</style>
