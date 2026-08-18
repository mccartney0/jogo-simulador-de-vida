<template>
  <section class="hud" aria-label="HUD">
    <div class="hud-heading">
      <div>
        <span class="eyebrow">{{ t('hud.status') }}</span>
        <h2>{{ t('hud.needs') }}</h2>
      </div>
      <div class="time-block">
        <strong>{{ ui.timeOfDay }}</strong>
        <span>{{ t('hud.day') }} 1</span>
      </div>
    </div>

    <div class="resource-row">
      <span class="resource-label">{{ t('hud.funds') }}</span>
      <strong>§{{ ui.funds.toLocaleString() }}</strong>
    </div>

    <ul class="needs">
      <li v-for="need in needEntries" :key="need.key" class="need-item" :data-state="need.status">
        <div class="need-meta">
          <span class="label">{{ t(`need.${need.key}`) }}</span>
          <strong>{{ Math.round(need.value) }}%</strong>
        </div>
        <div class="bar" role="progressbar" :aria-valuenow="Math.round(need.value)" aria-valuemin="0" aria-valuemax="100">
          <div class="fill" :style="{ width: `${need.value}%` }"></div>
        </div>
        <span class="state-label">{{ t(`needStatus.${need.status}`) }}</span>
      </li>
    </ul>

    <div class="traits" role="list">
      <span class="traits-label">{{ t('hud.traits') }}</span>
      <span class="trait" v-for="trait in traitNames" :key="trait">{{ trait }}</span>
    </div>
    <p class="help-text">{{ t('hud.help') }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../store/ui';

type NeedKey = 'hunger' | 'energy' | 'bladder' | 'hygiene' | 'fun' | 'social';
type NeedStatus = 'critical' | 'low' | 'ok' | 'good';

const ui = useUiStore();
const { t } = useI18n();
const traitNames = computed(() => [t('trait.active'), t('trait.creative'), t('trait.neat')]);
const needEntries = computed(() =>
  (Object.entries(ui.needs) as Array<[NeedKey, number]>).map(([key, value]) => ({
    key,
    value,
    status: getStatus(value)
  }))
);

function getStatus(value: number): NeedStatus {
  if (value < 20) return 'critical';
  if (value < 45) return 'low';
  if (value < 70) return 'ok';
  return 'good';
}
</script>

<style scoped>
.hud {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 4;
  width: min(320px, calc(100vw - 36px));
  padding: 17px 18px 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(9, 18, 34, 0.92), rgba(18, 44, 58, 0.8));
  box-shadow: 0 18px 45px rgba(2, 8, 23, 0.22), inset 0 1px rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  backdrop-filter: blur(14px);
}

.hud-heading,
.resource-row,
.need-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  display: block;
  margin-bottom: 3px;
  color: #5eead4;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 21px;
  letter-spacing: -0.04em;
}

.time-block {
  display: grid;
  justify-items: end;
  gap: 2px;
}

.time-block strong {
  color: #fef3c7;
  font-size: 18px;
  letter-spacing: -0.03em;
}

.time-block span {
  color: #94a3b8;
  font-size: 10px;
}

.resource-row {
  margin-top: 15px;
  padding: 9px 10px;
  border: 1px solid rgba(251, 191, 36, 0.12);
  border-radius: 11px;
  background: rgba(251, 191, 36, 0.08);
}

.resource-label {
  color: #cbd5e1;
  font-size: 12px;
}

.resource-row strong {
  color: #fcd34d;
  font-size: 14px;
}

.needs {
  display: grid;
  gap: 9px;
  margin: 16px 0;
  padding: 0;
  list-style: none;
}

.need-meta {
  margin-bottom: 5px;
}

.label {
  color: #cbd5e1;
  font-size: 12px;
}

.need-meta strong {
  color: #f8fafc;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.bar {
  height: 7px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(148, 163, 184, 0.16);
}

.fill {
  height: 100%;
  min-width: 3px;
  border-radius: inherit;
  background: linear-gradient(90deg, #2dd4bf, #4ade80);
  transition: width 240ms ease, background 240ms ease;
}

.state-label {
  display: block;
  margin-top: 3px;
  color: #64748b;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.need-item[data-state='low'] .fill {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.need-item[data-state='low'] .state-label {
  color: #fbbf24;
}

.need-item[data-state='critical'] .fill {
  background: linear-gradient(90deg, #fb7185, #ef4444);
}

.need-item[data-state='critical'] .state-label {
  color: #fb7185;
}

.traits {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.traits-label {
  margin-right: 2px;
  color: #64748b;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.trait {
  padding: 4px 7px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 7px;
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5e1;
  font-size: 10px;
}

.help-text {
  margin: 12px 0 0;
  color: #64748b;
  font-size: 10px;
}

@media (max-width: 640px) {
  .hud {
    top: 10px;
    left: 10px;
    width: min(290px, calc(100vw - 20px));
    padding: 13px 14px;
  }

  .needs {
    gap: 7px;
    margin: 12px 0;
  }
}
</style>
