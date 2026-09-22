<script setup>
import { onMounted, ref } from 'vue'
import { downloadReportPdf, getReport } from '../../api/reportApi.js'
import ReportView from '../../report/ReportView.vue'
import { validateReportData } from '../../report/reportValidator.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'

const props = defineProps({ reportId: { type: String, required: true } })
const reportData = ref(null)
const error = ref('')
const isDownloading = ref(false)

async function createPdfDownload() {
  if (isDownloading.value) return
  isDownloading.value = true
  error.value = ''
  try {
    const blob = await downloadReportPdf(props.reportId)
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `medicover-report-${props.reportId}.pdf`
    anchor.click()
    URL.revokeObjectURL(url)
  } catch (cause) {
    error.value = cause.message || 'PDF를 생성하지 못했습니다.'
  } finally {
    isDownloading.value = false
  }
}

onMounted(async () => {
  try {
    const report = await getReport(props.reportId)
    const validation = validateReportData(report)
    if (!validation.valid) throw new Error(validation.errors[0].message)
    reportData.value = report
  } catch (cause) {
    error.value = cause.message || '보고서를 불러오지 못했습니다.'
  }
})
</script>

<template>
  <AppAlert v-if="error" class="screen-only">{{ error }}</AppAlert>
  <div v-else-if="!reportData" class="empty-box screen-only">보고서를 불러오는 중입니다.</div>
  <section v-else class="backend-report-panel">
    <div class="report-result-actions screen-only">
      <div><p class="home-kicker">MEDICOVER REPORT</p><h1>건강자산 &amp; 보장분석</h1><p class="muted">Backend에서 계산·저장된 최종 리포트입니다.</p></div>
      <AppButton :disabled="isDownloading" @click="createPdfDownload">{{ isDownloading ? 'PDF 생성 중...' : 'PDF 다운로드' }}</AppButton>
    </div>
    <ReportView :report="reportData" />
  </section>
</template>
