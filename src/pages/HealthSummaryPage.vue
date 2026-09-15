<script setup>
import ReportPage from '../components/ReportPage.vue'
import StatusTag from '../components/StatusTag.vue'
</script>

<template>
  <ReportPage
    section="health-summary"
    eyebrow="01 · 최근 건강검진"
    title="최근 건강검진 기록을 정리했습니다"
    lead="원문에 기재된 검사값과 소견을 중심으로 확인이 필요한 부분과 양호한 부분을 구분했습니다."
    :customer-name="report.customer.name"
  >
    <section class="provenance-grid">
      <div><span>자료 출처</span><b>{{ record?.provider || '제공된 건강검진 자료' }}</b></div>
      <div><span>최근 검진일</span><b>{{ record?.checkup_date || '—' }}</b></div>
      <div><span>검진기관</span><b>{{ record?.institution || '기관명 미제공' }}</b></div>
    </section>

    <section class="summary-counts">
      <div class="action"><b>{{ report.summary.actionCount }}</b><span>확인 필요 영역</span></div>
      <div class="watch"><b>{{ report.summary.watchCount }}</b><span>관리 영역</span></div>
      <div class="good"><b>{{ report.summary.goodCount }}</b><span>양호 영역</span></div>
    </section>

    <section class="area-grid">
      <article v-for="area in priorityAreas" :key="area.id" :class="['area-card', area.state]">
        <div class="area-card-head"><h3>{{ area.label }}</h3><StatusTag :state="area.state" /></div>
        <strong>{{ area.result }}</strong>
        <p>{{ area.detail || '원문 소견과 추적검사 여부를 함께 확인하세요.' }}</p>
      </article>
    </section>
  </ReportPage>
</template>

<script>
export default {
  props: { report: { type: Object, required: true } },
  computed: {
    record() { return this.report.health.recentRecordDisplay },
    priorityAreas() {
      const ranked = [...this.report.health.areas].sort((a, b) => ({ action: 0, watch: 1, good: 2, info: 3, unknown: 4 }[a.state] - ({ action: 0, watch: 1, good: 2, info: 3, unknown: 4 }[b.state])))
      return ranked.slice(0, 6)
    }
  }
}
</script>
