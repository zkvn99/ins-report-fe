<script setup>
const props = defineProps({
  isBusy: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

const files = {
  health: [],
  insurance: [],
  standard: []
}

function handleSubmit() {
  const formData = new FormData()

  files.health.forEach(file => formData.append('healthFiles', file))
  files.insurance.forEach(file => formData.append('insuranceFiles', file))
  files.standard.forEach(file => formData.append('standardFiles', file))

  emit('submit', formData)
}

function updateFileList(kind, event) {
  files[kind] = Array.from(event.target.files || [])
}
</script>

<template>
  <section class="upload-panel">
    <h1>자료 업로드</h1>
    <p class="muted">건강검진 PDF · 보험 보장분석 PDF · 권장금액 엑셀을 업로드해 분석을 시작합니다.</p>

    <div class="upload-grid">
      <label class="upload-field">
        <span>건강검진 자료</span>
        <input type="file" multiple accept="application/pdf" @change="updateFileList('health', $event)" />
        <small>{{ files.health.length ? `${files.health.length}개 선택됨` : 'PDF 복수 업로드 가능' }}</small>
      </label>

      <label class="upload-field">
        <span>보험 보장분석</span>
        <input type="file" multiple accept="application/pdf" @change="updateFileList('insurance', $event)" />
        <small>{{ files.insurance.length ? `${files.insurance.length}개 선택됨` : '메리츠 보장분석 PDF' }}</small>
      </label>

      <label class="upload-field">
        <span>권장금액</span>
        <input type="file" multiple accept=".xlsx,.xls,.csv" @change="updateFileList('standard', $event)" />
        <small>{{ files.standard.length ? `${files.standard.length}개 선택됨` : 'xlsx / xls / csv' }}</small>
      </label>
    </div>

    <div class="upload-actions">
      <button class="primary" :disabled="disabled || isBusy" @click="handleSubmit">
        {{ isBusy ? '분석 중...' : '분석 시작' }}
      </button>
    </div>
  </section>
</template>
