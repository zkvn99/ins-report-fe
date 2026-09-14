const VALID_STATES = new Set(['action', 'watch', 'good', 'info', 'unknown'])
const VALID_INSURED = new Set(['self', 'other', 'unknown'])

function cleanString(value) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text || null
}

function normalizeDate(value) {
  const text = cleanString(value)
  if (!text) return null
  const iso = text.replace(/\./g, '-')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return text
  return iso
}

function normalizeSex(value) {
  const text = cleanString(value)
  if (!text) return null
  if (['남', '남성', 'M', 'male', 'Male'].includes(text)) return '남'
  if (['여', '여성', 'F', 'female', 'Female'].includes(text)) return '여'
  return text
}

export function calculateAge(birthDate, reportDate) {
  if (!birthDate || !reportDate) return null
  const b = new Date(`${birthDate}T00:00:00Z`)
  const r = new Date(`${reportDate}T00:00:00Z`)
  if (!Number.isFinite(b.getTime()) || !Number.isFinite(r.getTime())) return null
  let age = r.getUTCFullYear() - b.getUTCFullYear()
  const beforeBirthday = r.getUTCMonth() < b.getUTCMonth()
    || (r.getUTCMonth() === b.getUTCMonth() && r.getUTCDate() < b.getUTCDate())
  if (beforeBirthday) age -= 1
  return age >= 0 && age <= 120 ? age : null
}

function normalizeHealth(input = {}) {
  const records = Array.isArray(input.records)
    ? input.records
    : input.source
      ? [{ record_key: 'RECENT', ...input.source }]
      : []

  return {
    records: records.map((r, index) => ({
      record_key: cleanString(r.record_key) || `REC-${String(index + 1).padStart(2, '0')}`,
      provider: cleanString(r.provider),
      checkup_date: normalizeDate(r.checkup_date),
      institution: cleanString(r.institution),
      source_ref: cleanString(r.source_ref)
    })),
    metrics: (Array.isArray(input.metrics) ? input.metrics : []).map((m, index) => ({
      metric_key: cleanString(m.metric_key) || cleanString(m.id) || `METRIC-${String(index + 1).padStart(3, '0')}`,
      name: cleanString(m.name) || '검사항목',
      short_name: cleanString(m.short_name),
      value: m.value ?? null,
      unit: cleanString(m.unit),
      reference: cleanString(m.reference),
      comment: cleanString(m.comment),
      state: VALID_STATES.has(m.state) ? m.state : 'info',
      areas: [...new Set(Array.isArray(m.areas) ? m.areas.map(cleanString).filter(Boolean) : [])],
      featured: m.featured === true,
      source_ref: cleanString(m.source_ref),
      record_key: cleanString(m.record_key)
    })),
    area_notes: (Array.isArray(input.area_notes) ? input.area_notes : []).map(n => ({
      area: cleanString(n.area),
      state: VALID_STATES.has(n.state) ? n.state : 'info',
      detail: cleanString(n.detail)
    }))
  }
}

function normalizeInsurance(input = {}) {
  return {
    source_label: cleanString(input.source_label),
    as_of_date: normalizeDate(input.as_of_date),
    source_complete: input.source_complete === true,
    provider_type: cleanString(input.provider_type) || 'MERITZ_REPORT',
    coverages: (Array.isArray(input.coverages) ? input.coverages : []).map((c, index) => ({
      source_entry_key: cleanString(c.source_entry_key) || cleanString(c.source_rider_id) || `SRC-${String(index + 1).padStart(4, '0')}`,
      policy_key: cleanString(c.policy_key),
      company: cleanString(c.company) || '보험사 미확인',
      product: cleanString(c.product) || '상품 미확인',
      source_group: cleanString(c.source_group),
      rider_name: cleanString(c.rider_name) || '담보명 미확인',
      amount_won: Number.isSafeInteger(c.amount_won) && c.amount_won >= 0 ? c.amount_won : null,
      amount_basis: cleanString(c.amount_basis) || '가입금액',
      payment_type: cleanString(c.payment_type) || 'fixed_amount',
      coverage_id: cleanString(c.coverage_id),
      mapping_status: cleanString(c.mapping_status),
      aggregation_type: cleanString(c.aggregation_type),
      benefit_pool_id: cleanString(c.benefit_pool_id),
      insured: VALID_INSURED.has(c.insured) ? c.insured : 'self',
      source_ref: cleanString(c.source_ref)
    }))
  }
}

export function normalizeCustomerInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('고객 JSON 객체가 필요합니다.')
  }
  if (String(input.version ?? '') !== '2.0') {
    throw new Error('이 프로젝트는 customer_input version 2.0만 사용합니다.')
  }

  const reportDate = normalizeDate(input.report_date) || new Date().toISOString().slice(0, 10)
  const birthDate = normalizeDate(input.customer?.birth_date)
  const calculatedAge = calculateAge(birthDate, reportDate)

  return {
    version: '2.0',
    report_date: reportDate,
    customer: {
      name: cleanString(input.customer?.name) || '고객',
      birth_date: birthDate,
      age: calculatedAge ?? (Number.isInteger(input.customer?.age) ? input.customer.age : null),
      source_age: Number.isInteger(input.customer?.age) ? input.customer.age : null,
      sex: normalizeSex(input.customer?.sex)
    },
    health: normalizeHealth(input.health),
    insurance: normalizeInsurance(input.insurance),
    standards: (Array.isArray(input.standards) ? input.standards : []).map(s => ({
      coverage_id: cleanString(s.coverage_id),
      amount_won: Number.isSafeInteger(s.amount_won) && s.amount_won > 0 ? s.amount_won : null
    })),
    issues: (Array.isArray(input.issues) ? input.issues : []).map(i => ({
      severity: ['blocking', 'warning', 'info'].includes(i.severity) ? i.severity : 'warning',
      type: cleanString(i.type),
      scope: cleanString(i.scope),
      message: cleanString(i.message) || '확인이 필요한 항목',
      source_ref: cleanString(i.source_ref)
    }))
  }
}
