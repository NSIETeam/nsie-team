<script setup>
import { ref } from 'vue'
import { getAllProducts, submitProduct, getPendingProducts, approveProduct, rejectProduct } from '../store.js'

defineProps({ lang: String })

const builtinProducts = [
  { id: 'bp-1', name_zh: '简易计算器', name_en: 'Simple Calculator', desc_zh: '一个轻量级四则运算工具', desc_en: 'A lightweight arithmetic tool',
    type: 'tool', status: 'online', icon: '🧮', downloads: 0 },
  { id: 'bp-2', name_zh: '单位换算器', name_en: 'Unit Converter', desc_zh: '长度、重量、温度等多单位互换', desc_en: 'Length, weight, temperature converter',
    type: 'tool', status: 'online', icon: '📏', downloads: 0 },
  { id: 'bp-3', name_zh: '贪吃蛇小游戏', name_en: 'Snake Game', desc_zh: '经典贪吃蛇，键盘/触屏双支持', desc_en: 'Classic snake game with keyboard & touch',
    type: 'game', status: 'beta', icon: '🐍', downloads: 0 },
  { id: 'bp-4', name_zh: 'JSON 格式化工具', name_en: 'JSON Formatter', desc_zh: '美化与校验 JSON 数据', desc_en: 'Pretty-print and validate JSON',
    type: 'tool', status: 'coming', icon: '📋', downloads: 0 },
]

const userProducts = ref(getAllProducts())
const allProducts = ref([...userProducts.value, ...builtinProducts])
const submitVisible = ref(false)
const submitForm = ref({ name: '', desc: '', type: 'tool', file: null, fileName: '' })
const pendingProducts = ref([])

// File handling (localStorage, max 5MB per file)
function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert(lang === 'zh' ? '文件不能超过 5MB' : 'File must be < 5MB')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    submitForm.value.file = reader.result // base64
    submitForm.value.fileName = file.name
  }
  reader.readAsDataURL(file)
}

function submitProd() {
  const f = submitForm.value
  if (!f.name.trim()) return
  submitProduct({
    name_zh: f.name,
    name_en: f.name,
    desc_zh: f.desc || '用户提交的项目',
    desc_en: f.desc || 'User submitted project',
    type: f.type,
    status: 'beta',
    icon: '🚀',
    file: f.file || null,
    fileName: f.fileName || '',
  })
  submitForm.value = { name: '', desc: '', type: 'tool', file: null, fileName: '' }
  submitVisible.value = false
  alert(lang === 'zh' ? '提交成功，等待审核后展示！' : 'Submitted! Waiting for review.')
}

function checkPending() {
  pendingProducts.value = getPendingProducts()
}
checkPending()

function handleApprove(id) {
  approveProduct(id)
  checkPending()
  userProducts.value = getAllProducts()
  allProducts.value = [...userProducts.value, ...builtinProducts]
}

function handleReject(id) {
  rejectProduct(id)
  checkPending()
}

const statusLabel = (s) => {
  const map = { online: '已上线', beta: '测试中', coming: '开发中' }
  const mapEn = { online: 'Live', beta: 'Beta', coming: 'Coming' }
  return lang==='zh'?map[s]:mapEn[s]
}

