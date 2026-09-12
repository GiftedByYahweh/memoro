<template>
  <div class="main-layout">
    <slot />
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
