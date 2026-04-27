<script setup>
import { ref, computed } from 'vue'
import SnakeGame from './SnakeGame.vue'

defineProps({ lang: String })

const games = ref([
  { id: 'snake', name_zh: '贪吃蛇', name_en: 'Snake Game', desc_zh: '键盘/WASD控制，经典玩法', desc_en: 'Arrow/WASD keys, classic gameplay', icon: 'S' },
  { id: 'minesweeper', name_zh: '扫雷', name_en: 'Minesweeper', desc_zh: '经典扫雷，左键翻开右键标记', desc_en: 'Classic minesweeper, left-click to reveal', icon: 'B' },
  { id: '2048', name_zh: '2048', name_en: '2048', desc_zh: '方向键合并方块达到 2048', desc_en: 'Merge tiles to reach 2048', icon: '2' },
  { id: 'tetris', name_zh: '俄罗斯方块', name_en: 'Tetris', desc_zh: '经典下落方块游戏', desc_en: 'Classic falling blocks game', icon: 'T' },
])

const active = ref(null)

// Game sub-components (lazy-simple versions)
function renderGame(id) {
  if (id === 'snake') return SnakeGame
  return null
}
</script>
<template>
  <div>
    <div class="converter-hub">
      <div class="ch-grid">
        <button v-for="g in games" :key="g.id" class="ch-item" :class="{ active: active === g.id }" @click="active = active === g.id ? null : g.id">
          <div class="ch-icon">{{ g.icon }}</div>
          <div class="ch-name">{{ lang==='zh'?g.name_zh:g.name_en }}</div>
          <div class="ch-desc">{{ lang==='zh'?g.desc_zh:g.desc_en }}</div>
        </button>
      </div>

      <div v-if="active === 'snake'" class="ch-panel"><SnakeGame /></div>

      <div v-if="active === 'minesweeper'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        扫雷 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>

      <div v-if="active === '2048'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        2048 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>

      <div v-if="active === 'tetris'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        俄罗斯方块 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>
    </div>
  </div>
</template>
