<script setup>
import { computed } from 'vue'

const props = defineProps({ result: { type: Object, required: true } })
const extraction = computed(() => props.result.analysis ?? {})
const subject = computed(() => extraction.value.subject ?? {})
const checkups = computed(() => extraction.value.health?.checkups ?? [])
const contracts = computed(() => extraction.value.insurance?.contracts ?? [])
const issues = computed(() => extraction.value.issues ?? [])

function shown(value) {
  return value === null || value === undefined || value === '' ? '-' : value
}
</script>

<template>
  <article class="extraction-report">
    <header class="report-title">
      <div><p>Extraction v1</p><h1>보험 문서 원문 추출 결과</h1></div>
      <span>{{ result.schemaVersion }} · {{ result.promptVersion }}</span>
    </header>

    <section class="report-section">
      <h2>고객정보</h2>
      <dl class="summary-grid">
        <div><dt>이름</dt><dd>{{ shown(subject.name) }}</dd></div>
        <div><dt>생년월일</dt><dd>{{ shown(subject.birth_date) }}</dd></div>
        <div><dt>성별 원문</dt><dd>{{ shown(subject.sex_raw) }}</dd></div>
      </dl>
    </section>

    <section class="report-section">
      <h2>건강검진</h2>
      <p v-if="!checkups.length" class="empty">추출된 건강검진이 없습니다.</p>
      <article v-for="(checkup, index) in checkups" :key="index" class="record-card">
        <h3>{{ shown(checkup.exam_date) }} · {{ shown(checkup.institution_raw) }}</h3>
        <table v-if="checkup.observations?.length">
          <thead><tr><th>항목</th><th>값</th><th>참고치</th><th>원문 판정</th></tr></thead>
          <tbody><tr v-for="(item, itemIndex) in checkup.observations" :key="itemIndex"><td>{{ item.name_raw }}</td><td>{{ shown(item.value_raw) }} {{ shown(item.unit_raw) === '-' ? '' : item.unit_raw }}</td><td>{{ shown(item.reference_raw) }}</td><td>{{ shown(item.source_judgement_raw) }}</td></tr></tbody>
        </table>
        <div v-if="checkup.findings?.length" class="finding-list"><p v-for="(finding, findingIndex) in checkup.findings" :key="findingIndex"><b>{{ finding.kind }}</b> {{ finding.text_raw }}</p></div>
      </article>
    </section>

    <section class="report-section">
      <h2>보험계약 및 담보</h2>
      <p v-if="!contracts.length" class="empty">추출된 보험계약이 없습니다.</p>
      <article v-for="(contract, index) in contracts" :key="index" class="record-card">
        <h3>{{ shown(contract.insurer_name_raw) }} · {{ shown(contract.product_name_raw) }}</h3>
        <p>{{ shown(contract.contract_status_raw) }} · {{ shown(contract.start_date) }} ~ {{ shown(contract.end_date_raw) }} · 월 {{ shown(contract.monthly_premium_raw) }}</p>
        <table v-if="contract.benefits?.length">
          <thead><tr><th>담보 원문</th><th>지급 조건</th><th>금액</th><th>상태</th></tr></thead>
          <tbody><tr v-for="(benefit, benefitIndex) in contract.benefits" :key="benefitIndex"><td>{{ benefit.rider_name_raw }}</td><td>{{ shown(benefit.payment_condition_raw) }}</td><td>{{ shown(benefit.amount_raw) }}</td><td>{{ benefit.amount_status }}</td></tr></tbody>
        </table>
      </article>
    </section>

    <section class="report-section">
      <h2>Issues</h2>
      <p v-if="!issues.length" class="empty">추출 이슈가 없습니다.</p>
      <ul v-else class="issue-list"><li v-for="(issue, index) in issues" :key="index"><b>{{ issue.severity }} · {{ issue.code }}</b><span>{{ issue.message }}</span></li></ul>
    </section>

    <section class="report-section">
      <h2>문서와 Usage</h2>
      <ul><li v-for="document in result.documents" :key="document.documentId">{{ document.documentId }} · {{ document.type }} — {{ document.filename }}</li></ul>
      <dl class="usage-grid">
        <div><dt>Model</dt><dd>{{ result.usage.model }}</dd></div>
        <div><dt>Input</dt><dd>{{ result.usage.inputTokens }}</dd></div>
        <div><dt>Output</dt><dd>{{ result.usage.outputTokens }}</dd></div>
        <div><dt>Total</dt><dd>{{ result.usage.totalTokens }}</dd></div>
        <div><dt>Elapsed</dt><dd>{{ result.usage.elapsedMs }} ms</dd></div>
        <div><dt>Files</dt><dd>{{ result.usage.fileCount }}개</dd></div>
        <div><dt>PDF</dt><dd>{{ result.usage.pdfCount }}개</dd></div>
        <div><dt>Excel</dt><dd>{{ result.usage.excelCount }}개</dd></div>
        <div><dt>Bytes</dt><dd>{{ result.usage.totalBytes }}</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped>
.extraction-report{max-width:1100px;margin:32px auto;display:grid;gap:20px}.report-title,.report-section{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px}.report-title{display:flex;justify-content:space-between;align-items:end}.report-title p{color:var(--teal);font-weight:800}.report-title span,.empty{color:var(--muted)}.report-section h2{margin-bottom:16px}.summary-grid,.usage-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}.summary-grid>div,.usage-grid>div{background:#f6faf9;border-radius:8px;padding:12px}dt{color:var(--muted);font-size:.8rem}dd{font-weight:800;margin-top:4px}.record-card{border-top:1px solid var(--line);padding:18px 0}.record-card:first-of-type{border-top:0}table{width:100%;border-collapse:collapse;margin-top:12px;font-size:.9rem}th,td{text-align:left;border-bottom:1px solid var(--line);padding:10px}.finding-list,.record-card>p{margin-top:10px;color:var(--muted)}.issue-list{display:grid;gap:10px}.issue-list li{display:grid;gap:4px;border-left:3px solid var(--amber);padding:8px 12px;background:#fffcf7}@media(max-width:700px){.report-title{display:block}.report-title span{display:block;margin-top:8px}table{display:block;overflow-x:auto}}
</style>
