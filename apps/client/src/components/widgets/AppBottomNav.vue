<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppIcon from '@/components/shared/AppIcon.vue';
import { NAV_ITEMS_LEFT, NAV_ITEMS_RIGHT } from '@/constants/nav.constants';

const emit = defineEmits<{
  create: [];
}>();

function handleCreate(): void {
  emit('create');
}
</script>

<template>
  <nav class="bottom-nav" aria-label="Main Navigation">
    <div class="nav-container">
      <div class="nav-group">
        <RouterLink
          v-for="item in NAV_ITEMS_LEFT"
          :key="item.id"
          :to="item.path"
          class="nav-item"
          exact-active-class="is-active"
        >
          <AppIcon :name="item.icon" :size="22" color="inherit" />
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="fab-wrap">
        <button type="button" class="fab-btn" aria-label="Add memory" @click="handleCreate">
          <AppIcon name="plus" :size="24" color="inherit" />
        </button>
      </div>

      <div class="nav-group">
        <RouterLink
          v-for="item in NAV_ITEMS_RIGHT"
          :key="item.id"
          :to="item.path"
          class="nav-item"
          exact-active-class="is-active"
        >
          <AppIcon :name="item.icon" :size="22" color="inherit" />
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--scrim-overlay);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-subtle);
  padding-bottom: var(--safe-bottom);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--bottom-nav-height);
  max-width: 600px;
  margin: 0 auto;
  padding: 0 var(--space-xs);
}

.nav-group {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-around;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  padding: var(--space-xs);
  min-width: 56px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.nav-item:hover {
  color: var(--color-text-primary);
}

.nav-item.is-active {
  color: var(--color-primary);
}

.nav-label {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.nav-item.is-active .nav-label {
  font-weight: 600;
}

.fab-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-xs);
}

.fab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    background-color var(--transition-fast);
}

.fab-btn:hover {
  background-color: var(--color-primary-hover);
  transform: scale(1.05);
}

.fab-btn:active {
  transform: scale(0.95);
}
</style>
