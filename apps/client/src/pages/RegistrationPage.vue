<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthCard from '@/components/features/auth/AuthCard.vue';
import RegistrationForm from '@/components/features/auth/RegistrationForm.vue';
import { RoutePaths } from '@/router/routes';

const { t } = useI18n();
</script>

<template>
  <AuthCard
    :link-prompt="t('auth.haveAccount')"
    :link-text="t('auth.signInLink')"
    :link-to="RoutePaths.login.path"
  >
    <RegistrationForm />
  </AuthCard>
</template>
