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
</script>

<template>
  <section class="landing-hero">
    <AppIcon name="logo" :size="72" />
    <h1 class="hero-title">{{ t('landing.title') }}</h1>
    <p class="hero-subtitle">{{ t('landing.subtitle') }}</p>

    <div class="hero-actions">
      <AppButton v-if="isStandalone" size="lg" block @click="emit('navigateApp')">
        {{ t('landing.openApp') }}
      </AppButton>
      <template v-else>
        <AppButton size="lg" block @click="emit('install')">
          <template #icon-left>
            <AppIcon name="download" :size="20" />
          </template>
          {{ t('landing.installApp') }}
        </AppButton>
        <AppButton variant="ghost" size="lg" block @click="emit('navigateApp')">
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
  gap: var(--space-sm);
  width: 100%;
  text-align: center;
}

.hero-title {
  margin: var(--space-xs) 0 0;
  font-size: var(--text-2xl);
  font-weight: 400;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.hero-subtitle {
  margin: 0;
  font-size: var(--text-md);
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;
  margin-top: var(--space-md);
}
</style>
