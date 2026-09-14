<script setup>
import { computed } from 'vue'
import CoverPage from './CoverPage.vue'
import HealthSummaryPage from './HealthSummaryPage.vue'
import HealthAtlasPage from './HealthAtlasPage.vue'
import HealthMetricsPage from './HealthMetricsPage.vue'
import CoverageAtlasPage from './CoverageAtlasPage.vue'
import DiseasePage from './DiseasePage.vue'
import CoverageListPage from './CoverageListPage.vue'
import RecommendationPage from './RecommendationPage.vue'
import HealthInventoryPage from './HealthInventoryPage.vue'
import MethodPage from './MethodPage.vue'
import SourcesPage from './SourcesPage.vue'
import { REPORT_LAYOUT } from '../report/layout.js'

const props = defineProps({ report: { type: Object, required: true } })

const sourcePages = computed(() => {
  const size = REPORT_LAYOUT.sourcesPerPage
  const result = []
  for (let i = 0; i < props.report.statistics.sources.length; i += size) result.push(props.report.statistics.sources.slice(i, i + size))
  return result.length ? result : [[]]
})

const metricPages = computed(() => {
  const size = REPORT_LAYOUT.healthMetricsPerPage
  const result = []
  for (let i = 0; i < props.report.health.metrics.length; i += size) result.push(props.report.health.metrics.slice(i, i + size))
  return result.length ? result : [[]]
})
</script>

<template>
  <div class="report-document">
    <CoverPage
      :customer="report.customer"
      :report-date="report.meta.reportDate"
      :checkup-date="report.health.recentRecordDisplay?.checkup_date"
      :contract-count="report.summary.contractCount"
    />
    <HealthSummaryPage :report="report" />
    <HealthAtlasPage :report="report" />
    <HealthMetricsPage :report="report" />
    <CoverageAtlasPage :report="report" />

    <DiseasePage
      v-for="(module, index) in report.diseaseModules"
      :key="module.id"
      :module="module"
      :report="report"
      :index="index"
      :total="report.diseaseModules.length"
    />

    <CoverageListPage
      v-for="(items, index) in report.coveragePages"
      :key="`coverage-${index}`"
      :items="items"
      :report="report"
      :page-index="index"
      :page-count="report.coveragePages.length"
    />

    <RecommendationPage :report="report" />

    <HealthInventoryPage
      v-for="(items, index) in metricPages"
      :key="`health-inventory-${index}`"
      :items="items"
      :report="report"
      :page-index="index"
    />

    <MethodPage :report="report" />
    <SourcesPage
      v-for="(items, index) in sourcePages"
      :key="`sources-${index}`"
      :items="items"
      :report="report"
      :page-index="index"
    />
  </div>
</template>
