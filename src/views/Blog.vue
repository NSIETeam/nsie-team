<script setup>
import { ref, computed } from 'vue'
import { getAllPosts, submitPost, getComments, addComment, getPendingPosts, approvePost, rejectPost } from '../store.js'

defineProps({ lang: String })

const zhCats = ['全部', '前端', 'AI', '学习', '工程']
const enCats = ['All', 'Frontend', 'AI', 'Study', 'Engineering']

const builtinPosts = [
  { id: 'builtin-1', title_zh: 'Vue 3 组合式 API 实战总结', title_en: 'Vue 3 Composition API in Practice', cat: '前端', date: '2026-04-20',
    excerpt_zh: '从 Options API 到 Composition API，聊聊迁移过程中的思考与坑。', excerpt_en: 'From Options API to Composition API — migration lessons and reflections.',
    content_zh: '<p>从 Options API 迁移到 Composition API 是一次思维方式的重塑。</p><p>最大的变化在于：逻辑关注点从"选项"变成了"功能"。不再需要按照 data/methods/computed 的框架去组织代码，而是围绕一个功能点把相关的状态、计算属性和方法放在一起。</p><p>这种变化对于中等以上复杂度的组件来说，可维护性提升非常明显。</p>',
    content_en: '<p>Migrating from Options API to Composition API is a mindset shift.</p><p>The biggest change: logic organization moves from "options" to "concerns". Instead of splitting code by data/methods/computed, you group related state, computed properties, and methods by feature.</p>',
    author: 'NSIE Team', likes: 15, comments: 0 },
  { id: 'builtin-2', title_zh: '用 AI 辅助学习操作系统的经验', title_en: 'Learning OS with AI Assistance', cat: 'AI', date: '2026-04-15',
    excerpt_zh: 'ChatGPT + xv6 做老师，效率翻倍的经验分享。', excerpt_en: 'Using ChatGPT + xv6 as your teacher for double the efficiency.',
    content_zh: '<p>最近用 ChatGPT 辅助学习 MIT 6.S081 的 xv6 操作系统课程，体验非常棒。</p><p>遇到不理解的概念，直接问 AI：</p><ul><li>进程调度的核心数据结构是什么？</li><li>xv6 的页表如何管理？</li><li>sleep/wakeup 机制的原理？</li></ul><p>AI 能快速给出清晰的解释，比自己查资料快得多。</p>',
    content_en: '<p>Recently using ChatGPT to assist with MIT 6.S081 xv6 OS course — excellent experience.</p><p>When stuck on a concept, just ask AI directly about process scheduling, page tables, sleep/wakeup mechanism.</p>',
    author: 'NSIE Team', likes: 12, comments: 0 },
  { id: 'builtin-3', title_zh: '终身学习：建立个人知识体系', title_en: 'Lifelong Learning: Building Your Knowledge System', cat: '学习', date: '2026-04-10',
    excerpt_zh: '信息爆炸时代，如何系统化地构建自己的知识体系？', excerpt_en: 'How to systematically build your knowledge system in the age of information explosion?',
    content_zh: '<p>在信息爆炸的时代，知识本身的获取成本已经极低，真正的壁垒在于"体系化"。</p><p>推荐的方法：</p><ol><li>选定一个核心领域作为基础</li><li>每个知识点做笔记并建立关联</li><li>定期输出（写作/分享）来检验理解</li><li>不断迭代和修正自己的认知框架</li></ol>',
    content_en: '<p>In the age of information explosion, knowledge itself is cheap. The real moat is systematization.</p>',
    author: 'NSIE Team', likes: 20, comments: 0 },
  { id: 'builtin-4', title_zh: '从零搭一个 GitHub Pages 网站', title_en: 'Building a GitHub Pages Site from Scratch', cat: '工程', date: '2026-04-05',
    excerpt_zh: 'Vue 3 + Vite + GitHub Actions 全流程指南。', excerpt_en: 'A complete guide: Vue 3 + Vite + GitHub Actions pipeline.',
    content_zh: '<p>从零搭建一个 GitHub Pages 网站的完整流程：</p><ul><li>创建 Vue 3 + Vite 项目</li><li>配置 vue-router 实现 SPA 路由</li><li>编写 GitHub Actions 自动构建部署</li><li>设置自定义域名（可选）</li></ul>',
    content_en: '<p>Complete guide to building a GitHub Pages site from scratch with Vue 3, Vite, and GitHub Actions.</p>',
    author: 'NSIE Team', likes: 8, comments: 0 },
  { id: 'builtin-5', title_zh: '线性代数在机器学习中的应用', title_en: 'Linear Algebra in Machine Learning', cat: 'AI', date: '2026-03-28',
    excerpt_zh: '矩阵运算、特征值和 SVD 在 ML 中为什么重要？', excerpt_en: 'Why matrix operations, eigenvalues, and SVD matter in ML?',
    content_zh: '<p>线性代数是机器学习的数学基石：</p><ul><li>数据表示为矩阵和向量</li><li>模型训练 = 矩阵运算 + 梯度优化</li><li>PCA 降维 = 特征值分解</li><li>推荐系统 = 矩阵分解 (SVD)</li></ul>',
    content_en: '<p>Linear algebra is the mathematical foundation of ML: data as matrices, training as matrix ops, PCA as eigendecomposition, recomender systems as SVD.</p>',
    author: 'NSIE Team', likes: 18, comments: 0 },
]

