<script setup>
import ReportDocument from './ReportDocument.vue'

defineProps({ report: { type: Object, required: true } })
</script>

<template>
  <section class="report-view">
    <ReportDocument :report="report" />
  </section>
</template>
