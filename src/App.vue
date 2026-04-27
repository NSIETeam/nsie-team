<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const lang = ref('zh')

const labels = computed(() => lang.value === 'zh' ? zh : en)

const zh = {
  title: 'NSIE Team',
  nav: ['首页', '博客', '产品', '日常', '更新日志', '关于'],
  routes: ['/', '/blog', '/products', '/daily', '/changelog', '/about'],
  footer: 'Nature Science & Industrial Engineering · Do One Thing And Do It Well',
}

const en = {
  title: 'NSIE Team',
  nav: ['Home', 'Blog', 'Products', 'Daily', 'Changelog', 'About'],
  routes: ['/', '/blog', '/products', '/daily', '/changelog', '/about'],
  footer: 'Nature Science & Industrial Engineering · Do One Thing And Do It Well',
}

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleLang() {
  lang.value = lang.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">{{ labels.title }}</router-link>
        <nav>
          <router-link
            v-for="(l, i) in labels.nav"
            :key="l"
            :to="labels.routes[i]"
            :class="{ active: isActive(labels.routes[i]) }"
          >{{ l }}</router-link>
        </nav>
        <button class="lang-btn" @click="toggleLang">{{ lang === 'zh' ? 'EN' : '中文' }}</button>
      </div>
    </header>

    <main class="main">
      <div class="card">
        <router-view :lang="lang" />
      </div>
    </main>

    <footer class="footer">
      {{ labels.footer }}
    </footer>
  </div>
</template>
