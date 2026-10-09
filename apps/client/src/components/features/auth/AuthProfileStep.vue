<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { UserSex } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import AuthStepLayout from './AuthStepLayout.vue';

const ICON_SIZE_FIELD = 18;

const emit = defineEmits<{
  next: [payload: { username: string; sex: UserSex }];
}>();

const { t } = useI18n();

const username = ref('');
const sex = ref<UserSex | ''>('');
const usernameError = ref<string | undefined>(undefined);
const sexError = ref<string | undefined>(undefined);

const sexOptions = [
  { value: UserSex.MALE, label: t('auth.sexMale') },
  { value: UserSex.FEMALE, label: t('auth.sexFemale') },
  { value: UserSex.OTHER, label: t('auth.sexOther') },
];

function onNext(): void {
  let hasError = false;

  if (!username.value.trim()) {
    usernameError.value = t('validation.usernameRequired');
    hasError = true;
  } else {
    usernameError.value = undefined;
  }

  const selectedSex = sex.value;
  if (!selectedSex) {
    sexError.value = t('validation.sexRequired');
    hasError = true;
  } else {
    sexError.value = undefined;
  }

  if (hasError || !selectedSex) return;

  emit('next', { username: username.value, sex: selectedSex });
}
</script>

<template>
  <AuthStepLayout :title="t('auth.stepProfile')" :show-back="false">
    <AppInput
      id="reg-username"
      v-model="username"
      type="text"
      :label="t('auth.usernameLabel')"
      :placeholder="t('auth.usernamePlaceholder')"
      :error="usernameError"
    >
      <template #icon-left>
        <AppIcon name="user" :size="ICON_SIZE_FIELD" color="secondary" />
      </template>
    </AppInput>

    <div class="sex-section">
      <AppText variant="label" color="secondary">{{ t('auth.sexLabel') }}</AppText>
      <div class="sex-grid">
        <AppButton
          v-for="option in sexOptions"
          :key="option.value"
          :variant="sex === option.value ? 'primary' : 'secondary'"
          size="sm"
          @click="
            sex = option.value;
            sexError = undefined;
          "
        >
          {{ option.label }}
        </AppButton>
      </div>
      <AppText v-if="sexError" variant="body-sm" color="error">
        {{ sexError }}
      </AppText>
    </div>

    <template #actions>
      <AppButton variant="primary" size="lg" block @click="onNext">
        {{ t('auth.continue') }}
      </AppButton>
    </template>
  </AuthStepLayout>
</template>

<style scoped>
.sex-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
}
</style>
