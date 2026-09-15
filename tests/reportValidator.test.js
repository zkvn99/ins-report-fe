import { describe, expect, it } from 'vitest'
import { validateReportData } from '../src/utils/reportValidator.js'

const validReport = {
  customer: { name: '김상덕' },
  health: { areas: [], metrics: [] },
  insurance: { coverages: [] },
  diseases: []
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
})
