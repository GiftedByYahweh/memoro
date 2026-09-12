<script setup lang="ts"></script>

<template>
  <main class="map-page">
    <div class="map-container" />
  </main>
</template>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  background-color: var(--color-oled-black);
}

.map-container {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
