import { describe, expect, it } from 'vitest'
import { validateReportData } from '../src/report/reportValidator.js'

const validReport = {
  renderKey: 'HEALTH_INSURANCE_REPORT_V1',
  meta: {
    reportDate: '2026-09-15',
    pipelineVersion: '2.0.0',
    coverageCatalogVersion: '2026.09',
    mappingRuleVersion: '1.0',
    statisticsVersion: '8.0'
  },
  customer: { name: '김상덕', age: 43 },
  health: { areas: [], metrics: [] },
  insurance: {
    coverages: Array.from({ length: 118 }, (_, index) => ({ id: `C${index + 1}` })),
    supplemental: []
  },
  summary: { totalCoverageCount: 118 },
  diseaseModules: [],
  coveragePages: [],
  recommendations: [],
  statistics: { sources: [], modules: [] }
}

describe('validateReportData', () => {
  it('accepts a minimal valid report', () => {
    const result = validateReportData(validReport)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects missing customer name', () => {
    const result = validateReportData({ ...validReport, customer: {} })
    expect(result.valid).toBe(false)
    expect(result.errors.some(item => item.code === 'REPORT_MISSING_CUSTOMER_NAME')).toBe(true)
  })

  it('rejects a legacy report property in place of diseaseModules', () => {
    const { diseaseModules, ...legacyReport } = validReport
    const result = validateReportData({ ...legacyReport, diseases: diseaseModules })
    expect(result.valid).toBe(false)
  })

  it('rejects an incomplete coverage catalog', () => {
    const result = validateReportData({
      ...validReport,
      insurance: { ...validReport.insurance, coverages: [] },
      summary: { totalCoverageCount: 0 }
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(item => item.code === 'REPORT_INVALID_COVERAGE_COUNT')).toBe(true)
  })
})