function downloadProduct(p) {
  if (p.file) {
    const a = document.createElement('a')
    a.href = p.file
    a.download = p.fileName || 'download'
    a.click()
  } else {
    alert(lang === 'zh' ? '暂无安装包' : 'No package available')
  }
}
</script>
<template>
  <div>
    <!-- Pending banner -->
    <div v-if="pendingProducts.length > 0" style="background:#fff7e6;border:1px solid #ffd591;border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-size:0.85rem">
      <strong>{{ lang==='zh'?'待审核产品':'Pending Products' }}:</strong>
      <span v-for="p in pendingProducts" :key="p.id" style="display:inline-flex;align-items:center;gap:0.4rem;margin-left:0.5rem;flex-wrap:wrap">
        {{ p.name_zh }}
        <button class="btn btn-sm btn-primary" @click="handleApprove(p.id)" style="padding:0.15rem 0.45rem;font-size:0.72rem">✓ {{ lang==='zh'?'通过':'Approve' }}</button>
        <button class="btn btn-sm" style="padding:0.15rem 0.45rem;font-size:0.72rem;background:transparent;border:1px solid #ccc;color:#999;cursor:pointer" @click="handleReject(p.id)">✕ {{ lang==='zh'?'拒绝':'Reject' }}</button>
      </span>
    </div>

    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h1>{{ lang==='zh'?'产品与项目':'Products & Projects' }}</h1>
        <p class="subtitle">{{ lang==='zh'?'团队开发 + 社区贡献的小游戏、小工具合集。':'Mini games & tools by the team and community.' }}</p>
      </div>
      <button class="btn btn-primary" @click="submitVisible=!submitVisible">
        {{ lang==='zh'?'+ 提交项目':'+ Submit' }}
      </button>
    </div>

    <!-- Submit form -->
    <div v-if="submitVisible" style="border:1px solid var(--accent);border-radius:8px;padding:1rem;margin-bottom:1rem">
      <input v-model="submitForm.name" :placeholder="lang==='zh'?'项目名称 *':'Project name *'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <input v-model="submitForm.desc" :placeholder="lang==='zh'?'简短描述':'Short description'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <div style="margin-bottom:0.5rem">
        <label style="font-size:0.85rem;color:var(--text2)">{{ lang==='zh'?'上传安装包（可选，≤5MB）：':'Upload package (optional, ≤5MB):' }}</label>
        <input type="file" @change="handleFileUpload" style="display:block;margin-top:0.3rem;font-size:0.85rem" />
      </div>
      <div v-if="submitForm.fileName" style="font-size:0.8rem;color:var(--accent);margin-bottom:0.5rem">📎 {{ submitForm.fileName }}</div>
      <div style="display:flex;gap:0.5rem;justify-content:flex-end">
        <select v-model="submitForm.type" style="padding:0.45rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit">
          <option value="tool">{{ lang==='zh'?'工具':'Tool' }}</option>
          <option value="game">{{ lang==='zh'?'游戏':'Game' }}</option>
        </select>
        <button class="btn btn-primary" @click="submitProd">{{ lang==='zh'?'提交审核':'Submit for Review' }}</button>
      </div>
    </div>

    <!-- Product grid -->
    <div class="card-grid">
      <div v-for="p in allProducts" :key="p.id" class="card-item">
        <div style="font-size:2rem;margin-bottom:0.5rem">{{ p.icon }}</div>
        <h3>{{ lang==='zh'?p.name_zh:p.name_en }}</h3>
        <p class="desc">{{ lang==='zh'?p.desc_zh:p.desc_en }}</p>
        <div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap;margin-bottom:0.5rem">
          <span v-if="p.status==='online'" style="font-size:0.75rem;padding:0.1rem 0.45rem;border-radius:100px;background:#e6f7e6;color:#389e0d">✅ {{ statusLabel(p.status) }}</span>
          <span v-else style="font-size:0.75rem;padding:0.1rem 0.45rem;border-radius:100px;background:var(--accent-light);color:var(--accent)">🔄 {{ statusLabel(p.status) }}</span>
          <span v-if="p.fileName" style="font-size:0.72rem;color:var(--text3)">📦 {{ p.fileName }}</span>
        </div>
        <div style="display:flex;gap:0.4rem">
          <button v-if="p.file" class="btn btn-sm btn-primary" @click="downloadProduct(p)">📥 {{ lang==='zh'?'下载':'Download' }}</button>
          <button v-if="p.status === 'online' && !p.file" class="btn btn-sm btn-outline">{{ lang==='zh'?'在线使用':'Try Online' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
