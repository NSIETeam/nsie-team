<script setup>
defineProps({ lang: String })
</script>
<template>
  <div>
    <div v-if="lang==='zh'">
      <h1>关于 NSIE Team</h1>
      <p class="subtitle">Nature Science & Industrial Engineering</p>
      <p>NSIE 是 <strong>Nature Science & Industrial Engineering</strong> 的缩写，致力于践行终身学习。</p>
      <p>我们是一个以实践为导向的团队，专注于：</p>
      <ul style="margin:0.75rem 0 1rem 1.25rem">
        <li>技术知识的分享与沉淀</li>
        <li>有趣小工具和小游戏的开发</li>
        <li>学习方法的探索与实践</li>
        <li>开源精神的倡导与贡献</li>
      </ul>
      <p style="margin-top:1.5rem;color:var(--text3);font-size:0.9rem">联系邮箱：NSIETeam@outlook.com</p>
    </div>
    <div v-else>
      <h1>About NSIE Team</h1>
      <p class="subtitle">Nature Science & Industrial Engineering</p>
      <p>NSIE stands for <strong>Nature Science & Industrial Engineering</strong>, dedicated to lifelong learning.</p>
      <p>We are a practice-driven team focused on:</p>
      <ul style="margin:0.75rem 0 1rem 1.25rem">
        <li>Sharing and archiving technical knowledge</li>
        <li>Building fun mini tools and games</li>
        <li>Exploring learning methodologies</li>
        <li>Advocating open-source spirit</li>
      </ul>
      <p style="margin-top:1.5rem;color:var(--text3);font-size:0.9rem">Contact: NSIETeam@outlook.com</p>
    </div>
  </div>
</template>
