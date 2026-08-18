<template>
  <Transition name="guide-fade">
    <aside v-if="ui.onboardingVisible" class="guide-panel" aria-labelledby="guide-title">
      <button class="close-button" type="button" :aria-label="t('guide.close')" @click="ui.dismissOnboarding()">
        ×
      </button>
      <span class="eyebrow">{{ t('guide.eyebrow') }}</span>
      <h2 id="guide-title">{{ t('guide.title') }}</h2>
      <p class="description">{{ t('guide.description') }}</p>

      <ol class="steps">
        <li>
          <span class="step-number">1</span>
          <div>
            <strong>{{ t('guide.stepBuildTitle') }}</strong>
            <span>{{ t('guide.stepBuildText') }}</span>
          </div>
        </li>
        <li>
          <span class="step-number">2</span>
          <div>
            <strong>{{ t('guide.stepMoveTitle') }}</strong>
            <span>{{ t('guide.stepMoveText') }}</span>
          </div>
        </li>
        <li>
          <span class="step-number">3</span>
          <div>
            <strong>{{ t('guide.stepTimeTitle') }}</strong>
            <span>{{ t('guide.stepTimeText') }}</span>
          </div>
        </li>
      </ol>

      <button class="primary-action" type="button" @click="openBuildMode">
        {{ t('guide.cta') }}
      </button>
      <button class="text-action" type="button" @click="ui.dismissOnboarding()">
        {{ t('guide.later') }}
      </button>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../store/ui';

const ui = useUiStore();
const { t } = useI18n();

function openBuildMode() {
  ui.setBuildMode(true);
  ui.dismissOnboarding();
}
</script>

<style scoped>
.guide-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 8;
  width: min(390px, calc(100vw - 32px));
  padding: 24px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  background: linear-gradient(150deg, rgba(15, 23, 42, 0.96), rgba(22, 52, 68, 0.95));
  box-shadow: 0 24px 80px rgba(2, 8, 23, 0.5), inset 0 1px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  color: #f8fafc;
}

.close-button {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(226, 232, 240, 0.14);
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.45);
  color: #cbd5e1;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.close-button:hover,
.close-button:focus-visible {
  border-color: rgba(251, 191, 36, 0.7);
  color: #fef3c7;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #fbbf24;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(24px, 4vw, 32px);
  letter-spacing: -0.04em;
}

.description {
  margin: 10px 0 20px;
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.55;
}

.steps {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.steps li {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  align-items: start;
  padding: 11px 12px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.32);
}

.step-number {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 10px;
  background: rgba(45, 212, 191, 0.18);
  color: #5eead4;
  font-size: 13px;
  font-weight: 800;
}

.steps strong,
.steps span:not(.step-number) {
  display: block;
}

.steps strong {
  margin-bottom: 3px;
  color: #f8fafc;
  font-size: 13px;
}

.steps span:not(.step-number) {
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.4;
}

.primary-action,
.text-action {
  width: 100%;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  font-weight: 750;
}

.primary-action {
  margin-top: 20px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  box-shadow: 0 8px 22px rgba(249, 115, 22, 0.24);
  color: #431407;
}

.primary-action:hover,
.primary-action:focus-visible {
  filter: brightness(1.08);
}

.text-action {
  margin-top: 8px;
  padding: 8px;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
}

.text-action:hover,
.text-action:focus-visible {
  color: #f8fafc;
}

button:focus-visible {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}

.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -46%);
}

@media (max-width: 640px) {
  .guide-panel {
    padding: 20px;
  }
}
</style>
