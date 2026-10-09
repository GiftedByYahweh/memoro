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
  width: 100%;
  min-height: 100dvh;
  padding: calc(var(--safe-top) + var(--space-xl)) var(--space-md)
    calc(var(--safe-bottom) + var(--space-xl));
  background-color: var(--color-bg);
  overflow-x: hidden;
}

@media (width >= 600px) {
  .auth-layout {
    background-color: var(--color-bg-subtle);
  }
}
</style>
