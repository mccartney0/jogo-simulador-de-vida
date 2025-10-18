<template>
  <div class="toolbar" role="toolbar" aria-label="Build buy toolbar">
    <button class="primary" @click="toggle" :aria-pressed="ui.buildMode">
      {{ t('toolbar.build') }}
    </button>
    <button @click="exit" v-if="ui.buildMode">{{ t('toolbar.exit') }}</button>
    <span class="budget">{{ t('toolbar.budget') }}: §{{ ui.funds }}</span>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '../store/ui';
import { useI18n } from 'vue-i18n';

const ui = useUiStore();
const { t } = useI18n();

function toggle() {
  ui.toggleBuildMode();
}

function exit() {
  ui.setBuildMode(false);
}
</script>

<style scoped>
.toolbar {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(16, 21, 31, 0.7);
  padding: 10px 16px;
  border-radius: 12px;
  color: #f8fafc;
}

button {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  color: inherit;
}

button.primary {
  background: linear-gradient(90deg, #38bdf8, #6366f1);
}

button:focus {
  outline: 2px solid #f59e0b;
}

.budget {
  font-weight: 600;
}
</style>
