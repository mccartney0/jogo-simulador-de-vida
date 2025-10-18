<template>
  <aside v-if="ui.buildMode && ui.paletteOpen" class="palette" aria-label="Object palette">
    <header>
      <h3>{{ t('palette.title') }}</h3>
      <input
        type="search"
        v-model="search"
        :placeholder="t('palette.search')"
        aria-label="Search objects"
      />
    </header>
    <nav class="categories">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="{ active: category.id === activeCategory }"
        @click="() => (activeCategory = category.id)"
      >
        {{ category.label }}
      </button>
    </nav>
    <ul class="list">
      <li
        v-for="object in filtered"
        :key="object.id"
        :class="{ selected: ui.selectedObjectId === object.id }"
        @click="() => select(object.id)"
        tabindex="0"
      >
        <div class="preview" />
        <div class="details">
          <strong>{{ t(object.nameKey) }}</strong>
          <small>§{{ object.cost }}</small>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUiStore } from '../store/ui';
import { useI18n } from 'vue-i18n';
import { getObjectDefinitions } from '../../game/world/ObjectDefs';

const ui = useUiStore();
const { t } = useI18n();
const search = ref('');
const activeCategory = ref('furniture');
const objects = getObjectDefinitions();

const categories = computed(() => [
  { id: 'furniture', label: t('palette.furniture') },
  { id: 'plumbing', label: t('palette.plumbing') },
  { id: 'entertainment', label: t('palette.entertainment') },
  { id: 'appliances', label: t('palette.appliances') }
]);

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  return objects.filter((object) => {
    if (object.category !== activeCategory.value) return false;
    const label = t(object.nameKey).toLowerCase();
    return label.includes(term) || object.id.toLowerCase().includes(term);
  });
});

function select(id: string) {
  ui.selectObject(id);
}
</script>

<style scoped>
.palette {
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 280px;
  max-height: 60vh;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.78);
  border-radius: 16px;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
}

header {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.categories {
  display: flex;
  gap: 6px;
  padding: 0 16px 8px;
}

.categories button {
  flex: 1;
  border: none;
  padding: 6px;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.15);
  color: inherit;
  cursor: pointer;
}

.categories button.active {
  background: linear-gradient(90deg, #f97316, #ef4444);
}

.list {
  overflow-y: auto;
  padding: 0 16px 16px;
  list-style: none;
  margin: 0;
}

.list li {
  display: flex;
  gap: 12px;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.5);
  cursor: pointer;
  outline: none;
}

.list li.selected {
  border: 2px solid #38bdf8;
}

.preview {
  width: 36px;
  height: 36px;
  background: rgba(148, 163, 184, 0.3);
  border-radius: 6px;
}

.details small {
  color: rgba(226, 232, 240, 0.7);
}
</style>
