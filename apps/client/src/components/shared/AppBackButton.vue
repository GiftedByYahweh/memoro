<script setup lang="ts">
import AppIcon from './AppIcon.vue';

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button type="button" class="back-btn" aria-label="Назад" @click="emit('click')">
    <AppIcon name="arrowLeft" :size="20" color="primary" />
  </button>
</template>

<style scoped>
.back-btn {
  position: absolute;
  left: 0;
  top: 0;
  padding: var(--space-2xs);
  margin: calc(var(--space-2xs) * -1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.back-btn:hover {
  background-color: var(--color-surface-hover);
}
</style>
