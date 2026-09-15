<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createReportAnalysis } from '../../api/reportApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'
import FileDropzone from './components/FileDropzone.vue'
import { addUniqueFiles, createAnalysisFormData, fileKey } from './fileUtils.js'

const router = useRouter()
const healthFiles = ref([])
const insuranceFiles = ref([])
const standardFile = ref(null)
const errors = ref({ health: '', insurance: '', standard: '', submit: '' })
const isSubmitting = ref(false)

function addFiles(target, files, errorKey, multiple = true) {
  target.value = addUniqueFiles(target.value, files, multiple)
  errors.value[errorKey] = ''
}
function removeFile(target, file) { target.value = target.value.filter(item => fileKey(item) !== fileKey(file)) }
function setError(key, message) { errors.value[key] = message }

async function submit() {
  errors.value.submit = ''
  errors.value.health = healthFiles.value.length ? '' : '건강검진 PDF를 한 개 이상 선택하세요.'
  errors.value.insurance = insuranceFiles.value.length ? '' : '보험 보장분석 PDF를 한 개 이상 선택하세요.'
  if (errors.value.health || errors.value.insurance) return

  const formData = createAnalysisFormData(healthFiles.value, insuranceFiles.value, standardFile.value)

  isSubmitting.value = true
  try {
    const result = await createReportAnalysis(formData)
    const analysisId = result.analysisId || result.id
    if (!analysisId) throw new Error('분석 ID를 받지 못했습니다.')
    router.push(`/analysis/${analysisId}`)
  } catch (error) {
    errors.value.submit = error.message || '분석을 시작하지 못했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="upload-panel">
    <h1>자료 업로드</h1>
    <p class="muted">건강검진과 보험 보장자료를 업로드하면 분석을 시작합니다.</p>
    <div class="upload-grid">
      <div><FileDropzone label="건강검진 자료" hint="PDF" accept=".pdf" :mime-types="['application/pdf']" multiple :files="healthFiles" :disabled="isSubmitting" @add="addFiles(healthFiles, $event, 'health')" @remove="removeFile(healthFiles, $event)" @error="setError('health', $event)" /><AppAlert v-if="errors.health">{{ errors.health }}</AppAlert></div>
      <div><FileDropzone label="보험 보장분석" hint="PDF" accept=".pdf" :mime-types="['application/pdf']" multiple :files="insuranceFiles" :disabled="isSubmitting" @add="addFiles(insuranceFiles, $event, 'insurance')" @remove="removeFile(insuranceFiles, $event)" @error="setError('insurance', $event)" /><AppAlert v-if="errors.insurance">{{ errors.insurance }}</AppAlert></div>
      <div><FileDropzone label="권장금액" hint="XLS 또는 XLSX" accept=".xls,.xlsx" :mime-types="['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']" :files="standardFile ? [standardFile] : []" :disabled="isSubmitting" @add="standardFile = $event[0] || null; errors.standard = ''" @remove="standardFile = null" @error="setError('standard', $event)" /><AppAlert v-if="errors.standard">{{ errors.standard }}</AppAlert></div>
    </div>
    <AppAlert v-if="errors.submit">{{ errors.submit }}</AppAlert>
    <div class="upload-actions"><AppButton :disabled="isSubmitting" @click="submit">{{ isSubmitting ? '분석 시작 중...' : '분석 시작' }}</AppButton></div>
  </section>
</template>
