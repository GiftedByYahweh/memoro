<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  width: 100%;
  padding: var(--space-xl) var(--space-md);
  background-color: var(--color-oled-black);
  overflow-x: hidden;
}
</style>
