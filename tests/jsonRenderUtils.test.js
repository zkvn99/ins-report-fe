import { describe, expect, it } from 'vitest'
import { emptyJsonRenderState, parseReportJson } from '../src/features/json-render/jsonRenderUtils.js'

const report = {
  renderKey: 'HEALTH_INSURANCE_REPORT_V1',
  meta: { pipelineVersion: '2.0', coverageCatalogVersion: '1', mappingRuleVersion: '1', statisticsVersion: '1' },
  customer: { name: '테스트', age: 30 },
  health: { areas: [], metrics: [] },
  insurance: { coverages: Array.from({ length: 118 }, (_, index) => ({ id: `C${index + 1}` })), supplemental: [] },
  summary: { totalCoverageCount: 118 },
  diseaseModules: [], coveragePages: [], recommendations: [], statistics: { sources: [], modules: [] }
}

describe('JSON Renderer input', () => {
  it('parses a valid textarea JSON value', () => {
    expect(parseReportJson(JSON.stringify(report))).toEqual(report)
  })

  it('reports a JSON parse error', () => {
    expect(() => parseReportJson('{')).toThrow('JSON 파싱 실패')
  })

  it('provides a reset state', () => {
    expect(emptyJsonRenderState()).toEqual({ jsonText: '', reportData: null, error: '' })
  })
})
