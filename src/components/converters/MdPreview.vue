<script setup>
import { ref, computed } from 'vue'
const input = ref('# Hello\n\nType **Markdown** here...')
function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
const html = computed(() => {
  let s = input.value
  // headings
  s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // bold & italic
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // inline code
  s = s.replace(/`(.+?)`/g, '<code>$1</code>')
  // code block
  s = s.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  // links
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
  // unordered list
  s = s.replace(/^- (.+)$/gm, '<li>$1</li>')
  s = s.replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>' + m.replace(/\n$/, '') + '</ul>')
  // paragraph
  s = s.replace(/^(?!<[houpl])[\s\S]*?(?:\n\n|$)/gm, m => {
    if (!m.trim()) return m
    if (/^<(h[123]|ul|ol|li|pre|code|table)/.test(m.trim())) return m
    return '<p>' + m.trim() + '</p>\n'
  })
  return s
})
</script>
<template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
    <textarea v-model="input" style="width:100%;min-height:200px;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:monospace;resize:vertical"></textarea>
    <div style="padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;line-height:1.6;overflow-y:auto;max-height:400px" v-html="html"></div>
  </div>
</template>
