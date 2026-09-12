<script setup lang="ts">
import AppIcon from '@/components/shared/AppIcon.vue';
</script>

<template>
  <main class="feed-page">
    <header class="page-header">
      <h1 class="page-title">Feed</h1>
    </header>
    <div class="empty-state">
      <div class="empty-icon-wrap">
        <AppIcon name="book" :size="32" color="tertiary" />
      </div>
      <p class="empty-title">No memories yet</p>
      <p class="empty-description">Capture moments on the map to see your timeline here.</p>
    </div>
  </main>
</template>

<style scoped>
.feed-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-oled-black);
  padding: var(--space-xl) var(--space-md)
    calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-xl));
  box-sizing: border-box;
}

.page-header {
  margin-bottom: var(--space-2xl);
}

.page-title {
  font-family: var(--font-sans);
  font-size: var(--space-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  gap: var(--space-xs);
}

.empty-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  margin-bottom: var(--space-xs);
}

.empty-title {
  font-family: var(--font-sans);
  font-size: var(--space-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-description {
  font-family: var(--font-sans);
  font-size: var(--space-sm);
  color: var(--color-text-tertiary);
  margin: 0;
  max-width: 280px;
}
</style>