const activeCat = ref('全部')
const showSubmit = ref(false)
const selectedPost = ref(null)
const submitForm = ref({ title: '', content: '', cat: '', author: '' })
const commentForm = ref({ author: '', content: '' })

// Load user-submitted + builtin posts
const userPosts = ref(getAllPosts())

const allPosts = computed(() => {
  return [...userPosts.value, ...builtinPosts]
})

const filtered = computed(() => {
  const c = activeCat.value
  if (c === '全部' || c === 'All') return allPosts.value
  const zhCat = c === 'Frontend' ? '前端' : c === 'AI' ? 'AI' : c === 'Study' ? '学习' : '工程'
  return allPosts.value.filter(p => p.cat === zhCat)
})

function setCat(c) { activeCat.value = c }

function formatDate(d) { return new Date(d).toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' }) }

function submitBlog() {
  const f = submitForm.value
  if (!f.title.trim() || !f.content.trim()) return
  submitPost({
    title_zh: f.title,
    title_en: f.title,
    cat: f.cat || '学习',
    excerpt_zh: f.content.slice(0, 100),
    excerpt_en: f.content.slice(0, 100),
    content_zh: '<p>' + f.content.replace(/\n/g, '</p><p>') + '</p>',
    content_en: '<p>' + f.content.replace(/\n/g, '</p><p>') + '</p>',
    author: f.author.trim() || '匿名用户',
    likes: 0,
  })
  submitForm.value = { title: '', content: '', cat: '', author: '' }
  showSubmit.value = false
  alert(lang === 'zh' ? '提交成功，等待审核后展示！' : 'Submitted! Waiting for review.')
}

function openPost(post) {
  selectedPost.value = post
  document.body.style.overflow = 'hidden'
}

function closePost() {
  selectedPost.value = null
  document.body.style.overflow = ''
  commentForm.value = { author: '', content: '' }
}

function postComment() {
  const cf = commentForm.value
  if (!cf.content.trim()) return
  const postId = selectedPost.value.id
  addComment(postId, { author: cf.author.trim() || '匿名', content: cf.content })
  cf.content = ''
  // Force reactivity
  selectedPost.value = { ...selectedPost.value }
}

// Check pending posts
const pendingPosts = ref([])
function checkPending() {
  pendingPosts.value = getPendingPosts()
}
checkPending()

function handleApprove(id) {
  approvePost(id)
  checkPending()
  userPosts.value = getAllPosts()
}

function handleReject(id) {
  rejectPost(id)
  checkPending()
}

// Cat icon
function catIcon(c) {
  return c === '前端' ? '' : c === 'AI' ? '' : c === '学习' ? '' : ''
}
</script>
<template>
  <div>
    <!-- Pending review banner -->
    <div v-if="pendingPosts.length > 0" style="background:#fff7e6;border:1px solid #ffd591;border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-size:0.85rem">
      <strong>{{ lang==='zh'?'待审核':'Pending Review' }}:</strong>
      <span v-for="p in pendingPosts" :key="p.id" style="display:inline-flex;align-items:center;gap:0.4rem;margin-left:0.5rem">
        {{ p.title_zh }}
        <button class="btn btn-sm btn-primary" @click="handleApprove(p.id)" style="padding:0.15rem 0.45rem;font-size:0.72rem"></button>
        <button class="btn btn-sm" style="padding:0.15rem 0.45rem;font-size:0.72rem;background:transparent;border:1px solid #ccc;color:#999;cursor:pointer" @click="handleReject(p.id)"></button>
      </span>
    </div>

    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h1>{{ lang==='zh'?'博客':'Blog' }}</h1>
        <p class="subtitle">{{ lang==='zh'?'分享技术思考，记录学习历程。':'Share tech thoughts, document learning journeys.' }}</p>
      </div>
      <button class="btn btn-primary" @click="showSubmit=!showSubmit">
        {{ lang==='zh'?'+ 投稿':'+ Submit' }}
      </button>
    </div>

    <!-- Submit form -->
    <div v-if="showSubmit" style="border:1px solid var(--accent);border-radius:8px;padding:1rem;margin-bottom:1rem">
      <input v-model="submitForm.title" :placeholder="lang==='zh'?'文章标题':'Title'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <input v-model="submitForm.author" :placeholder="lang==='zh'?'你的名字（可选）':'Your name (optional)'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <textarea v-model="submitForm.content" :placeholder="lang==='zh'?'写下你的文章内容…':'Write your article...'" style="width:100%;min-height:120px;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit;resize:vertical"></textarea>
      <div style="display:flex;gap:0.5rem;justify-content:flex-end">
        <select v-model="submitForm.cat" style="padding:0.45rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit">
          <option value="">{{ lang==='zh'?'选择分类':'Category' }}</option>
          <option value="前端">前端</option>
          <option value="AI">AI</option>
          <option value="学习">学习</option>
          <option value="工程">工程</option>
        </select>
        <button class="btn btn-primary" @click="submitBlog">{{ lang==='zh'?'提交审核':'Submit for Review' }}</button>
      </div>
    </div>

    <!-- Category tabs -->
    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)">
      <button v-for="c in (lang==='zh'?zhCats:enCats)" :key="c"
        :style="{ cursor:'pointer', border:'none', padding:'0.2rem 0.6rem', fontSize:'0.8rem', borderRadius:'100px', background: activeCat===c?'var(--accent)':'var(--accent-light)', color: activeCat===c?'#fff':'var(--accent)' }"
        @click="setCat(c)">{{ c }}</button>
    </div>

    <!-- Post list -->
    <div v-if="filtered.length === 0" style="text-align:center;padding:2rem 0;color:var(--text3);font-size:0.9rem">
      {{ lang==='zh'?'暂无文章':'No posts yet' }}
    </div>
    <div v-for="p in filtered" :key="p.id" class="feed-item" style="cursor:pointer" @click="openPost(p)">
      <div class="img" style="font-size:1.5rem">{{ catIcon(p.cat) }}</div>
      <div class="body">
        <h3>{{ lang==='zh'?p.title_zh:p.title_en }}</h3>
        <p>{{ (lang==='zh'?p.excerpt_zh:p.excerpt_en).slice(0,80) }}{{ ((lang==='zh'?p.excerpt_zh:p.excerpt_en)||'').length>80?'…':'' }}</p>
        <div class="meta">
          <span class="author">{{ p.author || 'NSIE Team' }}</span>
          <span>{{ formatDate(p.date || p.submittedAt) }}</span>
          <span> {{ getComments(p.id).length }}</span>
          <span> {{ p.likes || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Post detail modal -->
    <div v-if="selectedPost" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem" @click.self="closePost">
      <div style="background:#fff;border-radius:8px;max-width:700px;width:100%;max-height:85vh;overflow-y:auto;padding:1.5rem 2rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
          <h2 style="margin:0;flex:1">{{ lang==='zh'?selectedPost.title_zh:selectedPost.title_en }}</h2>
          <button @click="closePost" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--text3)"></button>
        </div>
        <div class="meta" style="margin-bottom:1rem">
          <span class="author">{{ selectedPost.author }}</span>
          <span>{{ formatDate(selectedPost.date || selectedPost.submittedAt) }}</span>
          <span class="tag">{{ selectedPost.cat }}</span>
        </div>
        <div style="font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem" v-html="lang==='zh'?selectedPost.content_zh:selectedPost.content_en"></div>

        <!-- Comments -->
        <div style="border-top:1px solid var(--border);padding-top:1rem">
          <h3 style="font-size:0.95rem;margin-bottom:0.75rem">{{ lang==='zh'?'评论 ('+getComments(selectedPost.id).length+')':'Comments ('+getComments(selectedPost.id).length+')' }}</h3>
          <div v-for="c in getComments(selectedPost.id)" :key="c.id" style="padding:0.5rem 0;border-bottom:1px solid var(--border)">
            <div style="font-size:0.82rem;font-weight:500">{{ c.author }}</div>
            <div style="font-size:0.85rem;color:var(--text2);margin:0.15rem 0">{{ c.content }}</div>
            <div style="font-size:0.72rem;color:var(--text3)">{{ formatDate(c.date) }}</div>
          </div>
          <div v-if="getComments(selectedPost.id).length === 0" style="font-size:0.85rem;color:var(--text3);padding:0.5rem 0">
            {{ lang==='zh'?'暂无评论，来写第一条吧！':'No comments yet. Be the first!' }}
          </div>
          <div style="margin-top:0.75rem">
            <input v-model="commentForm.author" :placeholder="lang==='zh'?'你的昵称（可选）':'Your name (optional)'" style="width:100%;margin-bottom:0.4rem;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit" />
            <div style="display:flex;gap:0.4rem">
              <input v-model="commentForm.content" :placeholder="lang==='zh'?'写下你的评论…':'Write a comment...'" style="flex:1;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit" />
              <button class="btn btn-primary btn-sm" @click="postComment">{{ lang==='zh'?'发送':'Send' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
