<template>
  <div class="app-shell" :class="{ 'build-mode': uiStore.buildMode }">
    <div ref="canvasHost" class="game-canvas" aria-label="Isometric life simulation canvas"></div>
    <HudPanel />
    <BuildBuyToolbar />
    <ObjectPalette />
    <AgentPanel />
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
  background: radial-gradient(circle at center, #34495e 0%, #1b1b1b 80%);
}
</style>
