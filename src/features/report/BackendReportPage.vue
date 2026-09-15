<script setup>
import { onMounted, ref } from 'vue'
import { getReport } from '../../api/reportApi.js'
import { validateReportData } from '../../report/reportValidator.js'
import ReportView from '../../report/ReportView.vue'
import AppAlert from '../../shared/components/AppAlert.vue'

const props = defineProps({ reportId: { type: String, required: true } })
const reportData = ref(null)
const error = ref('')

onMounted(async () => {
  try {
    const report = await getReport(props.reportId)
    const validation = validateReportData(report)
    if (!validation.valid) throw new Error(validation.errors.map(item => item.message).join('\n'))
    reportData.value = report
  } catch (cause) {
    error.value = cause.message || '보고서를 불러오지 못했습니다.'
  }
})
</script>

<template>
  <AppAlert v-if="error" class="screen-only">{{ error }}</AppAlert>
  <div v-else-if="!reportData" class="empty-box screen-only">보고서를 불러오는 중입니다.</div>
  <ReportView v-else :report="reportData" />
</template>
