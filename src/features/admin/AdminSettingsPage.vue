<script setup>
import { onMounted, ref } from 'vue'
import { downloadReportPdf, getAdminReportResults } from '../../api/reportApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import ResultHistoryTable from '../history/components/ResultHistoryTable.vue'
import { canDownloadPdf } from '../history/historyUtils.js'

const PAGE_SIZE = 20
const results = ref([])
const page = ref(0)
const totalElements = ref(0)
const totalPages = ref(0)
const isLoading = ref(false)
const error = ref('')
const downloadingReportIds = ref(new Set())

async function loadHistory(targetPage = 0) {
  if (isLoading.value) return
  isLoading.value = true
  error.value = ''
  try {
    const response = await getAdminReportResults(targetPage, PAGE_SIZE)
    results.value = response.content || []
    page.value = response.page
    totalElements.value = response.totalElements
    totalPages.value = response.totalPages
  } catch (cause) {
    error.value = cause.message || '전체 결과이력을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

async function downloadPdf(result) {
  if (!canDownloadPdf(result) || downloadingReportIds.value.has(result.reportId)) return
  downloadingReportIds.value = new Set(downloadingReportIds.value).add(result.reportId)
  error.value = ''
  try {
    const download = await downloadReportPdf(result.reportId)
    const url = URL.createObjectURL(download.blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = download.filename || `건강자산_보장분석_${result.uniqueNumber}.pdf`
    anchor.click()
    URL.revokeObjectURL(url)
  } catch (cause) {
    error.value = cause.message || 'PDF를 생성하지 못했습니다.'
  } finally {
    const remainingIds = new Set(downloadingReportIds.value)
    remainingIds.delete(result.reportId)
    downloadingReportIds.value = remainingIds
  }
}

onMounted(() => loadHistory())
</script>

<template>
  <section class="history-page">
    <div class="history-heading">
      <p class="home-kicker">ADMIN SETTINGS</p>
      <h1>설정</h1>
      <p>전체 결과이력</p>
    </div>

    <AppAlert v-if="error">{{ error }}</AppAlert>

    <ResultHistoryTable
      :results="results"
      :page="page"
      :page-size="PAGE_SIZE"
      :total-elements="totalElements"
      :total-pages="totalPages"
      :is-loading="isLoading"
      :downloading-report-ids="downloadingReportIds"
      show-admin-details
      @download="downloadPdf"
      @page-change="loadHistory"
    />
  </section>
</template>
