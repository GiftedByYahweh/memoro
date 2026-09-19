<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { emailSchema } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AuthStepLayout from './AuthStepLayout.vue';

const emit = defineEmits<{
  next: [email: string];
  back: [];
}>();

const { t } = useI18n();

const email = ref('');
const emailError = ref<string | undefined>(undefined);

function onNext(): void {
  const result = emailSchema.safeParse(email.value);
  if (!result.success) {
    emailError.value = t('validation.invalidEmailFormat');
    return;
  }
  emailError.value = undefined;
  emit('next', result.data);
}
</script>

<template>
  <AuthStepLayout
    :title="t('auth.stepEmail')"
    :description="t('auth.stepEmailDesc')"
    @back="emit('back')"
  >
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

    <template #actions>
      <AppButton variant="primary" size="lg" block @click="onNext">
        {{ t('auth.sendCode') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>
