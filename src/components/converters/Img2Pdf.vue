<script setup>
import { ref } from 'vue'
const images = ref([])
const loading = ref(false)

function handleFiles(e) {
  const files = Array.from(e.target.files || e.dataTransfer.files)
  for (const f of files) {
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => images.value.push({ name: f.name, data: ev.target.result })
      reader.readAsDataURL(f)
    }
  }
}
function remove(i) { images.value.splice(i, 1) }
async function generatePdf() {
  if (!images.value.length) return
  loading.value = true
  // Use jspdf via dynamic import or fallback to a simple concatenation approach
  try {
    const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm')
    const pdf = new jsPDF()
    for (let i = 0; i < images.value.length; i++) {
      if (i > 0) pdf.addPage()
      const img = images.value[i]
      const imgProps = pdf.getImageProperties(img.data)
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      const wRatio = pw / imgProps.width
      const hRatio = ph / imgProps.height
      const ratio = Math.min(wRatio, hRatio, 1)
      const w = imgProps.width * ratio
      const h = imgProps.height * ratio
      pdf.addImage(img.data, 'JPEG', (pw - w) / 2, (ph - h) / 2, w, h)
    }
    pdf.save('converted.pdf')
  } catch(e) { alert('PDF generation failed: ' + e.message) }
  loading.value = false
}
</script>
<template>
  <div>
    <div style="border:2px dashed var(--border);border-radius:8px;padding:1.5rem;text-align:center;margin-bottom:0.75rem;cursor:pointer"
      @dragover.prevent @drop.prevent="handleFiles">
      <div style="font-size:2rem;color:var(--text3);margin-bottom:0.3rem">+</div>
      <div style="font-size:0.85rem;color:var(--text3)">拖拽图片到这里，或点击选择</div>
      <input type="file" multiple accept="image/*" @change="handleFiles" style="display:none" id="img2pdf-input" />
      <button class="btn btn-sm btn-outline" style="margin-top:0.5rem" @click="document.getElementById('img2pdf-input').click()">选择文件</button>
    </div>
    <div v-for="(img, i) in images" :key="i" style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0;font-size:0.82rem">
      <span style="flex:1">{{ img.name }}</span>
      <button style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:0.8rem" @click="remove(i)">x 移除</button>
    </div>
    <button v-if="images.length" class="btn btn-sm btn-primary" @click="generatePdf" :disabled="loading" style="margin-top:0.5rem">{{ loading?'处理中…':'生成 PDF' }}</button>
  </div>
</template>
