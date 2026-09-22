<script setup>
import { computed, onMounted, ref } from 'vue'
import { getReport } from '../../api/reportApi.js'
import { findExtractionReport } from '../../report/extractionReportRegistry.js'
import AppAlert from '../../shared/components/AppAlert.vue'

const props = defineProps({ reportId: { type: String, required: true } })
const reportData = ref(null)
const error = ref('')
const reportComponent = computed(() =>
  findExtractionReport(reportData.value?.renderKey)
)

onMounted(async () => {
  try {
    const report = await getReport(props.reportId)
    if (!findExtractionReport(report?.renderKey)) {
      throw new Error('지원하지 않는 리포트 형식입니다.')
    }
    reportData.value = report
  } catch (cause) {
    error.value = cause.message || '보고서를 불러오지 못했습니다.'
  }
})
</script>

<template>
  <AppAlert v-if="error" class="screen-only">{{ error }}</AppAlert>
  <div v-else-if="!reportData" class="empty-box screen-only">보고서를 불러오는 중입니다.</div>
  <component v-else :is="reportComponent" :result="reportData" />
</template>
