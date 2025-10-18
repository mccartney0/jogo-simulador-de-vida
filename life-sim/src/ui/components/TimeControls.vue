<template>
  <div class="time-controls" role="group" aria-label="Time controls">
    <button @click="() => setScale(0)">{{ t('time.pause') }}</button>
    <button @click="() => setScale(1)">1x</button>
    <button @click="() => setScale(2)">2x</button>
    <button @click="() => setScale(3)">3x</button>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '../store/ui';
import { useI18n } from 'vue-i18n';

const ui = useUiStore();
const { t } = useI18n();

function setScale(scale: number) {
  ui.setTimeScale(scale);
}
</script>

<style scoped>
.time-controls {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.72);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  gap: 6px;
}

button {
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.2);
  color: #f8fafc;
  cursor: pointer;
}

button:focus {
  outline: 2px solid #f59e0b;
}
</style>
