import { describe, expect, it } from 'vitest'
import { validateReportData } from '../src/report/reportValidator.js'

const validReport = {
  meta: { reportDate: '2026-09-15' },
  customer: { name: '김상덕', age: 43 },
  health: { areas: [], metrics: [] },
  insurance: { coverages: [], supplemental: [] },
  summary: {},
  diseaseModules: [],
  coveragePages: [],
  recommendations: [],
  statistics: { sources: [] }
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
})
