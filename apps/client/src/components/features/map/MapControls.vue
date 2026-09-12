<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';
import { MAP_CONTROL_ICON_SIZE, MAP_STYLES, type MapStyleKey } from '@/constants/map.constants';

interface Props {
  activeStyle: MapStyleKey;
  bearing?: number;
  pitch?: number;
  isLocating?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  bearing: 0,
  pitch: 0,
  isLocating: false,
});

const emit = defineEmits<{
  'update:activeStyle': [styleKey: MapStyleKey];
  locate: [];
  togglePitch: [];
  resetNorth: [];
}>();

const { t } = useI18n();
const isLayersOpen = ref(false);
const controlsRef = ref<HTMLElement | null>(null);
const styleOptions = Object.keys(MAP_STYLES) as MapStyleKey[];

const compassTransform = computed(() => {
  return `rotate(${String(-props.bearing)}deg)`;
});

const is3DActive = computed(() => {
  return props.pitch > 0;
});

function toggleLayers(): void {
  isLayersOpen.value = !isLayersOpen.value;
}

function handleSelectStyle(styleKey: MapStyleKey): void {
  emit('update:activeStyle', styleKey);
  isLayersOpen.value = false;
}

function handleOutsideClick(event: MouseEvent): void {
  if (!controlsRef.value || !isLayersOpen.value) return;
  const target = event.target as Node;
  if (!controlsRef.value.contains(target)) {
    isLayersOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div ref="controlsRef" class="map-controls">
    <button
      type="button"
      class="control-btn"
      :class="{ 'is-locating': isLocating }"
      :disabled="isLocating"
      :aria-label="t('map.locate')"
      @click="emit('locate')"
    >
      <AppIcon name="target" :size="MAP_CONTROL_ICON_SIZE.TARGET" color="inherit" />
    </button>

    <div class="layers-wrapper">
      <button
        type="button"
        class="control-btn"
        :class="{ 'is-active': isLayersOpen }"
        :aria-label="t('map.layers')"
        aria-haspopup="true"
        :aria-expanded="isLayersOpen"
        @click.stop="toggleLayers"
      >
        <AppIcon name="layers" :size="MAP_CONTROL_ICON_SIZE.LAYERS" color="inherit" />
      </button>

      <Transition name="dropdown">
        <div v-if="isLayersOpen" class="layers-dropdown" role="menu">
          <button
            v-for="styleKey in styleOptions"
            :key="styleKey"
            type="button"
            class="style-option-btn"
            :class="{ 'is-selected': activeStyle === styleKey }"
            role="menuitem"
            @click="handleSelectStyle(styleKey)"
          >
            <span class="style-dot" />
            <span class="style-name">{{ styleKey }}</span>
          </button>
        </div>
      </Transition>
    </div>

    <button
      type="button"
      class="control-btn"
      :class="{ 'is-active': is3DActive }"
      :aria-label="t('map.view3D')"
      @click="emit('togglePitch')"
    >
      <AppIcon name="navigation" :size="MAP_CONTROL_ICON_SIZE.NAVIGATION" color="inherit" />
    </button>

    <button
      type="button"
      class="control-btn"
      :aria-label="t('map.resetNorth')"
      @click="emit('resetNorth')"
    >
      <span class="compass-wrap" :style="{ transform: compassTransform }">
        <AppIcon name="north" :size="MAP_CONTROL_ICON_SIZE.NORTH" color="inherit" />
      </span>
    </button>
  </div>
</template>

<style scoped>
.map-controls {
  position: absolute;
  top: 50%;
  right: var(--space-md);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  transform: translateY(-50%);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background-color: var(--scrim-overlay);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-pin);
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.control-btn:hover {
  border-color: var(--border-hover);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn.is-active {
  border-color: var(--border-focus);
  color: var(--color-primary);
}

.control-btn.is-locating {
  border-color: var(--border-focus);
  color: var(--color-primary);
  cursor: default;
}

.control-btn.is-locating :deep(.app-icon) {
  animation: locate-pulse 1s ease-in-out infinite alternate;
}

.layers-wrapper {
  position: relative;
}

.layers-dropdown {
  position: absolute;
  top: 50%;
  right: calc(100% + var(--space-xs));
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  min-width: 140px;
  padding: var(--space-2xs);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background-color: var(--scrim-overlay);
  box-shadow: var(--shadow-elevated);
  transform: translateY(-50%);
  backdrop-filter: blur(16px);
}

.style-option-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: var(--space-sm);
  text-align: left;
  text-transform: capitalize;
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.style-option-btn:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.style-option-btn.is-selected {
  background-color: var(--glow-primary);
  color: var(--color-primary);
  font-weight: 600;
}

.style-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: transparent;
  transition: background-color var(--transition-fast);
}

.style-option-btn.is-selected .style-dot {
  background-color: var(--color-primary);
}

.style-name {
  flex: 1;
}

.compass-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(8px);
}

@keyframes locate-pulse {
  from {
    transform: scale(0.85);
    opacity: 0.6;
  }

  to {
    transform: scale(1.15);
    opacity: 1;
  }
}
</style>
