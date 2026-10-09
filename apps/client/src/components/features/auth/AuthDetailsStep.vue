<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { emailSchema, USER_CONSTRAINTS, UserSex, usernameSchema } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppChipGroup, { type ChipOption } from '@/components/shared/AppChipGroup.vue';
import AppInput from '@/components/shared/AppInput.vue';
import { useField } from '@/composables/useField';
import type { StepProgress } from '@/composables/useStepFlow';
import type { AuthDetails } from '@/constants/auth.constants';
import AuthStepLayout from './AuthStepLayout.vue';

interface Props {
  progress: StepProgress;
  initialDetails?: AuthDetails | null;
  isPending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialDetails: null,
  isPending: false,
});

const emit = defineEmits<{
  next: [details: AuthDetails];
}>();

const { t } = useI18n();

const username = useField(usernameSchema, props.initialDetails?.username);
const email = useField(emailSchema, props.initialDetails?.email);
const sex = ref<UserSex | null>(props.initialDetails?.sex ?? null);
const sexError = ref<string | undefined>(undefined);

const sexOptions = computed<ChipOption<UserSex>[]>(() => [
  { value: UserSex.MALE, label: t('auth.sexMale') },
  { value: UserSex.FEMALE, label: t('auth.sexFemale') },
  { value: UserSex.OTHER, label: t('auth.sexOther') },
]);

const isFilled = computed(() => username.value.trim().length > 0 && email.value.length > 0);

function handleSexChange(value: UserSex): void {
  sex.value = value;
  sexError.value = undefined;
}

function handleSubmit(): void {
  if (props.isPending) return;
  const validUsername = username.validate();
  const validEmail = email.validate();
  sexError.value = sex.value ? undefined : t('validation.sexRequired');

  if (!validUsername || !validEmail || !sex.value) return;
  emit('next', { username: validUsername, email: validEmail, sex: sex.value });
}
</script>

<template>
  <AuthStepLayout :title="t('auth.registerTitle')" :progress="progress" @submit="handleSubmit">
    <AppInput
      id="registration-username"
      v-model="username.value"
      name="username"
      autocomplete="username"
      icon="user"
      :placeholder="t('auth.usernamePlaceholder')"
      :maxlength="USER_CONSTRAINTS.USERNAME_MAX_LENGTH"
      :error="username.error"
    />
    <AppInput
      id="registration-email"
      v-model="email.value"
      type="email"
      name="email"
      autocomplete="email"
      icon="mail"
      :placeholder="t('auth.emailPlaceholder')"
      :error="email.error"
    />
    <AppChipGroup
      :model-value="sex"
      :options="sexOptions"
      :aria-label="t('auth.sexLabel')"
      :error="sexError"
      @update:model-value="handleSexChange"
    />

    <template #actions>
      <AppButton type="submit" size="lg" block :loading="isPending" :disabled="!isFilled">
        {{ t('auth.next') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>
