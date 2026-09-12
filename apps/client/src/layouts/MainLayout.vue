<script setup lang="ts">
import AppBottomNav from '@/components/widgets/AppBottomNav.vue';
</script>

<template>
  <div class="main-layout">
    <slot />
    <AppBottomNav />
  </div>
</template>

<style scoped>
.main-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
}
</style>
