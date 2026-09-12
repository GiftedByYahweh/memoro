<script setup lang="ts">
import { computed, markRaw, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppTabs, { type TabItem } from '@/components/shared/AppTabs.vue';
import AuthFooter from '@/components/features/auth/AuthFooter.vue';
import AuthHeader from '@/components/features/auth/AuthHeader.vue';
import LoginForm from '@/components/features/auth/LoginForm.vue';
import RegisterForm from '@/components/features/auth/RegisterForm.vue';

const AUTH_TABS = {
  LOGIN: 'login',
  REGISTER: 'register',
} as const;

type AuthTab = (typeof AUTH_TABS)[keyof typeof AUTH_TABS];

const { t } = useI18n();

const activeTab = ref<AuthTab>(AUTH_TABS.LOGIN);

const isRegister = computed(() => activeTab.value === AUTH_TABS.REGISTER);

const authTabs = computed<TabItem[]>(() => [
  {
    id: AUTH_TABS.LOGIN,
    label: t('auth.signIn'),
    component: markRaw(LoginForm),
  },
  {
    id: AUTH_TABS.REGISTER,
    label: t('auth.createAccount'),
    component: markRaw(RegisterForm),
  },
]);

function handleTabSuccess(): void {
  activeTab.value = AUTH_TABS.LOGIN;
}
</script>

<template>
  <main class="auth-page">
    <div class="ambient-glow" aria-hidden="true" />
    <AuthHeader :is-register="isRegister" />
    <AppTabs v-model="activeTab" :tabs="authTabs" @tab-success="handleTabSuccess" />
    <AuthFooter />
  </main>
</template>

<style scoped>
.auth-page {
  position: relative;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.ambient-glow {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  height: 520px;
  border-radius: var(--radius-full);
  background: radial-gradient(
    circle,
    var(--glow-primary) 0%,
    var(--glow-primary-subtle) 35%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
</style>
