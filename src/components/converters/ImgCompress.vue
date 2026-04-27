<script setup>
import { ref } from 'vue'
const file = ref(null)
const preview = ref('')
const compressed = ref('')
const quality = ref(0.7)
const maxW = ref(800)
const loading = ref(false)

function handleFile(e) {
  const f = (e.target.files || e.dataTransfer.files)[0]
  if (!f || !f.type.startsWith('image/')) return
  file.value = f
  const reader = new FileReader()
  reader.onload = (ev) => { preview.value = ev.target.result; compress() }
  reader.readAsDataURL(f)
}

function compress() {
  if (!preview.value) return
  loading.value = true
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    let w = img.width, h = img.height
    if (w > maxW.value) { h = h * maxW.value / w; w = maxW.value }
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    compressed.value = canvas.toDataURL('image/jpeg', quality.value)
    loading.value = false
  }
  img.src = preview.value
}

function download() {
  const a = document.createElement('a')
  a.href = compressed.value
  a.download = file.value ? 'compressed_' + file.value.name.replace(/\.[^.]+$/, '.jpg') : 'compressed.jpg'
  a.click()
}

function formatSize(b) {
  return b < 1024 ? b + 'B' : b < 1048576 ? (b/1024).toFixed(1) + 'KB' : (b/1048576).toFixed(1) + 'MB'
}
</script>
<template>
  <div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.75rem">
      <div>
        <label style="font-size:0.8rem;display:block;margin-bottom:0.2rem">最大宽度: {{ maxW }}px</label>
        <input type="range" v-model.number="maxW" :min="200" :max="2000" :step="100" style="width:120px" @input="compress" />
      </div>
      <div>
        <label style="font-size:0.8rem;display:block;margin-bottom:0.2rem">质量: {{ Math.round(quality*100) }}%</label>
        <input type="range" v-model.number="quality" :min="0.1" :max="1" :step="0.1" style="width:120px" @input="compress" />
      </div>
    </div>
    <div style="border:2px dashed var(--border);border-radius:8px;padding:1.5rem;text-align:center;cursor:pointer"
      @dragover.prevent @drop.prevent="handleFile">
      <div style="font-size:0.85rem;color:var(--text3)">拖拽图片或点击选择</div>
      <input type="file" accept="image/*" @change="handleFile" style="display:none" id="compress-input" />
      <button class="btn btn-sm btn-outline" style="margin-top:0.4rem" @click="document.getElementById('compress-input').click()">选择文件</button>
    </div>
    <div v-if="preview" style="display:flex;gap:0.75rem;margin-top:0.75rem;flex-wrap:wrap">
      <div style="flex:1;min-width:150px">
        <div style="font-size:0.78rem;color:var(--text3);margin-bottom:0.2rem">原图 ({{ file?formatSize(file.size):'' }})</div>
        <img :src="preview" style="max-width:100%;max-height:150px;border-radius:6px" />
      </div>
      <div style="flex:1;min-width:150px">
        <div style="font-size:0.78rem;color:var(--text3);margin-bottom:0.2rem">压缩后</div>
        <img v-if="compressed" :src="compressed" style="max-width:100%;max-height:150px;border-radius:6px" />
        <div v-if="loading" style="font-size:0.8rem;color:var(--text3)">处理中…</div>
      </div>
    </div>
    <button v-if="compressed && !loading" class="btn btn-sm btn-primary" @click="download" style="margin-top:0.5rem">下载压缩图片</button>
  </div>
</template>
