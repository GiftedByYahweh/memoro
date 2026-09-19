<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { UserSex } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import AuthStepLayout from './AuthStepLayout.vue';

const emit = defineEmits<{
  next: [payload: { username: string; gender: string }];
}>();

const { t } = useI18n();

const username = ref('');
const gender = ref<UserSex | ''>('');
const usernameError = ref<string | undefined>(undefined);
const genderError = ref<string | undefined>(undefined);

const genders = [
  { value: UserSex.MALE, label: t('auth.genderMale') },
  { value: UserSex.FEMALE, label: t('auth.genderFemale') },
  { value: UserSex.OTHER, label: t('auth.genderOther') },
];

function onNext(): void {
  let hasError = false;

  if (!username.value.trim()) {
    usernameError.value = t('validation.usernameRequired');
    hasError = true;
  } else {
    usernameError.value = undefined;
  }

  if (!gender.value) {
    genderError.value = t('validation.genderRequired');
    hasError = true;
  } else {
    genderError.value = undefined;
  }

  if (hasError) return;

  emit('next', { username: username.value, gender: gender.value });
}
</script>

<template>
  <AuthStepLayout
    :title="t('auth.stepProfile')"
    :description="t('auth.stepProfileDesc')"
    :show-back="false"
  >
    <AppInput
      id="reg-username"
      v-model="username"
      type="text"
      :label="t('auth.usernameLabel')"
      :placeholder="t('auth.usernamePlaceholder')"
      :error="usernameError"
    >
      <template #icon-left>
        <AppIcon name="user" :size="18" color="secondary" />
      </template>
    </AppInput>

    <div class="gender-section">
      <AppText variant="label" color="secondary">{{ t('auth.genderLabel') }}</AppText>
      <div class="gender-grid">
        <AppButton
          v-for="g in genders"
          :key="g.value"
          :variant="gender === g.value ? 'primary' : 'secondary'"
          size="sm"
          @click="
            gender = g.value;
            genderError = undefined;
          "
        >
          {{ g.label }}
        </AppButton>
      </div>
      <AppText v-if="genderError" variant="body-sm" color="error">
        {{ genderError }}
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
.gender-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.gender-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
}
</style>
