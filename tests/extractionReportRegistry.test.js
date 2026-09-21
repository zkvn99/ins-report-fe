import { describe, expect, it } from 'vitest'
import { findExtractionReport } from '../src/report/extractionReportRegistry.js'

describe('extraction report registry', () => {
  it('selects Extraction v1 by backend renderKey', () => {
    expect(findExtractionReport('HEALTH_INSURANCE_REPORT_V1')).toBeTruthy()
    expect(findExtractionReport('UNKNOWN')).toBeNull()
  })
})
