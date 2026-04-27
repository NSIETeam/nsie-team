<script setup>
import { ref } from 'vue'
defineProps({ lang: String })

const products = ref([
  { name_zh: '简易计算器', name_en: 'Simple Calculator', desc_zh: '一个轻量级四则运算工具', desc_en: 'A lightweight arithmetic tool',
    type: 'tool', status: 'online', icon: '🧮' },
  { name_zh: '单位换算器', name_en: 'Unit Converter', desc_zh: '长度、重量、温度等多单位互换', desc_en: 'Length, weight, temperature converter',
    type: 'tool', status: 'online', icon: '📏' },
  { name_zh: '贪吃蛇小游戏', name_en: 'Snake Game', desc_zh: '经典贪吃蛇，键盘/触屏双支持', desc_en: 'Classic snake game with keyboard & touch support',
    type: 'game', status: 'beta', icon: '🐍' },
  { name_zh: 'JSON 格式化工具', name_en: 'JSON Formatter', desc_zh: '美化与校验 JSON 数据', desc_en: 'Pretty-print and validate JSON',
    type: 'tool', status: 'coming', icon: '📋' },
  { name_zh: 'Markdown 编辑器', name_en: 'Markdown Editor', desc_zh: '实时预览的在线 MD 编辑器', desc_en: 'Real-time preview markdown editor',
    type: 'tool', status: 'coming', icon: '✏️' },
])

const statusLabel = (s) => {
  const map = { online: '已上线', beta: '测试中', coming: '开发中' }
  const mapEn = { online: 'Live', beta: 'Beta', coming: 'Coming' }
  return lang==='zh'?map[s]:mapEn[s]
}

const submitVisible = ref(false)
const submitForm = ref({ name: '', desc: '', type: 'tool' })

function handleSubmit() {
  if (!submitForm.value.name.trim()) return
  products.value.unshift({
    name_zh: submitForm.value.name,
    name_en: submitForm.value.name,
    desc_zh: submitForm.value.desc || '用户提交的新项目',
    desc_en: submitForm.value.desc || 'User submitted project',
    type: submitForm.value.type,
    status: 'beta',
    icon: '🚀',
  })
  submitForm.value = { name: '', desc: '', type: 'tool' }
  submitVisible.value = false
}
</script>
<template>
  <div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h1>{{ lang==='zh'?'产品与项目':'Products & Projects' }}</h1>
        <p class="subtitle">{{ lang==='zh'?'团队开发的小游戏、小工具、小项目合集。':'Mini games, tools & projects by the team.' }}</p>
      </div>
      <button class="btn btn-primary" @click="submitVisible=!submitVisible">
        {{ lang==='zh'?'+ 提交项目':'+ Submit' }}
      </button>
    </div>

    <!-- Submit form -->
    <div v-if="submitVisible" style="border:1px solid var(--accent);border-radius:8px;padding:1rem;margin-bottom:1rem">
      <input v-model="submitForm.name" :placeholder="lang==='zh'?'项目名称':'Project name'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <input v-model="submitForm.desc" :placeholder="lang==='zh'?'简短描述':'Short description'" style="width:100%;margin-bottom:0.5rem;padding:0.5rem 0.7rem;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;font-family:inherit" />
      <div style="display:flex;gap:0.5rem;justify-content:flex-end">
        <select v-model="submitForm.type" style="padding:0.45rem 0.6rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit">
          <option value="tool">{{ lang==='zh'?'工具':'Tool' }}</option>
          <option value="game">{{ lang==='zh'?'游戏':'Game' }}</option>
        </select>
        <button class="btn btn-primary" @click="handleSubmit">{{ lang==='zh'?'提交':'Submit' }}</button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="p in products" :key="p.name_zh" class="card-item">
        <div style="font-size:2rem;margin-bottom:0.5rem">{{ p.icon }}</div>
        <h3>{{ lang==='zh'?p.name_zh:p.name_en }}</h3>
        <p class="desc">{{ lang==='zh'?p.desc_zh:p.desc_en }}</p>
        <span v-if="p.status==='online'" style="display:inline-block;font-size:0.75rem;padding:0.1rem 0.45rem;border-radius:100px;background:#e6f7e6;color:#389e0d">✅ {{ statusLabel(p.status) }}</span>
        <span v-else style="display:inline-block;font-size:0.75rem;padding:0.1rem 0.45rem;border-radius:100px;background:var(--accent-light);color:var(--accent)">🔄 {{ statusLabel(p.status) }}</span>
      </div>
    </div>

    <div style="margin-top:1.5rem;text-align:center;padding:1rem 0;border-top:1px solid var(--border)">
      <p style="font-size:0.85rem;color:var(--text3)">
        {{ lang==='zh'?'想提交自己的项目？点击上方按钮。':'Want to submit your own project? Click the button above.' }}
      </p>
    </div>
  </div>
</template>
