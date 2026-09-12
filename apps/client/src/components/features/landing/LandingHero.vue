<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';

interface Props {
  isStandalone: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  install: [];
  navigateApp: [];
}>();

const { t } = useI18n();

function handleInstall(): void {
  emit('install');
}

function handleNavigateApp(): void {
  emit('navigateApp');
}
</script>

<template>
  <section class="landing-hero">
    <div class="logo-wrapper">
      <div class="logo-glow" />
      <div class="logo-circle">
        <AppIcon name="logo" :size="48" color="accent" />
      </div>
    </div>

    <div class="badge-container">
      <span class="badge-dot" />
      <span class="badge-text">{{ t('landing.badge') }}</span>
    </div>

    <h1 class="hero-title">{{ t('landing.title') }}</h1>
    <p class="hero-subtitle">{{ t('landing.subtitle') }}</p>

    <div class="hero-actions">
      <template v-if="isStandalone">
        <AppButton variant="primary" size="lg" block @click="handleNavigateApp">
          <template #icon-left>
            <AppIcon name="compass" :size="20" />
          </template>
          {{ t('landing.openApp') }}
        </AppButton>
      </template>

      <template v-else>
        <AppButton variant="primary" size="lg" block @click="handleInstall">
          <template #icon-left>
            <AppIcon name="download" :size="20" />
          </template>
          {{ t('landing.installApp') }}
        </AppButton>

        <AppButton variant="ghost" size="md" block @click="handleNavigateApp">
          {{ t('landing.openInBrowser') }}
        </AppButton>
      </template>
    </div>
  </section>
</template>

<style scoped>
.landing-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-lg);
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

.logo-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-xs);
}

.logo-glow {
  position: absolute;
  width: 96px;
  height: 96px;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  filter: blur(36px);
  opacity: 0.35;
  pointer-events: none;
}

.logo-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-focus-primary);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-fab);
}

.badge-container {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-2xs) var(--space-sm);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
}

.badge-dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px var(--color-primary);
}

.badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  margin-top: var(--space-xs);
}
</style>
