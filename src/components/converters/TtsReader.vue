<script setup>
import { ref } from 'vue'
const text = ref('你好，欢迎来到 NSIE Team。')
const speaking = ref(false)
const voices = ref([])
const selectedVoice = ref('')

function speak() {
  if (!text.value.trim()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text.value)
  if (selectedVoice.value) {
    const v = voices.value.find(v => v.name === selectedVoice.value)
    if (v) u.voice = v
  }
  u.lang = 'zh-CN'
  u.rate = 1.0
  u.onstart = () => speaking.value = true
  u.onend = () => speaking.value = false
  window.speechSynthesis.speak(u)
}
function stop() { window.speechSynthesis.cancel(); speaking.value = false }

// Load voices
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voices.value = window.speechSynthesis.getVoices()
    if (voices.value.length && !selectedVoice.value) selectedVoice.value = voices.value[0].name
  }
  voices.value = window.speechSynthesis.getVoices()
  if (voices.value.length && !selectedVoice.value) selectedVoice.value = voices.value[0].name
}
</script>
<template>
  <div>
    <textarea v-model="text" placeholder="输入要朗读的文本…" style="width:100%;min-height:80px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;resize:vertical;margin-bottom:0.5rem"></textarea>
    <div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap">
      <button class="btn btn-sm btn-primary" @click="speak" :disabled="speaking">{{ speaking?'播放中…':'朗读' }}</button>
      <button class="btn btn-sm btn-outline" @click="stop">停止</button>
      <select v-model="selectedVoice" style="padding:0.3rem 0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.8rem;font-family:inherit">
        <option v-for="v in voices" :key="v.name" :value="v.name">{{ v.name }} ({{ v.lang }})</option>
      </select>
    </div>
  </div>
</template>
