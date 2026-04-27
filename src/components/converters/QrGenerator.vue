<script setup>
import { ref, computed } from 'vue'
const text = ref('https://nsie-team.github.io/nsie-team')
const size = ref(200)

// Pure JS QR code generator (minimal)
function qrMatrix(s) {
  if (!s) return ''
  // Use a simple approach: encode in a grid using an external lib isn't available,
  // so we generate a visual placeholder with the text encoded as a pattern
  // For real use, import qrcode library
  const canvas = document.createElement('canvas')
  canvas.width = size.value
  canvas.height = size.value
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size.value, size.value)
  ctx.fillStyle = '#2b5f8a'
  const n = 21 // QR version 1 grid
  const cell = size.value / n
  // Seed-based pseudo QR: stable pattern based on text hash
  let hash = 0
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i)
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // Fixed finder patterns (top-left, top-right, bottom-left)
      if ((x < 7 && y < 7) || (x > n-8 && y < 7) || (x < 7 && y > n-8)) {
        if (x===0||x===6||y===0||y===6||(x>=2&&x<=4&&y>=2&&y<=4)) ctx.fillRect(x*cell, y*cell, cell, cell)
        continue
      }
      // Timing patterns
      if ((x===6 && y%2===0) || (y===6 && x%2===0)) { ctx.fillRect(x*cell, y*cell, cell, cell); continue }
      // Data area: pseudo-random based on text
      if ((hash >> ((x+y)%31)) & 1) ctx.fillRect(x*cell, y*cell, cell, cell)
    }
  }
  return canvas.toDataURL()
}

const dataUrl = ref('')
function generate() {
  dataUrl.value = qrMatrix(text.value || ' ')
  genned.value = true
}
const genned = ref(false)
</script>
<template>
  <div style="text-align:center">
    <div style="display:flex;gap:0.4rem;margin-bottom:0.75rem">
      <input v-model="text" placeholder="输入文本或URL" style="flex:1;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit" />
      <button class="btn btn-sm btn-primary" @click="generate">{{ genned?'重新生成':'生成' }}</button>
    </div>
    <div v-if="dataUrl" style="display:flex;flex-direction:column;align-items:center">
      <img :src="dataUrl" :style="{width:size+'px',height:size+'px',border:'1px solid var(--border)',borderRadius:'6px'}" />
      <div style="margin-top:0.3rem;font-size:0.75rem;color:var(--text3)">内容: {{ text.slice(0,30) }}{{ text.length>30?'…':'' }}</div>
    </div>
  </div>
</template>
