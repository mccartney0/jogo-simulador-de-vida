<template>
  <section class="hud" aria-label="HUD">
    <div class="row">
      <h2>{{ t('hud.needs') }}</h2>
      <span class="funds">{{ t('hud.funds') }}: §{{ ui.funds }}</span>
      <span class="time">{{ ui.timeOfDay }}</span>
    </div>
    <ul class="needs">
      <li v-for="(value, key) in ui.needs" :key="key">
        <span class="label">{{ t(`need.${key}`) }}</span>
        <div class="bar">
          <div class="fill" :style="{ width: value + '%' }"></div>
        </div>
      </li>
    </ul>
    <div class="traits" role="list">
      <span>{{ t('hud.traits') }}:</span>
      <span class="trait" v-for="trait in traitNames" :key="trait">{{ trait }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../store/ui';

const ui = useUiStore();
const { t } = useI18n();
const traitNames = computed(() => [t('trait.active'), t('trait.creative'), t('trait.neat')]);
</script>

<style scoped>
.hud {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 12px 16px;
  background: rgba(16, 21, 31, 0.75);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  width: 280px;
  color: #e2e8f0;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.needs {
  list-style: none;
  margin: 12px 0;
  padding: 0;
}

.needs li {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  text-transform: capitalize;
}

.bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #34d399, #10b981);
}

.traits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.trait {
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(148, 163, 184, 0.2);
}
</style>
