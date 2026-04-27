<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const score = ref(0)
const gameOver = ref(false)
const running = ref(false)

let snake, food, dir, nextDir, timer
const S = 20, COLS = 20, ROWS = 20

function init() {
  snake = [{x:5,y:10}, {x:4,y:10}, {x:3,y:10}]
  dir = {x:1,y:0}; nextDir = {x:1,y:0}
  score.value = 0; gameOver.value = false
  spawnFood()
}

function spawnFood() {
  while (true) {
    food = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)}
    if (!snake.some(s => s.x === food.x && s.y === food.y)) break
  }
}

function draw() {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#f8f8f8'
  ctx.fillRect(0, 0, c.width, c.height)

  // Grid
  ctx.strokeStyle = '#eee'; ctx.lineWidth = 0.5
  for (let x=0; x<=COLS; x++) { ctx.beginPath(); ctx.moveTo(x*S,0); ctx.lineTo(x*S,ROWS*S); ctx.stroke() }
  for (let y=0; y<=ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*S); ctx.lineTo(COLS*S,y*S); ctx.stroke() }

  // Snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#2b5f8a' : '#4a8bb5'
    ctx.fillRect(s.x*S+1, s.y*S+1, S-2, S-2)
  })

  // Food
  ctx.fillStyle = '#e8453c'
  ctx.beginPath()
  ctx.arc(food.x*S+S/2, food.y*S+S/2, S/2-2, 0, Math.PI*2)
  ctx.fill()
}

function tick() {
  if (gameOver.value) return
  dir = { ...nextDir }
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver.value = true; running.value = false; draw(); return
  }
  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) { score.value++; spawnFood() }
  else snake.pop()
  draw()
}

function start() { init(); running.value = true; if (timer) clearInterval(timer); timer = setInterval(tick, 150) }
function stopGame() { running.value = false; if (timer) clearInterval(timer) }

function keydown(e) {
  if (!running.value) return
  const k = e.key
  if ((k === 'ArrowUp' || k === 'w') && dir.y !== 1) nextDir = {x:0,y:-1}
  else if ((k === 'ArrowDown' || k === 's') && dir.y !== -1) nextDir = {x:0,y:1}
  else if ((k === 'ArrowLeft' || k === 'a') && dir.x !== 1) nextDir = {x:-1,y:0}
  else if ((k === 'ArrowRight' || k === 'd') && dir.x !== -1) nextDir = {x:1,y:0}
}

onMounted(() => { init(); draw(); window.addEventListener('keydown', keydown) })
onUnmounted(() => { if (timer) clearInterval(timer); window.removeEventListener('keydown', keydown) })
</script>
<template>
  <div style="display:flex;flex-direction:column;align-items:center">
    <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:0.5rem">
      <div style="font-size:1.1rem;font-weight:600">分数: {{ score }}</div>
      <button class="btn btn-sm btn-primary" @click="start" :disabled="running">{{ running?'进行中':'开始游戏' }}</button>
      <button class="btn btn-sm btn-outline" @click="stopGame" :disabled="!running">暂停</button>
    </div>
    <canvas ref="canvas" :width="COLS*S" :height="ROWS*S" style="border:1px solid var(--border);border-radius:6px;max-width:100%"></canvas>
    <div v-if="gameOver" style="margin-top:0.3rem;color:#e8453c;font-size:0.9rem">游戏结束！得分: {{ score }}</div>
    <div style="margin-top:0.3rem;font-size:0.75rem;color:var(--text3)">方向键 / WASD 控制</div>
  </div>
</template>
