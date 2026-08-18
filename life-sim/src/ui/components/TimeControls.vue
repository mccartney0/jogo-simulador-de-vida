<template>
  <div class="time-controls" role="group" :aria-label="t('time.speed')">
    <button class="pause-button" type="button" :aria-pressed="ui.timeScale === 0" @click="togglePause">
      <span aria-hidden="true">{{ ui.timeScale === 0 ? '▶' : 'Ⅱ' }}</span>
      {{ ui.timeScale === 0 ? t('time.play') : t('time.pause') }}
    </button>
    <button v-for="scale in speeds" :key="scale" type="button" :class="{ active: ui.timeScale === scale }" :aria-pressed="ui.timeScale === scale" @click="setScale(scale)">
      {{ scale }}x
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '../store/ui';
import { useI18n } from 'vue-i18n';

const ui = useUiStore();
const { t } = useI18n();
const speeds = [1, 2, 3];

function setScale(scale: number) {
  ui.setTimeScale(scale);
}

function togglePause() {
  ui.setTimeScale(ui.timeScale === 0 ? 1 : 0);
}
</script>

<style scoped>
.time-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 5;
  display: flex;
  gap: 5px;
  padding: 6px;
  transform: translateX(-50%);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 14px;
  background: rgba(9, 18, 34, 0.86);
  box-shadow: 0 14px 32px rgba(2, 8, 23, 0.28);
  backdrop-filter: blur(12px);
}

button {
  min-width: 38px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  padding: 8px 10px;
}

button:hover,
button:focus-visible {
  border-color: rgba(94, 234, 212, 0.35);
  color: #f8fafc;
}

button.active,
.pause-button[aria-pressed='true'] {
  background: rgba(45, 212, 191, 0.16);
  color: #5eead4;
}

.pause-button {
  display: flex;
  align-items: center;
  gap: 6px;
  border-right: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 8px 0 0 8px;
  padding-right: 13px;
}

.pause-button span {
  font-size: 11px;
}

button:focus-visible {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .time-controls {
    bottom: 12px;
  }

  .pause-button {
    padding-right: 9px;
  }

  button {
    min-width: 32px;
    padding: 8px 7px;
  }
}
</style>
