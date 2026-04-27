import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import Home from './views/Home.vue'
import Blog from './views/Blog.vue'
import Products from './views/Products.vue'
import Daily from './views/Daily.vue'
import Changelog from './views/Changelog.vue'
import About from './views/About.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/blog', name: 'blog', component: Blog },
  { path: '/products', name: 'products', component: Products },
  { path: '/daily', name: 'daily', component: Daily },
  { path: '/changelog', name: 'changelog', component: Changelog },
  { path: '/about', name: 'about', component: About },
]

const router = createRouter({ history: createWebHashHistory(), routes })

const app = createApp(App)
app.use(router)
app.mount('#app')
