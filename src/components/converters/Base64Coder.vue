<script setup>
import { ref, computed } from 'vue'
const input = ref('')
const mode = ref('encode')
const output = computed(() => {
  if (!input.value) return ''
  try {
    if (mode.value === 'encode') return btoa(unescape(encodeURIComponent(input.value)))
    else return decodeURIComponent(escape(atob(input.value)))
  } catch(e) { return 'Error: ' + e.message }
})
</script>
<template>
  <div>
    <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem">
      <button :class="['btn btn-sm', mode==='encode'?'btn-primary':'btn-outline']" @click="mode='encode'">编码</button>
      <button :class="['btn btn-sm', mode==='decode'?'btn-primary':'btn-outline']" @click="mode='decode'">解码</button>
    </div>
    <textarea v-model="input" :placeholder="mode==='encode'?'输入文本…':'输入 Base64…'" style="width:100%;min-height:80px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:monospace;resize:vertical;margin-bottom:0.5rem"></textarea>
    <textarea :value="output" readonly style="width:100%;min-height:80px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:monospace;resize:vertical;background:var(--accent-light)"></textarea>
  </div>
</template>
