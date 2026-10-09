<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthCard from '@/components/features/auth/AuthCard.vue';
import LoginForm from '@/components/features/auth/LoginForm.vue';
import { RoutePaths } from '@/router/routes';

const { t } = useI18n();
</script>

<template>
  <AuthCard
    :link-prompt="t('auth.noAccount')"
    :link-text="t('auth.signUpLink')"
    :link-to="RoutePaths.registration.path"
  >
    <LoginForm />
  </AuthCard>
</template>
