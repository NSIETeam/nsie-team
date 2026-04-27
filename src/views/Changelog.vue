<script setup>
defineProps({ lang: String })

const logs = [
  { ver: 'v1.0.0', date: '2026-04-27', zh: ['全新网站上线', '支持中英文切换', '博客、产品展示、日常记录三大板块', '产品在线提交功能', '响应式布局，移动端友好'], en: ['New website launched', 'Chinese/English language toggle', 'Blog, Products, Daily sections', 'Online product submission', 'Responsive & mobile-friendly'] },
  { ver: 'v0.0.3', date: '2026-03-15', zh: ['Vue 3 + Vite 重构', 'GitHub Pages 自动部署', '内置博客与工具系统'], en: ['Vue 3 + Vite rewrite', 'GitHub Pages auto-deploy', 'Built-in blog & tools'] },
  { ver: 'v0.0.2', date: '2025-12-01', zh: ['增加 About 和 Contact 页面', '优化移动端导航'], en: ['Added About & Contact pages', 'Mobile navigation improvements'] },
  { ver: 'v0.0.1', date: '2025-11-15', zh: ['基于 Jekyll 的初始版本', '基本页面结构搭建'], en: ['Initial Jekyll version', 'Basic page structure'] },
]

function formatDate(d) { return new Date(d).toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' }) }
</script>
<template>
  <div>
    <h1>{{ lang==='zh'?'更新日志':'Changelog' }}</h1>
    <p class="subtitle">{{ lang==='zh'?'记录每一次迭代。':'Every iteration matters.' }}</p>

    <div v-for="log in logs" :key="log.ver" style="margin-bottom:1.25rem;padding:1rem;border-left:3px solid var(--accent);background:var(--accent-light);border-radius:0 6px 6px 0">
      <div style="display:flex;align-items:baseline;gap:0.75rem;margin-bottom:0.4rem">
        <strong style="font-size:1rem;color:var(--accent)">{{ log.ver }}</strong>
        <span style="font-size:0.8rem;color:var(--text3)">{{ formatDate(log.date) }}</span>
      </div>
      <ul style="list-style:none;padding:0;margin:0">
        <li v-for="item in (lang==='zh'?log.zh:log.en)" :key="item" style="font-size:0.85rem;color:var(--text2);padding:0.15rem 0">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
