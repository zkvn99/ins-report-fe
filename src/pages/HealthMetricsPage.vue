<script setup>
import ReportPage from '../components/ReportPage.vue'
import StatusTag from '../components/StatusTag.vue'
</script>

<template>
  <ReportPage
    section="health-metrics"
    eyebrow="03 · 주요 검사값"
    title="주요 수치를 다시 확인하세요"
    lead="원문 값을 바꾸지 않고, 중요도가 높은 항목을 우선 배치했습니다."
    :customer-name="report.customer.name"
  >
    <div class="metric-grid">
      <article v-for="metric in metrics" :key="metric.metric_key" :class="['metric-card', metric.state]">
        <div class="metric-head"><h3>{{ metric.short_name || metric.name }}</h3><StatusTag :state="metric.state" /></div>
        <div class="metric-value">{{ metric.value ?? '—' }} <small>{{ metric.unit || '' }}</small></div>
        <p v-if="metric.reference" class="metric-ref">참고범위 {{ metric.reference }}</p>
        <p>{{ metric.comment || '원문 검사결과를 확인하세요.' }}</p>
      </article>
    </div>
  </ReportPage>
</template>

<script>
export default {
  props: { report: { type: Object, required: true } },
  computed: {
    metrics() {
      const priority = { action: 0, watch: 1, good: 2, info: 3, unknown: 4 }
      const sorted = [...this.report.health.metrics].sort((a, b) => priority[a.state] - priority[b.state])
      return sorted.slice(0, 8)
    }
  }
}
</script>
