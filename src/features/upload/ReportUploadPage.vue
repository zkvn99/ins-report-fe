<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createReportAnalysis } from '../../api/reportApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'
import FileDropzone from './components/FileDropzone.vue'
import { addUniqueFiles, createAnalysisFormData, fileKey } from './fileUtils.js'

const router = useRouter()
const healthFiles = ref([])
const insuranceFiles = ref([])
const supportingFiles = ref([])
const errors = reactive({ health: '', insurance: '', supporting: '', submit: '' })
const isSubmitting = ref(false)
const allFiles = computed(() => addUniqueFiles([], [
  ...healthFiles.value,
  ...insuranceFiles.value,
  ...supportingFiles.value
]))

function addFiles(incomingFiles, errorKey) {
  const target = { health: healthFiles, insurance: insuranceFiles, supporting: supportingFiles }[errorKey]
  target.value = addUniqueFiles(target.value, incomingFiles, errorKey !== 'supporting')
  errors[errorKey] = ''
}

function removeFile(file, fileType) {
  const target = { health: healthFiles, insurance: insuranceFiles, supporting: supportingFiles }[fileType]
  target.value = target.value.filter(item => fileKey(item) !== fileKey(file))
}

async function submitAnalysis() {
  if (isSubmitting.value) return
  if (!allFiles.value.length) {
    errors.submit = '분석할 PDF를 한 개 이상 선택하세요.'
    return
  }

  isSubmitting.value = true
  errors.submit = ''
  try {
    const result = await createReportAnalysis(createAnalysisFormData(allFiles.value))
    if (!result?.analysisId) throw new Error('분석 ID를 받지 못했습니다.')
    await router.push(`/analysis/${encodeURIComponent(result.analysisId)}`)
  } catch (error) {
    errors.submit = error.message || '분석을 완료하지 못했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="upload-panel">
    <h1>자료 분석</h1>
    <p class="muted">PDF와 선택한 Excel 기준표를 한 번의 분석 요청으로 함께 전송합니다.</p>
    <div class="upload-grid">
      <div>
        <FileDropzone
          label="건강검진 자료"
          hint="PDF · 여러 개 선택 가능"
          accept=".pdf"
          :mime-types="['application/pdf']"
          multiple
          :files="healthFiles"
          :disabled="isSubmitting"
          @add="addFiles($event, 'health')"
          @remove="removeFile($event, 'health')"
          @error="errors.health = $event"
        />
        <AppAlert v-if="errors.health">{{ errors.health }}</AppAlert>
      </div>
      <div>
        <FileDropzone
          label="보험 보장분석"
          hint="PDF · 여러 개 선택 가능"
          accept=".pdf"
          :mime-types="['application/pdf']"
          multiple
          :files="insuranceFiles"
          :disabled="isSubmitting"
          @add="addFiles($event, 'insurance')"
          @remove="removeFile($event, 'insurance')"
          @error="errors.insurance = $event"
        />
        <AppAlert v-if="errors.insurance">{{ errors.insurance }}</AppAlert>
      </div>
      <div>
        <FileDropzone
          label="선택 권장금액"
          hint="XLS · XLSX · 한 개 선택"
          accept=".xls,.xlsx"
          :mime-types="['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']"
          :files="supportingFiles"
          :disabled="isSubmitting"
          @add="addFiles($event, 'supporting')"
          @remove="removeFile($event, 'supporting')"
          @error="errors.supporting = $event"
        />
        <AppAlert v-if="errors.supporting">{{ errors.supporting }}</AppAlert>
      </div>
    </div>
    <AppAlert v-if="errors.submit">{{ errors.submit }}</AppAlert>
    <p v-if="isSubmitting" class="muted" role="status">
      PDF를 분석하고 있습니다. 파일 크기에 따라 수 분이 걸릴 수 있습니다.
    </p>
    <div class="upload-actions">
      <AppButton :disabled="isSubmitting" @click="submitAnalysis">
        {{ isSubmitting ? '분석 중...' : `분석 시작 (${allFiles.length}개)` }}
      </AppButton>
    </div>
  </section>
</template>
