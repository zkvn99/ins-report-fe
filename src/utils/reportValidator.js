export function validateReportData(reportData) {
  const errors = []

  if (!reportData || typeof reportData !== 'object') {
    return { valid: false, errors: [{ code: 'REPORT_EMPTY', message: 'Report JSON이 비어 있습니다.' }] }
  }

  if (!reportData.customer || !reportData.customer.name) {
    errors.push({ code: 'REPORT_MISSING_CUSTOMER_NAME', message: 'customer.name이 필요합니다.' })
  }

  if (!Array.isArray(reportData.health?.areas)) {
    errors.push({ code: 'REPORT_INVALID_HEALTH_AREAS', message: 'health.areas는 배열이어야 합니다.' })
  }

  if (!Array.isArray(reportData.health?.metrics)) {
    errors.push({ code: 'REPORT_INVALID_HEALTH_METRICS', message: 'health.metrics는 배열이어야 합니다.' })
  }

  if (!Array.isArray(reportData.insurance?.coverages)) {
    errors.push({ code: 'REPORT_INVALID_INSURANCE_COVERAGES', message: 'insurance.coverages는 배열이어야 합니다.' })
  }

  if (!Array.isArray(reportData.diseases)) {
    errors.push({ code: 'REPORT_INVALID_DISEASES', message: 'diseases는 배열이어야 합니다.' })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
