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
    <div class="analysis-title"><LoadingSpinner /><h1>분석 진행</h1></div>
    <div class="progress-wrap"><div class="progress-bar"><span :style="{ width: `${Math.min(100, status.progress)}%` }" /></div><strong>{{ status.progress }}%</strong></div>
    <p>{{ status.message }}</p>
    <AppAlert v-if="error">{{ error }}</AppAlert>
  </section>
</template>
