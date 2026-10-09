<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppIconButton from '@/components/shared/AppIconButton.vue';
import { MAP_STYLES, type MapStyleKey } from '@/constants/map.constants';

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

const STYLE_OPTIONS = Object.keys(MAP_STYLES) as MapStyleKey[];

const { t } = useI18n();
const isLayersOpen = ref(false);
const controlsRef = ref<HTMLElement | null>(null);

const compassTransform = computed(() => `rotate(${String(-props.bearing)}deg)`);
const is3DActive = computed(() => props.pitch > 0);

function handleSelectStyle(styleKey: MapStyleKey): void {
  emit('update:activeStyle', styleKey);
  isLayersOpen.value = false;
}

function handleOutsideClick(event: MouseEvent): void {
  if (!isLayersOpen.value || !controlsRef.value) return;
  if (!controlsRef.value.contains(event.target as Node)) isLayersOpen.value = false;
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
    <div class="layers-wrapper">
      <AppIconButton
        variant="floating"
        size="lg"
        icon="layers"
        :label="t('map.layers')"
        :active="isLayersOpen"
        aria-haspopup="true"
        :aria-expanded="isLayersOpen"
        @click.stop="isLayersOpen = !isLayersOpen"
      />
      <Transition name="dropdown">
        <div v-if="isLayersOpen" class="layers-menu" role="menu">
          <button
            v-for="styleKey in STYLE_OPTIONS"
            :key="styleKey"
            type="button"
            role="menuitemradio"
            :aria-checked="activeStyle === styleKey"
            :class="['layers-option', { 'is-selected': activeStyle === styleKey }]"
            @click="handleSelectStyle(styleKey)"
          >
            <span>{{ t(`map.styles.${styleKey}`) }}</span>
            <AppIcon v-if="activeStyle === styleKey" name="check" :size="18" />
          </button>
        </div>
      </Transition>
    </div>

    <AppIconButton
      variant="floating"
      size="lg"
      icon="view3d"
      :label="t('map.view3D')"
      :active="is3DActive"
      @click="emit('togglePitch')"
    />

    <AppIconButton
      variant="floating"
      size="lg"
      :label="t('map.resetNorth')"
      @click="emit('resetNorth')"
    >
      <span class="compass" :style="{ transform: compassTransform }">
        <AppIcon name="north" :size="24" />
      </span>
    </AppIconButton>

    <AppIconButton
      variant="floating"
      size="lg"
      icon="target"
      :label="t('map.locate')"
      :active="isLocating"
      :class="{ 'is-locating': isLocating }"
      :disabled="isLocating"
      @click="emit('locate')"
    />
  </div>
</template>

<style scoped>
.map-controls {
  position: absolute;
  right: var(--space-md);
  bottom: calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-md));
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.layers-wrapper {
  position: relative;
}

.layers-menu {
  position: absolute;
  top: 0;
  right: calc(100% + var(--space-xs));
  display: flex;
  flex-direction: column;
  min-width: 168px;
  padding: var(--space-2xs) 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-2);
}

.layers-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  height: 40px;
  padding: 0 var(--space-md);
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  text-align: left;
  outline: none;
}

.layers-option:hover,
.layers-option:focus-visible {
  background-color: var(--color-state-hover);
}

.layers-option.is-selected {
  color: var(--color-primary);
  font-weight: 500;
}

.compass {
  display: flex;
  transition: transform var(--transition-fast);
}

.is-locating :deep(.app-icon) {
  animation: locate-pulse 1s ease-in-out infinite alternate;
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
  transform: translateX(8px);
}

@keyframes locate-pulse {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 1;
  }
}
</style>
