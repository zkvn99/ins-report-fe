import { describe, expect, it } from 'vitest'
import {
  calculateHistoryNumber,
  canDownloadPdf,
  formatHistoryDate,
  getAnalysisStatusLabel
} from '../src/features/history/historyUtils.js'

describe('history utilities', () => {
  it('calculates descending numbers from total elements and page', () => {
    expect(calculateHistoryNumber(43, 0, 20, 0)).toBe(43)
    expect(calculateHistoryNumber(43, 1, 20, 0)).toBe(23)
    expect(calculateHistoryNumber(43, 2, 20, 2)).toBe(1)
  })

  it('uses the existing analysis status labels', () => {
    expect(getAnalysisStatusLabel('COMPLETED')).toBe('산출완료')
    expect(getAnalysisStatusLabel('PROCESSING')).toBe('처리중')
    expect(getAnalysisStatusLabel('FAILED')).toBe('실패')
  })

  it('formats the calculated time in the service timezone', () => {
    expect(formatHistoryDate('2026-09-23T04:20:11Z')).toBe('09.23 13:20')
  })

  it('allows PDF only for a completed result with a report id', () => {
    expect(canDownloadPdf({ status: 'COMPLETED', reportId: 'report-1' })).toBe(true)
    expect(canDownloadPdf({ status: 'PROCESSING', reportId: 'report-1' })).toBe(false)
    expect(canDownloadPdf({ status: 'COMPLETED', reportId: null })).toBe(false)
  })
})
