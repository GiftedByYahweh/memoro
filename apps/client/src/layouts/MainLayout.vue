<script setup lang="ts">
import { useRoute } from 'vue-router';
import AppBottomNav from '@/components/widgets/AppBottomNav.vue';

const route = useRoute();
</script>

<template>
  <div :class="['main-layout', { 'has-nav': !route.meta.hideNav }]">
    <slot />
    <AppBottomNav v-if="!route.meta.hideNav" />
  </div>
</template>

<style scoped>
.main-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100dvh;
}
</style>
