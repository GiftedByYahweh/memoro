<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { IconName } from '@/assets/icons';
import AppIcon from '@/components/shared/AppIcon.vue';

interface FeatureItem {
  icon: IconName;
  titleKey: string;
  descKey: string;
}

const FEATURES: readonly FeatureItem[] = [
  { icon: 'compass', titleKey: 'landing.features.geoTitle', descKey: 'landing.features.geoDesc' },
  { icon: 'download', titleKey: 'landing.features.pwaTitle', descKey: 'landing.features.pwaDesc' },
  {
    icon: 'shield',
    titleKey: 'landing.features.privacyTitle',
    descKey: 'landing.features.privacyDesc',
  },
];

const { t } = useI18n();
</script>

<template>
  <ul class="landing-features">
    <li v-for="item in FEATURES" :key="item.titleKey" class="feature">
      <span class="feature-icon">
        <AppIcon :name="item.icon" :size="20" />
      </span>
      <div class="feature-text">
        <h2 class="feature-title">{{ t(item.titleKey) }}</h2>
        <p class="feature-desc">{{ t(item.descKey) }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.landing-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  width: 100%;
  margin: 0;
  padding: var(--space-xl) 0 0;
  border-top: 1px solid var(--color-border);
  list-style: none;
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-title {
  margin: 0;
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--color-text-primary);
}

.feature-desc {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
</style>
