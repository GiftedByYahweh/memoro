<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { emailSchema } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AuthStepLayout from './AuthStepLayout.vue';

const ICON_SIZE_FIELD = 18;

interface Props {
  isPending?: boolean;
  initialEmail?: string;
  title?: string;
  submitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isPending: false,
  initialEmail: '',
  title: undefined,
  submitText: undefined,
});

const emit = defineEmits<{
  next: [email: string];
  back: [];
}>();

const { t } = useI18n();

const email = ref(props.initialEmail);
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
    :title="title ?? t('auth.stepEmail')"
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
        <AppIcon name="mail" :size="ICON_SIZE_FIELD" color="secondary" />
      </template>
    </AppInput>

    <template #actions>
      <AppButton variant="primary" size="lg" block :loading="isPending" @click="onNext">
        {{ submitText ?? t('auth.sendCode') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>
