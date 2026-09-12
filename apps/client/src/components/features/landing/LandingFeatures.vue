<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';
import type { IconName } from '@/assets/icons';

interface FeatureItem {
  icon: IconName;
  titleKey: string;
  descKey: string;
}

const { t } = useI18n();

const features: FeatureItem[] = [
  {
    icon: 'compass',
    titleKey: 'landing.features.geoTitle',
    descKey: 'landing.features.geoDesc',
  },
  {
    icon: 'download',
    titleKey: 'landing.features.pwaTitle',
    descKey: 'landing.features.pwaDesc',
  },
  {
    icon: 'shield',
    titleKey: 'landing.features.privacyTitle',
    descKey: 'landing.features.privacyDesc',
  },
];
</script>

<template>
  <section class="landing-features">
    <div v-for="item in features" :key="item.titleKey" class="feature-card">
      <div class="feature-icon-wrapper">
        <AppIcon :name="item.icon" :size="20" color="accent" />
      </div>
      <div class="feature-info">
        <h3 class="feature-title">{{ t(item.titleKey) }}</h3>
        <p class="feature-desc">{{ t(item.descKey) }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  transition: border-color var(--transition-fast);
}

.feature-card:hover {
  border-color: var(--border-subtle-hover);
}

.feature-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  background-color: var(--glow-primary);
  border: 1px solid var(--border-focus-primary);
}

.feature-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  text-align: left;
}

.feature-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.feature-desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}
</style>
