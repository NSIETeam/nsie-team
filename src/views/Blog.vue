<script setup>
import { ref, computed } from 'vue'
defineProps({ lang: String })

const zhCats = ['全部', '前端', 'AI', '学习', '工程']
const enCats = ['All', 'Frontend', 'AI', 'Study', 'Engineering']

const posts = [
  { title_zh: 'Vue 3 组合式 API 实战总结', title_en: 'Vue 3 Composition API in Practice', cat: '前端', date: '2026-04-20',
    excerpt_zh: '从 Options API 到 Composition API，聊聊迁移过程中的思考与坑。', excerpt_en: 'From Options API to Composition API — migration lessons and reflections.',
    author: 'NSIE Team', likes: 15, comments: 4 },
  { title_zh: '用 AI 辅助学习操作系统的经验', title_en: 'Learning OS with AI Assistance', cat: 'AI', date: '2026-04-15',
    excerpt_zh: 'ChatGPT + xv6 做老师，效率翻倍的经验分享。', excerpt_en: 'Using ChatGPT + xv6 as your teacher for double the efficiency.',
    author: 'NSIE Team', likes: 12, comments: 3 },
  { title_zh: '终身学习：建立个人知识体系', title_en: 'Lifelong Learning: Building Your Knowledge System', cat: '学习', date: '2026-04-10',
    excerpt_zh: '信息爆炸时代，如何系统化地构建自己的知识体系？', excerpt_en: 'How to systematically build your knowledge system in the age of information explosion?',
    author: 'NSIE Team', likes: 20, comments: 7 },
  { title_zh: '从零搭一个 GitHub Pages 网站', title_en: 'Building a GitHub Pages Site from Scratch', cat: '工程', date: '2026-04-05',
    excerpt_zh: 'Vue 3 + Vite + GitHub Actions 全流程指南。', excerpt_en: 'A complete guide: Vue 3 + Vite + GitHub Actions pipeline.',
    author: 'NSIE Team', likes: 8, comments: 2 },
  { title_zh: '线性代数在机器学习中的应用', title_en: 'Linear Algebra in Machine Learning', cat: 'AI', date: '2026-03-28',
    excerpt_zh: '矩阵运算、特征值和 SVD 在 ML 中为什么重要？', excerpt_en: 'Why matrix operations, eigenvalues, and SVD matter in ML?',
    author: 'NSIE Team', likes: 18, comments: 5 },
]

const activeCat = ref('全部')
const filtered = computed(() => {
  const c = activeCat.value
  if (c === '全部' || c === 'All') return posts
  return posts.filter(p => p.cat === (c === 'Frontend' ? '前端' : c === 'AI' ? 'AI' : c === 'Study' ? '学习' : '工程'))
})

function setCat(c) { activeCat.value = c }

function formatDate(d) { return new Date(d).toLocaleDateString('zh-CN', { month:'long', day:'numeric' }) }
</script>
<template>
  <div>
    <h1>{{ lang==='zh'?'博客':'Blog' }}</h1>
    <p class="subtitle">{{ lang==='zh'?'分享技术思考，记录学习历程。':'Share tech thoughts, document learning journeys.' }}</p>

    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)">
      <button v-for="c in (lang==='zh'?zhCats:enCats)" :key="c"
        :class="['tag', { 'btn-primary': activeCat===c }]"
        :style="{ cursor:'pointer', border:'none', padding:'0.2rem 0.6rem', fontSize:'0.8rem', background: activeCat===c?'var(--accent)':'var(--accent-light)', color: activeCat===c?'#fff':'var(--accent)' }"
        @click="setCat(c)">{{ c }}</button>
    </div>

    <div v-for="p in filtered" :key="p.title_zh" class="feed-item">
      <div class="img">{{ p.cat==='前端'?'💻':p.cat==='AI'?'🤖':p.cat==='学习'?'📖':'🛠' }}</div>
      <div class="body">
        <h3>{{ lang==='zh'?p.title_zh:p.title_en }}</h3>
        <p>{{ (lang==='zh'?p.excerpt_zh:p.excerpt_en).slice(0,80) }}{{ (lang==='zh'?p.excerpt_zh:p.excerpt_en).length>80?'…':'' }}</p>
        <div class="meta">
          <span class="author">{{ p.author }}</span>
          <span>{{ formatDate(p.date) }}</span>
          <span>💬 {{ p.comments }}</span>
          <span>👍 {{ p.likes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
