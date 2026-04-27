<script setup>
import { ref } from 'vue'
defineProps({ lang: String })

const items = ref([
  { id: 'sort', name_zh: '排序可视化', name_en: 'Sort Visualizer', desc_zh: '冒泡/快排/归并动画演示', desc_en: 'Bubble, Quick, Merge sort animation', icon: '↕' },
  { id: 'pathfind', name_zh: '路径搜索', name_en: 'Pathfinding', desc_zh: 'BFS/DFS/A* 网格寻路', desc_en: 'BFS/DFS/A* grid pathfinding', icon: '→' },
  { id: 'tree', name_zh: '二叉树遍历', name_en: 'Binary Tree', desc_zh: '前中后序遍历动画', desc_en: 'Pre/in/post-order traversal', icon: '🌳' },
  { id: 'linkedlist', name_zh: '链表操作', name_en: 'Linked List', desc_zh: '增删改查可视化', desc_en: 'Visual linked list operations', icon: '⇄' },
])

const active = ref(null)
</script>
<template>
  <div>
    <div class="converter-hub">
      <div class="ch-grid">
        <button v-for="item in items" :key="item.id" class="ch-item" :class="{ active: active === item.id }" @click="active = active === item.id ? null : item.id">
          <div class="ch-icon">{{ item.icon }}</div>
          <div class="ch-name">{{ lang==='zh'?item.name_zh:item.name_en }}</div>
          <div class="ch-desc">{{ lang==='zh'?item.desc_zh:item.desc_en }}</div>
        </button>
      </div>

      <div v-if="active === 'sort'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        排序可视化 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>
      <div v-if="active === 'pathfind'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        路径搜索 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>
      <div v-if="active === 'tree'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        二叉树遍历 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>
      <div v-if="active === 'linkedlist'" class="ch-panel" style="text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">
        链表操作 — 开发中<br/><span style="font-size:0.8rem">Coming soon</span>
      </div>
    </div>
  </div>
</template>
