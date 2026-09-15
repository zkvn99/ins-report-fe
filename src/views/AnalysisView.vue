<script setup>
const props = defineProps({
  status: { type: Object, default: () => ({ status: 'WAITING', progress: 0, message: '' }) }
})
</script>

<template>
  <section class="analysis-panel">
    <h2>분석 진행</h2>
    <div class="progress-wrap">
      <div class="progress-bar">
        <span :style="{ width: `${Math.min(100, props.status.progress || 0)}%` }" />
      </div>
      <strong>{{ props.status.progress || 0 }}%</strong>
    </div>
    <p>{{ props.status.message || '분석을 시작하고 있습니다.' }}</p>
  </section>
</template>
