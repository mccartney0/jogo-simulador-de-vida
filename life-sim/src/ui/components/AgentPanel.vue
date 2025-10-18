<template>
  <div class="agent-panel" aria-live="polite">
    <h3>{{ t('agent.title') }}</h3>
    <div class="row">
      <span>{{ t('agent.autonomy') }}</span>
      <button @click="toggle">{{ ui.autonomous ? t('hud.autonomyOn') : t('hud.autonomyOff') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '../store/ui';
import { useI18n } from 'vue-i18n';

const ui = useUiStore();
const { t } = useI18n();

function toggle() {
  ui.setAutonomous(!ui.autonomous);
}
</script>

<style scoped>
.agent-panel {
  position: absolute;
  right: 24px;
  top: 24px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.72);
  border-radius: 12px;
  color: #f8fafc;
  width: 220px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

button {
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: rgba(56, 189, 248, 0.3);
  color: inherit;
}
</style>
