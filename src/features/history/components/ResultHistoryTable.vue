<script setup>
import AppPagination from '../../../shared/components/AppPagination.vue'
import {
  calculateHistoryNumber,
  canDownloadPdf,
  formatHistoryDate,
  getAnalysisStatusLabel
} from '../historyUtils.js'

defineProps({
  results: { type: Array, required: true },
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  totalElements: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  isLoading: { type: Boolean, default: false },
  downloadingReportIds: { type: Set, required: true },
  showAdminDetails: { type: Boolean, default: false }
})

defineEmits(['download', 'page-change'])
</script>

<template>
  <div class="history-table-wrap" :aria-busy="isLoading">
    <table class="history-table" :class="{ 'is-admin': showAdminDetails }">
      <thead>
        <tr>
          <th>No</th>
          <th>산출일시</th>
          <th>사용자명</th>
          <th v-if="showAdminDetails">이메일</th>
          <th v-if="showAdminDetails">전화번호</th>
          <th>고객명</th>
          <th>고유번호</th>
          <th>산출상태</th>
          <th>PDF 다운로드</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading && results.length === 0">
          <td :colspan="showAdminDetails ? 9 : 7" class="history-empty">결과이력을 불러오는 중입니다.</td>
        </tr>
        <tr v-else-if="results.length === 0">
          <td :colspan="showAdminDetails ? 9 : 7" class="history-empty">산출된 결과가 없습니다.</td>
        </tr>
        <template v-else>
          <tr v-for="(result, index) in results" :key="result.uniqueNumber">
            <td>{{ calculateHistoryNumber(totalElements, page, pageSize, index) }}</td>
            <td>{{ formatHistoryDate(result.createdAt) }}</td>
            <td>{{ result.userName || '-' }}</td>
            <td v-if="showAdminDetails">{{ result.email || '-' }}</td>
            <td v-if="showAdminDetails">{{ result.phoneLast4 || '-' }}</td>
            <td>{{ result.customerName || '-' }}</td>
            <td class="history-unique-number" :title="result.uniqueNumber">{{ result.uniqueNumber }}</td>
            <td><span class="history-status" :class="`is-${result.status?.toLowerCase()}`">{{ getAnalysisStatusLabel(result.status) }}</span></td>
            <td>
              <button
                class="history-download-button"
                type="button"
                :disabled="!canDownloadPdf(result) || downloadingReportIds.has(result.reportId)"
                @click="$emit('download', result)"
              >
                {{ downloadingReportIds.has(result.reportId) ? 'PDF 생성 중...' : '다운로드' }}
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <AppPagination
    :page="page"
    :total-pages="totalPages"
    :disabled="isLoading"
    @change="$emit('page-change', $event)"
  />
</template>
