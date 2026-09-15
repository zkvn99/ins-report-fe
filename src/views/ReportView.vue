<script setup>
import { computed } from 'vue'
import ReportDocument from '../pages/ReportDocument.vue'

const props = defineProps({
  report: { type: Object, default: null }
})

const safeReport = computed(() => props.report || null)
</script>

<template>
  <section class="report-view">
    <div v-if="!safeReport" class="empty-box">표시할 보고서가 없습니다.</div>
    <ReportDocument v-else :report="safeReport" />
  </section>
</template>
