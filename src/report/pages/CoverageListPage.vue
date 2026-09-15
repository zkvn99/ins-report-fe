<script setup>
import { computed } from 'vue'
import ReportPage from '../components/ReportPage.vue'
import { formatWon } from '../formatters.js'

const props = defineProps({
  items: { type: Array, required: true },
  report: { type: Object, required: true },
  pageIndex: { type: Number, required: true },
  pageCount: { type: Number, required: true }
})

const midpoint = computed(() => Math.ceil(props.items.length / 2))
const columns = computed(() => [props.items.slice(0, midpoint.value), props.items.slice(midpoint.value)])

function sourceText(item) {
  if (!item.sources.length) return '—'
  return item.sources.map(source => `${source.company} · ${source.product} ${formatWon(source.amountWon)}`).join(' / ')
}
</script>

<template>
  <ReportPage
    :section="`coverage-list-${pageIndex}`"
    eyebrow="06 · 전체 보장 비교"
    :title="pageIndex === 0 ? '계약별 보장내용' : '계약별 보장내용 · 계속'"
    lead="권장금액과 현재 보장금액을 같은 기준으로 비교합니다."
    :customer-name="report.customer.name"
  >
    <div class="coverage-page-summary">
      <span>전체 <b>{{ report.summary.totalCoverageCount }}</b></span>
      <span>보유 <b>{{ report.summary.heldCoverageCount }}</b></span>
      <span>페이지 <b>{{ pageIndex + 1 }} / {{ pageCount }}</b></span>
    </div>

    <div class="coverage-columns">
      <table v-for="(column, columnIndex) in columns" :key="columnIndex" class="coverage-table">
        <thead><tr><th>보장항목</th><th>현재</th><th>권장</th><th>과부족</th></tr></thead>
        <tbody>
          <tr v-for="item in column" :key="item.id" :class="item.status.toLowerCase()">
            <td><b>{{ item.name }}</b><small>{{ sourceText(item) }}</small></td>
            <td>{{ formatWon(item.currentWon) }}</td>
            <td>{{ formatWon(item.targetWon) }}</td>
            <td><strong>{{ item.status === 'ENOUGH' ? '충분' : item.status === 'ABSENT' ? '없음' : formatWon(item.gapWon) }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="page-note">담보별 지급조건이 다르므로 모든 보장금액을 하나의 실제 수령액으로 합산하지 않습니다.</p>
  </ReportPage>
</template>
