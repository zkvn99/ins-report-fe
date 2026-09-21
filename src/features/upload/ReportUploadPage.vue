<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { analyzePdfs } from '../../api/analysisApi.js'
import { setAnalysisResult } from '../analysis/analysisResultStore.js'
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

function addFiles(target, incomingFiles, errorKey) {
  target.value = addUniqueFiles(target.value, incomingFiles)
  errors[errorKey] = ''
}

function removeFile(target, file) {
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
    const result = await analyzePdfs(createAnalysisFormData(allFiles.value))
    setAnalysisResult(result)
    await router.push('/analysis/result')
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
    <p class="muted">자료 종류별로 PDF를 선택하면 한 번의 분석 요청으로 함께 전송합니다.</p>
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
          @add="addFiles(healthFiles, $event, 'health')"
          @remove="removeFile(healthFiles, $event)"
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
          @add="addFiles(insuranceFiles, $event, 'insurance')"
          @remove="removeFile(insuranceFiles, $event)"
          @error="errors.insurance = $event"
        />
        <AppAlert v-if="errors.insurance">{{ errors.insurance }}</AppAlert>
      </div>
      <div>
        <FileDropzone
          label="기타 보험 문서"
          hint="PDF · 여러 개 선택 가능"
          accept=".pdf"
          :mime-types="['application/pdf']"
          multiple
          :files="supportingFiles"
          :disabled="isSubmitting"
          @add="addFiles(supportingFiles, $event, 'supporting')"
          @remove="removeFile(supportingFiles, $event)"
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
