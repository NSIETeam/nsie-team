<script setup>
import { ref, computed } from 'vue'
const hex = ref('#2b5f8a')
const rgb = computed(() => {
  const h = hex.value.replace('#','')
  if (h.length !== 6) return { r:0,g:0,b:0, str:'' }
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16)
  return { r,g,b, str:`rgb(${r}, ${g}, ${b})` }
})
const hsl = computed(() => {
  let {r,g,b} = rgb.value; r/=255; g/=255; b/=255
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn
  let h=0, s=0, l=(mx+mn)/2
  if (d) {
    s = l>0.5 ? d/(2-mx-mn) : d/(mx+mn)
    if (mx===r) h=((g-b)/d+(g<b?6:0))/6
    else if (mx===g) h=((b-r)/d+2)/6
    else h=((r-g)/d+4)/6
  }
  return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`
})
</script>
<template>
  <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
    <div :style="{width:'80px',height:'80px',borderRadius:'8px',background:hex,flexShrink:0}"></div>
    <div>
      <div style="margin-bottom:0.5rem"><label style="font-size:0.8rem">HEX: </label><input v-model="hex" style="padding:0.3rem 0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:monospace;width:120px" /></div>
      <div style="font-size:0.85rem;margin-bottom:0.2rem">RGB: {{ rgb.str }}</div>
      <div style="font-size:0.85rem">HSL: {{ hsl }}</div>
    </div>
  </div>
</template>
