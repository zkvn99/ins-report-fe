<script setup>
import ReportPage from '../components/ReportPage.vue'
</script>

<template>
  <ReportPage
    :section="`sources-${pageIndex}`"
    eyebrow="부록 · 통계 출처"
    :title="pageIndex === 0 ? '사용한 공개 통계자료' : '사용한 공개 통계자료 · 계속'"
    lead="질환별 그래프의 기관·관찰기간·범위를 확인할 수 있습니다."
    :customer-name="report.customer.name"
  >
    <div class="source-list">
      <article v-for="source in items" :key="source.id" class="source-card">
        <div class="source-id">[{{ source.id }}]</div>
        <div>
          <h3>{{ source.short || source.title || source.id }}</h3>
          <p>{{ source.dataPeriod || '' }} {{ source.publicationYear ? `· ${source.publicationYear}` : '' }}</p>
          <a v-if="source.url" :href="source.url" target="_blank" rel="noopener">원문 보기</a>
        </div>
      </article>
    </div>
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
