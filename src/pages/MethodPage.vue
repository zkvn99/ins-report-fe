<script setup>
import ReportPage from '../components/ReportPage.vue'
</script>

<template>
  <ReportPage
    section="method"
    eyebrow="부록 · 계산과 적용 기준"
    title="이 보고서는 이렇게 계산합니다"
    lead="원문 사실, 표준 보장 비교, 공개 통계를 서로 다른 단계로 분리했습니다."
    :customer-name="report.customer.name"
  >
    <div class="method-grid">
      <article><b>01</b><h3>AI는 원문 사실 추출</h3><p>검사값·보험사·상품·담보명·가입금액·출처를 JSON으로 정리합니다. 합계와 부족금액은 AI가 계산하지 않습니다.</p></article>
      <article><b>02</b><h3>Rule Engine이 보험 매핑</h3><p>명확한 coverage_id 또는 검토된 룰만 표준 담보에 연결합니다. 미매핑 담보는 버리지 않고 별도 보존합니다.</p></article>
      <article><b>03</b><h3>Aggregation이 금액 계산</h3><p>독립 정액보장은 합산하고, MAX·UNIQUE_POOL·일당·실손 등은 지급구조에 맞는 집계방식을 사용합니다.</p></article>
      <article><b>04</b><h3>Renderer는 표시만 담당</h3><p>Vue 페이지는 계산된 ViewModel만 받아 A4 화면을 그립니다. 계산규칙과 CSS를 서로 섞지 않습니다.</p></article>
    </div>
    <div class="method-warning">
      의료비 통계는 출처의 환자군·기간·집계단위를 그대로 표시합니다. 입원·외래 평균을 더하거나, 연간 평균을 임의로 3년·5년 누적 비용으로 만들지 않습니다.
    </div>
  </ReportPage>
</template>

<script>
export default { props: { report: { type: Object, required: true } } }
</script>
