<script setup lang="ts">
interface Props {
  size?: number;
}

withDefaults(defineProps<Props>(), {
  size: 20,
});
</script>

<template>
  <span
    class="app-spinner"
    role="status"
    :style="{ width: `${String(size)}px`, height: `${String(size)}px` }"
  />
</template>

<style scoped>
.app-spinner {
  display: inline-block;
  flex-shrink: 0;
  border: 2px solid var(--spinner-track);
  border-top-color: currentcolor;
  border-radius: var(--radius-full);
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
