<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AppToast from '@/components/shared/AppToast.vue';
import { appLayouts } from '@/router/routes';

const route = useRoute();

const layoutComponent = computed(() => {
  return route.meta.layout === appLayouts.auth ? AuthLayout : MainLayout;
});
</script>

<template>
  <component :is="layoutComponent">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </component>
  <AppToast />
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition:
    opacity var(--transition-page),
    transform var(--transition-page);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
