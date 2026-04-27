<script setup>
import { ref, computed } from 'vue'
import { getAllProducts, submitProduct, getPendingProducts, approveProduct, rejectProduct } from '../store.js'
import ConverterHub from '../components/converters/ConverterHub.vue'
import GameHub from '../components/games/GameHub.vue'
import AlgoHub from '../components/algorithms/AlgoHub.vue'

defineProps({ lang: String })

const tabs = ['all', 'converters', 'games', 'algo']
const tabNames_zh = ['全部', '转换工具', '小游戏', '算法演示']
const tabNames_en = ['All', 'Converters', 'Games', 'Algorithms']
const activeTab = ref('all')

const builtinProducts = [
  { id: 'bp-1', name_zh: '简易计算器', name_en: 'Simple Calculator', desc_zh: '轻量级四则运算工具', desc_en: 'Lightweight arithmetic tool', type: 'tool', status: 'online' },
  { id: 'bp-2', name_zh: '单位换算器', name_en: 'Unit Converter', desc_zh: '长度、重量、温度互转', desc_en: 'Length, weight, temperature converter', type: 'tool', status: 'online' },
  { id: 'bp-3', name_zh: '贪吃蛇', name_en: 'Snake Game', desc_zh: '经典游戏，方向键/WASD', desc_en: 'Classic snake game', type: 'game', status: 'beta' },
  { id: 'bp-4', name_zh: 'JSON 格式化', name_en: 'JSON Formatter', desc_zh: '美化与校验 JSON', desc_en: 'Pretty-print JSON', type: 'tool', status: 'coming' },
]

const userProducts = ref(getAllProducts())
const allProducts = computed(() => [...userProducts.value, ...builtinProducts])

const submitVisible = ref(false)
const submitForm = ref({ name: '', desc: '', type: 'tool', file: null, fileName: '' })
const dragOver = ref(false)
const pendingProducts = ref([])

function handleFileUpload(e) {
  const files = e.target.files || e.dataTransfer.files
  if (!files || !files.length) return
  const file = files[0]
  if (file.size > 5 * 1024 * 1024) {
    alert(lang === 'zh' ? '文件不能超过 5MB' : 'File must be < 5MB')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    submitForm.value.file = reader.result
    submitForm.value.fileName = file.name
    // Auto-detect type
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar') || file.name.endsWith('.7z')) {
      submitForm.value.type = 'game'
    }
  }
  reader.readAsDataURL(file)
}

function submitProd() {
  const f = submitForm.value
  if (!f.name.trim()) return
  submitProduct({
    name_zh: f.name, name_en: f.name,
    desc_zh: f.desc || '用户提交的项目', desc_en: f.desc || 'User submitted project',
    type: f.type, status: 'beta', file: f.file || null, fileName: f.fileName || '',
  })
  submitForm.value = { name: '', desc: '', type: 'tool', file: null, fileName: '' }
  submitVisible.value = false
  alert(lang === 'zh' ? '提交成功，等待审核后展示！' : 'Submitted! Waiting for review.')
}

function checkPending() { pendingProducts.value = getPendingProducts() }
checkPending()
function handleApprove(id) { approveProduct(id); checkPending(); userProducts.value = getAllProducts() }
function handleReject(id) { rejectProduct(id); checkPending() }

const statusLabel = (s) => {
  const map = { online: '已上线', beta: '测试中', coming: '开发中' }
  const mapEn = { online: 'Live', beta: 'Beta', coming: 'Coming' }
  return lang==='zh'?map[s]:mapEn[s]
}

