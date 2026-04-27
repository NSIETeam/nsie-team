<script setup>
defineProps({ lang: String })

const posts = [
  { date: '2026-04-26', zh: '今天优化了博客的阅读体验，增加了分类筛选功能。另外发现 xv6 的调度器设计真是精巧。', en: 'Polished blog reading experience with category filtering. Also found xv6 scheduler design is quite elegant.' },
  { date: '2026-04-24', zh: '逛 GitHub 看到一个不错的开源 SPA 模板，fork 下来改造了一番。', en: 'Found a nice open-source SPA template on GitHub, forked and customized it.' },
  { date: '2026-04-22', zh: '学习 Vue 3 的 Teleport 组件，用于做模态框太方便了。', en: 'Learning Vue 3 Teleport component — perfect for modals.' },
  { date: '2026-04-20', zh: '周末写了一个贪吃蛇小游戏，键盘/触屏双支持，在 Products 页可以试玩。', en: 'Weekend project: a snake game with keyboard & touch support. Check Products page.' },
  { date: '2026-04-18', zh: '阅读《操作系统导论》第三章，对进程调度有了更深的理解。', en: 'Reading "Operating Systems: Three Easy Pieces" Ch3 — deeper understanding of process scheduling.' },
  { date: '2026-04-15', zh: '准备写一篇关于组合式 API 的总结文章，把踩过的坑都记录下来。', en: 'Planning to write a summary about Composition API, documenting all the pitfalls.' },
  { date: '2026-04-12', zh: '今天用 AI 辅助写了几个单元测试，效率确实高了不少。', en: 'Used AI to help write some unit tests today — much more efficient.' },
]

function formatDate(d) { return new Date(d).toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' }) }
</script>
<template>
  <div>
    <h1>{{ lang==='zh'?'日常记录':'Daily Log' }}</h1>
    <p class="subtitle">{{ lang==='zh'?'团队成员的日常分享、碎碎念与感悟。':'Daily sharing, thoughts, and insights from the team.' }}</p>

    <div v-for="p in posts" :key="p.date" class="feed-item" style="align-items:flex-start">
      <div style="width:50px;height:50px;border-radius:50%;background:var(--accent-light);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--accent);font-weight:600">{{ p.date.slice(-2) }}</div>
      <div class="body">
        <p>{{ lang==='zh'?p.zh:p.en }}</p>
        <div class="meta" style="margin-top:0.3rem"><span>{{ formatDate(p.date) }}</span></div>
      </div>
    </div>
  </div>
</template>
