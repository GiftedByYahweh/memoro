<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AUTH_CONSTRAINTS } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import AuthStepLayout from './AuthStepLayout.vue';

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
  <AuthStepLayout :title="t('auth.stepVerify')" @back="emit('back')">
    <template #description>
      <AppText variant="body-sm" color="secondary">
        {{ t('auth.codeSentTo') }} <span class="highlight">{{ email }}</span>
      </AppText>
    </template>

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

    <template #actions>
      <AppButton variant="primary" size="lg" block @click="onNext">
        {{ t('auth.verifyBtn') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>
