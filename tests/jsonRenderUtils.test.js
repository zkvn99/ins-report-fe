import { describe, expect, it } from 'vitest'
import { emptyJsonRenderState, parseReportJson } from '../src/features/json-render/jsonRenderUtils.js'

const report = {
  meta: {}, customer: { name: '테스트', age: 30 }, health: { areas: [], metrics: [] },
  insurance: { coverages: [], supplemental: [] }, summary: {}, diseaseModules: [], coveragePages: [], recommendations: [], statistics: { sources: [] }
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
