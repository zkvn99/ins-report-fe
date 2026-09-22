export function validateReportData(reportData) {
  const errors = []

  if (!reportData || typeof reportData !== 'object') {
    return { valid: false, errors: [{ code: 'REPORT_EMPTY', message: 'Report JSON이 비어 있습니다.' }] }
  }

  if (reportData.renderKey !== 'HEALTH_INSURANCE_REPORT_V1') {
    errors.push({ code: 'REPORT_UNSUPPORTED_RENDER_KEY', message: '지원하지 않는 리포트 형식입니다.' })
  }

  if (!reportData.meta || typeof reportData.meta !== 'object') {
    errors.push({ code: 'REPORT_MISSING_META', message: 'meta가 필요합니다.' })
  } else if (!reportData.meta.pipelineVersion || !reportData.meta.coverageCatalogVersion || !reportData.meta.mappingRuleVersion || !reportData.meta.statisticsVersion) {
    errors.push({ code: 'REPORT_INVALID_META_VERSION', message: '리포트 기준 데이터 버전이 필요합니다.' })
  }

  if (!reportData.customer || typeof reportData.customer !== 'object') {
    errors.push({ code: 'REPORT_MISSING_CUSTOMER', message: 'customer가 필요합니다.' })
  } else if (!reportData.customer.name) {
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

  if (Array.isArray(reportData.insurance?.coverages) && reportData.insurance.coverages.length !== 118) {
    errors.push({ code: 'REPORT_INVALID_COVERAGE_COUNT', message: '표준 보장항목은 118개여야 합니다.' })
  }

  if (!Array.isArray(reportData.insurance?.supplemental)) {
    errors.push({ code: 'REPORT_INVALID_INSURANCE_SUPPLEMENTAL', message: 'insurance.supplemental는 배열이어야 합니다.' })
  }

  if (!reportData.summary || typeof reportData.summary !== 'object') {
    errors.push({ code: 'REPORT_MISSING_SUMMARY', message: 'summary가 필요합니다.' })
  }


  if (reportData.summary?.totalCoverageCount !== reportData.insurance?.coverages?.length) {
    errors.push({ code: 'REPORT_COVERAGE_SUMMARY_MISMATCH', message: '보장항목 합계가 일치하지 않습니다.' })
  }

  for (const [key, message] of [
    ['diseaseModules', 'diseaseModules는 배열이어야 합니다.'],
    ['coveragePages', 'coveragePages는 배열이어야 합니다.'],
    ['recommendations', 'recommendations는 배열이어야 합니다.']
  ]) {
    if (!Array.isArray(reportData[key])) errors.push({ code: `REPORT_INVALID_${key.toUpperCase()}`, message })
  }

  if (!Array.isArray(reportData.statistics?.sources)) {
    errors.push({ code: 'REPORT_INVALID_STATISTICS_SOURCES', message: 'statistics.sources는 배열이어야 합니다.' })
  }


  if (!Array.isArray(reportData.statistics?.modules)) {
    errors.push({ code: 'REPORT_INVALID_STATISTICS_MODULES', message: 'statistics.modules는 배열이어야 합니다.' })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
