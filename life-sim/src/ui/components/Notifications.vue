<template>
  <div class="notifications" aria-live="assertive">
    <div v-for="note in ui.notifications" :key="note.id" class="note" :data-level="note.level">
      {{ t(`notifications.${note.messageKey}`) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '../store/ui';
import { useI18n } from 'vue-i18n';

const ui = useUiStore();
const { t } = useI18n();
</script>

<style scoped>
.notifications {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note {
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.8);
  color: #f8fafc;
  min-width: 200px;
  text-align: center;
}

.note[data-level='warning'] {
  background: rgba(251, 191, 36, 0.8);
  color: #0f172a;
}

.note[data-level='critical'] {
  background: rgba(248, 113, 113, 0.85);
  color: #0f172a;
}
</style>
