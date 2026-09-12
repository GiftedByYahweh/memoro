<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';

const TRANSITION_SLIDE_LEFT = 'form-slide-left';
const TRANSITION_SLIDE_RIGHT = 'form-slide-right';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  component?: Component;
}

interface Props {
  tabs: TabItem[];
  modelValue?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  'tab-success': [tabId: string];
}>();

const transitionName = ref(TRANSITION_SLIDE_LEFT);

const currentTab = computed({
  get(): string {
    if (props.modelValue !== undefined) {
      return props.modelValue;
    }
    return props.tabs[0]?.id ?? '';
  },
  set(value: string): void {
    emit('update:modelValue', value);
    emit('change', value);
  },
});

const activeIndex = computed(() => {
  return props.tabs.findIndex((tab) => tab.id === currentTab.value);
});

const activeTabItem = computed(() => {
  return props.tabs.find((tab) => tab.id === currentTab.value);
});

const hasComponents = computed(() => {
  return props.tabs.some((tab) => Boolean(tab.component));
});

const indicatorWidth = computed(() => {
  const count = props.tabs.length;
  if (count === 0) return '0%';
  return `calc((100% - (var(--space-2xs) * 2)) / ${String(count)})`;
});

const indicatorTransform = computed(() => {
  const index = activeIndex.value >= 0 ? activeIndex.value : 0;
  return `translateX(${String(index * 100)}%)`;
});

function selectTab(id: string): void {
  if (id === currentTab.value) return;
  const newIndex = props.tabs.findIndex((tab) => tab.id === id);
  const oldIndex = activeIndex.value;
  transitionName.value = newIndex > oldIndex ? TRANSITION_SLIDE_LEFT : TRANSITION_SLIDE_RIGHT;
  currentTab.value = id;
}

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (!newVal || newVal === oldVal) return;
    const newIndex = props.tabs.findIndex((tab) => tab.id === newVal);
    const oldIndex = props.tabs.findIndex((tab) => tab.id === oldVal);
    if (newIndex >= 0 && oldIndex >= 0) {
      transitionName.value = newIndex > oldIndex ? TRANSITION_SLIDE_LEFT : TRANSITION_SLIDE_RIGHT;
    }
  },
);

const panelContainer = ref<HTMLElement | null>(null);

function onBeforeLeave(): void {
  if (!panelContainer.value) return;
  panelContainer.value.style.height = `${String(panelContainer.value.offsetHeight)}px`;
}

function onEnter(el: Element): void {
  if (!panelContainer.value) return;
  const htmlEl = el as HTMLElement;
  panelContainer.value.style.height = `${String(htmlEl.offsetHeight)}px`;
}

function onAfterEnter(): void {
  if (!panelContainer.value) return;
  panelContainer.value.style.height = '';
}
</script>

<template>
  <div class="app-tabs">
    <div class="tabs-header" role="tablist">
      <div
        v-if="activeIndex >= 0"
        class="tab-indicator"
        :style="{
          width: indicatorWidth,
          transform: indicatorTransform,
        }"
        aria-hidden="true"
      />
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="['tab-btn', { 'is-active': tab.id === currentTab }]"
        role="tab"
        :aria-selected="tab.id === currentTab"
        @click="selectTab(tab.id)"
      >
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div v-if="hasComponents || $slots.default" ref="panelContainer" class="tab-panel-container">
      <Transition
        :name="transitionName"
        mode="out-in"
        @before-leave="onBeforeLeave"
        @enter="onEnter"
        @after-enter="onAfterEnter"
      >
        <component
          :is="activeTabItem?.component"
          v-if="activeTabItem?.component"
          :key="activeTabItem.id"
          @success="emit('tab-success', activeTabItem.id)"
        />
        <slot v-else :name="currentTab" :tab="activeTabItem" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.app-tabs {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-header {
  position: relative;
  width: 100%;
  display: flex;
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: var(--space-2xs);
  margin-bottom: var(--space-xl);
  user-select: none;
}

.tab-indicator {
  position: absolute;
  top: var(--space-2xs);
  bottom: var(--space-2xs);
  left: var(--space-2xs);
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: transform var(--transition-normal);
  pointer-events: none;
  will-change: transform;
}

.tab-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: var(--space-xs) 0;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    color var(--transition-normal),
    font-weight var(--transition-normal);
  outline: none;
  text-align: center;
}

.tab-btn.is-active {
  color: var(--color-text-inverse);
  font-weight: 600;
}

.tab-label {
  display: block;
}

.tab-panel-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: height var(--transition-fast);
  will-change: height;
}

.form-slide-left-enter-active,
.form-slide-left-leave-active,
.form-slide-right-enter-active,
.form-slide-right-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.form-slide-left-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.form-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.form-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}

.form-slide-right-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
