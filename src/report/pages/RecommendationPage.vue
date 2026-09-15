<script setup>
import ReportPage from '../components/ReportPage.vue'
import { formatWon } from '../formatters.js'
</script>

<template>
  <ReportPage
    section="recommendations"
    eyebrow="07 · 함께 확인할 보장"
    title="건강관리와 보장을 따로, 그러나 함께 봅니다"
    lead="현재 검진에서 관리가 필요한 영역과 연결된 보장 중 권장금액에 미달하는 항목을 우선 정리했습니다."
    :customer-name="report.customer.name"
  >
    <div v-if="report.recommendations.length" class="recommendation-grid">
      <article v-for="(item, index) in report.recommendations" :key="item.id" class="recommendation-card">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ item.name }}</h3>
        <dl>
          <div><dt>현재</dt><dd>{{ formatWon(item.currentWon) }}</dd></div>
          <div><dt>권장</dt><dd>{{ formatWon(item.targetWon) }}</dd></div>
          <div><dt>부족</dt><dd>{{ formatWon(item.gapWon) }}</dd></div>
        </dl>
      </article>
    </div>
    <div v-else class="large-empty">현재 연결 규칙에서 우선 보완 항목이 없습니다.</div>

    <section v-if="report.insurance.supplemental.length" class="supplemental-box">
      <h3>표준표에 아직 매핑하지 않은 추가 보장</h3>
      <p>아래 담보는 원문에서는 보유가 확인되지만 현재 118개 표준 비교항목에는 자동 합산하지 않았습니다.</p>
      <div class="supplemental-list">
        <span v-for="item in report.insurance.supplemental.slice(0, 12)" :key="item.sourceEntryKey">{{ item.riderName }}</span>
      </div>
    </section>
  </ReportPage>
</template>

<script>
export default { props: { report: { type: Object, required: true } } }
</script>
