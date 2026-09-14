import { computed, ref } from 'vue'
import { parseJsonText } from '../input/jsonParser.js'
import { normalizeCustomerInput } from '../input/normalizeCustomerInput.js'
import { validateCustomerInput } from '../input/validateCustomerInput.js'
import { buildHealthModel } from '../domain/health/healthEngine.js'
import { buildInsuranceModel } from '../domain/insurance/insuranceEngine.js'
import { buildStatisticsModel } from '../domain/statistics/statisticsEngine.js'
import { buildReportViewModel } from '../report/buildReportViewModel.js'

function download(name, text, type = 'application/json;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function readEmbeddedInput() {
  const el = document.getElementById('initial-customer-data')
  if (!el) return null
  const text = el.textContent?.trim()
  if (!text || text === 'null') return null
  try { return JSON.parse(text) } catch { return null }
}

export function useReportApp() {
  const rawInput = ref(null)
  const report = ref(null)
  const fileName = ref('선택된 파일 없음')
  const messages = ref([])
  const ready = computed(() => !!report.value)

  function build(input) {
    const normalized = normalizeCustomerInput(input)
    const validation = validateCustomerInput(normalized)
    if (validation.errors.length) {
      report.value = null
      messages.value = [...validation.errors, ...validation.warnings]
      return
    }

    const health = buildHealthModel(normalized.health)
    const insurance = buildInsuranceModel(normalized.insurance, normalized.standards)
    const statistics = buildStatisticsModel({ customer: normalized.customer, health, insurance })
    report.value = buildReportViewModel({
      input: normalized,
      health,
      insurance,
      statistics,
      warnings: validation.warnings
    })
    rawInput.value = normalized
    messages.value = report.value.warnings
  }

  function loadText(text, name = '붙여넣은 JSON') {
    try {
      fileName.value = name
      build(parseJsonText(text))
    } catch (error) {
      report.value = null
      messages.value = [{ level: 'error', code: 'JSON_PARSE_ERROR', message: error.message }]
    }
  }

  function loadObject(input, name = '내장 데이터') {
    try {
      fileName.value = name
      build(input)
    } catch (error) {
      report.value = null
      messages.value = [{ level: 'error', code: 'INPUT_ERROR', message: error.message }]
    }
  }

  function clear() {
    rawInput.value = null
    report.value = null
    fileName.value = '선택된 파일 없음'
    messages.value = []
  }

  function printReport() {
    if (ready.value) window.print()
  }

  function exportNormalizedJson() {
    if (!rawInput.value) return
    download('customer_input.normalized.json', JSON.stringify(rawInput.value, null, 2))
  }

  function exportFilledHtml() {
    if (!rawInput.value) return
    const clone = document.documentElement.cloneNode(true)
    const seed = clone.querySelector('#initial-customer-data')
    if (seed) seed.textContent = JSON.stringify(rawInput.value).replace(/</g, '\\u003c')
    const app = clone.querySelector('#app')
    if (app) app.innerHTML = ''
    download('health_asset_filled.html', '<!doctype html>\n' + clone.outerHTML, 'text/html;charset=utf-8')
  }

  const embedded = readEmbeddedInput()
  if (embedded) queueMicrotask(() => loadObject(embedded, 'HTML 내장 데이터'))

  return {
    rawInput,
    report,
    fileName,
    messages,
    ready,
    loadText,
    loadObject,
    clear,
    printReport,
    exportNormalizedJson,
    exportFilledHtml
  }
}
