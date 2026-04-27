<script setup>
import { ref, computed } from 'vue'

defineProps({ lang: String })

const converters = ref([
  { id: 'json', name_zh: 'JSON 格式化', name_en: 'JSON Formatter', desc_zh: '美化、压缩、校验 JSON', desc_en: 'Pretty-print, minify, validate JSON' },
  { id: 'base64', name_zh: 'Base64 编解码', name_en: 'Base64 Encode/Decode', desc_zh: '文本与 Base64 互转', desc_en: 'Text to/from Base64' },
  { id: 'markdown', name_zh: 'Markdown 预览', name_en: 'Markdown Preview', desc_zh: 'MD 文本实时转 HTML', desc_en: 'Real-time MD to HTML' },
  { id: 'color', name_zh: '颜色转换', name_en: 'Color Converter', desc_zh: 'HEX/RGB/HSL 互转', desc_en: 'HEX/RGB/HSL converter' },
  { id: 'count', name_zh: '文字统计', name_en: 'Text Counter', desc_zh: '字数/行数/字符统计', desc_en: 'Word/line/char counter' },
  { id: 'qrcode', name_zh: '二维码生成', name_en: 'QR Code', desc_zh: '输入文本生成二维码', desc_en: 'Generate QR code from text' },
  { id: 'tts', name_zh: '文字转语音', name_en: 'Text to Speech', desc_zh: '朗读输入的文本', desc_en: 'Read text aloud' },
  { id: 'img2pdf', name_zh: '图片转 PDF', name_en: 'Image to PDF', desc_zh: '上传图片生成 PDF', desc_en: 'Upload images to make PDF' },
  { id: 'imgcompress', name_zh: '图片压缩', name_en: 'Image Compress', desc_zh: '压缩图片尺寸与质量', desc_en: 'Resize and compress images' },
  { id: 'diff', name_zh: '文本对比', name_en: 'Text Diff', desc_zh: '对比两段文本差异', desc_en: 'Compare two texts' },
])

const activeId = ref(null)
const activeConverter = computed(() => converters.value.find(c => c.id === activeId.value))

function select(id) { activeId.value = activeId.value === id ? null : id }
</script>
<template>
  <div class="converter-hub">
    <div class="ch-grid">
      <button v-for="c in converters" :key="c.id" class="ch-item" :class="{ active: activeId === c.id }" @click="select(c.id)">
        <div class="ch-icon">{{ c.id === 'json' ? '{ }' : c.id === 'base64' ? 'aZ' : c.id === 'markdown' ? 'M↓' : c.id === 'color' ? '🎨' : c.id === 'count' ? 'Σ' : c.id === 'qrcode' ? '◼' : c.id === 'tts' ? '♪' : c.id === 'img2pdf' ? '📄' : c.id === 'imgcompress' ? '▫' : '⇄' }}</div>
        <div class="ch-name">{{ lang==='zh' ? c.name_zh : c.name_en }}</div>
        <div class="ch-desc">{{ lang==='zh' ? c.desc_zh : c.desc_en }}</div>
      </button>
    </div>

    <!-- JSON Formatter -->
    <div v-if="activeId === 'json'" class="ch-panel">
      <JsonFormatter />
    </div>
    <!-- Base64 -->
    <div v-if="activeId === 'base64'" class="ch-panel">
      <Base64Coder />
    </div>
    <!-- Markdown -->
    <div v-if="activeId === 'markdown'" class="ch-panel">
      <MdPreview />
    </div>
    <!-- Color -->
    <div v-if="activeId === 'color'" class="ch-panel">
      <ColorConverter />
    </div>
    <!-- Counter -->
    <div v-if="activeId === 'count'" class="ch-panel">
      <TextCounter />
    </div>
    <!-- QR -->
    <div v-if="activeId === 'qrcode'" class="ch-panel">
      <QrGenerator />
    </div>
    <!-- TTS -->
    <div v-if="activeId === 'tts'" class="ch-panel">
      <TtsReader />
    </div>
    <!-- Img2PDF -->
    <div v-if="activeId === 'img2pdf'" class="ch-panel">
      <Img2Pdf />
    </div>
    <!-- Img compress -->
    <div v-if="activeId === 'imgcompress'" class="ch-panel">
      <ImgCompress />
    </div>
    <!-- Diff -->
    <div v-if="activeId === 'diff'" class="ch-panel">
      <TextDiff />
    </div>
  </div>
</template>

<style scoped>
.converter-hub { margin-top: 0.5rem; }
.ch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.6rem; margin-bottom: 1rem; }
.ch-item {
  padding: 0.75rem 0.5rem; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--card); cursor: pointer; text-align: center; transition: all .12s; font-family: inherit;
}
.ch-item:hover { border-color: var(--accent); }
.ch-item.active { border-color: var(--accent); background: var(--accent-light); }
.ch-icon { font-size: 1.4rem; margin-bottom: 0.3rem; color: var(--accent); }
.ch-name { font-size: 0.82rem; font-weight: 600; margin-bottom: 0.15rem; }
.ch-desc { font-size: 0.72rem; color: var(--text3); }
.ch-panel {
  border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem;
  margin-top: 0.5rem;
}
</style>
