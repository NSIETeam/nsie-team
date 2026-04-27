<script setup>
import { ref } from 'vue'
const input = ref('')
const output = ref('')
const error = ref('')
function format() {
  try { const obj = JSON.parse(input.value); output.value = JSON.stringify(obj, null, 2); error.value = '' }
  catch(e) { error.value = e.message; output.value = '' }
}
function compress() {
  try { const obj = JSON.parse(input.value); output.value = JSON.stringify(obj); error.value = '' }
  catch(e) { error.value = e.message; output.value = '' }
}
function clear() { input.value = ''; output.value = ''; error.value = '' }
</script>
<template>
  <div>
    <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem">
      <button class="btn btn-sm btn-primary" @click="format">美化</button>
      <button class="btn btn-sm btn-outline" @click="compress">压缩</button>
      <button class="btn btn-sm" style="background:transparent;border:1px solid #ccc;color:#999;cursor:pointer;padding:0.3rem 0.6rem;border-radius:6px;font-size:0.8rem" @click="clear">清空</button>
    </div>
    <textarea v-model="input" placeholder="粘贴 JSON..." style="width:100%;min-height:100px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:monospace;resize:vertical;margin-bottom:0.5rem"></textarea>
    <div v-if="error" style="font-size:0.82rem;color:#e8453c;margin-bottom:0.3rem">{{ error }}</div>
    <textarea v-if="output" :value="output" readonly style="width:100%;min-height:100px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:monospace;resize:vertical;background:var(--accent-light)"></textarea>
  </div>
</template>