function downloadProduct(p) {
  if (p.file) { const a = document.createElement('a'); a.href = p.file; a.download = p.fileName || 'download'; a.click() }
  else { alert(lang === 'zh' ? '暂无安装包' : 'No package available') }
}
</script>
<template>
  <div>
    <!-- Pending banner -->
    <div v-if="pendingProducts.length > 0" style="background:#fff7e6;border:1px solid #ffd591;border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-size:0.85rem">
      <strong>{{ lang==='zh'?'待审核':'Pending' }}:</strong>
      <span v-for="p in pendingProducts" :key="p.id" style="display:inline-flex;align-items:center;gap:0.4rem;margin-left:0.5rem;flex-wrap:wrap">
        {{ p.name_zh }}
        <button class="btn btn-sm btn-primary" @click="handleApprove(p.id)" style="padding:0.15rem 0.45rem;font-size:0.72rem">✓ {{ lang==='zh'?'通过':'Approve' }}</button>
        <button style="padding:0.15rem 0.45rem;font-size:0.72rem;background:transparent;border:1px solid #ccc;color:#999;cursor:pointer;border-radius:4px;font-family:inherit" @click="handleReject(p.id)">✕ {{ lang==='zh'?'拒绝':'Reject' }}</button>
      </span>
    </div>

    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h1>{{ lang==='zh'?'产品与项目':'Products & Projects' }}</h1>
        <p class="subtitle">{{ lang==='zh'?'团队开发 + 社区贡献。':'Team projects + community contributions.' }}</p>
      </div>
      <button class="btn btn-primary" @click="submitVisible=!submitVisible">
        {{ lang==='zh'?'+ 提交项目':'+ Submit' }}
      </button>
    </div>

    <!-- Submit form with drag & drop -->
    <div v-if="submitVisible" style="border:1px solid var(--accent);border-radius:8px;padding:1rem;margin-bottom:1rem">
      <input v-model="submitForm.name" :placeholder="lang==='zh'?'项目名称 *':'Project name *'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <input v-model="submitForm.desc" :placeholder="lang==='zh'?'简短描述':'Short description'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />

      <!-- Drag & drop zone -->
      <div :class="['drop-zone', { dragging: dragOver }]"
        @dragover.prevent="dragOver=true" @dragleave.prevent="dragOver=false"
        @drop.prevent="dragOver=false; handleFileUpload($event)">
        <div v-if="!submitForm.fileName" class="drop-zone-text">
          <div class="drop-zone-plus">+</div>
          <div>{{ lang==='zh'?'拖拽安装包到此处':'Drag package here' }}</div>
          <div style="font-size:0.75rem;color:var(--text3)">{{ lang==='zh'?'支持 .zip .rar .7z 等，≤5MB':'ZIP/RAR/7Z supported, ≤5MB' }}</div>
          <label class="btn btn-sm btn-outline" style="margin-top:0.4rem;cursor:pointer;display:inline-flex">
            {{ lang==='zh'?'或点击选择':'or click to select' }}
            <input type="file" @change="handleFileUpload" style="display:none" />
          </label>
        </div>
        <div v-else class="drop-zone-file">
          <div style="font-size:1.2rem">📦</div>
          <div style="font-weight:500">{{ submitForm.fileName }}</div>
          <button class="btn btn-sm" style="background:none;border:1px solid var(--border);color:var(--text3);cursor:pointer;border-radius:4px;margin-top:0.3rem;font-family:inherit" @click="submitForm.file=null; submitForm.fileName=''">{{ lang==='zh'?'移除':'Remove' }}</button>
        </div>
      </div>

      <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:0.5rem">
        <select v-model="submitForm.type" style="padding:0.45rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit">
          <option value="tool">{{ lang==='zh'?'工具':'Tool' }}</option>
          <option value="game">{{ lang==='zh'?'游戏':'Game' }}</option>
        </select>
        <button class="btn btn-primary" @click="submitProd">{{ lang==='zh'?'提交审核':'Submit' }}</button>
      </div>
    </div>

    <!-- Tab bar -->
    <div style="display:flex;gap:0.4rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border);flex-wrap:wrap">
      <button v-for="(t,i) in tabs" :key="t" :class="['btn btn-sm', activeTab===t?'btn-primary':'btn-outline']" @click="activeTab=t">
        {{ lang==='zh'?tabNames_zh[i]:tabNames_en[i] }}
      </button>
    </div>

    <!-- Tab: Converters -->
    <div v-if="activeTab === 'converters'">
      <h2 style="margin-top:0">{{ lang==='zh'?'在线转换工具':'Online Converters' }}</h2>
      <ConverterHub :lang="lang" />
    </div>

    <!-- Tab: Games -->
    <div v-if="activeTab === 'games'">
      <h2 style="margin-top:0">{{ lang==='zh'?'小游戏':'Mini Games' }}</h2>
      <GameHub :lang="lang" />
    </div>

    <!-- Tab: Algorithms -->
    <div v-if="activeTab === 'algo'">
      <h2 style="margin-top:0">{{ lang==='zh'?'算法演示':'Algorithm Demos' }}</h2>
      <AlgoHub :lang="lang" />
    </div>

    <!-- Tab: All (product cards) -->
    <div v-if="activeTab === 'all'">
      <div class="card-grid">
        <div v-for="p in allProducts" :key="p.id" class="card-item">
          <h3>{{ lang==='zh'?p.name_zh:p.name_en }}</h3>
          <p class="desc">{{ lang==='zh'?p.desc_zh:p.desc_en }}</p>
          <div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap;margin-bottom:0.5rem">
            <span v-if="p.status==='online'" style="font-size:0.75rem;padding:0.1rem 0.45rem;border-radius:100px;background:#e6f7e6;color:#389e0d"> {{ statusLabel(p.status) }}</span>
            <span v-else style="font-size:0.75rem;padding:0.1rem 0.45rem;border-radius:100px;background:var(--accent-light);color:var(--accent)"> {{ statusLabel(p.status) }}</span>
            <span v-if="p.fileName" style="font-size:0.72rem;color:var(--text3)"> {{ p.fileName }}</span>
          </div>
          <div style="display:flex;gap:0.4rem">
            <button v-if="p.file" class="btn btn-sm btn-primary" @click="downloadProduct(p)"> {{ lang==='zh'?'下载':'Download' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-zone {
  border: 2px dashed var(--border); border-radius: 8px; padding: 1.5rem;
  text-align: center; cursor: pointer; transition: all .15s;
  margin-bottom: 0.5rem;
}
.drop-zone:hover, .drop-zone.dragging { border-color: var(--accent); background: var(--accent-light); }
.drop-zone-plus { font-size: 2rem; color: var(--text3); margin-bottom: 0.3rem; }
.drop-zone-text { font-size: 0.85rem; color: var(--text3); }
.drop-zone-file { padding: 0.5rem 0; }
</style>
