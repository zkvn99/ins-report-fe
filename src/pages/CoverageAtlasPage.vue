<script setup>
import ReportPage from '../components/ReportPage.vue'
import AnatomyFigure from '../components/AnatomyFigure.vue'
import CoverageProgress from '../components/CoverageProgress.vue'
</script>

<template>
  <ReportPage
    section="coverage-atlas"
    eyebrow="04 · 보유 보험"
    title="보유한 보험으로 정리한 보장 현황"
    :lead="`보험상품 ${report.summary.contractCount}개 계약과 보유 보장항목 ${report.summary.heldCoverageCount}개를 기준으로 권장금액과 비교했습니다.`"
    :customer-name="report.customer.name"
  >
    <section class="provenance-grid four">
      <div><span>분석한 보험상품</span><b>{{ report.summary.contractCount }}개 계약</b></div>
      <div><span>보유 비교항목</span><b>{{ report.summary.heldCoverageCount }}개</b></div>
      <div><span>전체 비교기준</span><b>{{ report.summary.totalCoverageCount }}개</b></div>
      <div><span>자료 기준</span><b>{{ report.insurance.asOfDate || report.meta.reportDate }}</b></div>
    </section>

    <div class="coverage-atlas-layout">
      <div class="coverage-area-list">
        <article v-for="area in coverageAreas" :key="area.id" class="coverage-area-card">
          <h3>{{ area.label }}</h3>
          <CoverageProgress v-for="item in area.coverages.slice(0, 2)" :key="item.id" :item="item" />
          <p v-if="!area.coverages.length" class="muted">현재 비교기준에 연결된 보장항목 없음</p>
        </article>
      </div>
      <div class="atlas-body"><AnatomyFigure :areas="report.health.areas" /></div>
    </div>

    <p class="page-note">보유 보장항목 수는 표준 비교항목 기준입니다. 원계약의 특약 행 개수와 다를 수 있습니다.</p>
  </ReportPage>
</template>

<script>
export default {
  props: { report: { type: Object, required: true } },
  computed: {
    coverageAreas() {
      const byId = new Map(this.report.insurance.coverage.map(item => [item.id, item]))
      return this.report.health.areas.map(area => ({
        ...area,
        coverages: (area.coverage_ids || []).map(id => byId.get(id)).filter(Boolean)
      }))
    }
  }
}
</script>
