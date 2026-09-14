<script setup>
import ReportPage from '../components/ReportPage.vue'
import AnatomyFigure from '../components/AnatomyFigure.vue'
import StatusTag from '../components/StatusTag.vue'
</script>

<template>
  <ReportPage
    section="health-atlas"
    eyebrow="02 · 건강 지도"
    title="검진 결과를 몸의 위치와 함께 봅니다"
    lead="인체 표시는 설명을 위한 위치 안내이며 질환 진단을 의미하지 않습니다."
    :customer-name="report.customer.name"
  >
    <div class="atlas-layout">
      <div class="atlas-list">
        <article v-for="area in report.health.areas" :key="area.id" :class="['atlas-item', area.state]">
          <div><b>{{ area.label }}</b><StatusTag :state="area.state" /></div>
          <p>{{ area.result }}</p>
        </article>
      </div>
      <div class="atlas-body"><AnatomyFigure :areas="report.health.areas" /></div>
    </div>
    <p class="page-note">검진 결과가 없는 영역은 ‘자료 없음’으로 유지합니다. 다른 검사값으로 임의 추정하지 않습니다.</p>
  </ReportPage>
</template>

<script>
export default { props: { report: { type: Object, required: true } } }
</script>
