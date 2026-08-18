<template>
  <div class="app-shell" :class="{ 'build-mode': uiStore.buildMode }">
    <div ref="canvasHost" class="game-canvas" aria-label="Isometric life simulation canvas"></div>
    <HudPanel />
    <BuildBuyToolbar />
    <ObjectPalette />
    <AgentPanel />
    <GuidePanel />
    <TimeControls />
    <Notifications />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUiStore } from './ui/store/ui';
import HudPanel from './ui/components/HudPanel.vue';
import BuildBuyToolbar from './ui/components/BuildBuyToolbar.vue';
import ObjectPalette from './ui/components/ObjectPalette.vue';
import AgentPanel from './ui/components/AgentPanel.vue';
import GuidePanel from './ui/components/GuidePanel.vue';
import TimeControls from './ui/components/TimeControls.vue';
import Notifications from './ui/components/Notifications.vue';
import { Game } from './game/core/Game';

const canvasHost = ref<HTMLDivElement | null>(null);
const uiStore = useUiStore();
let game: Game | null = null;

onMounted(() => {
  if (!canvasHost.value) return;
  game = new Game(canvasHost.value, uiStore);
  game.start();
});

onBeforeUnmount(() => {
  game?.destroy();
});
</script>

<style scoped>
.app-shell {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #f1f5f9;
}

.game-canvas {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 42%, rgba(31, 78, 88, 0.58), transparent 42%),
    radial-gradient(circle at 50% 100%, rgba(15, 62, 67, 0.35), transparent 54%),
    linear-gradient(145deg, #071426 0%, #0b1d2c 48%, #101d2b 100%);
}
</style>
