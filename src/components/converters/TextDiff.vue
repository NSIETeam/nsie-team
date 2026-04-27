<script setup>
import { ref, computed } from 'vue'
const left = ref('')
const right = ref('')
const diffLines = computed(() => {
  const a = left.value.split('\n'), b = right.value.split('\n')
  const max = Math.max(a.length, b.length)
  const result = []
  for (let i = 0; i < max; i++) {
    const la = a[i] || '', lb = b[i] || ''
    if (la === lb) result.push({ type: 'same', left: la, right: lb })
    else result.push({ type: 'diff', left: la, right: lb })
  }
  return result
})
</script>
<template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
    <textarea v-model="left" placeholder="左侧文本" style="width:100%;min-height:200px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.82rem;font-family:monospace;resize:vertical"></textarea>
    <textarea v-model="right" placeholder="右侧文本" style="width:100%;min-height:200px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.82rem;font-family:monospace;resize:vertical"></textarea>
    <div style="grid-column:1/-1;border:1px solid var(--border);border-radius:6px;max-height:200px;overflow-y:auto;font-size:0.78rem;font-family:monospace">
      <div v-for="(l, i) in diffLines" :key="i" :style="{padding:'0.2rem 0.5rem', background: l.type==='diff'?'#ffeef0':'transparent', display:'grid', gridTemplateColumns:'1fr 1fr'}">
        <div :style="{borderRight:'1px solid var(--border)',padding:'0.1rem 0.3rem', color: l.type==='diff'?'#e8453c':''}">{{ l.left || '\u00A0' }}</div>
        <div :style="{padding:'0.1rem 0.3rem', color: l.type==='diff'?'#389e0d':''}">{{ l.right || '\u00A0' }}</div>
      </div>
    </div>
  </div>
</template>
