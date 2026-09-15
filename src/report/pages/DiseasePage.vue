<script setup>
import { computed } from 'vue'
import ReportPage from '../components/ReportPage.vue'
import StatusTag from '../components/StatusTag.vue'
import BarChart from '../components/BarChart.vue'
import CoverageProgress from '../components/CoverageProgress.vue'
import AnatomyFigure from '../components/AnatomyFigure.vue'
import { formatWon } from '../formatters.js'

const props = defineProps({
  module: { type: Object, required: true },
  report: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true }
})

const history = computed(() => props.module.statistics?.history || null)
const benchmark = computed(() => props.module.statistics?.benchmark || null)
const benchmarkPoints = computed(() => (benchmark.value?.values || []).map(item => ({ label: item.label, year: item.year, value: item.valueWon })))
const benefit = computed(() => props.module.demoBenefitId ? props.report.insurance.coverages.find(item => item.id === props.module.demoBenefitId) : null)
const moduleState = computed(() => {
  const states = props.module.healthAreas.map(area => area.state)
  if (states.includes('action')) return 'action'
  if (states.includes('watch')) return 'watch'
  if (states.includes('good')) return 'good'
  return 'unknown'
})
</script>

<template>
  <ReportPage
    :section="`disease-${module.id}`"
    eyebrow="05 · 질환별 건강과 보장"
    :title="`${module.title} 건강과 보장`"
    lead="현재 검진 소견과 같은 질환의 공개 통계, 관련 보장을 한 페이지에서 확인합니다."
    :customer-name="report.customer.name"
  >
    <div class="disease-ribbon">
      <div><span>이번 페이지의 비교 질환</span><b>{{ module.diseaseLabel }}</b><small>{{ module.diseaseIcd }}</small></div>
      <div class="disease-ribbon-right"><b>{{ report.customer.age }}세</b><span>{{ index + 1 }} / {{ total }}</span></div>
    </div>

    <div class="disease-layout">
      <div class="disease-main">
        <div class="disease-grid">
          <section class="panel">
            <div class="panel-kicker">나의 건강 현황</div>
            <h3>{{ module.title }}</h3>
            <div v-if="module.healthAreas.length">
              <article v-for="area in module.healthAreas" :key="area.id" :class="['health-row', area.state]">
                <div><b>{{ area.label }}</b><StatusTag :state="area.state" /></div>
                <strong>{{ area.result }}</strong>
              </article>
            </div>
            <div v-else class="empty-panel">현재 건강검진에서 암 진단을 산출하지 않습니다.</div>
            <p class="panel-note">{{ module.healthHint }}</p>
          </section>

          <section class="panel">
            <div class="panel-kicker">통계로 보는 발생·진료현황</div>
            <h3>{{ history?.title || '공개 건강통계' }}</h3>
            <template v-if="history?.points?.length">
              <div class="stat-scope">{{ history.scope }} · {{ history.unit }}</div>
              <BarChart :points="history.points" :unit="history.unit" />
              <p class="panel-note">{{ history.note }}</p>
            </template>
            <div v-else class="empty-panel">연결된 공개 통계가 없습니다.</div>
          </section>

          <section class="panel">
            <div class="panel-kicker">나의 관련 보장</div>
            <h3>{{ module.benefitLabel }}</h3>
            <CoverageProgress v-for="item in module.coreCoverages" :key="item.id" :item="item" />
            <p class="panel-note">{{ module.insuranceNote }}</p>
          </section>

          <section class="panel">
            <div class="panel-kicker">공개 의료비 통계와 나의 보장</div>
            <h3>{{ benchmark?.label || '공개 의료비 통계' }}</h3>
            <template v-if="benchmarkPoints.length">
              <div class="stat-scope">{{ benchmark.scope }}</div>
              <BarChart :points="benchmarkPoints" :unit="'만원 / 1인'" :value-scale="10000" />
              <div v-if="benefit" class="benefit-reference">
                <span>보유 {{ module.benefitLabel }}</span><b>{{ formatWon(benefit.currentWon) }}</b>
              </div>
              <p class="panel-note">{{ benchmark.note }}</p>
            </template>
            <div v-else class="empty-panel">연결된 의료비 통계가 없습니다.</div>
          </section>
        </div>
      </div>

      <aside class="disease-anatomy">
        <h3>{{ module.diseaseLabel }}</h3>
        <AnatomyFigure :areas="module.healthAreas" :highlight-position="module.position" />
        <p>인체 표시는 관련 위치 안내입니다.</p>
      </aside>
    </div>

    <div class="disease-coverage-list">
      <h3>관련 보장항목</h3>
      <div class="disease-coverage-grid">
        <div v-for="item in module.coverages" :key="item.id" class="mini-coverage-row">
          <span>{{ item.name }}</span><b>{{ formatWon(item.currentWon) }}</b><small>권장 {{ formatWon(item.targetWon) }}</small>
        </div>
      </div>
    </div>

    <p class="page-note"><b>대표 질환: {{ module.diseaseLabel }}</b>. 검진 소견이 이 질환의 진단을 뜻하지 않습니다. 공개 통계는 개인의 발병확률이나 보험금 지급 확약이 아닙니다.</p>
  </ReportPage>
</template>
