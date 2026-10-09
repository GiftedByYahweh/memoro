<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';
import { NAV_ITEMS_LEFT, NAV_ITEMS_RIGHT } from '@/constants/nav.constants';
import { RoutePaths } from '@/router/routes';
import AppNavItem from './AppNavItem.vue';

const { t } = useI18n();
</script>

<template>
  <nav class="bottom-nav" :aria-label="t('nav.mainNavigation')">
    <div class="nav-container">
      <AppNavItem
        v-for="item in NAV_ITEMS_LEFT"
        :key="item.id"
        :to="item.path"
        :icon="item.icon"
        :label="t(item.labelKey)"
      />
      <RouterLink
        :to="RoutePaths.createMedia.path"
        class="fab-btn"
        :aria-label="t('nav.addMemory')"
      >
        <AppIcon name="plus" :size="24" />
      </RouterLink>
      <AppNavItem
        v-for="item in NAV_ITEMS_RIGHT"
        :key="item.id"
        :to="item.path"
        :icon="item.icon"
        :label="t(item.labelKey)"
      />
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding-bottom: var(--safe-bottom);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.nav-container {
  display: flex;
  align-items: center;
  max-width: 600px;
  height: var(--bottom-nav-height);
  margin: 0 auto;
  padding: 0 var(--space-xs);
}

.fab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  margin: 0 var(--space-xs);
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  outline: none;
  transition: background-color var(--transition-fast);
}

.fab-btn:hover {
  background-color: var(--color-primary-hover);
}

.fab-btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
</style>
