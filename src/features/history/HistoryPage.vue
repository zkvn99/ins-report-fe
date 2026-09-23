<script setup>
import { onMounted, ref } from 'vue'
import { downloadReportPdf, getReportResults } from '../../api/reportApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppPagination from '../../shared/components/AppPagination.vue'
import {
  calculateHistoryNumber,
  canDownloadPdf,
  formatHistoryDate,
  getAnalysisStatusLabel
} from './historyUtils.js'

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
    const response = await getReportResults(targetPage, PAGE_SIZE)
    results.value = response.content || []
    page.value = response.page
    totalElements.value = response.totalElements
    totalPages.value = response.totalPages
  } catch (cause) {
    error.value = cause.message || '결과이력을 불러오지 못했습니다.'
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
      <p class="home-kicker">MEDICOVER HISTORY</p>
      <h1>결과이력</h1>
      <p>최근 산출한 건강자산 및 보장분석 결과를 확인할 수 있습니다.</p>
    </div>

    <AppAlert v-if="error">{{ error }}</AppAlert>

    <div class="history-table-wrap" :aria-busy="isLoading">
      <table class="history-table">
        <thead>
          <tr>
            <th>No</th>
            <th>산출일시</th>
            <th>사용자명</th>
            <th>고객명</th>
            <th>고유번호</th>
            <th>산출상태</th>
            <th>PDF 다운로드</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && results.length === 0">
            <td colspan="7" class="history-empty">결과이력을 불러오는 중입니다.</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="7" class="history-empty">산출된 결과가 없습니다.</td>
          </tr>
          <template v-else>
            <tr v-for="(result, index) in results" :key="result.uniqueNumber">
              <td>{{ calculateHistoryNumber(totalElements, page, PAGE_SIZE, index) }}</td>
              <td>{{ formatHistoryDate(result.createdAt) }}</td>
              <td>{{ result.userName || '-' }}</td>
              <td>{{ result.customerName || '-' }}</td>
              <td class="history-unique-number" :title="result.uniqueNumber">{{ result.uniqueNumber }}</td>
              <td><span class="history-status" :class="`is-${result.status?.toLowerCase()}`">{{ getAnalysisStatusLabel(result.status) }}</span></td>
              <td>
                <button
                  class="history-download-button"
                  type="button"
                  :disabled="!canDownloadPdf(result) || downloadingReportIds.has(result.reportId)"
                  @click="downloadPdf(result)"
                >
                  {{ downloadingReportIds.has(result.reportId) ? 'PDF 생성 중...' : '다운로드' }}
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <AppPagination :page="page" :total-pages="totalPages" :disabled="isLoading" @change="loadHistory" />
  </section>
</template>
