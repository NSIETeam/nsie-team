<script setup>
import { ref, computed } from 'vue'
const text = ref('')
const stats = computed(() => {
  const s = text.value
  return {
    chars: s.length,
    charsNoSpace: s.replace(/\s/g,'').length,
    words: s.trim() ? s.trim().split(/\s+/).length : 0,
    lines: s ? s.split('\n').length : 0,
    cjk: (s.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)||[]).length,
    spaces: (s.match(/\s/g)||[]).length,
  }
})
</script>
<template>
  <div>
    <textarea v-model="text" placeholder="输入或粘贴文本…" style="width:100%;min-height:120px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;resize:vertical;margin-bottom:0.5rem"></textarea>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;font-size:0.85rem">
      <div class="card-item" style="padding:0.5rem"><div style="font-weight:600;color:var(--accent);font-size:1.2rem">{{ stats.chars }}</div><div style="font-size:0.72rem;color:var(--text3)">总字符</div></div>
      <div class="card-item" style="padding:0.5rem"><div style="font-weight:600;color:var(--accent);font-size:1.2rem">{{ stats.words }}</div><div style="font-size:0.72rem;color:var(--text3)">单词数</div></div>
      <div class="card-item" style="padding:0.5rem"><div style="font-weight:600;color:var(--accent);font-size:1.2rem">{{ stats.lines }}</div><div style="font-size:0.72rem;color:var(--text3)">行数</div></div>
      <div class="card-item" style="padding:0.5rem"><div style="font-weight:600;color:var(--accent);font-size:1.2rem">{{ stats.cjk }}</div><div style="font-size:0.72rem;color:var(--text3)">中文字数</div></div>
      <div class="card-item" style="padding:0.5rem"><div style="font-weight:600;color:var(--accent);font-size:1.2rem">{{ stats.charsNoSpace }}</div><div style="font-size:0.72rem;color:var(--text3)">去空格</div></div>
      <div class="card-item" style="padding:0.5rem"><div style="font-weight:600;color:var(--accent);font-size:1.2rem">{{ stats.spaces }}</div><div style="font-size:0.72rem;color:var(--text3)">空白字符</div></div>
    </div>
  </div>
</template>
