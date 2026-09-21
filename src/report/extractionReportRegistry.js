import HealthInsuranceReportV1 from './HealthInsuranceReportV1.vue'

const reports = {
  HEALTH_INSURANCE_REPORT_V1: HealthInsuranceReportV1
}

export function findExtractionReport(renderKey) {
  return reports[renderKey] ?? null
}
