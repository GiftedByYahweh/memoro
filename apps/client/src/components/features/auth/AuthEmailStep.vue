<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import AppBackButton from '@/components/shared/AppBackButton.vue';

const emit = defineEmits<{
  next: [email: string];
  back: [];
}>();

const { t } = useI18n();

const email = ref('');
const emailError = ref<string | undefined>(undefined);

function onNext(): void {
  const result = z.string().email().safeParse(email.value);
  if (!result.success) {
    emailError.value = t('validation.invalidEmailFormat');
    return;
  }
  emailError.value = undefined;
  emit('next', email.value);
}
</script>

<template>
  <div class="step-container">
    <div class="step-header">
      <AppBackButton @click="emit('back')" />
      <AppText variant="h3" color="primary">{{ t('auth.stepEmail') }}</AppText>
      <AppText variant="body-sm" color="secondary">{{ t('auth.stepEmailDesc') }}</AppText>
    </div>

    <AppInput
      id="reg-email"
      v-model="email"
      type="email"
      :label="t('auth.emailLabel')"
      :placeholder="t('auth.emailPlaceholder')"
      :error="emailError"
    >
      <template #icon-left>
        <AppIcon name="mail" :size="18" color="secondary" />
      </template>
    </AppInput>

    <div class="step-actions">
      <AppButton variant="primary" size="lg" block @click="onNext">
        {{ t('auth.sendCode') }}
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

.step-actions {
  margin-top: var(--space-md);
}
</style>
