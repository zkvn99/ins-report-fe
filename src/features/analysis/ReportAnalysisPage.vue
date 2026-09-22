<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getReportAnalysis } from '../../api/reportApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import LoadingSpinner from '../../shared/components/LoadingSpinner.vue'

const props = defineProps({ analysisId: { type: String, required: true } })
const router = useRouter()
const status = ref({ status: 'PROCESSING', progress: 0, message: '분석을 시작하고 있습니다.' })
const error = ref('')
let timer

function stopPolling() { if (timer) clearInterval(timer) }
async function sync() {
  try {
    const result = await getReportAnalysis(props.analysisId)
    status.value = { status: result.status || 'PROCESSING', progress: Number(result.progress || 0), message: result.message || '분석을 진행하고 있습니다.' }
    if (result.status === 'COMPLETED') {
      stopPolling()
      if (!result.reportId) throw new Error('완성된 보고서 ID를 받지 못했습니다.')
      router.replace(`/report/${result.reportId}`)
    } else if (result.status === 'FAILED') {
      stopPolling()
      error.value = result.message || '분석에 실패했습니다.'
    }
  } catch (cause) {
    stopPolling()
    error.value = cause.message || '분석 상태를 확인하지 못했습니다.'
  }
}

onMounted(() => { sync(); timer = setInterval(sync, 2000) })
onBeforeUnmount(stopPolling)
</script>

<template>
  <section class="analysis-panel">
    <div class="step-indicator" aria-label="분석 단계">
      <div class="step-item"><b>STEP 1</b><span>AI 분석대상<br>파일 업로드</span></div>
      <div class="step-item is-active"><b>STEP 2</b><span>AI 크로스 분석</span></div>
      <div class="step-item"><b>STEP 3</b><span>PDF 결과 산출</span></div>
    </div>
    <div class="analysis-title"><LoadingSpinner /><div><p class="home-kicker">MEDICOVER ANALYSIS</p><h1>AI 분석 중...</h1></div></div>
    <div class="progress-wrap"><div class="progress-bar"><span :style="{ width: `${Math.min(100, status.progress)}%` }" /></div><strong>{{ status.progress }}%</strong></div>
    <p>{{ status.message }}</p>
    <AppAlert v-if="error">{{ error }}</AppAlert>
  </section>
</template>
