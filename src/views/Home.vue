<script setup>
defineProps({ lang: String })
const zh = {
  hero: '欢迎来到 NSIE Team',
  desc: 'Nature Science & Industrial Engineering — 一个致力于实践与分享的团队',
  sections: [
    { title: '探索博客', desc: '技术文章、学习笔记、深度思考', link: '/blog' },
    { title: '我们的产品', desc: '小游戏、小工具，从创意到可用', link: '/products' },
    { title: '日常记录', desc: '团队成员的日常分享与感悟', link: '/daily' },
  ]
}
const en = {
  hero: 'Welcome to NSIE Team',
  desc: 'Nature Science & Industrial Engineering — A team dedicated to practice and sharing',
  sections: [
    { title: 'Explore Blog', desc: 'Tech articles, study notes, deep thoughts', link: '/blog' },
    { title: 'Our Products', desc: 'Mini games, tools, from ideas to reality', link: '/products' },
    { title: 'Daily Life', desc: 'Team members daily sharing & insights', link: '/daily' },
  ]
}
</script>
<template>
  <div>
    <div style="text-align:center;padding:2rem 0 1.5rem">
      <h1>{{ (lang==='zh'?zh:en).hero }}</h1>
      <p class="subtitle">{{ (lang==='zh'?zh:en).desc }}</p>
    </div>
    <div class="card-grid">
      <router-link v-for="s in (lang==='zh'?zh:en).sections" :key="s.title" :to="s.link" class="card-item" style="display:block;text-decoration:none;color:inherit">
        <h3>{{ s.title }}</h3>
        <p class="desc">{{ s.desc }}</p>
        <span class="btn btn-sm btn-outline">{{ lang==='zh'?'前往 →':'Enter →' }}</span>
      </router-link>
    </div>
  </div>
</template>
