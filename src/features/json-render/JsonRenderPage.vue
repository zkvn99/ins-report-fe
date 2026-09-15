<script setup>
import { ref } from 'vue'
import ReportDocument from '../../report/ReportDocument.vue'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'
import { emptyJsonRenderState, parseReportJson } from './jsonRenderUtils.js'

const jsonText = ref('')
const reportData = ref(null)
const error = ref('')

function render() {
  try {
    reportData.value = parseReportJson(jsonText.value)
    error.value = ''
  } catch (cause) {
    reportData.value = null
    error.value = cause.message
  }
}
function reset() {
  const state = emptyJsonRenderState()
  jsonText.value = state.jsonText
  reportData.value = state.reportData
  error.value = state.error
}
function loadFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { jsonText.value = String(reader.result || '') }
  reader.onerror = () => { error.value = 'JSON 파일을 읽지 못했습니다.' }
  reader.readAsText(file)
}
</script>

<template>
  <section class="json-render-page">
    <div class="json-tool-panel screen-only">
      <p class="eyebrow">건강자산 &amp; 보장분석</p><h1>Report JSON Renderer</h1>
      <label class="json-file-select"><input type="file" accept=".json,application/json" @change="loadFile">JSON 파일 선택</label>
      <label class="json-label" for="report-json">JSON 붙여넣기</label>
      <textarea id="report-json" v-model="jsonText" rows="16" placeholder="Report JSON을 붙여넣으세요." />
      <div class="json-actions"><AppButton @click="render">렌더링</AppButton><AppButton variant="secondary" @click="reset">초기화</AppButton></div>
      <AppAlert v-if="error">{{ error }}</AppAlert>
    </div>
    <div v-if="reportData" class="report-preview"><ReportDocument :report="reportData" /></div>
  </section>
</template>
