<script setup>
import ReportDocument from './ReportDocument.vue'
import AppButton from '../shared/components/AppButton.vue'

defineProps({ report: { type: Object, required: true } })
</script>

<template>
  <section class="report-view">
    <div class="report-actions screen-only"><AppButton variant="secondary" @click="window.print()">PDF 인쇄</AppButton></div>
    <ReportDocument :report="report" />
  </section>
</template>
