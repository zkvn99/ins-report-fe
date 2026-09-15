<script setup>
import { computed } from 'vue'
import CoverPage from './pages/CoverPage.vue'
import HealthSummaryPage from './pages/HealthSummaryPage.vue'
import HealthAtlasPage from './pages/HealthAtlasPage.vue'
import HealthMetricsPage from './pages/HealthMetricsPage.vue'
import CoverageAtlasPage from './pages/CoverageAtlasPage.vue'
import DiseasePage from './pages/DiseasePage.vue'
import CoverageListPage from './pages/CoverageListPage.vue'
import RecommendationPage from './pages/RecommendationPage.vue'
import HealthInventoryPage from './pages/HealthInventoryPage.vue'
import MethodPage from './pages/MethodPage.vue'
import SourcesPage from './pages/SourcesPage.vue'
import { REPORT_LAYOUT } from './layout.js'

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
      :checkup-date="report.health.recentRecord?.checkupDate"
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
