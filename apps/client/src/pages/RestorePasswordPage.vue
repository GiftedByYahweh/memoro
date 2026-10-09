<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthCard from '@/components/features/auth/AuthCard.vue';
import RestorePasswordForm from '@/components/features/auth/RestorePasswordForm.vue';
import { RoutePaths } from '@/router/routes';

const { t } = useI18n();
</script>

<template>
  <AuthCard
    :link-prompt="t('auth.rememberedPassword')"
    :link-text="t('auth.signInLink')"
    :link-to="RoutePaths.login.path"
  >
    <RestorePasswordForm />
  </AuthCard>
</template>
