<script setup>
import ReportToolbar from './components/ReportToolbar.vue'
import ReportDocument from './pages/ReportDocument.vue'
import { useReportApp } from './app/useReportApp.js'

const app = useReportApp()
</script>

<template>
  <ReportToolbar
    :ready="app.ready.value"
    :file-name="app.fileName.value"
    :messages="app.messages.value"
    :input="app.rawInput.value"
    @load-text="app.loadText"
    @load-object="app.loadObject"
    @clear="app.clear"
    @print="app.printReport"
    @export-json="app.exportNormalizedJson"
    @export-html="app.exportFilledHtml"
  />

  <main class="app-shell">
    <section v-if="!app.ready.value" class="empty-state">
      <h1>건강자산 &amp; 보장분석</h1>
      <p>고객 JSON을 불러오면 검진·보험·통계 데이터를 조합해 A4 보고서를 생성합니다.</p>
      <p class="muted">AI는 원문 사실을 JSON으로 만들고, 계산·합산·페이지 구성은 이 프로젝트가 담당합니다.</p>
    </section>

    <ReportDocument v-else :report="app.report.value" />
  </main>
</template>
