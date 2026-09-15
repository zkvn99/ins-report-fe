<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import UploadView from './views/UploadView.vue'
import AnalysisView from './views/AnalysisView.vue'
import ReviewView from './views/ReviewView.vue'
import ReportView from './views/ReportView.vue'
import JsonDevView from './views/JsonDevView.vue'
import { createAnalysis, getAnalysis, getReport, getReviewItems, submitReview } from './api/reportApi.js'
import { validateReportData } from './utils/reportValidator.js'

const step = ref('UPLOAD')
const analysisId = ref(null)
const status = ref({ status: 'WAITING', progress: 0, message: '분석을 준비하고 있습니다.' })
const reviewItems = ref([])
const reportData = ref(null)
const errorMessage = ref('')
const devTools = import.meta.env.VITE_DEV_TOOLS === 'true'
let pollingTimer = null

const currentTitle = computed(() => {
  if (step.value === 'UPLOAD') return '자료 업로드'
  if (step.value === 'ANALYZING') return '분석'
  if (step.value === 'REVIEW') return '검토'
  if (step.value === 'REPORT') return '보고서'
  return '자료 업로드'
})

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

async function syncStatus() {
  if (!analysisId.value) return

  try {
    const result = await getAnalysis(analysisId.value)
    status.value = {
      status: result.status || 'WAITING',
      progress: Number(result.progress || 0),
      message: result.message || '분석을 진행하고 있습니다.'
    }

    if (result.status === 'REVIEW_REQUIRED') {
      stopPolling()
      step.value = 'REVIEW'
      const items = await getReviewItems(analysisId.value)
      reviewItems.value = Array.isArray(items) ? items : []
    } else if (result.status === 'COMPLETED') {
      stopPolling()
      const nextReport = await getReport(analysisId.value)
      const validation = validateReportData(nextReport)
      if (!validation.valid) {
        errorMessage.value = validation.errors.map(item => item.message).join(', ')
        step.value = 'UPLOAD'
        return
      }
      reportData.value = nextReport
      step.value = 'REPORT'
    } else if (result.status === 'FAILED') {
      stopPolling()
      errorMessage.value = result.message || '분석에 실패했습니다.'
      step.value = 'UPLOAD'
    }
  } catch (err) {
    stopPolling()
    errorMessage.value = err.message || '분석 상태를 확인하는 중 오류가 발생했습니다.'
    step.value = 'UPLOAD'
  }
}

function beginPolling() {
  stopPolling()
  pollingTimer = setInterval(() => {
    syncStatus()
  }, 1200)
}

async function handleSubmit(formData) {
  errorMessage.value = ''
  reviewItems.value = []
  reportData.value = null

  try {
    const result = await createAnalysis(formData)
    analysisId.value = result.analysisId || result.id || null
    step.value = 'ANALYZING'
    status.value = {
      status: 'PROCESSING',
      progress: 10,
      message: '업로드된 자료를 분석하고 있습니다.'
    }
    beginPolling()
  } catch (err) {
    errorMessage.value = err.message || '분석을 시작하지 못했습니다.'
    step.value = 'UPLOAD'
  }
}

async function confirmReview() {
  if (!analysisId.value) return

  try {
    step.value = 'ANALYZING'
    status.value = { status: 'PROCESSING', progress: 80, message: '검토 내용을 반영하고 다시 계산합니다.' }
    await submitReview(analysisId.value, reviewItems.value)
    beginPolling()
  } catch (err) {
    errorMessage.value = err.message || '검토를 반영하지 못했습니다.'
    step.value = 'REVIEW'
  }
}

function resetFlow() {
  stopPolling()
  step.value = 'UPLOAD'
  analysisId.value = null
  reviewItems.value = []
  reportData.value = null
  status.value = { status: 'WAITING', progress: 0, message: '분석을 준비하고 있습니다.' }
  errorMessage.value = ''
}

onBeforeUnmount(() => stopPolling())
</script>

<template>
  <header class="app-header">
    <div class="brand-block">
      <div class="brand-badge">건강자산 &amp; 보장분석</div>
      <span>{{ currentTitle }}</span>
    </div>

    <nav class="app-nav">
      <button :class="{ active: step === 'UPLOAD' }" @click="resetFlow">업로드</button>
      <button :class="{ active: step === 'ANALYZING' }" disabled>분석</button>
      <button :class="{ active: step === 'REVIEW' }" disabled>검토</button>
      <button :class="{ active: step === 'REPORT' }" disabled>보고서</button>
    </nav>

    <button v-if="devTools" class="secondary" @click="step = 'UPLOAD'">JSON 테스트</button>
  </header>

  <main class="app-shell">
    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

    <UploadView v-if="step === 'UPLOAD'" :disabled="false" :is-busy="false" @submit="handleSubmit" />
    <AnalysisView v-else-if="step === 'ANALYZING'" :status="status" />
    <ReviewView v-else-if="step === 'REVIEW'" :items="reviewItems" @confirm="confirmReview" />
    <ReportView v-else-if="step === 'REPORT'" :report="reportData" />

    <JsonDevView v-if="devTools" :dev-tools="devTools" />
  </main>
</template>
