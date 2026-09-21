<script setup>
import { computed } from 'vue'
import { currentAnalysisResult } from './analysisResultStore.js'
import { findExtractionReport } from '../../report/extractionReportRegistry.js'

const reportComponent = computed(() =>
  findExtractionReport(currentAnalysisResult.value?.renderKey)
)
</script>

<template>
  <section v-if="currentAnalysisResult && reportComponent">
    <component :is="reportComponent" :result="currentAnalysisResult" />
  </section>
  <section v-else class="empty-result">
    <h1>분석 결과가 없습니다.</h1>
    <p>새로고침하면 개인정보 보호를 위해 메모리의 분석 결과가 제거됩니다.</p>
    <RouterLink to="/upload">자료 분석으로 이동</RouterLink>
  </section>
</template>

<style scoped>
.empty-result{max-width:760px;margin:48px auto;text-align:center;background:#fff;border:1px solid var(--line);border-radius:16px;padding:48px}.empty-result p{margin:12px 0 24px;color:var(--muted)}
</style>
