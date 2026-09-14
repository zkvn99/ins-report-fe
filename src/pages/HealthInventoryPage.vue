<script setup>
import ReportPage from '../components/ReportPage.vue'
import StatusTag from '../components/StatusTag.vue'
</script>

<template>
  <ReportPage
    :section="`health-inventory-${pageIndex}`"
    eyebrow="부록 · 건강검진 항목"
    :title="pageIndex === 0 ? '확인한 건강검진 항목' : '확인한 건강검진 항목 · 계속'"
    lead="본문에 모두 표시하지 않은 검사값도 원문 값 그대로 보존합니다."
    :customer-name="report.customer.name"
  >
    <table class="inventory-table">
      <thead><tr><th>검사항목</th><th>결과</th><th>참고범위</th><th>상태</th><th>원문 소견</th></tr></thead>
      <tbody>
        <tr v-for="metric in items" :key="metric.metric_key">
          <td><b>{{ metric.name }}</b></td>
          <td>{{ metric.value ?? '—' }} {{ metric.unit || '' }}</td>
          <td>{{ metric.reference || '—' }}</td>
          <td><StatusTag :state="metric.state" /></td>
          <td>{{ metric.comment || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </ReportPage>
</template>

<script>
export default {
  props: {
    items: { type: Array, required: true },
    report: { type: Object, required: true },
    pageIndex: { type: Number, required: true }
  }
}
</script>
