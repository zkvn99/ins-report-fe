<script setup>
import { computed, ref } from 'vue'
import { parseJsonText } from '../input/jsonParser.js'
import { validateReportData } from '../utils/reportValidator.js'
import ReportDocument from '../pages/ReportDocument.vue'

const props = defineProps({
  devTools: { type: Boolean, default: false }
})

const sourceText = ref('')
const activeReport = ref(null)
const error = ref('')
const mode = ref('report')

const examples = {
  report: {
    customer: { name: '김상덕' },
    health: { areas: [], metrics: [] },
    insurance: { coverages: [] },
    diseases: []
  },
  mock: {
    customer: { name: '김상덕' },
    health: { areas: [], metrics: [] },
    insurance: { coverages: [] },
    diseases: []
  }
}

const sourceLabel = computed(() => (mode.value === 'report' ? 'Report JSON' : 'Backend 분석 결과 mock JSON'))

function loadSample() {
  sourceText.value = JSON.stringify(examples[mode.value], null, 2)
}

function applyJson() {
  try {
    const parsed = parseJsonText(sourceText.value)
    const validation = validateReportData(parsed)
    if (!validation.valid) {
      error.value = validation.errors.map(item => item.message).join('\n')
      activeReport.value = null
      return
    }

    activeReport.value = parsed
    error.value = ''
  } catch (err) {
    error.value = err.message
    activeReport.value = null
  }
}

function loadFile(event) {
  const [file] = Array.from(event.target.files || [])
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    sourceText.value = String(reader.result || '')
    applyJson()
  }
  reader.readAsText(file)
}
</script>

<template>
  <section v-if="props.devTools" class="dev-panel">
    <h2>JSON 테스트</h2>
    <div class="dev-toggle">
      <button :class="{ active: mode === 'report' }" @click="mode = 'report'">Report JSON</button>
      <button :class="{ active: mode === 'mock' }" @click="mode = 'mock'">Backend 분석 결과 mock JSON</button>
    </div>

    <label class="json-label">{{ sourceLabel }}</label>
    <textarea v-model="sourceText" rows="18" placeholder="JSON을 붙여넣거나 샘플을 불러오세요." />

    <div class="dev-actions">
      <button class="primary" @click="applyJson">적용</button>
      <button @click="loadSample">샘플 JSON 불러오기</button>
      <label class="file-button">
        <input type="file" accept="application/json" @change="loadFile" />
        JSON 파일 업로드
      </label>
    </div>

    <p v-if="error" class="dev-error">{{ error }}</p>

    <div v-if="activeReport" class="dev-preview">
      <ReportDocument :report="activeReport" />
    </div>
  </section>
</template>
